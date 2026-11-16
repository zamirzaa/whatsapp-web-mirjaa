import React, { useState } from 'react';
import { useWhatsApp } from '../../../context/WhatsAppContext';
import { ArrowLeft, Check, Lock, ChevronRight } from 'lucide-react';

export const SettingsPrivacyView: React.FC = () => {
  const { setSubView } = useWhatsApp();
  const [readReceipts, setReadReceipts] = useState(true);

  return (
    <div className="flex-1 flex flex-col h-full bg-[#111b21] select-none overflow-hidden animate-in slide-in-from-left duration-150">
      {/* Header */}
      <div className="h-[60px] px-4 flex items-center space-x-6 border-b border-[#222d34] shrink-0">
        <button
          onClick={() => setSubView('none')}
          className="text-[#aebac1] hover:text-white transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h2 className="text-xl font-medium text-[#e9edef]">Privacy</h2>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto divide-y divide-[#222d34]/60">
        {/* Last seen and online */}
        <div className="p-4 hover:bg-[#202c33] cursor-pointer transition-colors flex justify-between items-center">
          <div>
            <h4 className="text-base text-[#e9edef]">Last seen and online</h4>
            <p className="text-xs text-[#8696a0]">Everyone</p>
          </div>
          <ChevronRight className="w-4 h-4 text-[#8696a0]" />
        </div>

        {/* Profile photo */}
        <div className="p-4 hover:bg-[#202c33] cursor-pointer transition-colors flex justify-between items-center">
          <div>
            <h4 className="text-base text-[#e9edef]">Profile photo</h4>
            <p className="text-xs text-[#8696a0]">Everyone</p>
          </div>
          <ChevronRight className="w-4 h-4 text-[#8696a0]" />
        </div>

        {/* About */}
        <div className="p-4 hover:bg-[#202c33] cursor-pointer transition-colors flex justify-between items-center">
          <div>
            <h4 className="text-base text-[#e9edef]">About</h4>
            <p className="text-xs text-[#8696a0]">Everyone</p>
          </div>
          <ChevronRight className="w-4 h-4 text-[#8696a0]" />
        </div>

        {/* Read receipts */}
        <div
          onClick={() => setReadReceipts(!readReceipts)}
          className="p-4 hover:bg-[#202c33] cursor-pointer transition-colors flex justify-between items-center"
        >
          <div className="pr-4">
            <h4 className="text-base text-[#e9edef]">Read receipts</h4>
            <p className="text-xs text-[#8696a0] mt-0.5">
              If turned off, you won't send or receive read receipts. Read receipts are always sent for group chats.
            </p>
          </div>
          <div
            className={`w-5 h-5 rounded flex items-center justify-center border shrink-0 ${
              readReceipts ? 'bg-[#00a884] border-[#00a884] text-[#111b21]' : 'border-[#8696a0]'
            }`}
          >
            {readReceipts && <Check className="w-3.5 h-3.5 stroke-[3]" />}
          </div>
        </div>

        {/* Default message timer */}
        <div className="p-4 hover:bg-[#202c33] cursor-pointer transition-colors flex justify-between items-center">
          <div>
            <h4 className="text-base text-[#e9edef]">Default message timer</h4>
            <p className="text-xs text-[#8696a0]">Start new chats with disappearing messages: Off</p>
          </div>
          <ChevronRight className="w-4 h-4 text-[#8696a0]" />
        </div>

        {/* Blocked contacts */}
        <div className="p-4 hover:bg-[#202c33] cursor-pointer transition-colors flex justify-between items-center">
          <div>
            <h4 className="text-base text-[#e9edef]">Blocked contacts</h4>
            <p className="text-xs text-[#8696a0]">0</p>
          </div>
          <ChevronRight className="w-4 h-4 text-[#8696a0]" />
        </div>

        {/* App lock */}
        <div
          onClick={() => setSubView('app-lock')}
          className="p-4 hover:bg-[#202c33] cursor-pointer transition-colors flex justify-between items-center"
        >
          <div className="flex items-center space-x-3">
            <Lock className="w-5 h-5 text-[#8696a0]" />
            <div>
              <h4 className="text-base text-[#e9edef]">App lock</h4>
              <p className="text-xs text-[#8696a0]">Lock WhatsApp Web with a password</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-[#8696a0]" />
        </div>
      </div>
    </div>
  );
};
