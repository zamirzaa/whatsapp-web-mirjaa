import React, { useState, useRef } from 'react';
import { useWhatsApp } from '../../context/WhatsAppContext';
import {
  ArrowLeft,
  Search,
  X,
  ArrowRight,
  Check,
  Camera,
  Smile,
  ChevronRight,
  Upload,
  Sticker,
  Shield,
  MessageSquare,
  UserPlus,
  Link,
  Users,
} from 'lucide-react';

export const NewGroupView: React.FC = () => {
  const {
    contacts,
    selectedGroupMembers,
    toggleGroupMember,
    clearGroupMembers,
    createGroup,
    subView,
    setSubView,
  } = useWhatsApp();

  const [search, setSearch] = useState('');
  const [groupName, setGroupName] = useState('');
  const [groupIcon, setGroupIcon] = useState<string>('');
  const [showAvatarMenu, setShowAvatarMenu] = useState(false);

  // Group Settings
  const [disappearingMode, setDisappearingMode] = useState<string>('Off');
  const [tempDisappearingMode, setTempDisappearingMode] = useState<string>('Off');
  const [showDisappearingModal, setShowDisappearingModal] = useState(false);
  const [showingPermissionsView, setShowingPermissionsView] = useState(false);

  // Permission toggles
  const [permissions, setPermissions] = useState({
    editGroupSettings: true,
    sendNewMessages: true,
    addOtherMembers: true,
    inviteViaLink: true,
    approveNewMembers: false,
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleIconUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setGroupIcon(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
    setShowAvatarMenu(false);
  };

  const handleTakePhoto = () => {
    // Open file dialog directly as standard web capture
    fileInputRef.current?.click();
    setShowAvatarMenu(false);
  };

  const handleEmojiSticker = () => {
    // Default fun emoji avatar
    const defaultAvatars = [
      'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=150&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    ];
    setGroupIcon(defaultAvatars[Math.floor(Math.random() * defaultAvatars.length)]);
    setShowAvatarMenu(false);
  };

  const activeContacts = contacts.filter(
    c =>
      !c.isArchived &&
      !c.isGroup &&
      (c.name.toLowerCase().includes(search.toLowerCase()) || c.phoneNumber.includes(search))
  );

  const selectedList = contacts.filter(c => selectedGroupMembers.includes(c.id));

  // Subview: Group Permissions View (Screenshot 3)
  if (showingPermissionsView) {
    return (
      <div className="flex-1 flex flex-col h-full bg-[#111b21] select-none overflow-hidden animate-in slide-in-from-right duration-150">
        <div className="h-[60px] px-4 flex items-center space-x-6 border-b border-[#222d34] shrink-0">
          <button
            onClick={() => setShowingPermissionsView(false)}
            className="text-[#aebac1] hover:text-white transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h2 className="text-xl font-medium text-[#e9edef]">Group permissions</h2>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
          <div>
            <h4 className="text-xs text-[#8696a0] font-medium mb-3">Members can:</h4>
            <div className="space-y-4">
              {/* Edit group settings */}
              <div className="flex items-start justify-between py-1">
                <div className="pr-4">
                  <div className="flex items-center space-x-3 text-base text-[#e9edef]">
                    <Shield className="w-4 h-4 text-[#8696a0]" />
                    <span>Edit group settings</span>
                  </div>
                  <p className="text-xs text-[#8696a0] mt-1 pl-7">
                    This includes the name, icon, description, disappearing message timer, and the ability to pin, keep or unkeep messages.
                  </p>
                </div>
                <button
                  onClick={() =>
                    setPermissions(p => ({ ...p, editGroupSettings: !p.editGroupSettings }))
                  }
                  className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer shrink-0 ${
                    permissions.editGroupSettings ? 'bg-[#00a884]' : 'bg-[#374248]'
                  }`}
                >
                  <span
                    className={`block w-4 h-4 rounded-full bg-white transition-transform absolute top-1 ${
                      permissions.editGroupSettings ? 'right-1' : 'left-1'
                    }`}
                  />
                </button>
              </div>

              {/* Send new messages */}
              <div className="flex items-center justify-between py-2">
                <div className="flex items-center space-x-3 text-base text-[#e9edef]">
                  <MessageSquare className="w-4 h-4 text-[#8696a0]" />
                  <span>Send new messages</span>
                </div>
                <button
                  onClick={() =>
                    setPermissions(p => ({ ...p, sendNewMessages: !p.sendNewMessages }))
                  }
                  className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer shrink-0 ${
                    permissions.sendNewMessages ? 'bg-[#00a884]' : 'bg-[#374248]'
                  }`}
                >
                  <span
                    className={`block w-4 h-4 rounded-full bg-white transition-transform absolute top-1 ${
                      permissions.sendNewMessages ? 'right-1' : 'left-1'
                    }`}
                  />
                </button>
              </div>

              {/* Add other members */}
              <div className="flex items-center justify-between py-2">
                <div className="flex items-center space-x-3 text-base text-[#e9edef]">
                  <UserPlus className="w-4 h-4 text-[#8696a0]" />
                  <span>Add other members</span>
                </div>
                <button
                  onClick={() =>
                    setPermissions(p => ({ ...p, addOtherMembers: !p.addOtherMembers }))
                  }
                  className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer shrink-0 ${
                    permissions.addOtherMembers ? 'bg-[#00a884]' : 'bg-[#374248]'
                  }`}
                >
                  <span
                    className={`block w-4 h-4 rounded-full bg-white transition-transform absolute top-1 ${
                      permissions.addOtherMembers ? 'right-1' : 'left-1'
                    }`}
                  />
                </button>
              </div>

              {/* Invite via link */}
              <div className="flex items-center justify-between py-2">
                <div className="flex items-center space-x-3 text-base text-[#e9edef]">
                  <Link className="w-4 h-4 text-[#8696a0]" />
                  <span>Invite via link</span>
                </div>
                <button
                  onClick={() =>
                    setPermissions(p => ({ ...p, inviteViaLink: !p.inviteViaLink }))
                  }
                  className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer shrink-0 ${
                    permissions.inviteViaLink ? 'bg-[#00a884]' : 'bg-[#374248]'
                  }`}
                >
                  <span
                    className={`block w-4 h-4 rounded-full bg-white transition-transform absolute top-1 ${
                      permissions.inviteViaLink ? 'right-1' : 'left-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-[#222d34]">
            <h4 className="text-xs text-[#8696a0] font-medium mb-3">Admins can:</h4>
            {/* Approve new members */}
            <div className="flex items-start justify-between py-1">
              <div className="pr-4">
                <div className="flex items-center space-x-3 text-base text-[#e9edef]">
                  <Users className="w-4 h-4 text-[#8696a0]" />
                  <span>Approve new members</span>
                </div>
                <p className="text-xs text-[#8696a0] mt-1 pl-7">
                  When turned on, admins must approve anyone who wants to join this group.{' '}
                  <span className="text-[#00a884] cursor-pointer">Learn more</span>
                </p>
              </div>
              <button
                onClick={() =>
                  setPermissions(p => ({ ...p, approveNewMembers: !p.approveNewMembers }))
                }
                className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer shrink-0 ${
                  permissions.approveNewMembers ? 'bg-[#00a884]' : 'bg-[#374248]'
                }`}
              >
                <span
                  className={`block w-4 h-4 rounded-full bg-white transition-transform absolute top-1 ${
                    permissions.approveNewMembers ? 'right-1' : 'left-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Step 2: Group Info (Subject / Icon / Disappearing / Permissions) (Screenshot 1, 2, 4)
  if (subView === 'new-group-info') {
    return (
      <div className="flex-1 flex flex-col h-full bg-[#111b21] select-none overflow-hidden animate-in slide-in-from-right duration-150 relative">
        {/* Header */}
        <div className="h-[60px] px-4 flex items-center space-x-6 border-b border-[#222d34] shrink-0">
          <button
            onClick={() => setSubView('new-group')}
            className="text-[#aebac1] hover:text-white transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h2 className="text-xl font-medium text-[#e9edef]">New group</h2>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-8 space-y-7">
          {/* Avatar Icon */}
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleIconUpload}
            className="hidden"
          />

          <div className="flex justify-center relative">
            <div
              onClick={() => setShowAvatarMenu(!showAvatarMenu)}
              className="w-40 h-40 rounded-full bg-[#182229] border border-[#222d34] flex flex-col items-center justify-center text-[#8696a0] hover:text-[#00a884] cursor-pointer shadow-xl relative overflow-hidden group"
            >
              {groupIcon ? (
                <img src={groupIcon} alt="Group icon" className="w-full h-full object-cover" />
              ) : (
                <>
                  <Camera className="w-8 h-8 mb-2" />
                  <span className="text-[11px] font-medium uppercase tracking-wider text-center text-[#8696a0]">
                    Add group<br />icon
                  </span>
                </>
              )}
            </div>

            {/* Avatar Dropdown Menu (Screenshot 1) */}
            {showAvatarMenu && (
              <div
                onClick={e => e.stopPropagation()}
                className="absolute top-28 left-1/2 -translate-x-1/2 z-50 bg-[#233138] rounded-xl shadow-2xl py-2 w-48 border border-[#313d45] text-sm text-[#d1d7db] animate-in fade-in zoom-in-95 duration-100"
              >
                <div
                  onClick={handleTakePhoto}
                  className="px-4 py-2.5 hover:bg-[#182229] cursor-pointer flex items-center space-x-3"
                >
                  <Camera className="w-4 h-4 text-[#00a884]" />
                  <span>Take photo</span>
                </div>
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2.5 hover:bg-[#182229] cursor-pointer flex items-center space-x-3"
                >
                  <Upload className="w-4 h-4 text-[#8696a0]" />
                  <span>Upload photo</span>
                </div>
                <div
                  onClick={handleEmojiSticker}
                  className="px-4 py-2.5 hover:bg-[#182229] cursor-pointer flex items-center space-x-3"
                >
                  <Sticker className="w-4 h-4 text-[#8696a0]" />
                  <span>Emoji & sticker</span>
                </div>
              </div>
            )}
          </div>

          {/* Group Subject Name (Screenshot 1, 2) */}
          <div className="space-y-1">
            <div className="flex items-center space-x-3 border-b border-[#313d45] focus-within:border-[#00a884] pb-2 transition-colors">
              <input
                type="text"
                placeholder="Group subject (optional)"
                value={groupName}
                onChange={e => setGroupName(e.target.value)}
                autoFocus
                className="bg-transparent flex-1 text-white placeholder-[#8696a0] text-base outline-none"
              />
              <button className="text-[#8696a0] hover:text-white p-1 cursor-pointer">
                <Smile className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Options: Disappearing messages & Group permissions (Screenshot 1, 2) */}
          <div className="space-y-4 pt-2">
            {/* Disappearing messages */}
            <div
              onClick={() => {
                setTempDisappearingMode(disappearingMode);
                setShowDisappearingModal(true);
              }}
              className="flex items-center justify-between py-2 cursor-pointer hover:opacity-90 transition-opacity"
            >
              <div>
                <span className="text-base text-[#e9edef] block">Disappearing messages</span>
                <span className="text-xs text-[#8696a0]">{disappearingMode}</span>
              </div>
              <ChevronRight className="w-4 h-4 text-[#8696a0]" />
            </div>

            {/* Group permissions */}
            <div
              onClick={() => setShowingPermissionsView(true)}
              className="flex items-center justify-between py-2 cursor-pointer hover:opacity-90 transition-opacity"
            >
              <span className="text-base text-[#e9edef] block">Group permissions</span>
              <ChevronRight className="w-4 h-4 text-[#8696a0]" />
            </div>
          </div>
        </div>

        {/* Create Button (Green circle with checkmark) (Screenshot 1, 2) */}
        <div className="p-8 flex justify-center shrink-0">
          <button
            onClick={() => createGroup(groupName.trim() || 'New Group', groupIcon)}
            className="w-14 h-14 rounded-full bg-[#00a884] hover:bg-[#008f70] text-[#111b21] flex items-center justify-center shadow-2xl transition-transform hover:scale-105 cursor-pointer"
            title="Create group"
          >
            <Check className="w-7 h-7 stroke-[3]" />
          </button>
        </div>

        {/* Disappearing Messages Modal (Screenshot 4) */}
        {showDisappearingModal && (
          <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
            <div
              onClick={e => e.stopPropagation()}
              className="bg-[#202c33] max-w-sm w-full rounded-2xl shadow-2xl p-6 border border-[#313d45] space-y-5 animate-in fade-in zoom-in-95 duration-150"
            >
              <div>
                <h3 className="text-lg font-medium text-[#e9edef] mb-2">Disappearing messages</h3>
                <p className="text-xs text-[#8696a0] leading-relaxed">
                  All new messages in this chat will disappear after the selected duration.
                </p>
              </div>

              {/* Radio options */}
              <div className="space-y-3 pt-1">
                {['Off', 'After reading', '24 hours', '7 days', '90 days'].map(option => (
                  <label
                    key={option}
                    onClick={() => setTempDisappearingMode(option)}
                    className="flex items-center space-x-3 cursor-pointer py-1 text-sm text-[#e9edef]"
                  >
                    <div
                      className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                        tempDisappearingMode === option ? 'border-[#00a884]' : 'border-[#8696a0]'
                      }`}
                    >
                      {tempDisappearingMode === option && (
                        <div className="w-2 h-2 rounded-full bg-[#00a884]" />
                      )}
                    </div>
                    <span>{option}</span>
                  </label>
                ))}
              </div>

              {/* Action buttons */}
              <div className="flex items-center justify-end space-x-3 pt-2">
                <button
                  onClick={() => setShowDisappearingModal(false)}
                  className="px-4 py-2 text-sm text-[#00a884] hover:bg-[#182229] rounded-lg transition-colors cursor-pointer font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setDisappearingMode(tempDisappearingMode);
                    setShowDisappearingModal(false);
                  }}
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
  }

  // Step 1: Add Group Members
  return (
    <div className="flex-1 flex flex-col h-full bg-[#111b21] select-none overflow-hidden relative animate-in slide-in-from-left duration-150">
      {/* Header */}
      <div className="h-[60px] px-4 flex items-center space-x-6 border-b border-[#222d34] shrink-0">
        <button
          onClick={() => {
            clearGroupMembers();
            setSubView('none');
          }}
          className="text-[#aebac1] hover:text-white transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h2 className="text-xl font-medium text-[#e9edef]">Add group members</h2>
      </div>

      {/* Selected Members Chips */}
      {selectedList.length > 0 && (
        <div className="px-4 py-2 border-b border-[#222d34] flex flex-wrap gap-2 max-h-28 overflow-y-auto shrink-0">
          {selectedList.map(contact => (
            <div
              key={contact.id}
              className="flex items-center space-x-1.5 bg-[#202c33] rounded-full pl-1.5 pr-2 py-1 text-xs text-[#e9edef] border border-[#313d45]"
            >
              <img
                src={contact.avatar}
                alt={contact.name}
                className="w-5 h-5 rounded-full object-cover"
              />
              <span className="truncate max-w-[120px]">{contact.name}</span>
              <button
                onClick={() => toggleGroupMember(contact.id)}
                className="text-[#8696a0] hover:text-white p-0.5 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}

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

      {/* Contacts List */}
      <div className="flex-1 overflow-y-auto px-4 py-2">
        <h3 className="text-xs font-semibold text-[#8696a0] px-2 mb-2">A</h3>
        <div className="space-y-1">
          {activeContacts.map(contact => {
            const isSelected = selectedGroupMembers.includes(contact.id);
            return (
              <div
                key={contact.id}
                onClick={() => toggleGroupMember(contact.id)}
                className="flex items-center space-x-3.5 px-3 py-2.5 rounded-lg hover:bg-[#202c33] cursor-pointer transition-colors"
              >
                <img
                  src={contact.avatar}
                  alt={contact.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div className="flex-1 min-w-0 border-b border-[#222d34] pb-2 flex items-center justify-between">
                  <div>
                    <h4 className="text-base text-[#e9edef] truncate">{contact.name}</h4>
                    <p className="text-xs text-[#8696a0] truncate">{contact.about || contact.phoneNumber}</p>
                  </div>
                  <div
                    className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${
                      isSelected
                        ? 'bg-[#00a884] border-[#00a884] text-[#111b21]'
                        : 'border-[#8696a0]'
                    }`}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Floating Proceed Arrow Button at Bottom Right */}
      {selectedGroupMembers.length > 0 && (
        <div className="absolute bottom-6 right-6 z-20">
          <button
            onClick={() => setSubView('new-group-info')}
            className="w-14 h-14 rounded-full bg-[#00a884] hover:bg-[#008f70] text-[#111b21] flex items-center justify-center shadow-2xl transition-transform hover:scale-105 cursor-pointer"
            title="Next"
          >
            <ArrowRight className="w-6 h-6 stroke-[3]" />
          </button>
        </div>
      )}
    </div>
  );
};
