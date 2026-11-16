import React, { useState } from 'react';
import { useWhatsApp } from '../../../context/WhatsAppContext';
import { ArrowLeft, Check, Pencil, Camera } from 'lucide-react';

export const SettingsProfileView: React.FC = () => {
  const { currentUser, updateCurrentUser, setSubView } = useWhatsApp();
  const [name, setName] = useState(currentUser.name);
  const [about, setAbout] = useState(currentUser.about);
  const [username, setUsername] = useState(currentUser.username || 'mirza_id');
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingAbout, setIsEditingAbout] = useState(false);
  const [isEditingUsername, setIsEditingUsername] = useState(false);

  const saveName = () => {
    if (name.trim()) {
      updateCurrentUser({ name });
      setIsEditingName(false);
    }
  };

  const saveAbout = () => {
    if (about.trim()) {
      updateCurrentUser({ about });
      setIsEditingAbout(false);
    }
  };

  const saveUsername = () => {
    if (username.trim()) {
      updateCurrentUser({ username });
      setIsEditingUsername(false);
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
        <h2 className="text-xl font-medium text-[#e9edef]">Profile</h2>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
        {/* Avatar */}
        <div className="flex justify-center">
          <div className="relative group cursor-pointer">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-40 h-40 rounded-full object-cover shadow-lg border-2 border-[#202c33]"
            />
            <div className="absolute inset-0 bg-black/60 rounded-full opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white transition-opacity">
              <Camera className="w-6 h-6 mb-1 text-[#00a884]" />
              <span className="text-[11px] font-semibold uppercase tracking-wider text-center px-4">
                Change Profile Photo
              </span>
            </div>
          </div>
        </div>

        {/* Your Name */}
        <div className="space-y-1 bg-[#111b21]">
          <label className="text-xs text-[#00a884] font-medium uppercase tracking-wider">Your name</label>
          <div className="flex items-center justify-between border-b border-[#202c33] pb-2">
            {isEditingName ? (
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                autoFocus
                className="bg-transparent text-[#e9edef] text-base w-full outline-none"
                onKeyDown={e => e.key === 'Enter' && saveName()}
              />
            ) : (
              <span className="text-[#e9edef] text-base">{currentUser.name}</span>
            )}
            <button
              onClick={() => (isEditingName ? saveName() : setIsEditingName(true))}
              className="text-[#8696a0] hover:text-[#00a884] ml-2 cursor-pointer"
            >
              {isEditingName ? <Check className="w-5 h-5 text-[#00a884]" /> : <Pencil className="w-4 h-4" />}
            </button>
          </div>
          <p className="text-[11px] text-[#8696a0] pt-1">
            This is not your username or pin. This name will be visible to your WhatsApp contacts.
          </p>
        </div>

        {/* About */}
        <div className="space-y-1">
          <label className="text-xs text-[#00a884] font-medium uppercase tracking-wider">About</label>
          <div className="flex items-center justify-between border-b border-[#202c33] pb-2">
            {isEditingAbout ? (
              <input
                type="text"
                value={about}
                onChange={e => setAbout(e.target.value)}
                autoFocus
                className="bg-transparent text-[#e9edef] text-base w-full outline-none"
                onKeyDown={e => e.key === 'Enter' && saveAbout()}
              />
            ) : (
              <span className="text-[#e9edef] text-base">{currentUser.about}</span>
            )}
            <button
              onClick={() => (isEditingAbout ? saveAbout() : setIsEditingAbout(true))}
              className="text-[#8696a0] hover:text-[#00a884] ml-2 cursor-pointer"
            >
              {isEditingAbout ? <Check className="w-5 h-5 text-[#00a884]" /> : <Pencil className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Username */}
        <div className="space-y-1">
          <label className="text-xs text-[#00a884] font-medium uppercase tracking-wider">Username</label>
          <div className="flex items-center justify-between border-b border-[#202c33] pb-2">
            {isEditingUsername ? (
              <div className="flex items-center w-full">
                <span className="text-[#8696a0] mr-1">@</span>
                <input
                  type="text"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  autoFocus
                  className="bg-transparent text-[#e9edef] text-base w-full outline-none"
                  onKeyDown={e => e.key === 'Enter' && saveUsername()}
                />
              </div>
            ) : (
              <span className="text-[#e9edef] text-base">@{currentUser.username || 'mirza_id'}</span>
            )}
            <button
              onClick={() => (isEditingUsername ? saveUsername() : setIsEditingUsername(true))}
              className="text-[#8696a0] hover:text-[#00a884] ml-2 cursor-pointer"
            >
              {isEditingUsername ? <Check className="w-5 h-5 text-[#00a884]" /> : <Pencil className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Phone */}
        <div className="space-y-1">
          <label className="text-xs text-[#00a884] font-medium uppercase tracking-wider">Phone number</label>
          <div className="text-[#e9edef] text-base border-b border-[#202c33] pb-2 font-mono">
            {currentUser.phone}
          </div>
        </div>
      </div>
    </div>
  );
};
