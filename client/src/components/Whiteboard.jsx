import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Pencil, Eraser, Trash2, Download } from 'lucide-react';

const Whiteboard = ({ socket, classId, isTeacher }) => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [tool, setTool] = useState('pen');
  const [color, setColor] = useState('#000000');
  const [lineWidth, setLineWidth] = useState(2);
  const [ctx, setCtx] = useState(null);
  const lastPosRef = useRef({ x: 0, y: 0 });
  const remoteLastPosRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const context = canvas.getContext('2d');
      context.lineCap = 'round';
      context.lineJoin = 'round';
      setCtx(context);
    }
  }, []);

  const drawFromDataRef = useRef(null);
  drawFromDataRef.current = (data) => {
    if (!ctx) return;
    if (data.isStart) {
      remoteLastPosRef.current = { x: data.x, y: data.y };
    } else {
      ctx.beginPath();
      if (data.tool === 'eraser') {
        ctx.globalCompositeOperation = 'destination-out';
        ctx.lineWidth = 20;
      } else {
        ctx.globalCompositeOperation = 'source-over';
        ctx.strokeStyle = data.color;
        ctx.lineWidth = data.lineWidth;
      }
      ctx.moveTo(remoteLastPosRef.current.x, remoteLastPosRef.current.y);
      ctx.lineTo(data.x, data.y);
      ctx.stroke();
      ctx.closePath();
      remoteLastPosRef.current = { x: data.x, y: data.y };
    }
  };

  const clearCanvas = useCallback(() => {
    if (!ctx || !canvasRef.current) return;
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    ctx.beginPath();
  }, [ctx]);

  useEffect(() => {
    if (!socket) {
      console.log('Whiteboard: No socket provided');
      return;
    }
    console.log('Whiteboard: Setting up socket listeners for classId:', classId);
    console.log('Whiteboard: Socket connected:', socket.connected);
    console.log('Whiteboard: Socket id:', socket.id);
    const handleRemoteDraw = (data) => {
      console.log('Whiteboard: Received remote draw:', data);
      if (data.classId === classId) {
        console.log('Whiteboard: Drawing on canvas');
        drawFromDataRef.current(data);
      }
    };
    const handleRemoteClear = (data) => {
      console.log('Whiteboard: Received clear event');
      if (data.classId === classId) clearCanvas();
    };
    socket.on('whiteboard-draw', handleRemoteDraw);
    socket.on('whiteboard-clear', handleRemoteClear);
    return () => {
      socket.off('whiteboard-draw', handleRemoteDraw);
      socket.off('whiteboard-clear', handleRemoteClear);
    };
  }, [socket, classId, clearCanvas]);

  const startDrawing = (e) => {
    if (!isTeacher || !ctx) {
      console.log('Whiteboard: Cannot draw - isTeacher:', isTeacher, 'ctx:', !!ctx);
      return;
    }
    console.log('Whiteboard: Starting drawing');
    setIsDrawing(true);
    const { offsetX, offsetY } = e.nativeEvent;
    lastPosRef.current = { x: offsetX, y: offsetY };
    
    // Broadcast start position
    console.log('Whiteboard: Emitting start draw:', {
      classId,
      x: offsetX,
      y: offsetY,
      color: color,
      lineWidth: lineWidth,
      tool,
      isStart: true
    });
    socket?.emit('whiteboard-draw', {
      classId,
      x: offsetX,
      y: offsetY,
      color: color,
      lineWidth: lineWidth,
      tool,
      isStart: true
    });
  };

  const draw = (e) => {
    if (!isDrawing || !isTeacher || !ctx) return;
    console.log('Whiteboard: Drawing at position');
    const { offsetX, offsetY } = e.nativeEvent;
    
    ctx.beginPath();
    if (tool === 'eraser') {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.lineWidth = 20;
    } else {
      ctx.globalCompositeOperation = 'source-over';
      ctx.strokeStyle = color;
      ctx.lineWidth = lineWidth;
    }
    ctx.moveTo(lastPosRef.current.x, lastPosRef.current.y);
    ctx.lineTo(offsetX, offsetY);
    ctx.stroke();
    ctx.closePath();
    
    lastPosRef.current = { x: offsetX, y: offsetY };

    // Broadcast drawing
    console.log('Whiteboard: Emitting draw:', {
      classId,
      x: offsetX,
      y: offsetY,
      color: color,
      lineWidth: lineWidth,
      tool,
      isStart: false
    });
    socket?.emit('whiteboard-draw', {
      classId,
      x: offsetX,
      y: offsetY,
      color: color,
      lineWidth: lineWidth,
      tool,
      isStart: false
    });
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const handleClear = () => {
    if (!isTeacher) return;
    console.log('Whiteboard: Clearing canvas');
    clearCanvas();
    console.log('Whiteboard: Emitting clear:', { classId });
    socket?.emit('whiteboard-clear', { classId });
  };

  const downloadCanvas = () => {
    const link = document.createElement('a');
    link.download = 'whiteboard.png';
    link.href = canvasRef.current.toDataURL();
    link.click();
  };

  const colors = ['#000000', '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF'];

  return (
    <div className="flex flex-col h-full bg-gray-900">
      {/* Toolbar */}
      <div className="flex items-center gap-2 p-3 bg-gray-800 border-b border-cyan-900/30">
        <button
          onClick={() => setTool('pen')}
          className={`p-2 rounded ${tool === 'pen' ? 'bg-cyan-500 text-white' : 'bg-gray-700 text-gray-300'}`}
          title="Pen"
          disabled={!isTeacher}
        >
          <Pencil size={18} />
        </button>
        <button
          onClick={() => setTool('eraser')}
          className={`p-2 rounded ${tool === 'eraser' ? 'bg-cyan-500 text-white' : 'bg-gray-700 text-gray-300'}`}
          title="Eraser"
          disabled={!isTeacher}
        >
          <Eraser size={18} />
        </button>
        
        <div className="w-px h-6 bg-gray-600 mx-2" />
        
        {colors.map((c) => (
          <button
            key={c}
            onClick={() => setColor(c)}
            className={`w-6 h-6 rounded border-2 ${color === c ? 'border-white' : 'border-gray-600'}`}
            style={{ backgroundColor: c }}
            disabled={!isTeacher}
          />
        ))}
        
        <div className="w-px h-6 bg-gray-600 mx-2" />
        
        <input
          type="range"
          min="1"
          max="10"
          value={lineWidth}
          onChange={(e) => setLineWidth(e.target.value)}
          className="w-20"
          disabled={!isTeacher}
        />
        <span className="text-white text-xs">{lineWidth}px</span>
        
        <div className="flex-1" />
        
        <button
          onClick={handleClear}
          className="p-2 rounded bg-red-600 hover:bg-red-700 text-white"
          title="Clear"
          disabled={!isTeacher}
        >
          <Trash2 size={18} />
        </button>
        <button
          onClick={downloadCanvas}
          className="p-2 rounded bg-green-600 hover:bg-green-700 text-white"
          title="Download"
        >
          <Download size={18} />
        </button>
      </div>

      {/* Canvas */}
      <div className="flex-1 overflow-hidden bg-white">
        <canvas
          ref={canvasRef}
          width={1200}
          height={800}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          className="w-full h-full cursor-crosshair"
        />
      </div>

      {!isTeacher && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 bg-yellow-500/90 px-4 py-2 rounded-lg">
          <p className="text-black text-sm font-medium">View Only - Teacher is drawing</p>
        </div>
      )}
    </div>
  );
};

export default Whiteboard;
