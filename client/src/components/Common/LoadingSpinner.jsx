import React from 'react';

const LoadingSpinner = ({ size = 'medium', text = 'SYSTEM_INITIALIZING...' }) => {
  const sizeClasses = {
    small: 'w-16 h-16',
    medium: 'w-24 h-24',
    large: 'w-32 h-32'
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen cyber-bg relative overflow-hidden">
      {/* Background Grid */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute w-full h-full bg-[linear-gradient(rgba(6,182,212,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.1)_1px,transparent_1px)] bg-[size:40px_40px]" />
      </div>

      <div className={`relative ${sizeClasses[size]} flex items-center justify-center`}>
        {/* Outer Ring */}
        <div className="absolute inset-0 border-4 border-cyan-900/30 rounded-full" />
        
        {/* Spinning Ring */}
        <div className="absolute inset-0 border-4 border-transparent border-t-cyan-500 border-r-purple-500 rounded-full animate-spin" />
        
        {/* Inner Pulse */}
        <div className="absolute inset-4 bg-cyan-500/10 rounded-full animate-pulse" />
        
        {/* Center Icon/Dot */}
        <div className="w-2 h-2 bg-cyan-400 rounded-full shadow-[0_0_10px_rgba(34,211,238,0.8)]" />
      </div>

      <div className="mt-8 text-center">
        <h3 className="text-xl font-bold text-cyan-400 cyber-glitch-text tracking-widest" data-text={text}>
          {text}
        </h3>
        <div className="mt-2 flex gap-1 justify-center">
          <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
          <div className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
          <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" />
        </div>
      </div>
    </div>
  );
};

export default LoadingSpinner;