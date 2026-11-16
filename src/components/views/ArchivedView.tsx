import React from 'react';
import { useWhatsApp } from '../../context/WhatsAppContext';
import { ArrowLeft } from 'lucide-react';
import { ChatListItem } from '../sidebar/ChatListItem';

export const ArchivedView: React.FC = () => {
  const { chats, contacts, activeChatId, setSubView } = useWhatsApp();

  const archivedChats = chats.filter(c => c.isArchived);

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
        <h2 className="text-xl font-medium text-[#e9edef]">Archived</h2>
      </div>

      {/* Notice Banner */}
      <div className="px-4 py-3 text-xs text-[#8696a0] leading-relaxed border-b border-[#222d34] shrink-0">
        These chats stay archived when new messages are received. To change this experience, go to{' '}
        <span className="text-[#00a884]">Settings &gt; Chats</span> on your phone.
      </div>

      {/* Archived Chats List */}
      <div className="flex-1 overflow-y-auto">
        {archivedChats.map(chat => {
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
