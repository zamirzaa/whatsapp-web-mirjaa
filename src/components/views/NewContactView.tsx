import React, { useState } from 'react';
import { useWhatsApp } from '../../context/WhatsAppContext';
import { ArrowLeft, User, Phone } from 'lucide-react';

export const NewContactView: React.FC = () => {
  const { setSubView, addNewContact } = useWhatsApp();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [phone, setPhone] = useState('');
  const [syncToPhone, setSyncToPhone] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (firstName.trim()) {
      addNewContact(
        firstName.trim(),
        lastName.trim(),
        phone.trim() || '+62 812-3456-7890',
        username.trim()
      );
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#111b21] select-none overflow-hidden animate-in slide-in-from-left duration-150">
      {/* Header */}
      <div className="h-[60px] px-4 flex items-center justify-between border-b border-[#222d34] shrink-0">
        <div className="flex items-center space-x-6">
          <button
            onClick={() => setSubView('new-chat')}
            className="text-[#aebac1] hover:text-white transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h2 className="text-xl font-medium text-[#e9edef]">New contact</h2>
        </div>
        <button
          onClick={handleSave}
          disabled={!firstName.trim()}
          className="text-[#00a884] hover:text-[#00c99e] disabled:text-[#8696a0] font-semibold text-sm cursor-pointer"
        >
          Save
        </button>
      </div>

      {/* Form Content */}
      <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* First & Last name */}
        <div className="space-y-4">
          <div className="flex items-center space-x-4 border-b border-[#313d45] pb-2">
            <User className="w-5 h-5 text-[#8696a0]" />
            <input
              type="text"
              placeholder="First name"
              value={firstName}
              onChange={e => setFirstName(e.target.value)}
              className="bg-transparent flex-1 text-white placeholder-[#8696a0] text-sm outline-none"
              autoFocus
            />
          </div>

          <div className="flex items-center space-x-4 border-b border-[#313d45] pb-2 pl-9">
            <input
              type="text"
              placeholder="Last name"
              value={lastName}
              onChange={e => setLastName(e.target.value)}
              className="bg-transparent flex-1 text-white placeholder-[#8696a0] text-sm outline-none"
            />
          </div>
        </div>

        {/* Username */}
        <div className="flex items-center space-x-4 border-b border-[#00a884] pb-2">
          <span className="text-[#8696a0] text-lg font-bold">@</span>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={e => setUsername(e.target.value)}
            className="bg-transparent flex-1 text-white placeholder-[#8696a0] text-sm outline-none"
          />
        </div>

        {/* Country & Phone */}
        <div className="flex items-center space-x-4 border-b border-[#313d45] pb-2">
          <Phone className="w-5 h-5 text-[#8696a0]" />
          <div className="flex items-center space-x-2 border-r border-[#313d45] pr-3">
            <span className="text-xs text-[#8696a0] block -mt-4">Country</span>
            <span className="text-sm text-white font-medium">ID +62</span>
          </div>
          <input
            type="tel"
            placeholder="Phone"
            value={phone}
            onChange={e => setPhone(e.target.value)}
            className="bg-transparent flex-1 text-white placeholder-[#8696a0] text-sm outline-none font-mono"
          />
        </div>

        {/* Sync contact to phone toggle */}
        <div className="pt-2">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-[#e9edef]">Sync contact to phone</h4>
              <p className="text-xs text-[#8696a0] mt-0.5">
                This contact will be added to your phone's address book.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setSyncToPhone(!syncToPhone)}
              className={`w-11 h-6 rounded-full transition-colors p-0.5 cursor-pointer ${
                syncToPhone ? 'bg-[#00a884]' : 'bg-[#313d45]'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  syncToPhone ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
