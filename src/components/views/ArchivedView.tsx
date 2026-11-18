import React from 'react';
import { useWhatsApp } from '../../context/WhatsAppContext';
import { ArrowLeft, Archive } from 'lucide-react';
import { ChatListItem } from '../sidebar/ChatListItem';

export const ArchivedView: React.FC = () => {
  const { chats, contacts, activeChatId, setSubView } = useWhatsApp();

  const archivedChats = chats.filter(c => c.isArchived);

  return (
    <div className="flex-1 flex flex-col h-full bg-white dark:bg-[#111b21] select-none overflow-hidden animate-in slide-in-from-left duration-150 transition-colors">
      {/* Header */}
      <div className="h-[60px] px-4 flex items-center space-x-6 border-b border-[#e9edef] dark:border-[#222d34] shrink-0">
        <button
          onClick={() => setSubView('none')}
          className="text-[#54656f] dark:text-[#aebac1] hover:text-[#111b21] dark:hover:text-white transition-colors cursor-pointer"
          title="Back to chats"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h2 className="text-xl font-medium text-[#111b21] dark:text-[#e9edef]">Archived</h2>
      </div>

      {/* Notice Banner */}
      <div className="px-4 py-3 text-xs text-[#667781] dark:text-[#8696a0] leading-relaxed border-b border-[#e9edef] dark:border-[#222d34] shrink-0">
        These chats stay archived when new messages are received. To change this experience, go to{' '}
        <span className="text-[#008069] dark:text-[#00a884] font-medium">Settings &gt; Chats</span> on your phone.
      </div>

      {/* Archived Chats List */}
      <div className="flex-1 overflow-y-auto">
        {archivedChats.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 text-[#667781] dark:text-[#8696a0] text-sm space-y-2">
            <Archive className="w-10 h-10 stroke-[1.5] text-[#8696a0]/60" />
            <p>No archived chats</p>
          </div>
        ) : (
          archivedChats.map(chat => {
            const contact = contacts.find(c => c.id === chat.contactId) || {
              id: chat.contactId || chat.id,
              name: (chat as any).name || 'Group',
              phoneNumber: '',
              avatar: (chat as any).avatar || 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=150&auto=format&fit=crop&q=80',
              about: (chat as any).about || 'WhatsApp Group',
              isOnline: true,
              isGroup: (chat as any).isGroup ?? true,
              groupMembers: (chat as any).groupMembers || ['You'],
            };
            return (
              <ChatListItem
                key={chat.id}
                chat={chat}
                contact={contact}
                isActive={chat.id === activeChatId}
              />
            );
          })
        )}
      </div>
    </div>
  );
};
