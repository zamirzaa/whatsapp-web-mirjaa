import React from 'react';
import { useWhatsApp } from '../../context/WhatsAppContext';
import {
  PhoneOff,
  Mic,
  MicOff,
  Video,
  VideoOff,
} from 'lucide-react';

export const CallModal: React.FC = () => {
  const { callState, endCall, toggleMuteCall, toggleVideoCall } = useWhatsApp();

  if (!callState.isActive || !callState.contact) return null;

  const contact = callState.contact;

  const formatCallTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm select-none">
      <div className="relative w-full max-w-lg bg-[#1f2c34] rounded-2xl overflow-hidden shadow-2xl border border-[#313d45] flex flex-col items-center">
        {/* Call Content Area */}
        <div className="relative w-full h-80 flex flex-col items-center justify-center p-6 bg-gradient-to-b from-[#111b21] to-[#202c33]">
          {/* Avatar / Video Preview */}
          <div className="relative mb-4">
            <img
              src={contact.avatar}
              alt={contact.name}
              className={`w-28 h-28 rounded-full object-cover border-4 ${
                callState.status === 'ringing'
                  ? 'border-[#00a884] animate-pulse'
                  : 'border-[#202c33]'
              }`}
            />
            {callState.type === 'video' && !callState.isVideoOff && (
              <div className="absolute inset-0 bg-[#00a884]/20 rounded-full flex items-center justify-center">
                <Video className="w-8 h-8 text-white opacity-80" />
              </div>
            )}
          </div>

          {/* Contact Name */}
          <h2 className="text-2xl font-medium text-white mb-1">{contact.name}</h2>

          {/* Status / Call Duration */}
          <p className="text-sm font-mono text-[#00a884]">
            {callState.status === 'ringing'
              ? 'Ringing...'
              : `Connected • ${formatCallTime(callState.durationSeconds)}`}
          </p>
        </div>

        {/* Action Controls Bar */}
        <div className="w-full bg-[#111b21] px-8 py-5 flex items-center justify-around">
          {/* Mute Mic */}
          <button
            onClick={toggleMuteCall}
            className={`p-4 rounded-full transition-colors cursor-pointer ${
              callState.isMuted
                ? 'bg-[#ea4335] text-white'
                : 'bg-[#202c33] hover:bg-[#2a3942] text-white'
            }`}
            title={callState.isMuted ? 'Unmute' : 'Mute'}
          >
            {callState.isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
          </button>

          {/* End Call Button */}
          <button
            onClick={endCall}
            className="p-4 rounded-full bg-[#ea4335] hover:bg-[#d93025] text-white transition-all transform hover:scale-105 cursor-pointer shadow-lg"
            title="End call"
          >
            <PhoneOff className="w-7 h-7" />
          </button>

          {/* Video Toggle */}
          <button
            onClick={toggleVideoCall}
            className={`p-4 rounded-full transition-colors cursor-pointer ${
              callState.isVideoOff
                ? 'bg-[#ea4335] text-white'
                : 'bg-[#202c33] hover:bg-[#2a3942] text-white'
            }`}
            title={callState.isVideoOff ? 'Start video' : 'Stop video'}
          >
            {callState.isVideoOff ? <VideoOff className="w-6 h-6" /> : <Video className="w-6 h-6" />}
          </button>
        </div>
      </div>
    </div>
  );
};
