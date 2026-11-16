import React, { useState } from 'react';
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
} from 'lucide-react';

export const ContactInfoDrawer: React.FC = () => {
  const { activeContact, setActiveRightDrawer, activeMessages } = useWhatsApp();
  const [showVerifyModal, setShowVerifyModal] = useState(false);

  if (!activeContact) return null;

  const mediaMessages = activeMessages.filter(m => m.type === 'image');
  const docMessages = activeMessages.filter(m => m.type === 'document');

  return (
    <div className="w-full md:w-[380px] lg:w-[420px] h-full bg-[#111b21] border-l border-[#222d34] flex flex-col z-20 animate-in slide-in-from-right duration-200 select-none shrink-0">
      {/* Header */}
      <div className="h-[60px] bg-[#202c33] px-6 flex items-center justify-between border-b border-[#222d34]">
        <h3 className="text-base font-medium text-[#e9edef]">Contact info</h3>
        <button
          onClick={() => setActiveRightDrawer('none')}
          className="text-[#aebac1] hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto divide-y divide-[#202c33]">
        {/* Avatar & Name */}
        <div className="py-7 px-6 flex flex-col items-center text-center">
          <img
            src={activeContact.avatar}
            alt={activeContact.name}
            className="w-44 h-44 rounded-full object-cover shadow-xl mb-4 border-2 border-[#202c33]"
          />
          <h2 className="text-2xl font-normal text-[#e9edef] mb-1">{activeContact.name}</h2>
          <p className="text-sm text-[#8696a0] font-mono">{activeContact.phoneNumber}</p>
        </div>

        {/* About Section */}
        <div className="py-4 px-6 space-y-1">
          <span className="text-xs uppercase text-[#8696a0] font-semibold">About</span>
          <p className="text-base text-[#e9edef]">{activeContact.about || 'Available'}</p>
        </div>

        {/* Media, Links and Docs */}
        <div className="py-4 px-6 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase text-[#8696a0] font-semibold">
              Media, links and docs
            </span>
            <span className="text-xs text-[#00a884] font-medium">
              {mediaMessages.length + docMessages.length} items
            </span>
          </div>

          {/* Media previews */}
          {mediaMessages.length > 0 ? (
            <div className="grid grid-cols-3 gap-2">
              {mediaMessages.slice(0, 3).map(m => (
                <img
                  key={m.id}
                  src={m.mediaUrl}
                  alt="Media item"
                  className="w-full h-20 object-cover rounded cursor-pointer hover:opacity-90 transition-opacity"
                />
              ))}
            </div>
          ) : (
            <p className="text-xs text-[#8696a0]">No media shared yet</p>
          )}
        </div>

        {/* Starred Messages */}
        <div className="py-3 px-6 flex items-center justify-between hover:bg-[#202c33] cursor-pointer transition-colors">
          <div className="flex items-center space-x-4">
            <Star className="w-5 h-5 text-[#8696a0]" />
            <span className="text-base text-[#e9edef]">Starred messages</span>
          </div>
          <ChevronRight className="w-4 h-4 text-[#8696a0]" />
        </div>

        {/* Mute Notifications */}
        <div className="py-3 px-6 flex items-center justify-between hover:bg-[#202c33] cursor-pointer transition-colors">
          <div className="flex items-center space-x-4">
            <Bell className="w-5 h-5 text-[#8696a0]" />
            <span className="text-base text-[#e9edef]">Mute notifications</span>
          </div>
          <ChevronRight className="w-4 h-4 text-[#8696a0]" />
        </div>

        {/* Disappearing Messages */}
        <div className="py-3 px-6 flex items-center justify-between hover:bg-[#202c33] cursor-pointer transition-colors">
          <div className="flex items-center space-x-4">
            <Clock className="w-5 h-5 text-[#8696a0]" />
            <div>
              <span className="text-base text-[#e9edef] block">Disappearing messages</span>
              <span className="text-xs text-[#8696a0]">Off</span>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-[#8696a0]" />
        </div>

        {/* Encryption Verification */}
        <div
          onClick={() => setShowVerifyModal(true)}
          className="py-3 px-6 flex items-center justify-between hover:bg-[#202c33] cursor-pointer transition-colors"
        >
          <div className="flex items-center space-x-4">
            <Lock className="w-5 h-5 text-[#8696a0]" />
            <div>
              <span className="text-base text-[#e9edef] block">Encryption</span>
              <span className="text-xs text-[#8696a0]">
                Messages are end-to-end encrypted. Click to verify.
              </span>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-[#8696a0]" />
        </div>

        {/* Block & Report Actions */}
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
      </div>

      {/* Verify Security Code Modal */}
      {showVerifyModal && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-[#202c33] max-w-sm w-full rounded-xl shadow-2xl p-6 border border-[#313d45] space-y-4 text-center">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-medium text-[#e9edef]">Verify security code</h3>
              <button
                onClick={() => setShowVerifyModal(false)}
                className="text-[#8696a0] hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-[#8696a0] leading-relaxed">
              To verify that messages and calls with {activeContact.name} are end-to-end encrypted,
              scan this code on their phone or compare the 60-digit number.
            </p>

            <div className="p-4 bg-white rounded-lg flex items-center justify-center my-3">
              <div className="w-36 h-36 border-4 border-slate-900 rounded flex flex-wrap gap-1 p-2">
                {Array.from({ length: 25 }).map((_, i) => (
                  <div
                    key={i}
                    className={`w-5 h-5 ${i % 2 === 0 ? 'bg-slate-900' : 'bg-transparent'}`}
                  />
                ))}
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
