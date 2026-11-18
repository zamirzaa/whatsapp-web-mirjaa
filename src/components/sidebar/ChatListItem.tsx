import React, { useState, useRef, useEffect } from 'react';
import type { Chat, Contact } from '../../types/whatsapp';
import { useWhatsApp } from '../../context/WhatsAppContext';
import { Check, CheckCheck, ChevronDown, Pin, VolumeX, Archive, ArchiveRestore, BellOff, Bell } from 'lucide-react';

interface ChatListItemProps {
  chat: Chat;
  contact: Contact;
  isActive: boolean;
}

export const ChatListItem: React.FC<ChatListItemProps> = ({ chat, contact, isActive }) => {
  const { setActiveChatId, archiveChat, pinChat, muteChatSingle } = useWhatsApp();
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const lastMsg = chat.lastMessage;

  // Close menu on click outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowMenu(false);
      }
    };
    if (showMenu) document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [showMenu]);

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
    if (lastMsg.isViewOnce) return lastMsg.isViewOnceOpened ? '① Opened' : '① Photo';
    if (lastMsg.type === 'image') return lastMsg.text ? `📷 ${lastMsg.text}` : '📷 Photo';
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
          ? 'bg-[#f0f2f5] dark:bg-[#2a3942]'
          : 'hover:bg-[#f5f6f6] dark:hover:bg-[#202c33]'
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
          <span className="absolute bottom-0 right-0 w-3 h-3 bg-[#00a884] rounded-full border-2 border-white dark:border-[#111b21]" />
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 border-b border-[#e9edef] dark:border-[#222d34] pb-2.5">
        {/* Row 1: Name and Timestamp */}
        <div className="flex items-center justify-between mb-1">
          <span className="text-[16px] font-normal text-[#111b21] dark:text-[#e9edef] truncate">
            {contact.name}
          </span>
          <span
            className={`text-xs ${
              chat.unreadCount > 0 ? 'text-[#008069] dark:text-[#00a884] font-medium' : 'text-[#667781] dark:text-[#8696a0]'
            }`}
          >
            {lastMsg?.timestamp || ''}
          </span>
        </div>

        {/* Row 2: Message preview and Indicators */}
        <div className="flex items-center justify-between">
          <div className="flex items-center text-sm text-[#667781] dark:text-[#8696a0] truncate mr-2">
            {renderStatusIcon()}
            <span className="truncate">{renderSnippet()}</span>
          </div>

          <div className="flex items-center space-x-1.5 shrink-0">
            {chat.isMuted && <VolumeX className="w-3.5 h-3.5 text-[#8696a0]" />}
            {chat.isPinned && <Pin className="w-3.5 h-3.5 text-[#8696a0] rotate-45" />}
            {chat.unreadCount > 0 && (
              <span className="min-w-5 h-5 px-1.5 rounded-full bg-[#00a884] text-white text-xs font-semibold flex items-center justify-center">
                {chat.unreadCount}
              </span>
            )}

            {/* Hover Chevron */}
            <button
              onClick={e => {
                e.stopPropagation();
                setShowMenu(!showMenu);
              }}
              className="opacity-0 group-hover:opacity-100 text-[#8696a0] hover:text-[#111b21] dark:hover:text-[#e9edef] transition-opacity p-0.5 rounded cursor-pointer"
            >
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Action Popover Menu */}
      {showMenu && (
        <div
          ref={menuRef}
          onClick={e => e.stopPropagation()}
          className="absolute right-4 top-10 z-50 bg-white dark:bg-[#233138] rounded-md shadow-xl py-1.5 w-52 border border-[#e9edef] dark:border-[#313d45] text-sm text-[#111b21] dark:text-[#d1d7db]"
        >
          {/* Archive / Unarchive */}
          <div
            onClick={() => {
              archiveChat(chat.id, !chat.isArchived);
              setShowMenu(false);
            }}
            className="px-4 py-2.5 hover:bg-[#f5f6f6] dark:hover:bg-[#182229] cursor-pointer flex items-center space-x-3"
          >
            {chat.isArchived
              ? <ArchiveRestore className="w-4 h-4 text-[#00a884]" />
              : <Archive className="w-4 h-4" />
            }
            <span>{chat.isArchived ? 'Unarchive chat' : 'Archive chat'}</span>
          </div>

          {/* Pin / Unpin */}
          <div
            onClick={() => {
              pinChat(chat.id, !chat.isPinned);
              setShowMenu(false);
            }}
            className="px-4 py-2.5 hover:bg-[#f5f6f6] dark:hover:bg-[#182229] cursor-pointer flex items-center space-x-3"
          >
            <Pin className="w-4 h-4" />
            <span>{chat.isPinned ? 'Unpin chat' : 'Pin chat'}</span>
          </div>

          {/* Mute / Unmute */}
          <div
            onClick={() => {
              muteChatSingle(chat.id, !chat.isMuted);
              setShowMenu(false);
            }}
            className="px-4 py-2.5 hover:bg-[#f5f6f6] dark:hover:bg-[#182229] cursor-pointer flex items-center space-x-3"
          >
            {chat.isMuted ? <Bell className="w-4 h-4" /> : <BellOff className="w-4 h-4" />}
            <span>{chat.isMuted ? 'Unmute' : 'Mute notifications'}</span>
          </div>

          <div className="border-t border-[#e9edef] dark:border-[#313d45] my-1" />

          {/* Mark as unread */}
          <div
            onClick={() => {
              setShowMenu(false);
            }}
            className="px-4 py-2.5 hover:bg-[#f5f6f6] dark:hover:bg-[#182229] cursor-pointer flex items-center space-x-3"
          >
            <span className="w-4 h-4 text-[#8696a0] flex items-center justify-center text-xs font-bold">●</span>
            <span>Mark as unread</span>
          </div>
        </div>
      )}
    </div>
  );
};
