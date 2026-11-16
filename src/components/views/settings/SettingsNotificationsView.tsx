import React, { useState } from 'react';
import { useWhatsApp } from '../../../context/WhatsAppContext';
import { ArrowLeft, Check } from 'lucide-react';
import { sounds } from '../../../utils/audio';

export const SettingsNotificationsView: React.FC = () => {
  const { setSubView } = useWhatsApp();
  const [messagesEnabled, setMessagesEnabled] = useState(true);
  const [previewsEnabled, setPreviewsEnabled] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(sounds.enabled);
  const [reactionsEnabled, setReactionsEnabled] = useState(true);

  const toggleSound = () => {
    sounds.enabled = !soundEnabled;
    setSoundEnabled(!soundEnabled);
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
        <h2 className="text-xl font-medium text-[#e9edef]">Notifications</h2>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto divide-y divide-[#222d34]/60">
        {/* Messages */}
        <div
          onClick={() => setMessagesEnabled(!messagesEnabled)}
          className="p-4 hover:bg-[#202c33] cursor-pointer transition-colors flex justify-between items-center"
        >
          <div>
            <h4 className="text-base text-[#e9edef]">Messages</h4>
            <p className="text-xs text-[#8696a0]">Show notifications for new messages</p>
          </div>
          <div
            className={`w-5 h-5 rounded flex items-center justify-center border shrink-0 ${
              messagesEnabled ? 'bg-[#00a884] border-[#00a884] text-[#111b21]' : 'border-[#8696a0]'
            }`}
          >
            {messagesEnabled && <Check className="w-3.5 h-3.5 stroke-[3]" />}
          </div>
        </div>

        {/* Show previews */}
        <div
          onClick={() => setPreviewsEnabled(!previewsEnabled)}
          className="p-4 hover:bg-[#202c33] cursor-pointer transition-colors flex justify-between items-center"
        >
          <div>
            <h4 className="text-base text-[#e9edef]">Show previews</h4>
            <p className="text-xs text-[#8696a0]">Show message text in notification alerts</p>
          </div>
          <div
            className={`w-5 h-5 rounded flex items-center justify-center border shrink-0 ${
              previewsEnabled ? 'bg-[#00a884] border-[#00a884] text-[#111b21]' : 'border-[#8696a0]'
            }`}
          >
            {previewsEnabled && <Check className="w-3.5 h-3.5 stroke-[3]" />}
          </div>
        </div>

        {/* Sounds */}
        <div
          onClick={toggleSound}
          className="p-4 hover:bg-[#202c33] cursor-pointer transition-colors flex justify-between items-center"
        >
          <div>
            <h4 className="text-base text-[#e9edef]">Sounds</h4>
            <p className="text-xs text-[#8696a0]">Play sound for incoming and outgoing messages</p>
          </div>
          <div
            className={`w-5 h-5 rounded flex items-center justify-center border shrink-0 ${
              soundEnabled ? 'bg-[#00a884] border-[#00a884] text-[#111b21]' : 'border-[#8696a0]'
            }`}
          >
            {soundEnabled && <Check className="w-3.5 h-3.5 stroke-[3]" />}
          </div>
        </div>

        {/* Reaction notifications */}
        <div
          onClick={() => setReactionsEnabled(!reactionsEnabled)}
          className="p-4 hover:bg-[#202c33] cursor-pointer transition-colors flex justify-between items-center"
        >
          <div>
            <h4 className="text-base text-[#e9edef]">Reaction notifications</h4>
            <p className="text-xs text-[#8696a0]">Show notifications for reactions to messages you send</p>
          </div>
          <div
            className={`w-5 h-5 rounded flex items-center justify-center border shrink-0 ${
              reactionsEnabled ? 'bg-[#00a884] border-[#00a884] text-[#111b21]' : 'border-[#8696a0]'
            }`}
          >
            {reactionsEnabled && <Check className="w-3.5 h-3.5 stroke-[3]" />}
          </div>
        </div>
      </div>
    </div>
  );
};
