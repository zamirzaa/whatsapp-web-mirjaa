import React, { useRef } from 'react';
import { useWhatsApp } from '../../../context/WhatsAppContext';
import { ArrowLeft, Check, Image as ImageIcon, CheckSquare, Square } from 'lucide-react';

const SOLID_COLORS = [
  { id: 'default-dark', color: '#0b141a', name: 'Default Dark' },
  { id: 'black', color: '#000000', name: 'Black' },
  { id: 'dark-green', color: '#005c4b', name: 'WhatsApp Green' },
  { id: 'midnight', color: '#102a43', name: 'Midnight' },
  { id: 'deep-blue', color: '#0c1b33', name: 'Deep Blue' },
  { id: 'slate', color: '#243b53', name: 'Slate Gray' },
  { id: 'charcoal', color: '#1f2937', name: 'Charcoal' },
  { id: 'burgundy', color: '#4a154b', name: 'Burgundy' },
  { id: 'mocha', color: '#3d2622', name: 'Mocha' },
  { id: 'olive', color: '#2b3a25', name: 'Olive' },
  { id: 'plum', color: '#2e1065', name: 'Plum' },
  { id: 'navy', color: '#1e1b4b', name: 'Navy' },
  { id: 'forest', color: '#064e3b', name: 'Forest' },
  { id: 'eggplant', color: '#31102f', name: 'Eggplant' },
  { id: 'storm', color: '#334155', name: 'Storm' },
  { id: 'espresso', color: '#291811', name: 'Espresso' },
  { id: 'teal-dark', color: '#0f3a40', name: 'Dark Teal' },
  { id: 'light-cream', color: '#efeae2', name: 'Default Light Cream' },
  { id: 'light-mint', color: '#e2f7cb', name: 'Light Mint' },
  { id: 'light-blue', color: '#d9f0f8', name: 'Light Blue' },
];

export const SettingsWallpaperView: React.FC = () => {
  const {
    setSubView,
    chatWallpaper,
    setChatWallpaper,
    chatDoodlesEnabled,
    setChatDoodlesEnabled,
  } = useWhatsApp();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCustomImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setChatWallpaper(`url(${reader.result})`);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-white dark:bg-[#111b21] select-none overflow-hidden animate-in slide-in-from-left duration-150">
      {/* Header */}
      <div className="h-[60px] px-4 flex items-center space-x-6 border-b border-[#e9edef] dark:border-[#222d34] shrink-0">
        <button
          onClick={() => setSubView('settings-chats')}
          className="text-[#54656f] dark:text-[#aebac1] hover:text-[#111b21] dark:hover:text-white transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h2 className="text-xl font-medium text-[#111b21] dark:text-[#e9edef]">Set chat wallpaper</h2>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-5">
        {/* Toggle WhatsApp Doodles */}
        <div
          onClick={() => setChatDoodlesEnabled(!chatDoodlesEnabled)}
          className="flex items-center space-x-3 cursor-pointer py-1"
        >
          {chatDoodlesEnabled ? (
            <CheckSquare className="w-5 h-5 text-[#00a884]" />
          ) : (
            <Square className="w-5 h-5 text-[#8696a0]" />
          )}
          <span className="text-sm font-medium text-[#111b21] dark:text-[#e9edef]">
            Add WhatsApp doodles
          </span>
        </div>

        {/* Custom image upload button */}
        <div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleCustomImage}
            accept="image/*"
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full py-2.5 px-4 bg-[#f0f2f5] dark:bg-[#202c33] hover:bg-[#e9edef] dark:hover:bg-[#2a3942] rounded-lg border border-[#e9edef] dark:border-[#313d45] flex items-center justify-center space-x-2 text-sm font-medium text-[#111b21] dark:text-[#e9edef] transition-colors cursor-pointer"
          >
            <ImageIcon className="w-4 h-4 text-[#00a884]" />
            <span>Upload custom photo / wallpaper</span>
          </button>
        </div>

        {/* Color Palette Grid */}
        <div>
          <h4 className="text-xs font-semibold text-[#667781] dark:text-[#8696a0] uppercase mb-3">
            Solid Colors
          </h4>
          <div className="grid grid-cols-4 gap-3">
            {SOLID_COLORS.map(c => {
              const isSelected = chatWallpaper === c.color;
              return (
                <div
                  key={c.id}
                  onClick={() => setChatWallpaper(c.color)}
                  className={`relative aspect-square rounded-lg cursor-pointer transition-all border-2 overflow-hidden shadow-xs hover:scale-105 flex items-center justify-center ${
                    isSelected ? 'border-[#00a884] ring-2 ring-[#00a884]/40' : 'border-black/10 dark:border-white/10'
                  }`}
                  style={{ backgroundColor: c.color }}
                  title={c.name}
                >
                  {isSelected && <Check className="w-5 h-5 text-white drop-shadow-md" />}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
