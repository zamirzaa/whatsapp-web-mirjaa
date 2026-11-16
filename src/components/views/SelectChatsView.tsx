import React from 'react';
import { useWhatsApp } from '../../context/WhatsAppContext';
import { X, Check, MessageSquare, Archive, Trash2, VolumeX } from 'lucide-react';

export const SelectChatsView: React.FC = () => {
  const {
    chats,
    contacts,
    selectedChatIds,
    toggleSelectChat,
    clearSelectedChats,
    archiveSelectedChats,
    deleteSelectedChats,
    muteSelectedChats,
  } = useWhatsApp();

  const activeChats = chats.filter(c => !c.isArchived);

  return (
    <div className="flex-1 flex flex-col h-full bg-[#111b21] select-none overflow-hidden relative">
      {/* Header with Batch Actions */}
      <div className="h-[60px] px-4 flex items-center justify-between border-b border-[#222d34] shrink-0">
        <div className="flex items-center space-x-6">
          <button
            onClick={clearSelectedChats}
            className="text-[#aebac1] hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
          <h2 className="text-base font-normal text-[#e9edef]">
            {selectedChatIds.length} selected
          </h2>
        </div>

        {selectedChatIds.length > 0 && (
          <div className="flex items-center space-x-2 text-[#aebac1]">
            <button
              onClick={archiveSelectedChats}
              className="p-2 hover:bg-[#202c33] rounded-full transition-colors cursor-pointer"
              title="Archive selected"
            >
              <Archive className="w-5 h-5" />
            </button>
            <button
              onClick={muteSelectedChats}
              className="p-2 hover:bg-[#202c33] rounded-full transition-colors cursor-pointer"
              title="Mute selected"
            >
              <VolumeX className="w-5 h-5" />
            </button>
            <button
              onClick={deleteSelectedChats}
              className="p-2 hover:bg-[#202c33] rounded-full transition-colors cursor-pointer text-red-400"
              title="Delete selected"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>

      {/* Chat List with Checkboxes */}
      <div className="flex-1 overflow-y-auto">
        {activeChats.map(chat => {
          const contact = contacts.find(c => c.id === chat.contactId);
          if (!contact) return null;
          const isSelected = selectedChatIds.includes(chat.id);

          return (
            <div
              key={chat.id}
              onClick={() => toggleSelectChat(chat.id)}
              className="flex items-center px-4 py-3 hover:bg-[#202c33] cursor-pointer transition-colors border-b border-[#222d34]/50"
            >
              {/* Checkbox */}
              <div
                className={`w-5 h-5 rounded border mr-4 flex items-center justify-center transition-colors shrink-0 ${
                  isSelected
                    ? 'bg-[#00a884] border-[#00a884] text-[#111b21]'
                    : 'border-[#8696a0]'
                }`}
              >
                {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
              </div>

              {/* Avatar */}
              <img
                src={contact.avatar}
                alt={contact.name}
                className="w-11 h-11 rounded-full object-cover mr-3.5 shrink-0"
              />

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center mb-0.5">
                  <h4 className="text-base text-[#e9edef] truncate">{contact.name}</h4>
                  <span className="text-xs text-[#8696a0]">
                    {chat.lastMessage?.timestamp || ''}
                  </span>
                </div>
                <p className="text-xs text-[#8696a0] truncate">
                  {chat.lastMessage?.text || 'Photo/Audio'}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Popup Toast: "Get WhatsApp for Windows" (from Screenshot 12) */}
      <div className="p-3 bg-[#111b21] border-t border-[#222d34] shrink-0">
        <a
          href="https://www.whatsapp.com/download"
          target="_blank"
          rel="noreferrer"
          className="bg-[#182229] hover:bg-[#202c33] border border-[#313d45] rounded-xl px-4 py-2.5 flex items-center space-x-3 text-xs text-[#e9edef] shadow-lg transition-colors cursor-pointer"
        >
          <div className="w-8 h-8 rounded-full bg-[#00a884] flex items-center justify-center text-[#111b21] shrink-0">
            <MessageSquare className="w-4 h-4 fill-current" />
          </div>
          <span className="font-medium text-[#00a884]">Get WhatsApp for Windows</span>
        </a>
      </div>
    </div>
  );
};
