import React, { useState } from 'react';
import { useWhatsApp } from '../../context/WhatsAppContext';
import { X, Check } from 'lucide-react';

export const ThoughtModal: React.FC = () => {
  const { isThoughtModalOpen, setIsThoughtModalOpen, currentUser, setUserThought } = useWhatsApp();
  const [thought, setThought] = useState(currentUser.thought || '');

  if (!isThoughtModalOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (thought.trim()) {
      setUserThought(thought.trim());
      setIsThoughtModalOpen(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4 backdrop-blur-sm select-none">
      <div className="bg-[#202c33] max-w-sm w-full rounded-2xl shadow-2xl p-6 border border-[#313d45] space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-[#e9edef]">Share a thought</h3>
          <button
            onClick={() => setIsThoughtModalOpen(false)}
            className="text-[#8696a0] hover:text-white cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-[#8696a0]">
          Your thought will appear in a bubble above your profile picture for your contacts to see.
        </p>

        <form onSubmit={handleSave} className="space-y-4 pt-2">
          <input
            type="text"
            placeholder="What's on your mind?"
            value={thought}
            maxLength={60}
            onChange={e => setThought(e.target.value)}
            autoFocus
            className="w-full bg-[#111b21] border border-[#313d45] rounded-lg px-4 py-2.5 text-white placeholder-[#8696a0] text-sm outline-none focus:border-[#00a884]"
          />

          <div className="flex justify-between items-center text-xs text-[#8696a0]">
            <span>{60 - thought.length} characters left</span>
            <button
              type="submit"
              className="bg-[#00a884] hover:bg-[#008f70] text-[#111b21] font-semibold px-4 py-2 rounded-lg flex items-center space-x-1 transition-colors cursor-pointer"
            >
              <Check className="w-4 h-4 stroke-[3]" />
              <span>Share</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
