
import React, { useEffect, useRef } from 'react';

interface VoiceVisualizerProps {
  isActive: boolean;
  analyzer: AnalyserNode | null;
}

export const VoiceVisualizer: React.FC<VoiceVisualizerProps> = ({ isActive, analyzer }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!isActive || !analyzer || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const bufferLength = analyzer.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    let animationId: number;

    const draw = () => {
      animationId = requestAnimationFrame(draw);
      analyzer.getByteFrequencyData(dataArray);

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const width = canvas.width;
      const height = canvas.height;
      const barWidth = (width / bufferLength) * 2.5;
      let barHeight;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        barHeight = (dataArray[i] / 255) * height;
        ctx.fillStyle = `rgb(251, 191, 36)`; // gold color
        ctx.fillRect(x, height - barHeight, barWidth, barHeight);
        x += barWidth + 1;
      }
    };

    draw();
    return () => cancelAnimationFrame(animationId);
  }, [isActive, analyzer]);

  return (
    <div className="w-full h-16 flex items-center justify-center bg-slate-900/50 rounded-lg overflow-hidden">
      {isActive ? (
        <canvas ref={canvasRef} width={400} height={64} className="w-full h-full" />
      ) : (
        <div className="text-slate-500 text-sm italic">Microphone idle</div>
      )}
    </div>
  );
};
