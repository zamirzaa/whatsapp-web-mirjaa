import React, { useState } from 'react';
import { useWhatsApp } from '../../context/WhatsAppContext';
import { X, Radio } from 'lucide-react';

interface NewChannelModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NewChannelModal: React.FC<NewChannelModalProps> = ({ isOpen, onClose }) => {
  const { createChannel } = useWhatsApp();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      createChannel(name.trim(), description.trim());
      setName('');
      setDescription('');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm select-none">
      <div className="bg-[#202c33] max-w-md w-full rounded-2xl shadow-2xl overflow-hidden border border-[#313d45] flex flex-col">
        {/* Header */}
        <div className="h-14 px-6 bg-[#202c33] border-b border-[#313d45] flex items-center justify-between">
          <h3 className="text-base font-medium text-[#e9edef]">Create channel</h3>
          <button onClick={onClose} className="text-[#8696a0] hover:text-white cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="flex flex-col items-center justify-center text-center space-y-2 mb-2">
            <div className="w-16 h-16 rounded-full bg-[#111b21] border border-[#313d45] flex items-center justify-center text-[#00a884]">
              <Radio className="w-8 h-8" />
            </div>
            <p className="text-xs text-[#8696a0] max-w-xs">
              Anyone can discover your channel. Channels are public, so anyone can see what you share.
            </p>
          </div>

          <div className="space-y-1">
            <label className="text-xs uppercase text-[#00a884] font-semibold">Channel name</label>
            <input
              type="text"
              placeholder="Channel name"
              value={name}
              onChange={e => setName(e.target.value)}
              autoFocus
              className="w-full bg-[#111b21] border border-[#313d45] rounded-lg px-4 py-2 text-white placeholder-[#8696a0] text-sm outline-none focus:border-[#00a884]"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs uppercase text-[#00a884] font-semibold">Description</label>
            <textarea
              placeholder="Describe your channel for followers"
              value={description}
              onChange={e => setDescription(e.target.value)}
              rows={3}
              className="w-full bg-[#111b21] border border-[#313d45] rounded-lg px-4 py-2 text-white placeholder-[#8696a0] text-sm outline-none focus:border-[#00a884] resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={!name.trim()}
            className="w-full bg-[#00a884] hover:bg-[#008f70] disabled:bg-[#313d45] disabled:text-[#8696a0] text-[#111b21] font-semibold py-2.5 rounded-lg text-sm transition-colors cursor-pointer"
          >
            Create Channel
          </button>
        </form>
      </div>
    </div>
  );
};
