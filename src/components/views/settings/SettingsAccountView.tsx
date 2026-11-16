import React, { useState } from 'react';
import { useWhatsApp } from '../../../context/WhatsAppContext';
import { ArrowLeft, ShieldCheck, Key, FileText, Trash2 } from 'lucide-react';

export const SettingsAccountView: React.FC = () => {
  const { setSubView, logout } = useWhatsApp();
  const [securityNotifs, setSecurityNotifs] = useState(true);

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
        <h2 className="text-xl font-medium text-[#e9edef]">Account</h2>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto divide-y divide-[#222d34]/60">
        {/* Security notifications */}
        <div
          onClick={() => setSecurityNotifs(!securityNotifs)}
          className="flex items-center justify-between p-4 hover:bg-[#202c33] cursor-pointer transition-colors"
        >
          <div className="flex items-center space-x-4">
            <ShieldCheck className="w-5 h-5 text-[#8696a0]" />
            <div>
              <h4 className="text-base text-[#e9edef]">Security notifications</h4>
              <p className="text-xs text-[#8696a0]">Get notified when security code changes</p>
            </div>
          </div>
          <div
            className={`w-10 h-5 rounded-full transition-colors p-0.5 ${
              securityNotifs ? 'bg-[#00a884]' : 'bg-[#313d45]'
            }`}
          >
            <div
              className={`w-4 h-4 rounded-full bg-white transition-transform ${
                securityNotifs ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </div>
        </div>

        {/* Two-step verification */}
        <div className="flex items-center space-x-4 p-4 hover:bg-[#202c33] cursor-pointer transition-colors">
          <Key className="w-5 h-5 text-[#8696a0]" />
          <div>
            <h4 className="text-base text-[#e9edef]">Two-step verification</h4>
            <p className="text-xs text-[#8696a0]">For added security, enable a PIN</p>
          </div>
        </div>

        {/* Request account info */}
        <div className="flex items-center space-x-4 p-4 hover:bg-[#202c33] cursor-pointer transition-colors">
          <FileText className="w-5 h-5 text-[#8696a0]" />
          <div>
            <h4 className="text-base text-[#e9edef]">Request account info</h4>
            <p className="text-xs text-[#8696a0]">Create a report of your account info and settings</p>
          </div>
        </div>

        {/* Delete account */}
        <div
          onClick={logout}
          className="flex items-center space-x-4 p-4 hover:bg-[#202c33] cursor-pointer transition-colors text-red-400"
        >
          <Trash2 className="w-5 h-5 text-red-400" />
          <div>
            <h4 className="text-base font-medium">Delete my account</h4>
            <p className="text-xs text-red-400/80">Delete account and erase chat history</p>
          </div>
        </div>
      </div>
    </div>
  );
};
