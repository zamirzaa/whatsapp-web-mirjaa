import React from 'react';
import { useWhatsApp } from '../../context/WhatsAppContext';
import {
  MessageSquare,
  CircleDashed,
  Radio,
  Users,
  Star,
  User,
  Image as ImageIcon,
} from 'lucide-react';
import type { NavTab } from '../../types/whatsapp';

export const NavRail: React.FC = () => {
  const {
    activeNavTab,
    setActiveNavTab,
    setSubView,
    chats,
    askMetaAI,
  } = useWhatsApp();

  const unreadChatsCount = chats.filter(c => !c.isArchived && c.unreadCount > 0).length;

  const handleTabClick = (tab: NavTab) => {
    setActiveNavTab(tab);
    setSubView('none');
  };

  return (
    <div className="w-[60px] h-full bg-[#f0f2f5] dark:bg-[#111b21] border-r border-[#e9edef] dark:border-[#222d34] flex flex-col justify-between items-center py-3 select-none shrink-0 z-30 transition-colors">
      {/* Top Main Navigation Tabs */}
      <div className="flex flex-col items-center space-y-2 w-full">
        {/* Chats Tab */}
        <button
          onClick={() => handleTabClick('chats')}
          className={`relative w-10 h-10 rounded-full flex items-center justify-center transition-colors cursor-pointer ${
            activeNavTab === 'chats'
              ? 'bg-[#00a884]/20 text-[#00a884] dark:bg-[#374248] dark:text-white'
              : 'text-[#54656f] dark:text-[#8696a0] hover:text-[#111b21] dark:hover:text-[#e9edef] hover:bg-black/5 dark:hover:bg-[#202c33]'
          }`}
          title="Chats"
        >
          <MessageSquare className="w-5 h-5 fill-current" />
          {unreadChatsCount > 0 && (
            <span className="absolute -top-1 -right-1 min-w-4 h-4 px-1 rounded-full bg-[#00a884] text-white font-bold text-[10px] flex items-center justify-center">
              {unreadChatsCount}
            </span>
          )}
        </button>

        {/* Status Tab */}
        <button
          onClick={() => handleTabClick('status')}
          className={`relative w-10 h-10 rounded-full flex items-center justify-center transition-colors cursor-pointer ${
            activeNavTab === 'status'
              ? 'bg-[#00a884]/20 text-[#00a884] dark:bg-[#374248] dark:text-white'
              : 'text-[#54656f] dark:text-[#8696a0] hover:text-[#111b21] dark:hover:text-[#e9edef] hover:bg-black/5 dark:hover:bg-[#202c33]'
          }`}
          title="Status"
        >
          <CircleDashed className="w-5 h-5" />
        </button>

        {/* Channels Tab */}
        <button
          onClick={() => handleTabClick('channels')}
          className={`relative w-10 h-10 rounded-full flex items-center justify-center transition-colors cursor-pointer ${
            activeNavTab === 'channels'
              ? 'bg-[#00a884]/20 text-[#00a884] dark:bg-[#374248] dark:text-white'
              : 'text-[#54656f] dark:text-[#8696a0] hover:text-[#111b21] dark:hover:text-[#e9edef] hover:bg-black/5 dark:hover:bg-[#202c33]'
          }`}
          title="Channels"
        >
          <Radio className="w-5 h-5" />
        </button>

        {/* Communities Tab */}
        <button
          onClick={() => handleTabClick('communities')}
          className={`relative w-10 h-10 rounded-full flex items-center justify-center transition-colors cursor-pointer ${
            activeNavTab === 'communities'
              ? 'bg-[#00a884]/20 text-[#00a884] dark:bg-[#374248] dark:text-white'
              : 'text-[#54656f] dark:text-[#8696a0] hover:text-[#111b21] dark:hover:text-[#e9edef] hover:bg-black/5 dark:hover:bg-[#202c33]'
          }`}
          title="Communities"
        >
          <Users className="w-5 h-5" />
        </button>

        {/* Meta AI Tab / Action */}
        <button
          onClick={askMetaAI}
          className="relative w-10 h-10 rounded-full flex items-center justify-center transition-transform hover:scale-105 cursor-pointer mt-1"
          title="Ask Meta AI"
        >
          {/* Authentic Meta AI colorful iridescent spiral ring */}
          <div className="w-6 h-6 rounded-full p-[2px] bg-gradient-to-tr from-[#9333ea] via-[#ec4899] to-[#3b82f6] flex items-center justify-center animate-spin-slow">
            <div className="w-full h-full bg-[#f0f2f5] dark:bg-[#111b21] rounded-full flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-gradient-to-r from-[#a855f7] to-[#ec4899]" />
            </div>
          </div>
        </button>
      </div>

      {/* Bottom Shortcuts: Starred & Profile/Settings */}
      <div className="flex flex-col items-center space-y-3 w-full">
        {/* Starred Messages */}
        <button
          onClick={() => {
            setActiveNavTab('chats');
            setSubView('starred');
          }}
          className="w-10 h-10 rounded-full flex items-center justify-center text-[#54656f] dark:text-[#8696a0] hover:text-[#111b21] dark:hover:text-[#e9edef] hover:bg-black/5 dark:hover:bg-[#202c33] transition-colors cursor-pointer"
          title="Starred messages"
        >
          <Star className="w-5 h-5" />
        </button>

        {/* All Media from all chats */}
        <button
          onClick={() => {
            setActiveNavTab('chats');
            setSubView('all-media');
          }}
          className="w-10 h-10 rounded-full flex items-center justify-center text-[#54656f] dark:text-[#8696a0] hover:text-[#111b21] dark:hover:text-[#e9edef] hover:bg-black/5 dark:hover:bg-[#202c33] transition-colors cursor-pointer"
          title="Media from all chats"
        >
          <ImageIcon className="w-5 h-5" />
        </button>

        {/* Settings / Profile Avatar */}
        <button
          onClick={() => handleTabClick('settings')}
          className={`relative w-9 h-9 rounded-full flex items-center justify-center transition-all cursor-pointer ${
            activeNavTab === 'settings'
              ? 'ring-2 ring-[#00a884]'
              : 'hover:opacity-90'
          }`}
          title="Settings (Mirza)"
        >
          <div className="w-8 h-8 rounded-full bg-[#1d5c96] flex items-center justify-center text-white">
            <User className="w-5 h-5" />
          </div>
        </button>
      </div>
    </div>
  );
};
