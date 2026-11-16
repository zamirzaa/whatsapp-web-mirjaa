import React from 'react';
import { useWhatsApp } from '../../context/WhatsAppContext';
import { ChatHeader } from './ChatHeader';
import { MessageList } from './MessageList';
import { ChatInput } from './ChatInput';
import { EmptyChatState } from './EmptyChatState';

interface ChatAreaProps {
  onOpenPollModal: () => void;
  onImageClick?: (url: string) => void;
}

export const ChatArea: React.FC<ChatAreaProps> = ({ onOpenPollModal, onImageClick }) => {
  const { activeChatId, activeContact, theme, setSubView } = useWhatsApp();

  if (!activeChatId || !activeContact) {
    return (
      <EmptyChatState
        onAddContact={() => setSubView('new-contact')}
        onSendDocument={() => {}}
      />
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#0b141a] relative">
      {/* Authentic WhatsApp doodle wallpaper background */}
      <div
        className={`absolute inset-0 pointer-events-none opacity-40 ${
          theme === 'dark' ? 'wa-chat-bg-dark' : 'wa-chat-bg-light'
        }`}
      />

      {/* Header */}
      <ChatHeader />

      {/* Messages Canvas */}
      <MessageList onImageClick={onImageClick} />

      {/* Bottom Input Area */}
      <ChatInput onOpenPollModal={onOpenPollModal} />
    </div>
  );
};
