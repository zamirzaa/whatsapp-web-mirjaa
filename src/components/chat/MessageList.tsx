import React, { useEffect, useRef } from 'react';
import { useWhatsApp } from '../../context/WhatsAppContext';
import { MessageBubble } from './MessageBubble';
import { Lock } from 'lucide-react';

interface MessageListProps {
  onImageClick?: (url: string) => void;
}

export const MessageList: React.FC<MessageListProps> = ({ onImageClick }) => {
  const { activeMessages, isTyping } = useWhatsApp();
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeMessages, isTyping]);

  return (
    <div className="flex-1 overflow-y-auto px-4 md:px-12 py-4 space-y-2 relative">
      {/* Encryption Banner */}
      <div className="flex justify-center my-3">
        <div className="max-w-[480px] bg-[#182229] border border-[#222d34] text-[#ffd279] text-xs text-center py-2 px-3.5 rounded-lg shadow-sm flex items-center space-x-2">
          <Lock className="w-3.5 h-3.5 shrink-0" />
          <span className="leading-snug">
            Messages and calls are end-to-end encrypted. No one outside of this chat, not even WhatsApp, can read or listen to them.
          </span>
        </div>
      </div>

      {/* Date Divider */}
      <div className="flex justify-center my-3">
        <span className="bg-[#182229] border border-[#222d34] text-[#8696a0] text-xs uppercase px-3 py-1 rounded-md shadow-xs">
          Today
        </span>
      </div>

      {/* Message List */}
      {activeMessages.map(msg => (
        <MessageBubble key={msg.id} message={msg} onImageClick={onImageClick} />
      ))}

      {/* Typing Bubble Indicator */}
      {isTyping && (
        <div className="flex justify-start my-1">
          <div className="bg-[#202c33] rounded-lg rounded-tl-none px-4 py-2 flex items-center space-x-1.5 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-[#8696a0] animate-bounce" />
            <span
              className="w-2 h-2 rounded-full bg-[#8696a0] animate-bounce"
              style={{ animationDelay: '0.2s' }}
            />
            <span
              className="w-2 h-2 rounded-full bg-[#8696a0] animate-bounce"
              style={{ animationDelay: '0.4s' }}
            />
          </div>
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  );
};
