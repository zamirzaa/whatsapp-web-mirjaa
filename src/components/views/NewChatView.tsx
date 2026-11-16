import React, { useState } from 'react';
import { useWhatsApp } from '../../context/WhatsAppContext';
import {
  ArrowLeft,
  Search,
  Users,
  UserPlus,
  Network,
  Grid,
} from 'lucide-react';

export const NewChatView: React.FC = () => {
  const { contacts, currentUser, setActiveChatId, setSubView } = useWhatsApp();
  const [search, setSearch] = useState('');

  const filtered = contacts.filter(
    c =>
      !c.isArchived &&
      (c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.phoneNumber.includes(search))
  );

  const startChatWithContact = (contactId: string) => {
    setActiveChatId(`chat_${contactId}`);
    setSubView('none');
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#111b21] select-none overflow-hidden animate-in slide-in-from-left duration-150">
      {/* Header */}
      <div className="h-[60px] px-4 flex items-center justify-between border-b border-[#222d34] shrink-0">
        <div className="flex items-center space-x-6">
          <button
            onClick={() => setSubView('none')}
            className="text-[#aebac1] hover:text-white transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h2 className="text-xl font-medium text-[#e9edef]">New chat</h2>
        </div>
        <button className="text-[#aebac1] hover:text-white p-2 cursor-pointer">
          <Grid className="w-5 h-5" />
        </button>
      </div>

      {/* Search Input */}
      <div className="p-3 shrink-0">
        <div className="flex items-center bg-[#202c33] rounded-lg px-3 py-1.5 border border-transparent focus-within:border-[#00a884]">
          <Search className="w-4 h-4 text-[#8696a0] mr-3" />
          <input
            type="text"
            placeholder="Search name, number or @username"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="bg-transparent flex-1 text-[#e9edef] placeholder-[#8696a0] text-sm outline-none"
            autoFocus
          />
        </div>
      </div>

      {/* Main Options */}
      <div className="border-b border-[#222d34] pb-2 shrink-0">
        {/* New group */}
        <div
          onClick={() => setSubView('new-group')}
          className="flex items-center space-x-4 px-4 py-3 hover:bg-[#202c33] cursor-pointer transition-colors"
        >
          <div className="w-10 h-10 rounded-full bg-[#00a884] flex items-center justify-center text-[#111b21]">
            <Users className="w-5 h-5" />
          </div>
          <span className="text-base text-[#e9edef]">New group</span>
        </div>

        {/* New contact */}
        <div
          onClick={() => setSubView('new-contact')}
          className="flex items-center space-x-4 px-4 py-3 hover:bg-[#202c33] cursor-pointer transition-colors"
        >
          <div className="w-10 h-10 rounded-full bg-[#00a884] flex items-center justify-center text-[#111b21]">
            <UserPlus className="w-5 h-5" />
          </div>
          <span className="text-base text-[#e9edef]">New contact</span>
        </div>

        {/* New community */}
        <div
          onClick={() => setSubView('new-community')}
          className="flex items-center space-x-4 px-4 py-3 hover:bg-[#202c33] cursor-pointer transition-colors"
        >
          <div className="w-10 h-10 rounded-full bg-[#00a884] flex items-center justify-center text-[#111b21]">
            <Network className="w-5 h-5" />
          </div>
          <span className="text-base text-[#e9edef]">New community</span>
        </div>

        {/* Message yourself */}
        <div
          onClick={() => {
            // Select user self chat
            setActiveChatId('chat_self');
            setSubView('none');
          }}
          className="flex items-center space-x-4 px-4 py-3 hover:bg-[#202c33] cursor-pointer transition-colors"
        >
          <div className="w-10 h-10 rounded-full bg-[#1d5c96] flex items-center justify-center text-white">
            <span className="text-sm font-semibold">👤</span>
          </div>
          <div>
            <span className="text-base text-[#e9edef] block">{currentUser.phone} (You)</span>
            <span className="text-xs text-[#8696a0]">Message yourself</span>
          </div>
        </div>
      </div>

      {/* Alphabetical Contact List */}
      <div className="flex-1 overflow-y-auto px-4 py-3">
        <h3 className="text-xs font-semibold text-[#8696a0] px-2 mb-2">A</h3>
        <div className="space-y-1">
          {filtered.map(contact => (
            <div
              key={contact.id}
              onClick={() => startChatWithContact(contact.id)}
              className="flex items-center space-x-3.5 px-2 py-2.5 rounded-lg hover:bg-[#202c33] cursor-pointer transition-colors"
            >
              <img
                src={contact.avatar}
                alt={contact.name}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div className="flex-1 min-w-0 border-b border-[#222d34] pb-2">
                <h4 className="text-base text-[#e9edef] truncate">{contact.name}</h4>
                <p className="text-xs text-[#8696a0] truncate">{contact.about || contact.phoneNumber}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
