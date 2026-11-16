import React from 'react';
import { useWhatsApp } from '../../context/WhatsAppContext';
import { ArrowLeft, Lock } from 'lucide-react';

export const AppLockView: React.FC = () => {
  const { setSubView, appLockEnabled, setAppLockEnabled, setIsAppLocked } = useWhatsApp();

  const handleToggle = () => {
    const nextVal = !appLockEnabled;
    setAppLockEnabled(nextVal);
    if (nextVal) {
      // simulate locked after 2 seconds
      setTimeout(() => {
        setIsAppLocked(true);
      }, 500);
    }
  };

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
        <h2 className="text-xl font-medium text-[#e9edef]">App lock</h2>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Lock Graphic */}
        <div className="flex flex-col items-center text-center space-y-3">
          <div className="w-20 h-20 rounded-full bg-[#182229] border border-[#313d45] flex items-center justify-center text-[#00a884] shadow-md">
            <Lock className="w-10 h-10" />
          </div>
          <h3 className="text-xl font-medium text-[#e9edef]">Lock with a password</h3>
          <p className="text-xs text-[#8696a0] leading-relaxed max-w-xs">
            You can lock WhatsApp Web instead of logging out. This makes it easier to access again later.{' '}
            <span className="text-[#00a884] cursor-pointer hover:underline">Learn more</span>
          </p>
        </div>

        {/* Toggle Option */}
        <div className="pt-4 border-t border-[#222d34]">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-[#e9edef]">Enable app lock</span>
            <button
              onClick={handleToggle}
              className={`w-11 h-6 rounded-full transition-colors p-0.5 cursor-pointer ${
                appLockEnabled ? 'bg-[#00a884]' : 'bg-[#313d45]'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  appLockEnabled ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Information notes */}
        <div className="space-y-4 pt-2 text-xs text-[#8696a0] leading-relaxed">
          <p>
            When app lock is enabled you can lock WhatsApp Web from the Chats menu.
          </p>
          <p>
            You won't get notifications when WhatsApp Web is locked. App lock will reset if you log out.
          </p>
        </div>
      </div>
    </div>
  );
};
