import React, { useState, useEffect } from 'react';
import { Play, Pause } from 'lucide-react';

interface VoiceNotePlayerProps {
  duration?: number;
  isOutgoing: boolean;
}

export const VoiceNotePlayer: React.FC<VoiceNotePlayerProps> = ({ duration = 12, isOutgoing }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentProgress, setCurrentProgress] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState<1 | 1.5 | 2>(1);

  useEffect(() => {
    let interval: number;
    if (isPlaying) {
      interval = window.setInterval(() => {
        setCurrentProgress(prev => {
          if (prev >= 100) {
            setIsPlaying(false);
            return 0;
          }
          return prev + (100 / (duration * 10)) * playbackSpeed;
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isPlaying, duration, playbackSpeed]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const cycleSpeed = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (playbackSpeed === 1) setPlaybackSpeed(1.5);
    else if (playbackSpeed === 1.5) setPlaybackSpeed(2);
    else setPlaybackSpeed(1);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // Generate 24 pseudo-random waveform bar heights
  const bars = [30, 60, 45, 80, 55, 90, 70, 40, 60, 85, 95, 50, 75, 45, 60, 80, 65, 40, 50, 70, 85, 60, 40, 30];

  return (
    <div className="flex items-center space-x-3 py-1 min-w-[240px]">
      {/* Play/Pause Button */}
      <button
        onClick={togglePlay}
        className="w-10 h-10 rounded-full flex items-center justify-center bg-white/20 hover:bg-white/30 text-white transition-colors cursor-pointer shrink-0"
      >
        {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
      </button>

      {/* Waveform Bar Visualizer */}
      <div className="flex-1 flex flex-col justify-center space-y-1">
        <div className="flex items-center space-x-1 h-7">
          {bars.map((height, idx) => {
            const barProgress = (idx / bars.length) * 100;
            const isPlayed = barProgress <= currentProgress;
            return (
              <div
                key={idx}
                className="w-1 rounded-full transition-colors"
                style={{
                  height: `${height}%`,
                  backgroundColor: isPlayed
                    ? '#53bdeb'
                    : isOutgoing
                    ? 'rgba(255, 255, 255, 0.4)'
                    : 'rgba(255, 255, 255, 0.3)',
                }}
              />
            );
          })}
        </div>

        {/* Time display & Speed pill */}
        <div className="flex items-center justify-between text-[11px] text-[#8696a0]">
          <span>{formatTime((duration * currentProgress) / 100)}</span>
          <button
            onClick={cycleSpeed}
            className="px-1.5 py-0.5 rounded-full bg-white/10 hover:bg-white/20 text-[#e9edef] font-mono text-[10px] cursor-pointer"
          >
            {playbackSpeed}x
          </button>
        </div>
      </div>
    </div>
  );
};
