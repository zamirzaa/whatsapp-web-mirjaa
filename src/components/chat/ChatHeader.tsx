import React, { useState } from 'react';
import { useWhatsApp } from '../../context/WhatsAppContext';
import {
  Video,
  Phone,
  Search,
  MoreVertical,
} from 'lucide-react';

export const ChatHeader: React.FC = () => {
  const {
    activeContact,
    startCall,
    setActiveRightDrawer,
    activeRightDrawer,
    isTyping,
    setActiveChatId,
  } = useWhatsApp();

  const [showMenu, setShowMenu] = useState(false);

  if (!activeContact) return null;

  const renderSubtitle = () => {
    if (isTyping) return <span className="text-[#00a884] font-medium animate-pulse">typing...</span>;
    if (activeContact.isGroup) {
      return activeContact.groupMembers?.join(', ') || 'Group members';
    }
    if (activeContact.isOnline) return <span className="text-[#00a884]">online</span>;
    return activeContact.lastSeen || 'offline';
  };

  return (
    <div className="h-[60px] bg-[#202c33] dark:bg-[#202c33] px-4 flex items-center justify-between border-b border-[#222d34] select-none shrink-0 z-10">
      {/* Contact Info (Click opens Right Drawer) */}
      <div
        onClick={() =>
          setActiveRightDrawer(activeRightDrawer === 'contact-info' ? 'none' : 'contact-info')
        }
        className="flex items-center space-x-3.5 cursor-pointer flex-1 min-w-0"
      >
        <img
          src={activeContact.avatar}
          alt={activeContact.name}
          className="w-10 h-10 rounded-full object-cover"
        />
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-normal text-[#e9edef] truncate leading-tight">
            {activeContact.name}
          </h3>
          <p className="text-xs text-[#8696a0] truncate leading-tight mt-0.5">
            {renderSubtitle()}
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center space-x-2 text-[#aebac1]">
        {/* Video Call */}
        <button
          onClick={() => startCall(activeContact, 'video')}
          className="p-2 hover:bg-[#374248] rounded-full transition-colors cursor-pointer"
          title="Video call"
        >
          <Video className="w-5 h-5" />
        </button>

        {/* Audio Call */}
        <button
          onClick={() => startCall(activeContact, 'audio')}
          className="p-2 hover:bg-[#374248] rounded-full transition-colors cursor-pointer"
          title="Voice call"
        >
          <Phone className="w-5 h-5" />
        </button>

        {/* Search in chat */}
        <button
          onClick={() =>
            setActiveRightDrawer(activeRightDrawer === 'search-chat' ? 'none' : 'search-chat')
          }
          className="p-2 hover:bg-[#374248] rounded-full transition-colors cursor-pointer"
          title="Search in chat"
        >
          <Search className="w-5 h-5" />
        </button>

        {/* Menu dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-2 hover:bg-[#374248] rounded-full transition-colors cursor-pointer"
            title="Menu"
          >
            <MoreVertical className="w-5 h-5" />
          </button>

          {showMenu && (
            <div
              onClick={() => setShowMenu(false)}
              className="absolute right-0 top-11 z-40 bg-[#233138] rounded-md shadow-2xl py-2 w-48 border border-[#313d45] text-sm text-[#d1d7db]"
            >
              <div
                onClick={() => setActiveRightDrawer('contact-info')}
                className="px-4 py-2 hover:bg-[#182229] cursor-pointer"
              >
                Contact info
              </div>
              <div
                onClick={() => setActiveRightDrawer('search-chat')}
                className="px-4 py-2 hover:bg-[#182229] cursor-pointer"
              >
                Search messages
              </div>
              <div
                onClick={() => setActiveChatId(null)}
                className="px-4 py-2 hover:bg-[#182229] cursor-pointer"
              >
                Close chat
              </div>
              <div
                onClick={() => setShowMenu(false)}
                className="px-4 py-2 hover:bg-[#182229] cursor-pointer"
              >
                Mute notifications
              </div>
              <div
                onClick={() => setShowMenu(false)}
                className="px-4 py-2 hover:bg-[#182229] cursor-pointer text-red-400"
              >
                Clear chat
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
