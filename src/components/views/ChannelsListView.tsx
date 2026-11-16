import React, { useState } from 'react';
import { useWhatsApp } from '../../context/WhatsAppContext';
import { Plus, Check, BadgeCheck } from 'lucide-react';
import { NewChannelModal } from '../modals/NewChannelModal';

export const ChannelsListView: React.FC = () => {
  const { channels, toggleFollowChannel, setActiveChannel } = useWhatsApp();
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  return (
    <div className="flex-1 flex flex-col h-full bg-[#111b21] select-none overflow-hidden animate-in slide-in-from-left duration-150">
      {/* Header */}
      <div className="h-[60px] px-4 flex items-center justify-between border-b border-[#222d34] shrink-0">
        <h2 className="text-xl font-bold text-[#e9edef]">Channels</h2>
        <button
          onClick={() => setIsCreateOpen(true)}
          className="p-2 hover:bg-[#202c33] rounded-full transition-colors cursor-pointer text-[#00a884]"
          title="Create channel"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {/* Banner text */}
        <div>
          <h3 className="text-base font-semibold text-[#e9edef] leading-snug">
            Stay updated on your favorite topics
          </h3>
          <p className="text-xs text-[#8696a0] mt-1">
            Find channels to follow below
          </p>
        </div>

        {/* Channel Items */}
        <div className="space-y-2 pt-2">
          {channels.map(ch => (
            <div
              key={ch.id}
              onClick={() => setActiveChannel(ch)}
              className="flex items-center justify-between p-2 rounded-lg hover:bg-[#202c33] cursor-pointer transition-colors"
            >
              <div className="flex items-center space-x-3 min-w-0 flex-1 pr-2">
                <img
                  src={ch.avatar}
                  alt={ch.name}
                  className="w-11 h-11 rounded-full object-cover shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center space-x-1">
                    <h4 className="text-sm font-medium text-[#e9edef] truncate">{ch.name}</h4>
                    {ch.isVerified && (
                      <BadgeCheck className="w-4 h-4 text-[#00a884] fill-current shrink-0" />
                    )}
                  </div>
                  <p className="text-xs text-[#8696a0]">{ch.followers}</p>
                </div>
              </div>

              {/* Follow / Following button */}
              <button
                onClick={e => {
                  e.stopPropagation();
                  toggleFollowChannel(ch.id);
                }}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-colors cursor-pointer shrink-0 ${
                  ch.isFollowing
                    ? 'bg-[#202c33] text-[#e9edef] border border-[#313d45]'
                    : 'bg-[#103629] text-[#00a884] border border-[#00a884]/40 hover:bg-[#00a884] hover:text-[#111b21]'
                }`}
              >
                {ch.isFollowing ? (
                  <span className="flex items-center space-x-1">
                    <Check className="w-3.5 h-3.5" />
                    <span>Following</span>
                  </span>
                ) : (
                  'Follow'
                )}
              </button>
            </div>
          ))}
        </div>

        {/* Bottom Actions */}
        <div className="pt-4 space-y-2">
          <button
            onClick={() => setIsCreateOpen(true)}
            className="w-full py-2.5 rounded-full border border-[#00a884]/40 text-[#00a884] hover:bg-[#00a884]/10 text-xs font-semibold transition-colors cursor-pointer"
          >
            Discover more
          </button>
          <button
            onClick={() => setIsCreateOpen(true)}
            className="w-full py-2 text-[#00a884] hover:underline text-xs font-medium flex items-center justify-center space-x-1 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create channel</span>
          </button>
        </div>
      </div>

      <NewChannelModal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} />
    </div>
  );
};
