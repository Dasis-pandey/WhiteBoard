// src/Whiteboard.tsx

import React, { useState, useRef, useEffect } from 'react';

const Whiteboard: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [drawColor, setDrawColor] = useState<string>('#000000');
  const [brushSize, setBrushSize] = useState<number>(5);
  const [eraseMode, setEraseMode] = useState<boolean>(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const context = canvas.getContext('2d');
      if (context) {
        setCtx(context);
        context.lineCap = 'round';
        context.lineJoin = 'round';
      }
    }
  }, []);

  const startDrawing = (event: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
    if (ctx) {
      ctx.strokeStyle = eraseMode ? '#ffffff' : drawColor;
      ctx.lineWidth = brushSize;
      ctx.beginPath();
      ctx.moveTo(event.nativeEvent.offsetX, event.nativeEvent.offsetY);
      setIsDrawing(true);
    }
  };

  const draw = (event: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
    if (isDrawing && ctx) {
      ctx.lineTo(event.nativeEvent.offsetX, event.nativeEvent.offsetY);
      ctx.stroke();
    }
  };

  const finishDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    if (ctx) {
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    }
  };

  const handleColorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDrawColor(event.target.value);
  };

  const handleBrushSizeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setBrushSize(parseInt(event.target.value));
  };

  const toggleEraseMode = () => {
    setEraseMode(!eraseMode);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && ctx) {
      const reader = new FileReader();
      reader.onload = () => {
        const img = new Image();
        img.onload = () => {
          ctx.drawImage(img, 0, 0);
        };
        img.src = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div>
      <canvas
        ref={canvasRef}
        width={800}
        height={600}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={finishDrawing}
        onMouseOut={finishDrawing}
        style={{ border: '1px solid black' }}
      />
      <div>
        <input type="color" value={drawColor} onChange={handleColorChange} />
        <input
          type="range"
          min="1"
          max="50"
          value={brushSize}
          onChange={handleBrushSizeChange}
        />
        <button onClick={toggleEraseMode}>{eraseMode ? 'Draw' : 'Erase'}</button>
        <button onClick={clearCanvas}>Clear</button>
        <input type="file" accept="image/*" onChange={handleFileUpload} />
      </div>
    </div>
  );
};

export default Whiteboard;
