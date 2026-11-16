import React, { useState } from 'react';
import { useWhatsApp } from '../../context/WhatsAppContext';
import { X, Send, Image, Palette } from 'lucide-react';

export const NewStatusModal: React.FC = () => {
  const { isNewStatusModalOpen, setIsNewStatusModalOpen, addNewStatus } = useWhatsApp();
  const [text, setText] = useState('');
  const [selectedBg, setSelectedBg] = useState('#005c4b');
  const [mediaUrl, setMediaUrl] = useState('');

  const colors = ['#005c4b', '#7c3aed', '#dc2626', '#d97706', '#2563eb', '#059669'];

  if (!isNewStatusModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim() || mediaUrl) {
      addNewStatus(text.trim(), mediaUrl, selectedBg);
      setText('');
      setMediaUrl('');
      setIsNewStatusModalOpen(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setMediaUrl(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-4 backdrop-blur-sm select-none">
      <div className="bg-[#202c33] max-w-md w-full rounded-2xl shadow-2xl overflow-hidden border border-[#313d45] flex flex-col">
        {/* Header */}
        <div className="h-14 px-6 bg-[#202c33] border-b border-[#313d45] flex items-center justify-between">
          <h3 className="text-base font-medium text-[#e9edef]">Add status update</h3>
          <button
            onClick={() => setIsNewStatusModalOpen(false)}
            className="text-[#8696a0] hover:text-white cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status Preview Canvas */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div
            className="w-full h-56 rounded-xl flex flex-col items-center justify-center p-6 text-center shadow-inner relative transition-colors"
            style={{ backgroundColor: mediaUrl ? '#111b21' : selectedBg }}
          >
            {mediaUrl ? (
              <img
                src={mediaUrl}
                alt="Status preview"
                className="max-h-full max-w-full rounded-lg object-contain"
              />
            ) : (
              <textarea
                placeholder="Type a status..."
                value={text}
                onChange={e => setText(e.target.value)}
                autoFocus
                className="w-full bg-transparent text-white text-xl font-medium placeholder-white/60 outline-none resize-none text-center"
                rows={3}
              />
            )}
          </div>

          {/* Color Palettes & Image upload bar */}
          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center space-x-2">
              <Palette className="w-4 h-4 text-[#8696a0] mr-1" />
              {colors.map(c => (
                <button
                  type="button"
                  key={c}
                  onClick={() => {
                    setSelectedBg(c);
                    setMediaUrl('');
                  }}
                  className={`w-6 h-6 rounded-full border-2 transition-transform ${
                    selectedBg === c ? 'scale-110 border-white' : 'border-transparent'
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>

            <label className="p-2 bg-[#111b21] hover:bg-[#2a3942] rounded-full text-white cursor-pointer transition-colors">
              <Image className="w-5 h-5" />
              <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
            </label>
          </div>

          {/* Caption input if image attached */}
          {mediaUrl && (
            <input
              type="text"
              placeholder="Add a caption..."
              value={text}
              onChange={e => setText(e.target.value)}
              className="w-full bg-[#111b21] border border-[#313d45] rounded-lg px-4 py-2 text-white placeholder-[#8696a0] text-sm outline-none"
            />
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={!text.trim() && !mediaUrl}
            className="w-full bg-[#00a884] hover:bg-[#008f70] disabled:bg-[#313d45] disabled:text-[#8696a0] text-[#111b21] font-semibold py-2.5 rounded-lg text-sm flex items-center justify-center space-x-2 transition-colors cursor-pointer"
          >
            <Send className="w-4 h-4 fill-current" />
            <span>Post Status</span>
          </button>
        </form>
      </div>
    </div>
  );
};
