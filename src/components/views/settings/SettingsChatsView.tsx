import React from 'react';
import { useWhatsApp } from '../../../context/WhatsAppContext';
import { ArrowLeft, Moon, Sun, Archive, Trash2, Check } from 'lucide-react';

export const SettingsChatsView: React.FC = () => {
  const { setSubView, theme, setThemeMode, chats, deleteSelectedChats } = useWhatsApp();

  const wallpapers = [
    { id: 'default', color: '#0b141a', name: 'Default Dark' },
    { id: 'green', color: '#005c4b', name: 'WhatsApp Green' },
    { id: 'navy', color: '#102a43', name: 'Midnight Blue' },
    { id: 'slate', color: '#243b53', name: 'Slate Gray' },
    { id: 'burgundy', color: '#4a154b', name: 'Burgundy' },
  ];

  return (
    <div className="flex-1 flex flex-col h-full bg-[#111b21] select-none overflow-hidden animate-in slide-in-from-left duration-150">
      {/* Header */}
      <div className="h-[60px] px-4 flex items-center space-x-6 border-b border-[#222d34] shrink-0">
        <button
          onClick={() => setSubView('none')}
          className="text-[#aebac1] hover:text-white transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h2 className="text-xl font-medium text-[#e9edef]">Chats</h2>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto divide-y divide-[#222d34]/60">
        {/* Theme Section */}
        <div className="p-4 space-y-3">
          <h4 className="text-sm font-semibold uppercase tracking-wider text-[#00a884]">Theme</h4>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setThemeMode('dark')}
              className={`p-3 rounded-xl border flex items-center space-x-3 cursor-pointer transition-colors ${
                theme === 'dark'
                  ? 'border-[#00a884] bg-[#202c33]'
                  : 'border-[#313d45] hover:bg-[#202c33]/50'
              }`}
            >
              <Moon className="w-5 h-5 text-[#00a884]" />
              <span className="text-sm text-[#e9edef] font-medium">Dark</span>
              {theme === 'dark' && <Check className="w-4 h-4 text-[#00a884] ml-auto" />}
            </button>

            <button
              onClick={() => setThemeMode('light')}
              className={`p-3 rounded-xl border flex items-center space-x-3 cursor-pointer transition-colors ${
                theme === 'light'
                  ? 'border-[#00a884] bg-[#202c33]'
                  : 'border-[#313d45] hover:bg-[#202c33]/50'
              }`}
            >
              <Sun className="w-5 h-5 text-[#00a884]" />
              <span className="text-sm text-[#e9edef] font-medium">Light</span>
              {theme === 'light' && <Check className="w-4 h-4 text-[#00a884] ml-auto" />}
            </button>
          </div>
        </div>

        {/* Wallpaper Section */}
        <div className="p-4 space-y-3">
          <h4 className="text-sm font-semibold uppercase tracking-wider text-[#00a884]">
            Chat wallpaper
          </h4>
          <div className="flex items-center space-x-3 overflow-x-auto pb-2">
            {wallpapers.map(wp => (
              <div
                key={wp.id}
                className="w-12 h-16 rounded-lg border-2 border-[#313d45] hover:border-[#00a884] cursor-pointer transition-all shadow-md shrink-0 flex items-center justify-center"
                style={{ backgroundColor: wp.color }}
                title={wp.name}
              />
            ))}
          </div>
        </div>

        {/* Chat Management Options */}
        <div className="p-4 space-y-2">
          <h4 className="text-sm font-semibold uppercase tracking-wider text-[#00a884]">History</h4>
          <div
            onClick={() => {
              chats.forEach(c => (c.isArchived = true));
              setSubView('archived');
            }}
            className="flex items-center space-x-4 py-2.5 hover:text-[#00a884] cursor-pointer transition-colors text-sm text-[#e9edef]"
          >
            <Archive className="w-5 h-5 text-[#8696a0]" />
            <span>Archive all chats</span>
          </div>

          <div
            onClick={() => deleteSelectedChats()}
            className="flex items-center space-x-4 py-2.5 hover:text-red-400 cursor-pointer transition-colors text-sm text-red-400"
          >
            <Trash2 className="w-5 h-5" />
            <span>Clear all messages</span>
          </div>
        </div>
      </div>
    </div>
  );
};
