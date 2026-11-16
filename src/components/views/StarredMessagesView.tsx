import React, { useState } from 'react';
import { useWhatsApp } from '../../context/WhatsAppContext';
import { ArrowLeft, Search, Star, MoreVertical } from 'lucide-react';

export const StarredMessagesView: React.FC = () => {
  const { setSubView, activeMessages } = useWhatsApp();
  const [search, setSearch] = useState('');

  const starredList = activeMessages.filter(m => m.isStarred);

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
          <h2 className="text-xl font-medium text-[#e9edef]">Starred messages</h2>
        </div>
        <button className="text-[#aebac1] hover:text-white p-2 cursor-pointer">
          <MoreVertical className="w-5 h-5" />
        </button>
      </div>

      {/* Search Input */}
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
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-8 flex flex-col items-center justify-center text-center">
        {starredList.length === 0 ? (
          <div className="flex flex-col items-center max-w-xs space-y-4">
            <div className="w-16 h-16 rounded-full bg-[#00a884]/20 border-2 border-[#00a884] flex items-center justify-center text-[#00a884]">
              <Star className="w-8 h-8 fill-current" />
            </div>
            <h3 className="text-lg font-medium text-[#e9edef]">No starred messages</h3>
            <p className="text-xs text-[#8696a0] leading-relaxed">
              Use WhatsApp on your phone to see older chats and messages.
            </p>
          </div>
        ) : (
          <div className="w-full space-y-2">
            {starredList.map(msg => (
              <div
                key={msg.id}
                className="p-3 bg-[#202c33] rounded-lg text-left text-sm text-[#e9edef]"
              >
                <div className="flex justify-between text-xs text-[#8696a0] mb-1">
                  <span>{msg.isOutgoing ? 'You' : 'Contact'}</span>
                  <span>{msg.timestamp}</span>
                </div>
                <p>{msg.text}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
