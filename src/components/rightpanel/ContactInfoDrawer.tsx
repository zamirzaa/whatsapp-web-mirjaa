import React, { useState, useRef } from 'react';
import { useWhatsApp } from '../../context/WhatsAppContext';
import {
  X,
  Bell,
  Clock,
  Lock,
  Star,
  Slash,
  ThumbsDown,
  ChevronRight,
  Pencil,
  Search,
  UserPlus,
  Link,
  Users,
  Shield,
  Trash2,
  LogOut,
  Camera,
  Heart,
  ListPlus,
  History,
  ArrowLeft,
  MessageSquare,
  Copy,
  RotateCcw,
  Check,
  Share2,
} from 'lucide-react';

type DrawerSubView =
  | 'info'
  | 'permissions'
  | 'invite-link'
  | 'member-changes'
  | 'notifications'
  | 'media'
  | 'community';

export const ContactInfoDrawer: React.FC = () => {
  const {
    activeChatId,
    activeContact,
    setActiveRightDrawer,
    activeMessages,
    clearChatMessages,
    contacts,
    updateGroupInfo,
    addMembersToGroup,
    removeGroupMember,
    exitGroupAction,
    toggleFavoriteChat,
  } = useWhatsApp();

  const [currentView, setCurrentView] = useState<DrawerSubView>('info');

  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [groupName, setGroupName] = useState(activeContact?.name || '');
  const [groupDescription, setGroupDescription] = useState(activeContact?.about || 'Add group description');
  const [isEditingDesc, setIsEditingDesc] = useState(false);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  // Group Permissions state (Screenshot 8)
  const [permissions, setPermissions] = useState({
    editGroupSettings: true,
    sendNewMessages: true,
    addOtherMembers: true,
    inviteViaLink: true,
    sendMessageHistory: true,
    approveNewMembers: false,
  });

  // Modals
  const [showEditAdminsModal, setShowEditAdminsModal] = useState(false);
  const [showSendLinkModal, setShowSendLinkModal] = useState(false);
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [showExitModal, setShowExitModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showChooseListModal, setShowChooseListModal] = useState(false);

  // Notifications
  const [muteNotifications, setMuteNotifications] = useState(false);

  // Media tab
  const [mediaTab, setMediaTab] = useState<'media' | 'docs' | 'links'>('media');

  // Search member
  const [adminSearch, setAdminSearch] = useState('');
  const [memberSearch, setMemberSearch] = useState('');
  const [selectedNewMembers, setSelectedNewMembers] = useState<string[]>([]);

  if (!activeContact) return null;

  const isGroup = activeContact.isGroup;
  const mediaMessages = activeMessages.filter(m => m.type === 'image');
  const docMessages = activeMessages.filter(m => m.type === 'document');

  const members = activeContact.groupMembers && activeContact.groupMembers.length > 0
    ? activeContact.groupMembers
    : ['You', 'pais genjor'];

  const inviteUrl = `https://chat.whatsapp.com/Jtwzyr1XnUwIR0o50HmiGu`;

  // 1. Subview: Member Changes (Screenshot 5)
  if (currentView === 'member-changes') {
    return (
      <div className="w-full md:w-[380px] lg:w-[420px] h-full bg-[#111b21] border-l border-[#222d34] flex flex-col z-20 animate-in slide-in-from-right duration-200 select-none shrink-0 text-[#e9edef]">
        <div className="h-[60px] bg-[#202c33] px-4 flex items-center space-x-6 border-b border-[#222d34] shrink-0">
          <button
            onClick={() => setCurrentView('info')}
            className="text-[#aebac1] hover:text-white transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h3 className="text-base font-medium text-[#e9edef]">Member changes</h3>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-4">
          <div className="w-20 h-20 rounded-full bg-[#00a884]/20 flex items-center justify-center text-[#00a884]">
            <Users className="w-10 h-10" />
          </div>
          <div className="space-y-2">
            <h4 className="text-lg font-medium text-[#e9edef]">No member changes</h4>
            <p className="text-xs text-[#8696a0] leading-relaxed max-w-xs">
              See updates from the last 60 days like username changes or who has left or been removed.{' '}
              <span className="text-[#00a884] cursor-pointer">Learn more</span>
            </p>
          </div>
        </div>
      </div>
    );
  }

  // 2. Subview: Invite to Group via Link (Screenshot 6 & 7)
  if (currentView === 'invite-link') {
    return (
      <div className="w-full md:w-[380px] lg:w-[420px] h-full bg-[#111b21] border-l border-[#222d34] flex flex-col z-20 animate-in slide-in-from-right duration-200 select-none shrink-0 text-[#e9edef]">
        <div className="h-[60px] bg-[#202c33] px-4 flex items-center space-x-6 border-b border-[#222d34] shrink-0">
          <button
            onClick={() => setCurrentView('info')}
            className="text-[#aebac1] hover:text-white transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h3 className="text-base font-medium text-[#e9edef]">Invite to group via link</h3>
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-[#202c33]">
          {/* Group Header Card */}
          <div className="p-6 flex items-center space-x-4">
            <div className="w-12 h-12 rounded-full bg-[#2a264a] border border-[#3d3866] flex items-center justify-center text-[#9b8fff]">
              <Users className="w-6 h-6" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-base font-medium text-[#e9edef] truncate">{activeContact.name}</h4>
              <p className="text-xs text-[#00a884] truncate">{inviteUrl}</p>
            </div>
          </div>

          <div className="px-6 py-4">
            <p className="text-xs text-[#8696a0] leading-relaxed">
              Members do not need approval from an admin to join this group. Edit in{' '}
              <span
                onClick={() => setCurrentView('permissions')}
                className="text-[#00a884] cursor-pointer hover:underline"
              >
                group permissions
              </span>.
            </p>
          </div>

          {/* Action options */}
          <div className="py-2">
            <div
              onClick={() => setShowSendLinkModal(true)}
              className="px-6 py-3.5 hover:bg-[#202c33] cursor-pointer flex items-center space-x-4 transition-colors"
            >
              <Share2 className="w-5 h-5 text-[#8696a0]" />
              <span className="text-base text-[#e9edef]">Send link via WhatsApp</span>
            </div>

            <div
              onClick={() => {
                navigator.clipboard?.writeText(inviteUrl);
                alert('Invite link copied to clipboard!');
              }}
              className="px-6 py-3.5 hover:bg-[#202c33] cursor-pointer flex items-center space-x-4 transition-colors"
            >
              <Copy className="w-5 h-5 text-[#8696a0]" />
              <span className="text-base text-[#e9edef]">Copy link</span>
            </div>

            <div
              onClick={() => {
                if (confirm('Are you sure you want to reset this invite link? Previous links will no longer work.')) {
                  alert('Invite link has been reset!');
                }
              }}
              className="px-6 py-3.5 hover:bg-[#202c33] cursor-pointer flex items-center space-x-4 transition-colors text-red-400"
            >
              <RotateCcw className="w-5 h-5" />
              <span className="text-base">Reset link</span>
            </div>
          </div>
        </div>

        {/* Modal: Send Link to Contacts (Screenshot 7) */}
        {showSendLinkModal && (
          <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
            <div
              onClick={e => e.stopPropagation()}
              className="bg-[#202c33] max-w-sm w-full rounded-2xl shadow-2xl p-6 border border-[#313d45] space-y-4 max-h-[85vh] flex flex-col animate-in fade-in zoom-in-95 duration-150"
            >
              <div className="flex items-center space-x-3 pb-2 border-b border-[#313d45]">
                <button
                  onClick={() => setShowSendLinkModal(false)}
                  className="text-[#8696a0] hover:text-white p-1 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
                <h3 className="text-lg font-medium text-[#e9edef]">Send link to</h3>
              </div>

              <div className="flex items-center bg-[#111b21] rounded-lg px-3 py-1.5 border border-transparent focus-within:border-[#00a884]">
                <Search className="w-4 h-4 text-[#8696a0] mr-3" />
                <input
                  type="text"
                  placeholder="Search name, number or @username"
                  className="bg-transparent flex-1 text-white placeholder-[#8696a0] text-sm outline-none"
                />
              </div>

              <div className="flex-1 overflow-y-auto space-y-1 divide-y divide-[#202c33] pr-1">
                <span className="text-xs text-[#8696a0] font-medium block px-1 py-1">Recent chats</span>
                {contacts.map(c => (
                  <div
                    key={c.id}
                    onClick={() => {
                      alert(`Invite link sent to ${c.name}!`);
                      setShowSendLinkModal(false);
                    }}
                    className="flex items-center space-x-3 py-2.5 px-2 hover:bg-[#182229] cursor-pointer rounded-lg transition-colors"
                  >
                    <img src={c.avatar} alt={c.name} className="w-10 h-10 rounded-full object-cover" />
                    <div className="flex-1 min-w-0">
                      <span className="text-sm font-medium text-[#e9edef] block truncate">{c.name}</span>
                      <span className="text-xs text-[#8696a0] truncate">{c.about || c.phoneNumber}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // 3. Subview: Group Permissions (Screenshot 8 & 11)
  if (currentView === 'permissions') {
    return (
      <div className="w-full md:w-[380px] lg:w-[420px] h-full bg-[#111b21] border-l border-[#222d34] flex flex-col z-20 animate-in slide-in-from-right duration-200 select-none shrink-0 text-[#e9edef]">
        <div className="h-[60px] bg-[#202c33] px-4 flex items-center space-x-6 border-b border-[#222d34] shrink-0">
          <button
            onClick={() => setCurrentView('info')}
            className="text-[#aebac1] hover:text-white transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h3 className="text-base font-medium text-[#e9edef]">Group permissions</h3>
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

              {/* Send message history */}
              <div className="flex items-start justify-between py-1">
                <div className="pr-4">
                  <div className="flex items-center space-x-3 text-base text-[#e9edef]">
                    <History className="w-4 h-4 text-[#8696a0]" />
                    <span>Send message history</span>
                  </div>
                  <p className="text-xs text-[#8696a0] mt-1 pl-7">
                    Past messages can be sent to new members.
                  </p>
                </div>
                <button
                  onClick={() =>
                    setPermissions(p => ({ ...p, sendMessageHistory: !p.sendMessageHistory }))
                  }
                  className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer shrink-0 ${
                    permissions.sendMessageHistory ? 'bg-[#00a884]' : 'bg-[#374248]'
                  }`}
                >
                  <span
                    className={`block w-4 h-4 rounded-full bg-white transition-transform absolute top-1 ${
                      permissions.sendMessageHistory ? 'right-1' : 'left-1'
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

          <div className="pt-2 border-t border-[#222d34]">
            <h4 className="text-xs text-[#8696a0] font-medium mb-3">Group admins</h4>
            <div
              onClick={() => setShowEditAdminsModal(true)}
              className="flex items-center justify-between py-2 cursor-pointer hover:opacity-90"
            >
              <div className="flex items-center space-x-3 text-base text-[#e9edef]">
                <UserPlus className="w-4 h-4 text-[#8696a0]" />
                <div>
                  <span className="block">Edit group admins</span>
                  <span className="text-xs text-[#8696a0]">You</span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-[#8696a0]" />
            </div>
          </div>
        </div>

        {/* Modal: Edit Group Admins (Screenshot 11) */}
        {showEditAdminsModal && (
          <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
            <div
              onClick={e => e.stopPropagation()}
              className="bg-[#202c33] max-w-sm w-full rounded-2xl shadow-2xl p-6 border border-[#313d45] space-y-4 max-h-[85vh] flex flex-col animate-in fade-in zoom-in-95 duration-150"
            >
              <div className="flex items-center space-x-3 pb-2 border-b border-[#313d45]">
                <button
                  onClick={() => setShowEditAdminsModal(false)}
                  className="text-[#8696a0] hover:text-white p-1 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
                <h3 className="text-lg font-medium text-[#e9edef]">Edit group admins</h3>
              </div>

              <div className="flex items-center bg-[#111b21] rounded-lg px-3 py-1.5 border border-transparent focus-within:border-[#00a884]">
                <Search className="w-4 h-4 text-[#8696a0] mr-3" />
                <input
                  type="text"
                  placeholder="Search name or number"
                  value={adminSearch}
                  onChange={e => setAdminSearch(e.target.value)}
                  className="bg-transparent flex-1 text-white placeholder-[#8696a0] text-sm outline-none"
                />
              </div>

              <div className="flex items-center space-x-2 pt-1">
                <span className="bg-[#182229] border border-[#313d45] text-xs text-[#e9edef] px-2.5 py-1 rounded-full flex items-center space-x-1">
                  <span>👤 You</span>
                </span>
              </div>

              <div className="flex-1 overflow-y-auto space-y-1 divide-y divide-[#202c33] pr-1">
                <span className="text-xs text-[#8696a0] font-medium block px-1 py-1">Contacts</span>
                {members.map((m, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between py-2.5 px-2 hover:bg-[#182229] cursor-pointer rounded-lg transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-[#1d5c96] flex items-center justify-center text-white text-sm font-semibold">
                        {m === 'You' ? '👤' : m.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-sm font-medium text-[#e9edef]">{m}</span>
                    </div>
                    <div
                      className={`w-5 h-5 rounded border flex items-center justify-center ${
                        m === 'You' ? 'bg-[#00a884] border-[#00a884] text-[#111b21]' : 'border-[#8696a0]'
                      }`}
                    >
                      {m === 'You' && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={() => {
                    alert('Group admins updated!');
                    setShowEditAdminsModal(false);
                  }}
                  className="w-12 h-12 rounded-full bg-[#00a884] hover:bg-[#008f70] text-[#111b21] flex items-center justify-center shadow-lg cursor-pointer"
                >
                  <Check className="w-6 h-6 stroke-[3]" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // 4. Subview: Media, Links and Docs (Screenshot 9)
  if (currentView === 'media') {
    return (
      <div className="w-full md:w-[380px] lg:w-[420px] h-full bg-[#111b21] border-l border-[#222d34] flex flex-col z-20 animate-in slide-in-from-right duration-200 select-none shrink-0 text-[#e9edef]">
        <div className="h-[60px] bg-[#202c33] px-4 flex items-center space-x-6 border-b border-[#222d34] shrink-0">
          <button
            onClick={() => setCurrentView('info')}
            className="text-[#aebac1] hover:text-white transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h3 className="text-base font-medium text-[#e9edef]">Media</h3>
        </div>

        {/* Tabs: Media / Docs / Links */}
        <div className="flex border-b border-[#222d34] shrink-0 text-sm font-medium">
          <button
            onClick={() => setMediaTab('media')}
            className={`flex-1 py-3 text-center border-b-2 transition-colors cursor-pointer ${
              mediaTab === 'media' ? 'border-[#00a884] text-[#00a884]' : 'border-transparent text-[#8696a0] hover:text-[#e9edef]'
            }`}
          >
            Media
          </button>
          <button
            onClick={() => setMediaTab('docs')}
            className={`flex-1 py-3 text-center border-b-2 transition-colors cursor-pointer ${
              mediaTab === 'docs' ? 'border-[#00a884] text-[#00a884]' : 'border-transparent text-[#8696a0] hover:text-[#e9edef]'
            }`}
          >
            Docs
          </button>
          <button
            onClick={() => setMediaTab('links')}
            className={`flex-1 py-3 text-center border-b-2 transition-colors cursor-pointer ${
              mediaTab === 'links' ? 'border-[#00a884] text-[#00a884]' : 'border-transparent text-[#8696a0] hover:text-[#e9edef]'
            }`}
          >
            Links
          </button>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-4">
          <div className="space-y-2">
            <h4 className="text-lg font-medium text-[#e9edef]">No media</h4>
            <p className="text-xs text-[#8696a0]">Media shared in this chat will appear here.</p>
            <div className="pt-2">
              <span className="text-xs text-[#00a884] flex items-center justify-center space-x-2 cursor-pointer hover:underline">
                <span>🖼️ View media from all chats</span>
              </span>
            </div>
          </div>
        </div>

        <div className="p-4 text-center border-t border-[#222d34] text-[11px] text-[#8696a0]">
          Use WhatsApp on your phone to see messages from before 8/12/2026.
        </div>
      </div>
    );
  }

  // 5. Subview: Notifications (Screenshot 10)
  if (currentView === 'notifications') {
    return (
      <div className="w-full md:w-[380px] lg:w-[420px] h-full bg-[#111b21] border-l border-[#222d34] flex flex-col z-20 animate-in slide-in-from-right duration-200 select-none shrink-0 text-[#e9edef]">
        <div className="h-[60px] bg-[#202c33] px-4 flex items-center space-x-6 border-b border-[#222d34] shrink-0">
          <button
            onClick={() => setCurrentView('info')}
            className="text-[#aebac1] hover:text-white transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h3 className="text-base font-medium text-[#e9edef]">Notifications</h3>
        </div>

        <div className="p-6 space-y-6">
          <span className="text-xs text-[#8696a0] font-medium block">Messages</span>
          <div className="flex items-center justify-between">
            <span className="text-base text-[#e9edef]">Mute notifications</span>
            <button
              onClick={() => setMuteNotifications(!muteNotifications)}
              className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                muteNotifications ? 'bg-[#00a884]' : 'bg-[#374248]'
              }`}
            >
              <span
                className={`block w-4 h-4 rounded-full bg-white transition-transform absolute top-1 ${
                  muteNotifications ? 'right-1' : 'left-1'
                }`}
              />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 6. Subview: Add Group to a Community (Screenshot 12)
  if (currentView === 'community') {
    return (
      <div className="w-full md:w-[380px] lg:w-[420px] h-full bg-[#111b21] border-l border-[#222d34] flex flex-col z-20 animate-in slide-in-from-right duration-200 select-none shrink-0 text-[#e9edef]">
        <div className="h-[60px] bg-[#202c33] px-4 flex items-center space-x-6 border-b border-[#222d34] shrink-0">
          <button
            onClick={() => setCurrentView('info')}
            className="text-[#aebac1] hover:text-white transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h3 className="text-base font-medium text-[#e9edef]">Add group to a community</h3>
        </div>

        <div className="p-6 space-y-4">
          <div
            onClick={() => alert('New community setup')}
            className="p-4 bg-[#202c33] hover:bg-[#2a3942] rounded-xl cursor-pointer flex items-center space-x-4 transition-colors"
          >
            <div className="w-12 h-12 rounded-lg bg-[#00a884]/20 flex items-center justify-center text-[#00a884]">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-base font-medium text-[#e9edef]">New community</h4>
              <p className="text-xs text-[#8696a0]">Create a new community and add your group to it</p>
            </div>
          </div>

          <div
            onClick={() => alert('Existing community selected')}
            className="p-4 bg-[#202c33] hover:bg-[#2a3942] rounded-xl cursor-pointer flex items-center space-x-4 transition-colors"
          >
            <div className="w-12 h-12 rounded-lg bg-[#00a884]/20 flex items-center justify-center text-[#00a884]">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-base font-medium text-[#e9edef]">Existing community</h4>
              <p className="text-xs text-[#8696a0]">Add your group to an existing community</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Default Main View: Group Info (Screenshot 5 & 6)
  return (
    <div className="w-full md:w-[380px] lg:w-[420px] h-full bg-[#111b21] border-l border-[#222d34] flex flex-col z-20 animate-in slide-in-from-right duration-200 select-none shrink-0 text-[#e9edef]">
      {/* Header */}
      <div className="h-[60px] bg-[#202c33] px-6 flex items-center justify-between border-b border-[#222d34] shrink-0">
        <h3 className="text-base font-medium text-[#e9edef]">
          {isGroup ? 'Group info' : 'Contact info'}
        </h3>
        <button
          onClick={() => setActiveRightDrawer('none')}
          className="text-[#aebac1] hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto divide-y divide-[#202c33]">
        {/* Hidden file input for avatar upload */}
        <input
          type="file"
          accept="image/*"
          ref={avatarInputRef}
          onChange={e => {
            const file = e.target.files?.[0];
            if (file && activeChatId) {
              const reader = new FileReader();
              reader.onload = () => {
                if (typeof reader.result === 'string') {
                  updateGroupInfo(activeChatId, { avatar: reader.result });
                }
              };
              reader.readAsDataURL(file);
            }
          }}
          className="hidden"
        />

        {/* Avatar & Name Section */}
        <div className="py-7 px-6 flex flex-col items-center text-center relative">
          <div
            onClick={() => isGroup && avatarInputRef.current?.click()}
            className="relative group mb-4 cursor-pointer"
          >
            {isGroup ? (
              activeContact.avatar ? (
                <img
                  src={activeContact.avatar}
                  alt={activeContact.name}
                  className="w-40 h-40 rounded-full object-cover shadow-xl border-2 border-[#202c33]"
                />
              ) : (
                <div className="w-40 h-40 rounded-full bg-[#2a264a] border-2 border-[#3d3866] flex items-center justify-center text-[#9b8fff] shadow-xl">
                  <Camera className="w-14 h-14" />
                </div>
              )
            ) : (
              <img
                src={activeContact.avatar}
                alt={activeContact.name}
                className="w-40 h-40 rounded-full object-cover shadow-xl border-2 border-[#202c33]"
              />
            )}
            <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer">
              <Camera className="w-8 h-8 text-white" />
            </div>
          </div>

          {/* Group / Contact Name */}
          <div className="flex items-center justify-center space-x-2 w-full px-4">
            {isEditingName ? (
              <input
                type="text"
                value={groupName}
                onChange={e => setGroupName(e.target.value)}
                onBlur={() => {
                  setIsEditingName(false);
                  if (activeChatId && groupName.trim()) {
                    updateGroupInfo(activeChatId, { name: groupName.trim() });
                  }
                }}
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    setIsEditingName(false);
                    if (activeChatId && groupName.trim()) {
                      updateGroupInfo(activeChatId, { name: groupName.trim() });
                    }
                  }
                }}
                autoFocus
                className="bg-[#202c33] text-xl font-medium text-center text-white border-b border-[#00a884] outline-none px-2 py-0.5 rounded"
              />
            ) : (
              <div className="flex items-center space-x-2">
                <h2 className="text-2xl font-normal text-[#e9edef]">{groupName}</h2>
                {isGroup && (
                  <button
                    onClick={() => setIsEditingName(true)}
                    className="text-[#8696a0] hover:text-white p-1 cursor-pointer"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Subtitle */}
          <p className="text-sm text-[#8696a0] mt-1 font-mono">
            {isGroup ? `Group · ${members.length} members` : activeContact.phoneNumber}
          </p>

          {/* Action Buttons (Add & Search for Groups) */}
          {isGroup && (
            <div className="flex items-center space-x-8 mt-5">
              <div
                onClick={() => setShowAddMemberModal(true)}
                className="flex flex-col items-center cursor-pointer group"
              >
                <div className="w-10 h-10 rounded-full bg-[#202c33] group-hover:bg-[#2a3942] flex items-center justify-center text-[#00a884] mb-1 transition-colors">
                  <UserPlus className="w-5 h-5" />
                </div>
                <span className="text-xs text-[#e9edef]">Add</span>
              </div>
              <div
                onClick={() => setActiveRightDrawer('search-chat')}
                className="flex flex-col items-center cursor-pointer group"
              >
                <div className="w-10 h-10 rounded-full bg-[#202c33] group-hover:bg-[#2a3942] flex items-center justify-center text-[#00a884] mb-1 transition-colors">
                  <Search className="w-5 h-5" />
                </div>
                <span className="text-xs text-[#e9edef]">Search</span>
              </div>
            </div>
          )}
        </div>

        {/* Group Description / About */}
        <div className="py-4 px-6">
          {isGroup ? (
            <div className="flex items-center justify-between">
              {isEditingDesc ? (
                <input
                  type="text"
                  value={groupDescription}
                  onChange={e => setGroupDescription(e.target.value)}
                  onBlur={() => {
                    setIsEditingDesc(false);
                    if (activeChatId) {
                      updateGroupInfo(activeChatId, { description: groupDescription.trim() });
                    }
                  }}
                  onKeyDown={e => {
                    if (e.key === 'Enter') {
                      setIsEditingDesc(false);
                      if (activeChatId) {
                        updateGroupInfo(activeChatId, { description: groupDescription.trim() });
                      }
                    }
                  }}
                  autoFocus
                  className="bg-[#202c33] text-sm text-[#00a884] border-b border-[#00a884] outline-none px-2 py-1 w-full rounded"
                />
              ) : (
                <>
                  <span
                    onClick={() => setIsEditingDesc(true)}
                    className="text-sm text-[#00a884] hover:underline cursor-pointer"
                  >
                    {groupDescription}
                  </span>
                  <button
                    onClick={() => setIsEditingDesc(true)}
                    className="text-[#8696a0] hover:text-white p-1 cursor-pointer"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                </>
              )}
            </div>
          ) : (
            <div className="space-y-1">
              <span className="text-xs uppercase text-[#8696a0] font-semibold">About</span>
              <p className="text-base text-[#e9edef]">{activeContact.about || 'Available'}</p>
            </div>
          )}
        </div>

        {/* Media, Links and Docs */}
        <div
          onClick={() => setCurrentView('media')}
          className="py-3 px-6 flex items-center justify-between hover:bg-[#202c33] cursor-pointer transition-colors"
        >
          <div className="flex items-center space-x-4">
            <span className="text-base text-[#e9edef]">Media, links and docs</span>
          </div>
          <div className="flex items-center space-x-2 text-[#8696a0]">
            <span className="text-sm">{mediaMessages.length + docMessages.length}</span>
            <ChevronRight className="w-4 h-4" />
          </div>
        </div>

        {/* Starred Messages */}
        <div className="py-3 px-6 flex items-center justify-between hover:bg-[#202c33] cursor-pointer transition-colors">
          <div className="flex items-center space-x-4">
            <Star className="w-5 h-5 text-[#8696a0]" />
            <span className="text-base text-[#e9edef]">Starred messages</span>
          </div>
          <ChevronRight className="w-4 h-4 text-[#8696a0]" />
        </div>

        {/* Notification Settings */}
        <div
          onClick={() => setCurrentView('notifications')}
          className="py-3 px-6 flex items-center justify-between hover:bg-[#202c33] cursor-pointer transition-colors"
        >
          <div className="flex items-center space-x-4">
            <Bell className="w-5 h-5 text-[#8696a0]" />
            <span className="text-base text-[#e9edef]">Notification settings</span>
          </div>
          <ChevronRight className="w-4 h-4 text-[#8696a0]" />
        </div>

        {/* Encryption */}
        <div
          onClick={() => setShowVerifyModal(true)}
          className="py-3 px-6 flex items-center justify-between hover:bg-[#202c33] cursor-pointer transition-colors"
        >
          <div className="flex items-center space-x-4">
            <Lock className="w-5 h-5 text-[#8696a0]" />
            <div>
              <span className="text-base text-[#e9edef] block">Encryption</span>
              <span className="text-xs text-[#8696a0]">
                Messages are end-to-end encrypted. Click to learn more.
              </span>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-[#8696a0]" />
        </div>

        {/* Disappearing Messages */}
        <div className="py-3 px-6 flex items-center justify-between hover:bg-[#202c33] cursor-pointer transition-colors">
          <div className="flex items-center space-x-4">
            <Clock className="w-5 h-5 text-[#8696a0]" />
            <div>
              <span className="text-base text-[#e9edef] block">Disappearing messages</span>
              <span className="text-xs text-[#8696a0]">off</span>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-[#8696a0]" />
        </div>

        {/* Restricted Chat */}
        {isGroup && (
          <div className="py-3 px-6 flex items-center justify-between hover:bg-[#202c33] cursor-pointer transition-colors">
            <div className="flex items-center space-x-4">
              <Shield className="w-5 h-5 text-[#8696a0]" />
              <div>
                <span className="text-base text-[#e9edef] block">Restricted chat</span>
                <span className="text-xs text-[#8696a0]">off</span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-[#8696a0]" />
          </div>
        )}

        {/* Group Permissions (Screenshot 5 & 8) */}
        {isGroup && (
          <div
            onClick={() => setCurrentView('permissions')}
            className="py-3 px-6 flex items-center justify-between hover:bg-[#202c33] cursor-pointer transition-colors"
          >
            <div className="flex items-center space-x-4">
              <Shield className="w-5 h-5 text-[#8696a0]" />
              <span className="text-base text-[#e9edef]">Group permissions</span>
            </div>
            <ChevronRight className="w-4 h-4 text-[#8696a0]" />
          </div>
        )}

        {/* Add Group to a Community (Screenshot 5 & 12) */}
        {isGroup && (
          <div
            onClick={() => setCurrentView('community')}
            className="py-3 px-6 flex items-center justify-between hover:bg-[#202c33] cursor-pointer transition-colors"
          >
            <div className="flex items-center space-x-4">
              <div className="w-9 h-9 rounded-lg bg-[#00a884]/20 flex items-center justify-center text-[#00a884]">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <span className="text-base text-[#e9edef] block">Add group to a community</span>
                <span className="text-xs text-[#8696a0]">Bring members together in topic-based groups</span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-[#8696a0]" />
          </div>
        )}

        {/* Create a similar group */}
        {isGroup && (
          <div
            onClick={() => alert('Create similar group with same members')}
            className="py-3 px-6 flex items-center justify-between hover:bg-[#202c33] cursor-pointer transition-colors"
          >
            <div className="flex items-center space-x-4">
              <div className="w-9 h-9 rounded-lg bg-[#202c33] flex items-center justify-center text-[#8696a0]">
                <UserPlus className="w-5 h-5" />
              </div>
              <div>
                <span className="text-base text-[#e9edef] block">Create a similar group</span>
                <span className="text-xs text-[#8696a0]">Start with the same members. You can add or remove people.</span>
              </div>
            </div>
          </div>
        )}

        {/* Group Members List (Screenshot 6) */}
        {isGroup && (
          <div className="py-4 space-y-1">
            <div className="px-6 py-2 flex items-center justify-between">
              <span className="text-sm text-[#8696a0] font-medium">{members.length} members</span>
              <Search
                onClick={() => setShowAddMemberModal(true)}
                className="w-4 h-4 text-[#8696a0] cursor-pointer hover:text-white"
              />
            </div>

            {/* Add member row */}
            <div
              onClick={() => setShowAddMemberModal(true)}
              className="px-6 py-2.5 flex items-center space-x-4 hover:bg-[#202c33] cursor-pointer transition-colors"
            >
              <div className="w-10 h-10 rounded-full bg-[#00a884] flex items-center justify-center text-[#111b21]">
                <UserPlus className="w-5 h-5" />
              </div>
              <span className="text-base text-[#e9edef]">Add member</span>
            </div>

            {/* Invite to group via link (Screenshot 6) */}
            <div
              onClick={() => setCurrentView('invite-link')}
              className="px-6 py-2.5 flex items-center space-x-4 hover:bg-[#202c33] cursor-pointer transition-colors"
            >
              <div className="w-10 h-10 rounded-full bg-[#00a884] flex items-center justify-center text-[#111b21]">
                <Link className="w-5 h-5" />
              </div>
              <span className="text-base text-[#e9edef]">Invite to group via link</span>
            </div>

            {/* You (Group Admin) */}
            <div className="px-6 py-2.5 flex items-center justify-between hover:bg-[#202c33] cursor-pointer transition-colors">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 rounded-full bg-[#1d5c96] flex items-center justify-center text-white text-sm font-semibold">
                  👤
                </div>
                <div>
                  <span className="text-base text-[#e9edef] block">You</span>
                  <span className="text-xs text-[#00a884]">Add member tag</span>
                </div>
              </div>
              <span className="text-[11px] bg-[#00a884]/20 text-[#00a884] px-2 py-0.5 rounded font-medium">
                Group admin
              </span>
            </div>

            {/* Other Members */}
            {members.filter(m => m !== 'You').map((m, idx) => (
              <div
                key={idx}
                className="px-6 py-2.5 flex items-center justify-between hover:bg-[#202c33] cursor-pointer transition-colors group"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 rounded-full bg-[#e86b24] flex items-center justify-center text-white text-sm font-semibold">
                    {m.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <span className="text-base text-[#e9edef] block">{m}</span>
                  </div>
                </div>
                <button
                  onClick={() => {
                    if (confirm(`Remove ${m} from group?`) && activeChatId) {
                      removeGroupMember(activeChatId, m);
                    }
                  }}
                  className="opacity-0 group-hover:opacity-100 text-xs text-red-400 hover:underline px-2 py-1 rounded cursor-pointer transition-opacity"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Group Secondary Actions (Screenshot 6) */}
        {isGroup && (
          <div className="py-2">
            <div
              onClick={() => setCurrentView('member-changes')}
              className="py-3 px-6 flex items-center space-x-4 hover:bg-[#202c33] cursor-pointer transition-colors"
            >
              <History className="w-5 h-5 text-[#8696a0]" />
              <span className="text-base text-[#e9edef]">See member changes</span>
            </div>
            <div
              onClick={() => {
                if (activeChatId) toggleFavoriteChat(activeChatId);
              }}
              className="py-3 px-6 flex items-center space-x-4 hover:bg-[#202c33] cursor-pointer transition-colors"
            >
              <Heart className={`w-5 h-5 ${activeContact.isFavorite ? 'text-[#00a884] fill-current' : 'text-[#8696a0]'}`} />
              <span className="text-base text-[#e9edef]">
                {activeContact.isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
              </span>
            </div>
            <div
              onClick={() => setShowChooseListModal(true)}
              className="py-3 px-6 flex items-center space-x-4 hover:bg-[#202c33] cursor-pointer transition-colors"
            >
              <ListPlus className="w-5 h-5 text-[#8696a0]" />
              <span className="text-base text-[#e9edef]">Add to list</span>
            </div>
            <div
              onClick={() => {
                if (confirm('Are you sure you want to clear all messages in this group?')) {
                  clearChatMessages(activeContact.id);
                }
              }}
              className="py-3 px-6 flex items-center space-x-4 hover:bg-[#202c33] cursor-pointer transition-colors"
            >
              <Trash2 className="w-5 h-5 text-[#8696a0]" />
              <span className="text-base text-[#e9edef]">Clear chat</span>
            </div>
            <div
              onClick={() => setShowExitModal(true)}
              className="py-3 px-6 flex items-center space-x-4 hover:bg-[#202c33] cursor-pointer transition-colors text-red-500"
            >
              <LogOut className="w-5 h-5" />
              <span className="text-base">Exit group</span>
            </div>
            <div
              onClick={() => setShowReportModal(true)}
              className="py-3 px-6 flex items-center space-x-4 hover:bg-[#202c33] cursor-pointer transition-colors text-red-500"
            >
              <ThumbsDown className="w-5 h-5" />
              <span className="text-base">Report group</span>
            </div>

            <div className="px-6 py-4 text-xs text-[#8696a0]">
              Group created by you, today at {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
        )}

        {/* Standard Single Contact Actions */}
        {!isGroup && (
          <div className="py-2">
            <div className="py-3 px-6 flex items-center space-x-4 hover:bg-[#202c33] cursor-pointer transition-colors text-red-400">
              <Slash className="w-5 h-5" />
              <span className="text-base">Block {activeContact.name}</span>
            </div>
            <div className="py-3 px-6 flex items-center space-x-4 hover:bg-[#202c33] cursor-pointer transition-colors text-red-400">
              <ThumbsDown className="w-5 h-5" />
              <span className="text-base">Report {activeContact.name}</span>
            </div>
          </div>
        )}
      </div>

      {/* Modal: Exit Group (Screenshot 2) */}
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

            <div className="pt-2 border-t border-[#313d45]">
              <span className="text-sm text-[#e9edef] block font-medium">Report to WhatsApp</span>
              <p className="text-[11px] text-[#8696a0] leading-snug">
                The last 5 messages in this chat will be sent to WhatsApp. No one in the group will know about this report.{' '}
                <span className="text-[#00a884] cursor-pointer">Learn more</span>
              </p>
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

      {/* Modal: Report Group (Screenshot 3) */}
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

      {/* Modal: Choose List (Screenshot 4) */}
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

      {/* Modal: Add Member (Screenshot 13) */}
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

            {selectedNewMembers.length > 0 && (
              <div className="flex justify-end pt-2">
                <button
                  onClick={() => {
                    if (selectedNewMembers.length > 0 && activeChatId) {
                      addMembersToGroup(activeChatId, selectedNewMembers);
                    }
                    setShowAddMemberModal(false);
                    setSelectedNewMembers([]);
                  }}
                  className="w-12 h-12 rounded-full bg-[#00a884] hover:bg-[#008f70] text-[#111b21] flex items-center justify-center shadow-lg transition-transform hover:scale-105 cursor-pointer"
                >
                  <Check className="w-6 h-6 stroke-[3]" />
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Verify Security Code Modal */}
      {showVerifyModal && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-[#202c33] max-w-sm w-full rounded-xl shadow-2xl p-6 border border-[#313d45] space-y-4 text-center">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-medium text-[#e9edef]">Verify security code</h3>
              <button
                onClick={() => setShowVerifyModal(false)}
                className="text-[#8696a0] hover:text-white p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-[#8696a0]">
              To verify that messages and calls with {activeContact.name} are end-to-end encrypted, scan this code or compare the number below.
            </p>
            <div className="bg-white p-4 rounded-lg inline-block my-2">
              <div className="w-40 h-40 bg-[#111b21] flex items-center justify-center text-xs text-white">
                QR Code Placeholder
              </div>
            </div>

            <div className="font-mono text-xs text-[#aebac1] tracking-widest leading-loose">
              08492 19482 94821 95820 48192 48102
            </div>

            <button
              onClick={() => setShowVerifyModal(false)}
              className="w-full bg-[#00a884] hover:bg-[#008f70] text-[#111b21] font-semibold py-2 rounded-md transition-colors cursor-pointer"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
