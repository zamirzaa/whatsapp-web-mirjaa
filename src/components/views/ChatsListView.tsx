import React, { useState } from 'react';
import { useWhatsApp } from '../../context/WhatsAppContext';
import {
  Search,
  MoreVertical,
  Plus,
  VolumeX,
  X,
  Archive,
  Users,
  Star,
  CheckSquare,
  MailCheck,
  Lock,
  LogOut,
} from 'lucide-react';
import { ChatListItem } from '../sidebar/ChatListItem';

export const ChatsListView: React.FC = () => {
  const {
    chats,
    contacts,
    activeChatId,
    searchQuery,
    setSearchQuery,
    activeFilter,
    setActiveFilter,
    showNotificationBanner,
    setShowNotificationBanner,
    setSubView,
    logout,
    markAllAsRead,
  } = useWhatsApp();

  const [showMenu, setShowMenu] = useState(false);

  // Active (non-archived) chats
  const activeChats = chats.filter(c => !c.isArchived);
  const archivedCount = chats.filter(c => c.isArchived).length;
  const unreadCount = activeChats.filter(c => c.unreadCount > 0).length;
  const groupCount = activeChats.filter(c => {
    const contact = contacts.find(con => con.id === c.contactId);
    return contact?.isGroup;
  }).length;

  const filteredChats = activeChats.filter(chat => {
    const contact = contacts.find(c => c.id === chat.contactId);
    if (!contact) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = contact.name.toLowerCase().includes(q);
      const matchText = chat.lastMessage?.text?.toLowerCase().includes(q);
      if (!matchName && !matchText) return false;
    }

    if (activeFilter === 'unread' && chat.unreadCount === 0) return false;
    if (activeFilter === 'groups' && !contact.isGroup) return false;
    if (activeFilter === 'favorites' && !chat.isFavorite) return false;

    return true;
  });

  return (
    <div className="flex-1 flex flex-col h-full bg-[#111b21] select-none overflow-hidden">
      {/* Top Header */}
      <div className="h-[60px] px-4 flex items-center justify-between shrink-0">
        <h1 className="text-xl font-bold text-[#e9edef]">WhatsApp</h1>

        <div className="flex items-center space-x-3 text-[#aebac1]">
          {/* Dropdown Menu */}
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-2 hover:bg-[#202c33] rounded-full transition-colors cursor-pointer"
              title="Menu"
            >
              <MoreVertical className="w-5 h-5" />
            </button>

            {showMenu && (
              <div
                onClick={() => setShowMenu(false)}
                className="absolute right-0 top-11 z-50 bg-[#233138] rounded-xl shadow-2xl py-2 w-52 border border-[#313d45] text-sm text-[#d1d7db]"
              >
                <div
                  onClick={() => setSubView('new-group')}
                  className="px-4 py-2.5 hover:bg-[#182229] cursor-pointer flex items-center space-x-3"
                >
                  <Users className="w-4 h-4 text-[#aebac1]" />
                  <span>New group</span>
                </div>
                <div
                  onClick={() => setSubView('starred')}
                  className="px-4 py-2.5 hover:bg-[#182229] cursor-pointer flex items-center space-x-3"
                >
                  <Star className="w-4 h-4 text-[#aebac1]" />
                  <span>Starred messages</span>
                </div>
                <div
                  onClick={() => setSubView('select-chats')}
                  className="px-4 py-2.5 hover:bg-[#182229] cursor-pointer flex items-center space-x-3"
                >
                  <CheckSquare className="w-4 h-4 text-[#aebac1]" />
                  <span>Select chats</span>
                </div>
                <div
                  onClick={() => {
                    markAllAsRead();
                  }}
                  className="px-4 py-2.5 hover:bg-[#182229] cursor-pointer flex items-center space-x-3"
                >
                  <MailCheck className="w-4 h-4 text-[#aebac1]" />
                  <span>Mark all as read</span>
                </div>
                <div
                  onClick={() => setSubView('app-lock')}
                  className="px-4 py-2.5 hover:bg-[#182229] cursor-pointer flex items-center space-x-3"
                >
                  <Lock className="w-4 h-4 text-[#aebac1]" />
                  <span>App lock</span>
                </div>
                <div
                  onClick={logout}
                  className="px-4 py-2.5 hover:bg-[#182229] cursor-pointer flex items-center space-x-3 text-red-400 border-t border-[#313d45] mt-1"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Log out</span>
                </div>
              </div>
            )}
          </div>

          {/* New Chat Button (Green rounded square with +) */}
          <button
            onClick={() => setSubView('new-chat')}
            className="w-8 h-8 rounded-lg bg-[#00a884] hover:bg-[#008f70] text-[#111b21] flex items-center justify-center transition-colors cursor-pointer shadow-md"
            title="New chat"
          >
            <Plus className="w-5 h-5 stroke-[2.5]" />
          </button>
        </div>
      </div>

      {/* Search Input Box */}
      <div className="px-3 pb-2 shrink-0">
        <div className="flex items-center bg-[#202c33] rounded-lg px-3 py-1.5 border border-transparent focus-within:border-[#00a884]">
          <Search className="w-4 h-4 text-[#8696a0] mr-3 shrink-0" />
          <input
            type="text"
            placeholder="Search or start a new chat"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="bg-transparent flex-1 text-[#e9edef] placeholder-[#8696a0] text-sm outline-none"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="text-[#8696a0] hover:text-white p-0.5 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Filter Pills (All, Unread 1, Favorites, Groups 1, +) */}
      <div className="flex items-center space-x-1.5 px-3 pb-3 text-xs overflow-x-auto shrink-0 scrollbar-none">
        <button
          onClick={() => setActiveFilter('all')}
          className={`px-3 py-1 rounded-full font-medium transition-colors cursor-pointer shrink-0 ${
            activeFilter === 'all'
              ? 'bg-[#103629] text-[#00a884] border border-[#00a884]/40'
              : 'bg-[#202c33] text-[#8696a0] hover:text-[#e9edef]'
          }`}
        >
          All
        </button>

        <button
          onClick={() => setActiveFilter('unread')}
          className={`px-3 py-1 rounded-full font-medium transition-colors cursor-pointer shrink-0 ${
            activeFilter === 'unread'
              ? 'bg-[#103629] text-[#00a884] border border-[#00a884]/40'
              : 'bg-[#202c33] text-[#8696a0] hover:text-[#e9edef]'
          }`}
        >
          Unread {unreadCount > 0 ? unreadCount : ''}
        </button>

        <button
          onClick={() => setActiveFilter('favorites')}
          className={`px-3 py-1 rounded-full font-medium transition-colors cursor-pointer shrink-0 ${
            activeFilter === 'favorites'
              ? 'bg-[#103629] text-[#00a884] border border-[#00a884]/40'
              : 'bg-[#202c33] text-[#8696a0] hover:text-[#e9edef]'
          }`}
        >
          Favorites
        </button>

        <button
          onClick={() => setActiveFilter('groups')}
          className={`px-3 py-1 rounded-full font-medium transition-colors cursor-pointer shrink-0 ${
            activeFilter === 'groups'
              ? 'bg-[#103629] text-[#00a884] border border-[#00a884]/40'
              : 'bg-[#202c33] text-[#8696a0] hover:text-[#e9edef]'
          }`}
        >
          Groups {groupCount > 0 ? groupCount : ''}
        </button>

        <button
          onClick={() => {
            // cycle or add filter
            if (activeFilter === 'all') setActiveFilter('unread');
            else if (activeFilter === 'unread') setActiveFilter('groups');
            else setActiveFilter('all');
          }}
          className="p-1 rounded-full bg-[#202c33] text-[#8696a0] hover:text-[#e9edef] transition-colors cursor-pointer shrink-0"
          title="Toggle filters"
        >
          <Plus className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Message and call notifications are off Banner */}
      {showNotificationBanner && (
        <div className="mx-3 mb-2 bg-[#103629] border border-[#00a884]/30 rounded-xl p-3 flex items-center justify-between text-xs shrink-0">
          <div className="flex items-center space-x-3 text-[#e9edef]">
            <div className="w-8 h-8 rounded-full bg-[#00a884]/20 flex items-center justify-center text-[#00a884] shrink-0">
              <VolumeX className="w-4 h-4" />
            </div>
            <div>
              <p className="font-medium text-[#e9edef]">Message and call notifications are off.</p>
              <button
                onClick={() => {
                  setShowNotificationBanner(false);
                  setSubView('settings-notifications');
                }}
                className="text-[#00a884] hover:underline font-semibold cursor-pointer"
              >
                Turn on
              </button>
            </div>
          </div>
          <button
            onClick={() => setShowNotificationBanner(false)}
            className="text-[#8696a0] hover:text-white p-1 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Archived Chats Row */}
      <div
        onClick={() => setSubView('archived')}
        className="px-4 py-3 flex items-center justify-between hover:bg-[#202c33] cursor-pointer transition-colors border-b border-[#222d34] shrink-0"
      >
        <div className="flex items-center space-x-4">
          <Archive className="w-5 h-5 text-[#00a884]" />
          <span className="text-base text-[#e9edef]">Archived</span>
        </div>
        <span className="text-xs text-[#00a884] font-semibold">{archivedCount}</span>
      </div>

      {/* Chat List Scrollable */}
      <div className="flex-1 overflow-y-auto">
        {filteredChats.map(chat => {
          const contact = contacts.find(c => c.id === chat.contactId);
          if (!contact) return null;
          return (
            <ChatListItem
              key={chat.id}
              chat={chat}
              contact={contact}
              isActive={chat.id === activeChatId}
            />
          );
        })}
      </div>
    </div>
  );
};
