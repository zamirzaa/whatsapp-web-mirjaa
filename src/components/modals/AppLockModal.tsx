import React, { useState } from 'react';
import { useWhatsApp } from '../../context/WhatsAppContext';
import { Lock, ArrowRight } from 'lucide-react';

export const AppLockModal: React.FC = () => {
  const { isAppLocked, setIsAppLocked } = useWhatsApp();
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  if (!isAppLocked) return null;

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length >= 4) {
      setIsAppLocked(false);
      setPassword('');
      setError(false);
    } else {
      setError(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#111b21] flex flex-col items-center justify-center p-6 select-none">
      <div className="w-full max-w-sm flex flex-col items-center text-center space-y-6">
        <div className="w-20 h-20 rounded-full bg-[#182229] border border-[#313d45] flex items-center justify-center text-[#00a884] shadow-xl">
          <Lock className="w-10 h-10" />
        </div>

        <div className="space-y-1">
          <h2 className="text-2xl font-light text-[#e9edef]">WhatsApp is locked</h2>
          <p className="text-xs text-[#8696a0]">Enter your password to unlock WhatsApp Web</p>
        </div>

        <form onSubmit={handleUnlock} className="w-full space-y-4">
          <div className="relative">
            <input
              type="password"
              placeholder="Enter password (e.g. 1234)"
              value={password}
              onChange={e => {
                setPassword(e.target.value);
                setError(false);
              }}
              autoFocus
              className={`w-full bg-[#202c33] border rounded-lg px-4 py-2.5 text-white text-sm outline-none ${
                error ? 'border-[#ea4335]' : 'border-[#313d45] focus:border-[#00a884]'
              }`}
            />
            <button
              type="submit"
              className="absolute right-2 top-2 p-1 text-[#00a884] hover:text-[#00c99e] cursor-pointer"
            >
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>

          {error && <p className="text-xs text-[#ea4335]">Password must be at least 4 digits</p>}

          <button
            type="submit"
            className="w-full bg-[#00a884] hover:bg-[#008f70] text-[#111b21] font-semibold py-2.5 rounded-lg text-sm transition-colors cursor-pointer"
          >
            Unlock
          </button>
        </form>
      </div>
    </div>
  );
};
