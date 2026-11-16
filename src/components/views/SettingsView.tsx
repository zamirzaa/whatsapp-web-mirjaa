import React, { useState } from 'react';
import { useWhatsApp } from '../../context/WhatsAppContext';
import {
  Search,
  User,
  KeyRound,
  Lock,
  MessageSquare,
  Bell,
  Keyboard,
  HelpCircle,
  Lightbulb,
  X,
} from 'lucide-react';

export const SettingsView: React.FC = () => {
  const {
    currentUser,
    setSubView,
    theme,
    setIsThoughtModalOpen,
  } = useWhatsApp();

  const [search, setSearch] = useState('');
  const [showNotice, setShowNotice] = useState(true);

  const settingsItems = [
    {
      id: 'profile',
      icon: User,
      title: 'Profile',
      desc: 'Name, profile picture, username',
      action: () => setSubView('settings-profile'),
    },
    {
      id: 'account',
      icon: KeyRound,
      title: 'Account',
      desc: 'Security notifications, account info',
      action: () => setSubView('settings-account'),
    },
    {
      id: 'privacy',
      icon: Lock,
      title: 'Privacy',
      desc: 'Blocked contacts, disappearing messages',
      action: () => setSubView('settings-privacy'),
    },
    {
      id: 'chats',
      icon: MessageSquare,
      title: 'Chats',
      desc: `Theme (${theme}), wallpaper, chat settings`,
      action: () => setSubView('settings-chats'),
    },
    {
      id: 'notifications',
      icon: Bell,
      title: 'Notifications',
      desc: 'Messages, groups, sounds',
      action: () => setSubView('settings-notifications'),
    },
    {
      id: 'keyboard',
      icon: Keyboard,
      title: 'Keyboard shortcuts',
      desc: 'Quick actions',
      action: () => setSubView('settings-keyboard'),
    },
    {
      id: 'help',
      icon: HelpCircle,
      title: 'Help and feedback',
      desc: 'Help center, contact us, privacy policy',
      action: () => setSubView('settings-help'),
    },
  ];

  const filteredItems = search.trim()
    ? settingsItems.filter(
        item =>
          item.title.toLowerCase().includes(search.toLowerCase()) ||
          item.desc.toLowerCase().includes(search.toLowerCase())
      )
    : settingsItems;

  return (
    <div className="flex-1 flex flex-col h-full bg-[#111b21] select-none overflow-hidden animate-in slide-in-from-left duration-150">
      {/* Header with user name Mirza */}
      <div className="h-[60px] px-4 flex items-center border-b border-[#222d34] shrink-0">
        <h2 className="text-xl font-bold text-[#e9edef]">{currentUser.name}</h2>
      </div>

      {/* Search Bar */}
      <div className="p-3 shrink-0">
        <div className="flex items-center bg-[#202c33] rounded-lg px-3 py-1.5 border border-transparent focus-within:border-[#00a884]">
          <Search className="w-4 h-4 text-[#8696a0] mr-3" />
          <input
            type="text"
            placeholder="Search"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="bg-transparent flex-1 text-[#e9edef] placeholder-[#8696a0] text-sm outline-none"
          />
          {search && (
            <button onClick={() => setSearch('')} className="text-[#8696a0] hover:text-white">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto divide-y divide-[#222d34]/60">
        {/* Notice Card: Choose your notifications */}
        {showNotice && !search && (
          <div className="p-3">
            <div className="bg-[#182229] border border-[#2a3942] rounded-xl p-3 flex items-start justify-between text-xs text-[#e9edef]">
              <div className="flex items-start space-x-3">
                <Lightbulb className="w-5 h-5 text-[#8696a0] mt-0.5 shrink-0" />
                <div>
                  <h4 className="font-semibold text-sm">Choose your notifications</h4>
                  <p className="text-[#8696a0] mt-0.5">
                    Get notifications for messages, groups or your status.{' '}
                    <button
                      onClick={() => setSubView('settings-notifications')}
                      className="text-[#00a884] cursor-pointer hover:underline font-medium inline"
                    >
                      Choose now
                    </button>
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowNotice(false)}
                className="text-[#8696a0] hover:text-white p-1 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* User Profile Avatar with "Share a thought" speech bubble (Screenshot 14) */}
        {!search && (
          <div className="py-6 px-4 flex flex-col items-center justify-center">
            <div
              onClick={() => setIsThoughtModalOpen(true)}
              className="relative cursor-pointer group"
              title="Click to edit thought"
            >
              {/* Thought speech bubble */}
              <div className="absolute -top-7 -left-6 z-10 bg-[#202c33] group-hover:bg-[#2a3942] text-[#e9edef] text-xs px-3 py-1.5 rounded-2xl shadow-md border border-[#313d45] whitespace-nowrap transition-colors flex items-center space-x-1">
                <span>{currentUser.thought || 'Share a thought'}</span>
                <div className="w-2 h-2 bg-[#202c33] group-hover:bg-[#2a3942] rotate-45 border-b border-r border-[#313d45] absolute -bottom-1 left-8" />
              </div>

              {/* Avatar circle */}
              <div className="w-24 h-24 rounded-full bg-[#1d5c96] group-hover:opacity-90 flex items-center justify-center text-white shadow-xl border-2 border-[#202c33] transition-opacity">
                <User className="w-12 h-12" />
              </div>
            </div>
          </div>
        )}

        {/* Settings Navigation List (Screenshot 15) */}
        <div className="divide-y divide-[#222d34]/40">
          {filteredItems.map(item => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                onClick={item.action}
                className="flex items-center space-x-4 px-5 py-3.5 hover:bg-[#202c33] cursor-pointer transition-colors"
              >
                <Icon className="w-5 h-5 text-[#8696a0]" />
                <div>
                  <h4 className="text-base text-[#e9edef]">{item.title}</h4>
                  <p className="text-xs text-[#8696a0]">{item.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
