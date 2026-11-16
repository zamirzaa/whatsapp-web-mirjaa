import React from 'react';
import { useWhatsApp } from '../../../context/WhatsAppContext';
import { ArrowLeft } from 'lucide-react';

export const SettingsKeyboardShortcutsView: React.FC = () => {
  const { setSubView } = useWhatsApp();

  const shortcuts = [
    { label: 'Mark as unread', keys: 'Ctrl + Alt + U' },
    { label: 'Mute chat', keys: 'Ctrl + Alt + M' },
    { label: 'Archive chat', keys: 'Ctrl + Alt + E' },
    { label: 'Delete chat', keys: 'Ctrl + Alt + Backspace' },
    { label: 'Pin chat', keys: 'Ctrl + Alt + P' },
    { label: 'Search in chat', keys: 'Ctrl + Alt + /' },
    { label: 'New chat', keys: 'Ctrl + Alt + N' },
    { label: 'New group', keys: 'Ctrl + Alt + Shift + N' },
    { label: 'Profile and About', keys: 'Ctrl + Alt + P' },
    { label: 'Settings', keys: 'Ctrl + Alt + ,' },
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
        <h2 className="text-xl font-medium text-[#e9edef]">Keyboard shortcuts</h2>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto divide-y divide-[#222d34]/60 p-4 space-y-1">
        {shortcuts.map((sc, i) => (
          <div key={i} className="flex justify-between items-center py-3">
            <span className="text-sm text-[#e9edef]">{sc.label}</span>
            <span className="bg-[#202c33] border border-[#313d45] text-xs font-mono text-[#aebac1] px-2.5 py-1 rounded-md">
              {sc.keys}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
