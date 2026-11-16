import React, { useState } from 'react';
import { useWhatsApp } from '../../context/WhatsAppContext';
import { X, Search, Calendar } from 'lucide-react';

export const SearchMessagesDrawer: React.FC = () => {
  const { activeMessages, setActiveRightDrawer } = useWhatsApp();
  const [query, setQuery] = useState('');

  const filtered = query.trim()
    ? activeMessages.filter(
        m => m.text?.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  return (
    <div className="w-full md:w-[380px] lg:w-[420px] h-full bg-[#111b21] border-l border-[#222d34] flex flex-col z-20 animate-in slide-in-from-right duration-200 select-none shrink-0">
      {/* Header */}
      <div className="h-[60px] bg-[#202c33] px-6 flex items-center justify-between border-b border-[#222d34]">
        <h3 className="text-base font-medium text-[#e9edef]">Search messages</h3>
        <button
          onClick={() => setActiveRightDrawer('none')}
          className="text-[#aebac1] hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Search Input Box */}
      <div className="p-3 bg-[#111b21] border-b border-[#222d34]">
        <div className="flex items-center bg-[#202c33] rounded-lg px-3 py-1.5 border border-transparent focus-within:border-[#00a884]">
          <Search className="w-4 h-4 text-[#8696a0] mr-3" />
          <input
            type="text"
            placeholder="Search..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            autoFocus
            className="bg-transparent flex-1 text-[#e9edef] placeholder-[#8696a0] text-sm outline-none"
          />
          {query && (
            <button onClick={() => setQuery('')} className="text-[#8696a0] hover:text-white">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Results List */}
      <div className="flex-1 overflow-y-auto p-4">
        {!query.trim() ? (
          <div className="flex flex-col items-center justify-center h-48 text-center text-[#8696a0]">
            <Calendar className="w-8 h-8 mb-2 opacity-50" />
            <p className="text-xs">Search for messages with this contact</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center text-[#8696a0] text-xs py-8">
            No messages found for "{query}"
          </div>
        ) : (
          <div className="space-y-2">
            <span className="text-xs text-[#8696a0] font-medium block mb-2">
              {filtered.length} messages found
            </span>
            {filtered.map(msg => (
              <div
                key={msg.id}
                className="p-3 rounded-lg bg-[#202c33] hover:bg-[#2a3942] transition-colors cursor-pointer space-y-1"
              >
                <div className="flex justify-between items-center text-[11px] text-[#8696a0]">
                  <span>{msg.isOutgoing ? 'You' : 'Contact'}</span>
                  <span>{msg.timestamp}</span>
                </div>
                <p className="text-sm text-[#e9edef] line-clamp-2">{msg.text}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
