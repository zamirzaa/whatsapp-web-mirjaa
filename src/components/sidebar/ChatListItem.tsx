import React, { useState } from 'react';
import type { Chat, Contact } from '../../types/whatsapp';
import { useWhatsApp } from '../../context/WhatsAppContext';
import { Check, CheckCheck, ChevronDown, Pin, VolumeX, Trash2 } from 'lucide-react';

interface ChatListItemProps {
  chat: Chat;
  contact: Contact;
  isActive: boolean;
}

export const ChatListItem: React.FC<ChatListItemProps> = ({ chat, contact, isActive }) => {
  const { setActiveChatId, deleteMessage } = useWhatsApp();
  const [showMenu, setShowMenu] = useState(false);

  const lastMsg = chat.lastMessage;

  const renderStatusIcon = () => {
    if (!lastMsg || !lastMsg.isOutgoing) return null;
    if (lastMsg.status === 'read') {
      return <CheckCheck className="w-4 h-4 text-[#53bdeb] mr-1 shrink-0" />;
    }
    if (lastMsg.status === 'delivered') {
      return <CheckCheck className="w-4 h-4 text-[#8696a0] mr-1 shrink-0" />;
    }
    return <Check className="w-4 h-4 text-[#8696a0] mr-1 shrink-0" />;
  };

  const renderSnippet = () => {
    if (!lastMsg) return 'No messages yet';
    if (lastMsg.type === 'image') return '📷 Photo';
    if (lastMsg.type === 'audio') return '🎤 Voice message';
    if (lastMsg.type === 'document') return `📄 ${lastMsg.fileName || 'Document'}`;
    if (lastMsg.type === 'poll') return '📊 Poll';
    return lastMsg.text || '';
  };

  return (
    <div
      onClick={() => setActiveChatId(chat.id)}
      className={`group relative flex items-center px-3 py-2.5 cursor-pointer transition-colors select-none ${
        isActive
          ? 'bg-[#2a3942]'
          : 'hover:bg-[#202c33]'
      }`}
    >
      {/* Contact Avatar */}
      <div className="relative mr-3 shrink-0">
        <img
          src={contact.avatar}
          alt={contact.name}
          className="w-12 h-12 rounded-full object-cover"
        />
        {contact.isOnline && (
          <span className="absolute bottom-0 right-0 w-3 h-3 bg-[#00a884] rounded-full border-2 border-[#111b21]" />
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 border-b border-[#222d34] pb-2.5">
        {/* Row 1: Name and Timestamp */}
        <div className="flex items-center justify-between mb-1">
          <span className="text-[16px] font-normal text-[#e9edef] truncate">
            {contact.name}
          </span>
          <span
            className={`text-xs ${
              chat.unreadCount > 0 ? 'text-[#00a884] font-medium' : 'text-[#8696a0]'
            }`}
          >
            {lastMsg?.timestamp || ''}
          </span>
        </div>

        {/* Row 2: Message preview and Indicators */}
        <div className="flex items-center justify-between">
          <div className="flex items-center text-sm text-[#8696a0] truncate mr-2">
            {renderStatusIcon()}
            <span className="truncate">{renderSnippet()}</span>
          </div>

          <div className="flex items-center space-x-1.5 shrink-0">
            {chat.isMuted && <VolumeX className="w-3.5 h-3.5 text-[#8696a0]" />}
            {chat.isPinned && <Pin className="w-3.5 h-3.5 text-[#8696a0] rotate-45" />}
            {chat.unreadCount > 0 && (
              <span className="min-w-5 h-5 px-1.5 rounded-full bg-[#00a884] text-[#111b21] text-xs font-semibold flex items-center justify-center">
                {chat.unreadCount}
              </span>
            )}

            {/* Hover Chevron */}
            <button
              onClick={e => {
                e.stopPropagation();
                setShowMenu(!showMenu);
              }}
              className="opacity-0 group-hover:opacity-100 text-[#8696a0] hover:text-[#e9edef] transition-opacity p-0.5 rounded cursor-pointer"
            >
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Action Popover Menu */}
      {showMenu && (
        <div
          onClick={e => e.stopPropagation()}
          className="absolute right-4 top-10 z-30 bg-[#233138] rounded-md shadow-xl py-1.5 w-44 border border-[#313d45] text-sm text-[#d1d7db]"
        >
          <div
            onClick={() => {
              setShowMenu(false);
              chat.isPinned = !chat.isPinned;
            }}
            className="px-4 py-2 hover:bg-[#182229] cursor-pointer flex items-center space-x-3"
          >
            <Pin className="w-4 h-4" />
            <span>{chat.isPinned ? 'Unpin chat' : 'Pin chat'}</span>
          </div>
          <div
            onClick={() => {
              setShowMenu(false);
              chat.isMuted = !chat.isMuted;
            }}
            className="px-4 py-2 hover:bg-[#182229] cursor-pointer flex items-center space-x-3"
          >
            <VolumeX className="w-4 h-4" />
            <span>{chat.isMuted ? 'Unmute' : 'Mute notifications'}</span>
          </div>
          <div
            onClick={() => {
              setShowMenu(false);
              if (lastMsg) deleteMessage(lastMsg.id);
            }}
            className="px-4 py-2 hover:bg-[#182229] cursor-pointer flex items-center space-x-3 text-red-400"
          >
            <Trash2 className="w-4 h-4" />
            <span>Clear messages</span>
          </div>
        </div>
      )}
    </div>
  );
};
