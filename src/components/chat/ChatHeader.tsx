import React, { useState } from 'react';
import { useWhatsApp } from '../../context/WhatsAppContext';
import {
  Video,
  Phone,
  Search,
  MoreVertical,
  UserPlus,
  Info,
  CheckSquare,
  BellOff,
  Clock,
  Heart,
  ListPlus,
  XCircle,
  MinusCircle,
  LogOut,
  ChevronRight,
  X,
  Check,
} from 'lucide-react';

export const ChatHeader: React.FC = () => {
  const {
    activeChatId,
    activeContact,
    startCall,
    setActiveRightDrawer,
    activeRightDrawer,
    isTyping,
    setActiveChatId,
    clearChatMessages,
    contacts,
    setIsSelectingMessages,
    addMembersToGroup,
    exitGroupAction,
    toggleFavoriteChat,
    muteChatSingle,
  } = useWhatsApp();

  const [showMenu, setShowMenu] = useState(false);

  // Modals for group features
  const [showExitModal, setShowExitModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showChooseListModal, setShowChooseListModal] = useState(false);
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [showMuteModal, setShowMuteModal] = useState(false);
  const [selectedMuteDuration, setSelectedMuteDuration] = useState('8 hours');
  const [selectedNewMembers, setSelectedNewMembers] = useState<string[]>([]);
  const [memberSearch, setMemberSearch] = useState('');

  // Disappearing messages modal
  const [showDisappearingModal, setShowDisappearingModal] = useState(false);
  const [disappearingMode, setDisappearingMode] = useState('Off');

  if (!activeContact) return null;

  const isGroup = activeContact.isGroup;

  const renderSubtitle = () => {
    if (isTyping) return <span className="text-[#00a884] font-medium animate-pulse">typing...</span>;
    if (activeContact.isGroup) {
      return activeContact.groupMembers?.join(', ') || 'Group members';
    }
    if (activeContact.isOnline) return <span className="text-[#00a884]">online</span>;
    return activeContact.lastSeen || 'offline';
  };

  const handleAddSelectedMembers = () => {
    if (selectedNewMembers.length > 0 && activeChatId) {
      addMembersToGroup(activeChatId, selectedNewMembers);
    }
    setShowAddMemberModal(false);
    setSelectedNewMembers([]);
  };

  return (
    <div className="h-[60px] bg-[#f0f2f5] dark:bg-[#202c33] px-4 flex items-center justify-between border-b border-[#e9edef] dark:border-[#222d34] select-none shrink-0 z-10 transition-colors">
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
          <h3 className="text-base font-normal text-[#111b21] dark:text-[#e9edef] truncate leading-tight">
            {activeContact.name}
          </h3>
          <p className="text-xs text-[#667781] dark:text-[#8696a0] truncate leading-tight mt-0.5">
            {renderSubtitle()}
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center space-x-2 text-[#54656f] dark:text-[#aebac1]">
        {/* Video Call */}
        <button
          onClick={() => startCall(activeContact, 'video')}
          className="p-2 hover:bg-black/5 dark:hover:bg-[#374248] rounded-full transition-colors cursor-pointer"
          title="Video call"
        >
          <Video className="w-5 h-5" />
        </button>

        {/* Audio Call */}
        <button
          onClick={() => startCall(activeContact, 'audio')}
          className="p-2 hover:bg-black/5 dark:hover:bg-[#374248] rounded-full transition-colors cursor-pointer"
          title="Voice call"
        >
          <Phone className="w-5 h-5" />
        </button>

        {/* Search in chat */}
        <button
          onClick={() =>
            setActiveRightDrawer(activeRightDrawer === 'search-chat' ? 'none' : 'search-chat')
          }
          className="p-2 hover:bg-black/5 dark:hover:bg-[#374248] rounded-full transition-colors cursor-pointer"
          title="Search in chat"
        >
          <Search className="w-5 h-5" />
        </button>

        {/* Menu dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-2 hover:bg-black/5 dark:hover:bg-[#374248] rounded-full transition-colors cursor-pointer"
            title="Menu"
          >
            <MoreVertical className="w-5 h-5" />
          </button>

          {showMenu && (
            <div
              onClick={() => setShowMenu(false)}
              className="absolute right-0 top-11 z-50 bg-[#233138] rounded-xl shadow-2xl py-2 w-56 border border-[#313d45] text-sm text-[#d1d7db] animate-in fade-in zoom-in-95 duration-100"
            >
              {isGroup ? (
                <>
                  {/* Add member (Screenshot 1) */}
                  <div
                    onClick={() => setShowAddMemberModal(true)}
                    className="px-4 py-2.5 hover:bg-[#182229] cursor-pointer flex items-center space-x-3 text-[#e9edef]"
                  >
                    <UserPlus className="w-4 h-4 text-[#8696a0]" />
                    <span>Add member</span>
                  </div>

                  {/* Group info */}
                  <div
                    onClick={() => setActiveRightDrawer('contact-info')}
                    className="px-4 py-2.5 hover:bg-[#182229] cursor-pointer flex items-center space-x-3"
                  >
                    <Info className="w-4 h-4 text-[#8696a0]" />
                    <span>Group info</span>
                  </div>

                  {/* Search */}
                  <div
                    onClick={() => setActiveRightDrawer('search-chat')}
                    className="px-4 py-2.5 hover:bg-[#182229] cursor-pointer flex items-center space-x-3"
                  >
                    <Search className="w-4 h-4 text-[#8696a0]" />
                    <span>Search</span>
                  </div>

                  {/* Select messages */}
                  <div
                    onClick={() => setIsSelectingMessages(true)}
                    className="px-4 py-2.5 hover:bg-[#182229] cursor-pointer flex items-center space-x-3"
                  >
                    <CheckSquare className="w-4 h-4 text-[#8696a0]" />
                    <span>Select messages</span>
                  </div>

                  {/* Mute notifications */}
                  <div
                    onClick={() => setShowMuteModal(true)}
                    className="px-4 py-2.5 hover:bg-[#182229] cursor-pointer flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-3">
                      <BellOff className="w-4 h-4 text-[#8696a0]" />
                      <span>Mute notifications</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-[#8696a0]" />
                  </div>

                  {/* Disappearing messages */}
                  <div
                    onClick={() => setShowDisappearingModal(true)}
                    className="px-4 py-2.5 hover:bg-[#182229] cursor-pointer flex items-center space-x-3"
                  >
                    <Clock className="w-4 h-4 text-[#8696a0]" />
                    <span>Disappearing messages</span>
                  </div>

                  {/* Add to Favorites */}
                  <div
                    onClick={() => {
                      if (activeChatId) toggleFavoriteChat(activeChatId);
                    }}
                    className="px-4 py-2.5 hover:bg-[#182229] cursor-pointer flex items-center space-x-3"
                  >
                    <Heart className="w-4 h-4 text-[#8696a0]" />
                    <span>{activeContact.isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}</span>
                  </div>

                  {/* Add to list */}
                  <div
                    onClick={() => setShowChooseListModal(true)}
                    className="px-4 py-2.5 hover:bg-[#182229] cursor-pointer flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-3">
                      <ListPlus className="w-4 h-4 text-[#8696a0]" />
                      <span>Add to list</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-[#8696a0]" />
                  </div>

                  {/* Close chat */}
                  <div
                    onClick={() => setActiveChatId(null)}
                    className="px-4 py-2.5 hover:bg-[#182229] cursor-pointer flex items-center space-x-3"
                  >
                    <XCircle className="w-4 h-4 text-[#8696a0]" />
                    <span>Close chat</span>
                  </div>

                  {/* Clear chat */}
                  <div
                    onClick={() => {
                      if (activeChatId) clearChatMessages(activeChatId);
                    }}
                    className="px-4 py-2.5 hover:bg-[#182229] cursor-pointer flex items-center space-x-3"
                  >
                    <MinusCircle className="w-4 h-4 text-[#8696a0]" />
                    <span>Clear chat</span>
                  </div>

                  {/* Exit group */}
                  <div
                    onClick={() => setShowExitModal(true)}
                    className="px-4 py-2.5 hover:bg-[#182229] cursor-pointer flex items-center space-x-3 text-red-500 border-t border-[#313d45]"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Exit group</span>
                  </div>
                </>
              ) : (
                <>
                  <div
                    onClick={() => setActiveRightDrawer('contact-info')}
                    className="px-4 py-2.5 hover:bg-[#182229] cursor-pointer"
                  >
                    Contact info
                  </div>
                  <div
                    onClick={() => setActiveRightDrawer('search-chat')}
                    className="px-4 py-2.5 hover:bg-[#182229] cursor-pointer"
                  >
                    Search messages
                  </div>
                  <div
                    onClick={() => setActiveChatId(null)}
                    className="px-4 py-2.5 hover:bg-[#182229] cursor-pointer"
                  >
                    Close chat
                  </div>
                  <div
                    onClick={() => alert('Mute notifications')}
                    className="px-4 py-2.5 hover:bg-[#182229] cursor-pointer"
                  >
                    Mute notifications
                  </div>
                  <div
                    onClick={() => {
                      if (activeChatId) clearChatMessages(activeChatId);
                    }}
                    className="px-4 py-2.5 hover:bg-[#182229] cursor-pointer text-red-500"
                  >
                    Clear chat
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Modal 1: Exit Group (Screenshot 2) */}
      {showExitModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div
            onClick={e => e.stopPropagation()}
            className="bg-[#202c33] max-w-sm w-full rounded-2xl shadow-2xl p-6 border border-[#313d45] space-y-4 animate-in fade-in zoom-in-95 duration-150"
          >
            <h3 className="text-lg font-medium text-[#e9edef]">
              Exit group: &ldquo;{activeContact.name}&rdquo;?
            </h3>
            <p className="text-xs text-[#8696a0]">
              Only admins are notified when you leave a group.
            </p>

            <div className="pt-2 border-t border-[#313d45] flex items-center justify-between">
              <div>
                <span className="text-sm text-[#e9edef] block font-medium">Report to WhatsApp</span>
                <p className="text-[11px] text-[#8696a0] leading-snug">
                  The last 5 messages in this chat will be sent to WhatsApp. No one in the group will know about this report.{' '}
                  <span className="text-[#00a884] cursor-pointer">Learn more</span>
                </p>
              </div>
            </div>

            <div className="space-y-2 pt-3">
              <button
                onClick={() => {
                  if (activeChatId) exitGroupAction(activeChatId, false);
                  setShowExitModal(false);
                }}
                className="w-full py-2.5 rounded-lg bg-[#2a3942] hover:bg-[#32424b] text-red-400 text-sm font-semibold transition-colors cursor-pointer"
              >
                Exit group
              </button>
              <button
                onClick={() => {
                  if (activeChatId) exitGroupAction(activeChatId, true);
                  setShowExitModal(false);
                }}
                className="w-full py-2.5 rounded-lg bg-[#2a3942] hover:bg-[#32424b] text-[#00a884] text-sm font-semibold transition-colors cursor-pointer"
              >
                Exit and delete for me
              </button>
              <button
                onClick={() => setShowExitModal(false)}
                className="w-full py-2.5 rounded-lg border-2 border-[#00a884] text-[#00a884] hover:bg-[#182229] text-sm font-semibold transition-colors cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal 2: Report Group (Screenshot 3) */}
      {showReportModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div
            onClick={e => e.stopPropagation()}
            className="bg-[#202c33] max-w-sm w-full rounded-2xl shadow-2xl p-6 border border-[#313d45] space-y-4 animate-in fade-in zoom-in-95 duration-150"
          >
            <h3 className="text-lg font-medium text-[#e9edef]">
              Report this group to WhatsApp?
            </h3>
            <label className="flex items-center space-x-3 cursor-pointer py-1">
              <div className="w-5 h-5 rounded bg-[#00a884] text-[#111b21] flex items-center justify-center">
                <Check className="w-3.5 h-3.5 stroke-[3]" />
              </div>
              <span className="text-sm text-[#e9edef]">Exit group and clear chat</span>
            </label>
            <p className="text-xs text-[#8696a0] leading-relaxed">
              The last 5 messages in this group will be forwarded to WhatsApp. No one in this group will be notified.
            </p>
            <div className="flex items-center justify-end space-x-3 pt-2">
              <button
                onClick={() => setShowReportModal(false)}
                className="px-4 py-2 text-sm text-[#00a884] hover:bg-[#182229] rounded-lg transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (activeChatId) exitGroupAction(activeChatId, true);
                  setShowReportModal(false);
                }}
                className="px-5 py-2 text-sm bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold transition-colors cursor-pointer shadow-md"
              >
                Report
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Mute Notifications */}
      {showMuteModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div
            onClick={e => e.stopPropagation()}
            className="bg-[#202c33] max-w-sm w-full rounded-2xl shadow-2xl p-6 border border-[#313d45] space-y-4 animate-in fade-in zoom-in-95 duration-150"
          >
            <h3 className="text-lg font-medium text-[#e9edef]">Mute notifications</h3>
            <p className="text-xs text-[#8696a0]">
              Other participants will not see that you muted this chat.
            </p>
            <div className="space-y-3 pt-1">
              {['8 hours', '1 week', 'Always'].map(dur => (
                <label
                  key={dur}
                  onClick={() => setSelectedMuteDuration(dur)}
                  className="flex items-center space-x-3 cursor-pointer text-sm text-[#e9edef]"
                >
                  <div
                    className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                      selectedMuteDuration === dur ? 'border-[#00a884]' : 'border-[#8696a0]'
                    }`}
                  >
                    {selectedMuteDuration === dur && (
                      <div className="w-2 h-2 rounded-full bg-[#00a884]" />
                    )}
                  </div>
                  <span>{dur}</span>
                </label>
              ))}
            </div>
            <div className="flex items-center justify-end space-x-3 pt-2">
              <button
                onClick={() => setShowMuteModal(false)}
                className="px-4 py-2 text-sm text-[#00a884] hover:bg-[#182229] rounded-lg transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (activeChatId) muteChatSingle(activeChatId, true);
                  setShowMuteModal(false);
                }}
                className="px-5 py-2 text-sm bg-[#00a884] hover:bg-[#008f70] text-[#111b21] rounded-lg font-semibold transition-colors cursor-pointer shadow-md"
              >
                Mute
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal 3: Choose List (Screenshot 4) */}
      {showChooseListModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div
            onClick={e => e.stopPropagation()}
            className="bg-[#202c33] max-w-sm w-full rounded-2xl shadow-2xl p-6 border border-[#313d45] space-y-4 animate-in fade-in zoom-in-95 duration-150"
          >
            <h3 className="text-lg font-medium text-[#e9edef]">Choose list</h3>
            <div className="py-2">
              <button
                onClick={() => alert('New list created!')}
                className="flex items-center space-x-3 text-[#e9edef] hover:text-[#00a884] cursor-pointer"
              >
                <div className="w-8 h-8 rounded-full bg-[#00a884] flex items-center justify-center text-[#111b21]">
                  <span className="text-lg font-bold">+</span>
                </div>
                <span className="text-base font-medium">New list</span>
              </button>
            </div>
            <div className="flex items-center justify-end space-x-3 pt-3">
              <button
                onClick={() => setShowChooseListModal(false)}
                className="px-4 py-2 text-sm text-[#00a884] hover:bg-[#182229] rounded-lg transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowChooseListModal(false)}
                className="px-5 py-2 text-sm bg-[#374248] text-[#8696a0] rounded-lg font-semibold cursor-not-allowed"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal 4: Add Member (Screenshot 13) */}
      {showAddMemberModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div
            onClick={e => e.stopPropagation()}
            className="bg-[#202c33] max-w-md w-full rounded-2xl shadow-2xl p-6 border border-[#313d45] space-y-4 max-h-[85vh] flex flex-col animate-in fade-in zoom-in-95 duration-150"
          >
            <div className="flex items-center justify-between pb-2 border-b border-[#313d45]">
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setShowAddMemberModal(false)}
                  className="text-[#8696a0] hover:text-white p-1 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
                <h3 className="text-lg font-medium text-[#e9edef]">Add member</h3>
              </div>
            </div>

            {/* Search Input */}
            <div className="flex items-center bg-[#111b21] rounded-lg px-3 py-2 border border-transparent focus-within:border-[#00a884]">
              <Search className="w-4 h-4 text-[#8696a0] mr-3" />
              <input
                type="text"
                placeholder="Search name, number or @username"
                value={memberSearch}
                onChange={e => setMemberSearch(e.target.value)}
                className="bg-transparent flex-1 text-white placeholder-[#8696a0] text-sm outline-none"
                autoFocus
              />
            </div>

            {/* Contacts list */}
            <div className="flex-1 overflow-y-auto space-y-1 divide-y divide-[#202c33] pr-1">
              <span className="text-xs text-[#8696a0] uppercase font-semibold block px-1 py-1">
                Contacts
              </span>
              {contacts
                .filter(
                  c =>
                    !c.isGroup &&
                    c.name.toLowerCase().includes(memberSearch.toLowerCase())
                )
                .map(contact => {
                  const isChecked = selectedNewMembers.includes(contact.id);
                  return (
                    <div
                      key={contact.id}
                      onClick={() =>
                        setSelectedNewMembers(prev =>
                          isChecked ? prev.filter(id => id !== contact.id) : [...prev, contact.id]
                        )
                      }
                      className="flex items-center justify-between py-2.5 px-2 hover:bg-[#182229] cursor-pointer rounded-lg transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        <img
                          src={contact.avatar}
                          alt={contact.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <div>
                          <span className="text-sm font-medium text-[#e9edef] block">
                            {contact.name}
                          </span>
                          <span className="text-xs text-[#8696a0]">{contact.phoneNumber}</span>
                        </div>
                      </div>
                      <div
                        className={`w-5 h-5 rounded border flex items-center justify-center ${
                          isChecked ? 'bg-[#00a884] border-[#00a884] text-[#111b21]' : 'border-[#8696a0]'
                        }`}
                      >
                        {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>
                    </div>
                  );
                })}
            </div>

            {/* Floating Done / Add button */}
            {selectedNewMembers.length > 0 && (
              <div className="flex justify-end pt-2">
                <button
                  onClick={handleAddSelectedMembers}
                  className="w-12 h-12 rounded-full bg-[#00a884] hover:bg-[#008f70] text-[#111b21] flex items-center justify-center shadow-lg transition-transform hover:scale-105 cursor-pointer"
                >
                  <Check className="w-6 h-6 stroke-[3]" />
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Disappearing Messages Modal */}
      {showDisappearingModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div
            onClick={e => e.stopPropagation()}
            className="bg-[#202c33] max-w-sm w-full rounded-2xl shadow-2xl p-6 border border-[#313d45] space-y-4 animate-in fade-in zoom-in-95 duration-150"
          >
            <h3 className="text-lg font-medium text-[#e9edef]">Disappearing messages</h3>
            <p className="text-xs text-[#8696a0]">
              All new messages in this chat will disappear after the selected duration.
            </p>
            <div className="space-y-3 pt-1">
              {['Off', 'After reading', '24 hours', '7 days', '90 days'].map(opt => (
                <label
                  key={opt}
                  onClick={() => setDisappearingMode(opt)}
                  className="flex items-center space-x-3 cursor-pointer text-sm text-[#e9edef]"
                >
                  <div
                    className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                      disappearingMode === opt ? 'border-[#00a884]' : 'border-[#8696a0]'
                    }`}
                  >
                    {disappearingMode === opt && <div className="w-2 h-2 rounded-full bg-[#00a884]" />}
                  </div>
                  <span>{opt}</span>
                </label>
              ))}
            </div>
            <div className="flex items-center justify-end space-x-3 pt-2">
              <button
                onClick={() => setShowDisappearingModal(false)}
                className="px-4 py-2 text-sm text-[#00a884] hover:bg-[#182229] rounded-lg transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowDisappearingModal(false)}
                className="px-5 py-2 text-sm bg-[#00a884] hover:bg-[#008f70] text-[#111b21] rounded-lg font-semibold transition-colors cursor-pointer shadow-md"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
