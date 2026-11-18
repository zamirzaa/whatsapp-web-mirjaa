import React, { useEffect, useRef } from 'react';
import { useWhatsApp } from '../../context/WhatsAppContext';
import { MessageBubble } from './MessageBubble';
import { Lock, Camera, UserPlus, Link } from 'lucide-react';

interface MessageListProps {
  onImageClick?: (url: string) => void;
}

export const MessageList: React.FC<MessageListProps> = ({ onImageClick }) => {
  const { activeMessages, isTyping, activeContact, setActiveRightDrawer } = useWhatsApp();
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeMessages, isTyping]);

  const memberCount = activeContact?.groupMembers?.length || 2;

  return (
    <div className="flex-1 overflow-y-auto px-4 md:px-12 py-4 space-y-2 relative">
      {/* Encryption Banner */}
      <div className="flex justify-center my-3">
        <div className="max-w-[480px] bg-[#182229] border border-[#222d34] text-[#ffd279] text-xs text-center py-2 px-3.5 rounded-lg shadow-sm flex items-center space-x-2">
          <Lock className="w-3.5 h-3.5 shrink-0" />
          <span className="leading-snug">
            {activeContact?.isGroup
              ? 'Messages and calls are end-to-end encrypted. Only people in this chat can read, listen to, or share them. Learn more'
              : 'Messages and calls are end-to-end encrypted. No one outside of this chat, not even WhatsApp, can read or listen to them.'}
          </span>
        </div>
      </div>

      {/* Date Divider */}
      <div className="flex justify-center my-3">
        <span className="bg-[#182229] border border-[#222d34] text-[#8696a0] text-xs uppercase px-3 py-1 rounded-md shadow-xs">
          Today
        </span>
      </div>

      {/* Group Creation Intro Card (Screenshot 5 & 6) */}
      {activeContact?.isGroup && (
        <div className="flex justify-center my-4">
          <div className="max-w-md w-full bg-[#182229]/95 backdrop-blur-sm border border-[#222d34] rounded-2xl p-6 flex flex-col items-center text-center shadow-lg space-y-3.5">
            {/* Camera Icon Avatar */}
            <div className="w-20 h-20 rounded-full bg-[#2a264a] border border-[#3d3866] flex items-center justify-center text-[#9b8fff] shadow-md">
              <Camera className="w-10 h-10" />
            </div>

            <div className="space-y-1">
              <h3 className="text-base font-semibold text-[#e9edef]">You created this group</h3>
              <p className="text-xs text-[#8696a0]">
                {memberCount} members · 1 contact · Created today
              </p>
              <p className="text-xs text-[#8696a0] pt-1">
                Members can add people or invite them using a link.{' '}
                <span
                  onClick={() => setActiveRightDrawer('contact-info')}
                  className="text-[#00a884] hover:underline cursor-pointer"
                >
                  Edit
                </span>
              </p>
            </div>

            {/* Action Buttons */}
            <div className="w-full space-y-2 pt-2">
              <button
                onClick={() => setActiveRightDrawer('contact-info')}
                className="w-full py-2.5 px-4 rounded-xl border border-[#313d45] hover:bg-[#202c33] text-[#00a884] text-xs font-semibold flex items-center justify-center space-x-2 transition-colors cursor-pointer"
              >
                <UserPlus className="w-4 h-4" />
                <span>Add members</span>
              </button>

              <button
                onClick={() => {
                  navigator.clipboard?.writeText(window.location.origin + '/join-group/' + activeContact.id);
                  alert('Group invite link copied to clipboard!');
                }}
                className="w-full py-2.5 px-4 rounded-xl border border-[#313d45] hover:bg-[#202c33] text-[#00a884] text-xs font-semibold flex items-center justify-center space-x-2 transition-colors cursor-pointer"
              >
                <Link className="w-4 h-4" />
                <span>Invite to group via link</span>
              </button>
            </div>
          </div>
        </div>
      )}

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
