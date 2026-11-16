import React, { useState, useEffect } from 'react';
import { Trash2, Send } from 'lucide-react';

interface VoiceRecorderProps {
  onCancel: () => void;
  onSend: (duration: number) => void;
}

export const VoiceRecorder: React.FC<VoiceRecorderProps> = ({ onCancel, onSend }) => {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatDuration = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="flex-1 flex items-center justify-between px-4 py-2 bg-[#202c33] rounded-lg animate-in fade-in duration-150">
      {/* Delete / Cancel Icon */}
      <button
        onClick={onCancel}
        className="p-2 text-[#ea4335] hover:bg-black/20 rounded-full transition-colors cursor-pointer"
        title="Cancel recording"
      >
        <Trash2 className="w-5 h-5" />
      </button>

      {/* Recording indicator & timer */}
      <div className="flex items-center space-x-3">
        <span className="w-3 h-3 rounded-full bg-[#ea4335] animate-ping" />
        <span className="text-[#e9edef] font-mono text-sm">{formatDuration(seconds)}</span>
        <span className="text-xs text-[#8696a0]">Recording audio...</span>
      </div>

      {/* Send voice note button */}
      <button
        onClick={() => onSend(seconds || 3)}
        className="p-2.5 bg-[#00a884] hover:bg-[#008f70] text-[#111b21] rounded-full transition-colors cursor-pointer shadow-md"
        title="Send voice note"
      >
        <Send className="w-5 h-5 fill-current" />
      </button>
    </div>
  );
};
