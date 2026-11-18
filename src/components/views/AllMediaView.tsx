import React, { useState } from 'react';
import { useWhatsApp } from '../../context/WhatsAppContext';
import {
  ArrowLeft,
  Search,
  FileText,
  Link as LinkIcon,
  Download,
  ExternalLink,
} from 'lucide-react';

type MediaTab = 'media' | 'docs' | 'links';

export const AllMediaView: React.FC = () => {
  const { setSubView } = useWhatsApp();
  const [activeTab, setActiveTab] = useState<MediaTab>('media');
  const [search, setSearch] = useState('');

  const sampleMediaItems = [
    {
      id: 'm1',
      senderName: '+62 857-7631-6313',
      chatName: 'Nihongo 2026-2027',
      mediaUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&auto=format&fit=crop&q=80',
      timestamp: 'Today at 08:15 AM',
      dateGroup: 'Today',
      type: 'image',
    },
    {
      id: 'm2',
      senderName: 'mamah',
      chatName: 'Quwildra family',
      mediaUrl: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=600&auto=format&fit=crop&q=80',
      timestamp: 'Yesterday',
      dateGroup: 'Yesterday',
      type: 'image',
    },
    {
      id: 'm3',
      senderName: '+62 852-1567-9595',
      chatName: 'SIJA 2',
      mediaUrl: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=600&auto=format&fit=crop&q=80',
      timestamp: 'Yesterday',
      dateGroup: 'Yesterday',
      duration: '0:18',
      type: 'video',
    },
    {
      id: 'm4',
      senderName: '+62 857-7631-6313',
      chatName: 'acrocoy',
      mediaUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=600&auto=format&fit=crop&q=80',
      timestamp: 'Yesterday',
      dateGroup: 'Yesterday',
      type: 'image',
    },
    {
      id: 'm5',
      senderName: '+62 858-8052-3474',
      chatName: '12 SIJA 2 bersama Walas',
      mediaUrl: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=600&auto=format&fit=crop&q=80',
      timestamp: 'Yesterday',
      dateGroup: 'Yesterday',
      type: 'image',
    },
  ];

  const sampleDocs = [
    {
      id: 'd1',
      title: 'TP(A1) Bab5.pdf',
      size: '613 KB • PDF',
      caption: 'latihan soal bab 5 buat kelas 12',
      senderName: '+62 857-7631-6313',
      chatName: 'Nihongo 2026-2027',
      timestamp: 'Today at 7:53 AM',
      dateGroup: 'Today',
      fileUrl: '#',
    },
    {
      id: 'd2',
      title: 'TP(A1) Bab1.pdf',
      size: '717 KB • PDF',
      caption: 'tugas untuk kelas 11 boleh diprint boleh ditulis tangan',
      senderName: '+62 857-7631-6313',
      chatName: 'Nihongo 2026-2027',
      timestamp: 'Today at 7:52 AM',
      dateGroup: 'Today',
      fileUrl: '#',
    },
    {
      id: 'd3',
      title: 'List akun Redhat XI SIJA 2.xlsx',
      size: '9 KB • XLSX',
      caption: 'No caption',
      senderName: '+62 896-6292-5949',
      chatName: 'SIJA 2',
      timestamp: 'Yesterday at 11:39 AM',
      dateGroup: 'Yesterday',
      fileUrl: '#',
    },
    {
      id: 'd4',
      title: 'jadwal kelas blok 2.pdf',
      size: '215 KB • PDF',
      caption: 'No caption',
      senderName: 'pais genjor',
      chatName: 'pais genjor',
      timestamp: 'Yesterday at 8:46 AM',
      dateGroup: 'Yesterday',
      fileUrl: '#',
    },
  ];

  const sampleLinks = [
    {
      id: 'l1',
      url: 'https://instagram.com',
      domain: 'instagram.com',
      title: 'LOKA BARBER STUDIO di Instagram: "-YOUR HAIR DESTINATION-"',
      senderName: 'cina anjing • acrocoy',
      timestamp: 'Today at 12:13 AM',
      dateGroup: 'Today',
    },
    {
      id: 'l2',
      url: 'https://youtu.be',
      domain: 'youtu.be',
      title: 'Hiragana Reading 1 -AIUEO- [Learn Japanese Alphabet]',
      senderName: '+62 857-7631-6313 • Nihongo...',
      timestamp: 'Yesterday at 5:21 PM',
      dateGroup: 'Yesterday',
    },
    {
      id: 'l3',
      url: 'https://share.gemini.google',
      domain: 'share.gemini.google',
      title: 'share.gemini.google',
      senderName: '+62 856-9298-5360',
      timestamp: 'Yesterday at 1:49 PM',
      dateGroup: 'Yesterday',
    },
    {
      id: 'l4',
      url: 'https://e4dd76a47e7e5f.app.lhr.life',
      domain: 'e4dd76a47e7e5f.app.lhr.life',
      title: 'e4dd76a47e7e5f.app.lhr.life',
      senderName: 'pais genjor',
      timestamp: 'Yesterday at 1:42 PM',
      dateGroup: 'Yesterday',
    },
  ];

  return (
    <div className="flex-1 flex flex-col h-full bg-white dark:bg-[#111b21] select-none overflow-hidden animate-in slide-in-from-left duration-150">
      {/* Header */}
      <div className="h-[60px] px-4 flex items-center justify-between border-b border-[#e9edef] dark:border-[#222d34] shrink-0">
        <div className="flex items-center space-x-6">
          <button
            onClick={() => setSubView('none')}
            className="text-[#54656f] dark:text-[#aebac1] hover:text-[#111b21] dark:hover:text-white transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-lg font-medium text-[#111b21] dark:text-[#e9edef] leading-tight">Media</h2>
            <p className="text-xs text-[#667781] dark:text-[#8696a0]">Media from all chats</p>
          </div>
        </div>
      </div>

      {/* Tabs: Media | Docs | Links */}
      <div className="flex border-b border-[#e9edef] dark:border-[#222d34] text-sm font-medium">
        <button
          onClick={() => setActiveTab('media')}
          className={`flex-1 py-3 text-center cursor-pointer border-b-2 transition-colors ${
            activeTab === 'media'
              ? 'border-[#00a884] text-[#00a884]'
              : 'border-transparent text-[#667781] dark:text-[#8696a0] hover:text-[#111b21] dark:hover:text-[#e9edef]'
          }`}
        >
          Media
        </button>
        <button
          onClick={() => setActiveTab('docs')}
          className={`flex-1 py-3 text-center cursor-pointer border-b-2 transition-colors ${
            activeTab === 'docs'
              ? 'border-[#00a884] text-[#00a884]'
              : 'border-transparent text-[#667781] dark:text-[#8696a0] hover:text-[#111b21] dark:hover:text-[#e9edef]'
          }`}
        >
          Docs
        </button>
        <button
          onClick={() => setActiveTab('links')}
          className={`flex-1 py-3 text-center cursor-pointer border-b-2 transition-colors ${
            activeTab === 'links'
              ? 'border-[#00a884] text-[#00a884]'
              : 'border-transparent text-[#667781] dark:text-[#8696a0] hover:text-[#111b21] dark:hover:text-[#e9edef]'
          }`}
        >
          Links
        </button>
      </div>

      {/* Search Bar */}
      <div className="p-3 shrink-0">
        <div className="flex items-center bg-[#f0f2f5] dark:bg-[#202c33] rounded-lg px-3 py-1.5 border border-transparent focus-within:border-[#00a884]">
          <Search className="w-4 h-4 text-[#8696a0] mr-3" />
          <input
            type="text"
            placeholder="Search"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="bg-transparent flex-1 text-[#111b21] dark:text-[#e9edef] placeholder-[#8696a0] text-sm outline-none"
          />
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto px-4 py-2">
        {activeTab === 'media' && (
          <div className="space-y-4">
            <h4 className="text-xs font-semibold text-[#8696a0] uppercase">Recent Media</h4>
            <div className="grid grid-cols-2 gap-2">
              {sampleMediaItems.map(item => (
                <div
                  key={item.id}
                  className="relative group aspect-square rounded-lg overflow-hidden bg-[#202c33] border border-[#222d34] cursor-pointer"
                >
                  <img
                    src={item.mediaUrl}
                    alt={item.senderName}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-2">
                    <span className="text-[11px] font-semibold text-white truncate">{item.senderName}</span>
                    <span className="text-[10px] text-white/70">{item.timestamp}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'docs' && (
          <div className="space-y-2">
            <h4 className="text-xs font-semibold text-[#8696a0] uppercase mb-2">Documents</h4>
            {sampleDocs.map(doc => (
              <div
                key={doc.id}
                className="flex items-center justify-between p-3 rounded-lg bg-[#f0f2f5] dark:bg-[#202c33] hover:bg-[#e9edef] dark:hover:bg-[#2a3942] transition-colors cursor-pointer border border-[#e9edef] dark:border-[#222d34]"
              >
                <div className="flex items-center space-x-3 min-w-0">
                  <div className="p-2 bg-red-500/20 text-red-500 rounded-md shrink-0">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <h5 className="text-sm font-medium text-[#111b21] dark:text-[#e9edef] truncate">{doc.title}</h5>
                    <p className="text-xs text-[#667781] dark:text-[#8696a0] truncate">{doc.caption}</p>
                    <p className="text-[10px] text-[#00a884]">{doc.senderName} • {doc.size}</p>
                  </div>
                </div>
                <Download className="w-4 h-4 text-[#8696a0] hover:text-[#00a884] shrink-0 ml-2" />
              </div>
            ))}
          </div>
        )}

        {activeTab === 'links' && (
          <div className="space-y-2">
            <h4 className="text-xs font-semibold text-[#8696a0] uppercase mb-2">Shared Links</h4>
            {sampleLinks.map(link => (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between p-3 rounded-lg bg-[#f0f2f5] dark:bg-[#202c33] hover:bg-[#e9edef] dark:hover:bg-[#2a3942] transition-colors cursor-pointer border border-[#e9edef] dark:border-[#222d34] group"
              >
                <div className="flex items-center space-x-3 min-w-0">
                  <div className="p-2 bg-blue-500/20 text-blue-500 rounded-md shrink-0">
                    <LinkIcon className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <h5 className="text-sm font-medium text-[#111b21] dark:text-[#e9edef] truncate group-hover:text-[#00a884]">
                      {link.title}
                    </h5>
                    <p className="text-xs text-[#667781] dark:text-[#8696a0] truncate">{link.domain}</p>
                    <p className="text-[10px] text-[#8696a0]">{link.senderName} • {link.timestamp}</p>
                  </div>
                </div>
                <ExternalLink className="w-4 h-4 text-[#8696a0] group-hover:text-[#00a884] shrink-0 ml-2" />
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
