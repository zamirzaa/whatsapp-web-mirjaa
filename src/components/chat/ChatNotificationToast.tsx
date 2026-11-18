import React, { useEffect } from 'react';
import { X, MessageSquare } from 'lucide-react';

export interface ToastNotification {
  id: string;
  senderName: string;
  senderAvatar: string;
  chatId: string;
  text: string;
  timestamp: string;
}

interface ChatNotificationToastProps {
  notification: ToastNotification | null;
  onClose: () => void;
  onClick: (chatId: string) => void;
}

export const ChatNotificationToast: React.FC<ChatNotificationToastProps> = ({
  notification,
  onClose,
  onClick,
}) => {
  useEffect(() => {
    if (!notification) return;
    const timer = setTimeout(() => {
      onClose();
    }, 5500);
    return () => clearTimeout(timer);
  }, [notification, onClose]);

  if (!notification) return null;

  return (
    <div
      onClick={() => onClick(notification.chatId)}
      className="fixed bottom-6 right-6 z-50 flex items-center max-w-sm w-full bg-white dark:bg-[#202c33] border border-[#e9edef] dark:border-[#313d45] rounded-xl shadow-2xl p-3.5 space-x-3.5 cursor-pointer hover:bg-[#f5f6f6] dark:hover:bg-[#2a3942] transition-all transform animate-in slide-in-from-bottom-5 duration-200 select-none"
    >
      {/* Avatar */}
      <div className="relative shrink-0">
        <img
          src={notification.senderAvatar}
          alt={notification.senderName}
          className="w-11 h-11 rounded-full object-cover border border-[#e9edef] dark:border-[#313d45]"
        />
        <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-[#00a884] flex items-center justify-center text-white">
          <MessageSquare className="w-2.5 h-2.5 fill-current" />
        </div>
      </div>

      {/* Details */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-0.5">
          <h4 className="text-sm font-semibold text-[#111b21] dark:text-[#e9edef] truncate">
            {notification.senderName}
          </h4>
          <span className="text-[11px] text-[#667781] dark:text-[#8696a0]">
            {notification.timestamp}
          </span>
        </div>
        <p className="text-xs text-[#54656f] dark:text-[#d1d7db] truncate">
          {notification.text}
        </p>
      </div>

      {/* Close button */}
      <button
        onClick={e => {
          e.stopPropagation();
          onClose();
        }}
        className="text-[#8696a0] hover:text-[#111b21] dark:hover:text-white p-1 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer shrink-0"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
