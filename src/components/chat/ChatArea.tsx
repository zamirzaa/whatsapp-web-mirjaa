import React from 'react';
import { useWhatsApp } from '../../context/WhatsAppContext';
import { ChatHeader } from './ChatHeader';
import { MessageList } from './MessageList';
import { ChatInput } from './ChatInput';
import { EmptyChatState } from './EmptyChatState';
import { X, Star, Trash2, CornerUpRight } from 'lucide-react';

interface ChatAreaProps {
  onOpenPollModal: () => void;
  onImageClick?: (url: string) => void;
}

export const ChatArea: React.FC<ChatAreaProps> = ({ onOpenPollModal, onImageClick }) => {
  const {
    activeChatId,
    activeContact,
    theme,
    setSubView,
    chatWallpaper,
    chatDoodlesEnabled,
    isSelectingMessages,
    selectedMessageIds,
    clearSelectedMessages,
    deleteSelectedMessages,
    starSelectedMessages,
  } = useWhatsApp();

  if (!activeChatId || !activeContact) {
    return (
      <EmptyChatState
        onAddContact={() => setSubView('new-contact')}
        onSendDocument={() => {}}
      />
    );
  }

  const isCustomImage = chatWallpaper.startsWith('url(');

  return (
    <div
      className="flex-1 flex flex-col h-full overflow-hidden relative transition-colors"
      style={{
        backgroundColor: !isCustomImage ? chatWallpaper : undefined,
        backgroundImage: isCustomImage ? chatWallpaper : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Authentic WhatsApp doodle wallpaper background */}
      {chatDoodlesEnabled && (
        <div
          className={`absolute inset-0 pointer-events-none opacity-30 ${
            theme === 'dark' ? 'wa-chat-bg-dark' : 'wa-chat-bg-light'
          }`}
        />
      )}

      {/* Header */}
      <ChatHeader />

      {/* Messages Canvas */}
      <MessageList onImageClick={onImageClick} />

      {/* Bottom Area: Input or Selection Bar (Screenshot 14) */}
      {isSelectingMessages ? (
        <div className="h-[62px] bg-[#f0f2f5] dark:bg-[#202c33] px-6 flex items-center justify-between border-t border-[#e9edef] dark:border-[#222d34] select-none shrink-0 z-20 animate-in slide-in-from-bottom-2 duration-150">
          <div className="flex items-center space-x-4">
            <button
              onClick={clearSelectedMessages}
              className="p-1.5 hover:bg-black/10 dark:hover:bg-[#374248] rounded-full transition-colors text-[#54656f] dark:text-[#aebac1] cursor-pointer"
              title="Close selection"
            >
              <X className="w-5 h-5" />
            </button>
            <span className="text-sm font-medium text-[#111b21] dark:text-[#e9edef]">
              {selectedMessageIds.length} selected
            </span>
          </div>

          <div className="flex items-center space-x-5 text-[#54656f] dark:text-[#aebac1]">
            <button
              onClick={starSelectedMessages}
              disabled={selectedMessageIds.length === 0}
              className="p-2 hover:bg-black/10 dark:hover:bg-[#374248] rounded-full transition-colors cursor-pointer disabled:opacity-40"
              title="Star selected"
            >
              <Star className="w-5 h-5" />
            </button>
            <button
              onClick={deleteSelectedMessages}
              disabled={selectedMessageIds.length === 0}
              className="p-2 hover:bg-black/10 dark:hover:bg-[#374248] rounded-full transition-colors cursor-pointer text-red-400 disabled:opacity-40"
              title="Delete selected"
            >
              <Trash2 className="w-5 h-5" />
            </button>
            <button
              onClick={() => {
                if (selectedMessageIds.length > 0) {
                  alert(`Forwarding ${selectedMessageIds.length} message(s)`);
                  clearSelectedMessages();
                }
              }}
              disabled={selectedMessageIds.length === 0}
              className="p-2 hover:bg-black/10 dark:hover:bg-[#374248] rounded-full transition-colors cursor-pointer disabled:opacity-40"
              title="Forward selected"
            >
              <CornerUpRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      ) : (
        <ChatInput onOpenPollModal={onOpenPollModal} />
      )}
    </div>
  );
};
