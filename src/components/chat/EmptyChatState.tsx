import React from 'react';
import { FileText, UserPlus, Lock } from 'lucide-react';
import { useWhatsApp } from '../../context/WhatsAppContext';

interface EmptyChatStateProps {
  onAddContact?: () => void;
  onSendDocument?: () => void;
}

export const EmptyChatState: React.FC<EmptyChatStateProps> = ({ onAddContact, onSendDocument }) => {
  const { askMetaAI, activeNavTab } = useWhatsApp();

  // If active tab is Status
  if (activeNavTab === 'status') {
    return (
      <div className="flex-1 hidden md:flex flex-col items-center justify-center bg-[#111b21] p-8 text-center select-none text-[#e9edef]">
        <div className="w-20 h-20 rounded-full border-4 border-[#313d45] flex items-center justify-center mb-6">
          <div className="w-10 h-10 rounded-full bg-[#313d45]" />
        </div>
        <h2 className="text-3xl font-light mb-3">Share statuses</h2>
        <p className="text-sm text-[#8696a0] max-w-sm">
          Share photos, videos and text that disappear after 24 hours.
        </p>
      </div>
    );
  }

  // If active tab is Channels
  if (activeNavTab === 'channels') {
    return (
      <div className="flex-1 hidden md:flex flex-col items-center justify-center bg-[#111b21] p-8 text-center select-none text-[#e9edef]">
        <div className="w-20 h-20 rounded-full bg-[#202c33] flex items-center justify-center mb-6 text-[#8696a0]">
          <div className="w-10 h-10 rounded-full border-2 border-[#8696a0] flex items-center justify-center">
            <span className="w-2 h-2 rounded-full bg-[#8696a0]" />
          </div>
        </div>
        <h2 className="text-3xl font-light mb-3">Discover channels</h2>
        <p className="text-sm text-[#8696a0] max-w-sm">
          Entertainment, sports, news, lifestyle, people and more. Follow the channels that interest you
        </p>
      </div>
    );
  }

  // If active tab is Communities
  if (activeNavTab === 'communities') {
    return (
      <div className="flex-1 hidden md:flex flex-col items-center justify-between bg-[#111b21] py-16 px-8 text-center select-none text-[#e9edef]">
        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="w-20 h-20 rounded-full bg-[#202c33] flex items-center justify-center mb-6 text-[#8696a0]">
            <span className="text-3xl">👥</span>
          </div>
          <h2 className="text-3xl font-light mb-3">Create communities</h2>
          <p className="text-sm text-[#8696a0] max-w-md">
            Bring members together in topic-based groups and easily send them admin announcements.
          </p>
        </div>
        <div className="flex items-center space-x-2 text-xs text-[#8696a0]">
          <Lock className="w-3.5 h-3.5" />
          <span>Your personal messages in communities are end-to-end encrypted</span>
        </div>
      </div>
    );
  }

  // Default Chats Empty State (Exact 1:1 match with Screenshot 1, 2, 6, 7, 8, etc.)
  return (
    <div className="flex-1 hidden md:flex flex-col items-center justify-center bg-[#111b21] p-8 select-none text-[#e9edef] relative">
      {/* Centered Download WhatsApp for Windows Card */}
      <div className="w-full max-w-[420px] bg-[#182229] border border-[#222d34] rounded-3xl p-8 flex flex-col items-center text-center shadow-2xl mb-12">
        {/* Laptop Graphic Illustration */}
        <div className="relative mb-6">
          <div className="w-36 h-24 bg-[#e9edef] rounded-t-xl border-4 border-[#202c33] p-1.5 flex items-center justify-between shadow-inner">
            <div className="w-1/2 h-full bg-[#00a884] rounded-sm flex flex-col justify-around p-1">
              <div className="w-full h-1 bg-white/60 rounded" />
              <div className="w-3/4 h-1 bg-white/60 rounded" />
              <div className="w-1/2 h-1 bg-white/60 rounded" />
            </div>
            <div className="w-1/2 h-full flex items-center justify-center">
              <span className="text-2xl text-[#00a884]">📞</span>
            </div>
          </div>
          <div className="w-44 h-3 bg-[#aebac1] rounded-b-xl mx-auto -mt-0.5 border-t border-[#313d45]" />
        </div>

        <h2 className="text-2xl font-normal text-[#e9edef] mb-3">
          Download WhatsApp for Windows
        </h2>

        <p className="text-xs text-[#8696a0] leading-relaxed mb-6 max-w-xs">
          Get extra features like voice and video calling, screen sharing and more.
        </p>

        <button
          onClick={() => window.open('https://www.whatsapp.com/download', '_blank')}
          className="bg-[#00a884] hover:bg-[#008f70] text-[#111b21] font-semibold text-sm px-7 py-2.5 rounded-full transition-colors cursor-pointer"
        >
          Download
        </button>
      </div>

      {/* Bottom 3 Shortcut Action Buttons */}
      <div className="flex items-center space-x-12">
        {/* Send Document */}
        <button
          onClick={onSendDocument}
          className="flex flex-col items-center space-y-2 group cursor-pointer"
        >
          <div className="w-12 h-12 rounded-full bg-[#202c33] group-hover:bg-[#2a3942] border border-[#313d45] flex items-center justify-center text-[#e9edef] transition-colors">
            <FileText className="w-5 h-5" />
          </div>
          <span className="text-xs text-[#8696a0] group-hover:text-[#e9edef]">
            Send document
          </span>
        </button>

        {/* Add Contact */}
        <button
          onClick={onAddContact}
          className="flex flex-col items-center space-y-2 group cursor-pointer"
        >
          <div className="w-12 h-12 rounded-full bg-[#202c33] group-hover:bg-[#2a3942] border border-[#313d45] flex items-center justify-center text-[#e9edef] transition-colors">
            <UserPlus className="w-5 h-5" />
          </div>
          <span className="text-xs text-[#8696a0] group-hover:text-[#e9edef]">
            Add contact
          </span>
        </button>

        {/* Ask Meta AI */}
        <button
          onClick={askMetaAI}
          className="flex flex-col items-center space-y-2 group cursor-pointer"
        >
          <div className="w-12 h-12 rounded-full bg-[#202c33] group-hover:bg-[#2a3942] border border-[#313d45] flex items-center justify-center transition-colors">
            <div className="w-6 h-6 rounded-full p-[2px] bg-gradient-to-tr from-[#9333ea] via-[#ec4899] to-[#3b82f6] flex items-center justify-center">
              <div className="w-full h-full bg-[#202c33] rounded-full flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-gradient-to-r from-[#a855f7] to-[#ec4899]" />
              </div>
            </div>
          </div>
          <span className="text-xs text-[#8696a0] group-hover:text-[#e9edef]">
            Ask Meta AI
          </span>
        </button>
      </div>
    </div>
  );
};
