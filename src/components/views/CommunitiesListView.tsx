import React, { useState } from 'react';
import { useWhatsApp } from '../../context/WhatsAppContext';
import { Plus, ArrowLeft, Users, Check } from 'lucide-react';

export const CommunitiesListView: React.FC = () => {
  const { setSubView, subView } = useWhatsApp();
  const [isCreating, setIsCreating] = useState(false);
  const [commName, setCommName] = useState('');
  const [commDesc, setCommDesc] = useState('');
  const [communities, setCommunities] = useState([
    {
      id: 'comm_1',
      name: 'Warga SIJA & Alumni 🚀',
      desc: 'Komunitas resmi alumni dan siswa jurusan SIJA.',
      members: '142 members',
    },
  ]);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (commName.trim()) {
      setCommunities(prev => [
        {
          id: `comm_${Date.now()}`,
          name: commName.trim(),
          desc: commDesc.trim() || 'Komunitas WhatsApp',
          members: '1 member',
        },
        ...prev,
      ]);
      setCommName('');
      setCommDesc('');
      setIsCreating(false);
      setSubView('none');
    }
  };

  if (isCreating || subView === 'new-community') {
    return (
      <div className="flex-1 flex flex-col h-full bg-[#111b21] select-none overflow-hidden animate-in slide-in-from-left duration-150">
        <div className="h-[60px] px-4 flex items-center space-x-6 border-b border-[#222d34] shrink-0">
          <button
            onClick={() => {
              setIsCreating(false);
              setSubView('none');
            }}
            className="text-[#aebac1] hover:text-white transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h2 className="text-xl font-medium text-[#e9edef]">New community</h2>
        </div>

        <form onSubmit={handleCreate} className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="flex justify-center">
            <div className="w-24 h-24 rounded-2xl bg-[#00a884]/20 border-2 border-[#00a884] flex items-center justify-center text-[#00a884]">
              <Users className="w-10 h-10" />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs uppercase text-[#00a884] font-semibold">Community name</label>
            <input
              type="text"
              placeholder="Community name"
              value={commName}
              onChange={e => setCommName(e.target.value)}
              autoFocus
              className="w-full bg-[#202c33] border border-[#313d45] rounded-lg px-4 py-2.5 text-white placeholder-[#8696a0] text-sm outline-none focus:border-[#00a884]"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs uppercase text-[#00a884] font-semibold">Community description</label>
            <textarea
              placeholder="What's this community for?"
              value={commDesc}
              onChange={e => setCommDesc(e.target.value)}
              rows={3}
              className="w-full bg-[#202c33] border border-[#313d45] rounded-lg px-4 py-2 text-white placeholder-[#8696a0] text-sm outline-none focus:border-[#00a884] resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={!commName.trim()}
            className="w-full bg-[#00a884] hover:bg-[#008f70] disabled:bg-[#313d45] disabled:text-[#8696a0] text-[#111b21] font-semibold py-2.5 rounded-lg text-sm flex items-center justify-center space-x-2 transition-colors cursor-pointer"
          >
            <Check className="w-4 h-4 stroke-[3]" />
            <span>Create Community</span>
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-[#111b21] select-none overflow-hidden animate-in slide-in-from-left duration-150">
      {/* Header */}
      <div className="h-[60px] px-4 flex items-center justify-between border-b border-[#222d34] shrink-0">
        <h2 className="text-xl font-bold text-[#e9edef]">Communities</h2>
        <button
          onClick={() => setIsCreating(true)}
          className="p-2 hover:bg-[#202c33] rounded-full transition-colors cursor-pointer text-[#00a884]"
          title="New community"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Existing Communities */}
        {communities.map(cm => (
          <div
            key={cm.id}
            className="p-3 bg-[#202c33] rounded-xl border border-[#313d45] flex items-center space-x-3.5 hover:bg-[#2a3942] cursor-pointer transition-colors"
          >
            <div className="w-12 h-12 rounded-xl bg-[#00a884]/20 border border-[#00a884] flex items-center justify-center text-[#00a884] shrink-0">
              <Users className="w-6 h-6" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-base font-medium text-[#e9edef] truncate">{cm.name}</h4>
              <p className="text-xs text-[#8696a0] truncate">{cm.desc}</p>
              <span className="text-[11px] text-[#00a884] font-medium mt-0.5 block">{cm.members}</span>
            </div>
          </div>
        ))}

        {/* Start a new community banner */}
        <div className="pt-6 flex flex-col items-center text-center space-y-4">
          <div className="w-24 h-24 rounded-2xl bg-[#d1fae5] p-3 flex items-center justify-center shadow-lg">
            <span className="text-4xl">🏘️</span>
          </div>

          <div className="space-y-1.5 max-w-xs">
            <h3 className="text-base font-semibold text-[#e9edef]">
              Stay connected with a community
            </h3>
            <p className="text-xs text-[#8696a0] leading-relaxed">
              Communities bring members together in topic-based groups.
            </p>
          </div>

          <button
            onClick={() => setIsCreating(true)}
            className="w-full max-w-xs bg-[#00a884] hover:bg-[#008f70] text-[#111b21] font-semibold text-xs py-2.5 rounded-full transition-colors cursor-pointer shadow-md"
          >
            Start your community
          </button>
        </div>
      </div>
    </div>
  );
};
