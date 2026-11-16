import React, { useState } from 'react';
import { useWhatsApp } from '../../context/WhatsAppContext';
import { ArrowLeft, Search, X, ArrowRight, Check, Camera, Smile } from 'lucide-react';

export const NewGroupView: React.FC = () => {
  const {
    contacts,
    selectedGroupMembers,
    toggleGroupMember,
    clearGroupMembers,
    createGroup,
    subView,
    setSubView,
  } = useWhatsApp();

  const [search, setSearch] = useState('');
  const [groupName, setGroupName] = useState('');

  const activeContacts = contacts.filter(
    c =>
      !c.isArchived &&
      !c.isGroup &&
      (c.name.toLowerCase().includes(search.toLowerCase()) || c.phoneNumber.includes(search))
  );

  const selectedList = contacts.filter(c => selectedGroupMembers.includes(c.id));

  // Step 2: Group Info (Subject / Icon)
  if (subView === 'new-group-info') {
    return (
      <div className="flex-1 flex flex-col h-full bg-[#111b21] select-none overflow-hidden animate-in slide-in-from-right duration-150">
        {/* Header */}
        <div className="h-[60px] px-4 flex items-center space-x-6 border-b border-[#222d34] shrink-0">
          <button
            onClick={() => setSubView('new-group')}
            className="text-[#aebac1] hover:text-white transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h2 className="text-xl font-medium text-[#e9edef]">New group</h2>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Avatar Icon */}
          <div className="flex justify-center">
            <div className="w-32 h-32 rounded-full bg-[#202c33] border-2 border-[#313d45] flex items-center justify-center text-[#8696a0] hover:text-[#00a884] cursor-pointer shadow-lg relative group">
              <Camera className="w-10 h-10" />
              <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center text-xs text-white uppercase font-bold">
                Add icon
              </div>
            </div>
          </div>

          {/* Group Subject Name */}
          <div className="space-y-1">
            <label className="text-xs uppercase text-[#00a884] font-semibold">Group subject</label>
            <div className="flex items-center space-x-3 border-b-2 border-[#00a884] pb-2">
              <input
                type="text"
                placeholder="Type group subject here..."
                value={groupName}
                onChange={e => setGroupName(e.target.value)}
                autoFocus
                className="bg-transparent flex-1 text-white placeholder-[#8696a0] text-base outline-none"
              />
              <button className="text-[#8696a0] hover:text-white p-1 cursor-pointer">
                <Smile className="w-5 h-5" />
              </button>
            </div>
            <p className="text-[11px] text-[#8696a0] pt-1">
              Provide a group subject and optional group icon
            </p>
          </div>

          {/* Members count preview */}
          <div className="pt-4 border-t border-[#222d34]">
            <span className="text-xs text-[#8696a0]">
              Members: {selectedGroupMembers.length} selected
            </span>
            <div className="flex flex-wrap gap-2 mt-2">
              {selectedList.map(c => (
                <span
                  key={c.id}
                  className="bg-[#202c33] text-xs text-[#e9edef] px-2.5 py-1 rounded-full border border-[#313d45]"
                >
                  {c.name}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Create Button (Floating checkmark) */}
        {groupName.trim() && (
          <div className="p-6 flex justify-center shrink-0">
            <button
              onClick={() => createGroup(groupName.trim())}
              className="w-14 h-14 rounded-full bg-[#00a884] hover:bg-[#008f70] text-[#111b21] flex items-center justify-center shadow-2xl transition-transform hover:scale-105 cursor-pointer"
            >
              <Check className="w-7 h-7 stroke-[3]" />
            </button>
          </div>
        )}
      </div>
    );
  }

  // Step 1: Add Group Members (Screenshot 8)
  return (
    <div className="flex-1 flex flex-col h-full bg-[#111b21] select-none overflow-hidden relative animate-in slide-in-from-left duration-150">
      {/* Header */}
      <div className="h-[60px] px-4 flex items-center space-x-6 border-b border-[#222d34] shrink-0">
        <button
          onClick={() => {
            clearGroupMembers();
            setSubView('none');
          }}
          className="text-[#aebac1] hover:text-white transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h2 className="text-xl font-medium text-[#e9edef]">Add group members</h2>
      </div>

      {/* Selected Members Chips */}
      {selectedList.length > 0 && (
        <div className="px-4 py-2 border-b border-[#222d34] flex flex-wrap gap-2 max-h-28 overflow-y-auto shrink-0">
          {selectedList.map(contact => (
            <div
              key={contact.id}
              className="flex items-center space-x-1.5 bg-[#202c33] rounded-full pl-1.5 pr-2 py-1 text-xs text-[#e9edef] border border-[#313d45]"
            >
              <img
                src={contact.avatar}
                alt={contact.name}
                className="w-5 h-5 rounded-full object-cover"
              />
              <span className="truncate max-w-[120px]">{contact.name}</span>
              <button
                onClick={() => toggleGroupMember(contact.id)}
                className="text-[#8696a0] hover:text-white p-0.5 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Search Input */}
      <div className="p-3 shrink-0">
        <div className="flex items-center bg-[#202c33] rounded-lg px-3 py-1.5 border border-transparent focus-within:border-[#00a884]">
          <Search className="w-4 h-4 text-[#8696a0] mr-3" />
          <input
            type="text"
            placeholder="Search name, number or @username"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="bg-transparent flex-1 text-[#e9edef] placeholder-[#8696a0] text-sm outline-none"
            autoFocus
          />
        </div>
      </div>

      {/* Contacts List */}
      <div className="flex-1 overflow-y-auto px-4 py-2">
        <h3 className="text-xs font-semibold text-[#8696a0] px-2 mb-2">A</h3>
        <div className="space-y-1">
          {activeContacts.map(contact => {
            const isSelected = selectedGroupMembers.includes(contact.id);
            return (
              <div
                key={contact.id}
                onClick={() => toggleGroupMember(contact.id)}
                className="flex items-center space-x-3.5 px-3 py-2.5 rounded-lg hover:bg-[#202c33] cursor-pointer transition-colors"
              >
                <img
                  src={contact.avatar}
                  alt={contact.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div className="flex-1 min-w-0 border-b border-[#222d34] pb-2 flex items-center justify-between">
                  <div>
                    <h4 className="text-base text-[#e9edef] truncate">{contact.name}</h4>
                    <p className="text-xs text-[#8696a0] truncate">{contact.about || contact.phoneNumber}</p>
                  </div>
                  <div
                    className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${
                      isSelected
                        ? 'bg-[#00a884] border-[#00a884] text-[#111b21]'
                        : 'border-[#8696a0]'
                    }`}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Floating Proceed Arrow Button at Bottom Right */}
      {selectedGroupMembers.length > 0 && (
        <div className="absolute bottom-6 right-6 z-20">
          <button
            onClick={() => setSubView('new-group-info')}
            className="w-14 h-14 rounded-full bg-[#00a884] hover:bg-[#008f70] text-[#111b21] flex items-center justify-center shadow-2xl transition-transform hover:scale-105 cursor-pointer"
            title="Next"
          >
            <ArrowRight className="w-6 h-6 stroke-[3]" />
          </button>
        </div>
      )}
    </div>
  );
};
