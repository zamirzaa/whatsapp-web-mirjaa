import type { Contact, Chat, Message, UserProfile, UserStatus, ChannelItem } from '../types/whatsapp';

export const CURRENT_USER: UserProfile = {
  id: 'usr_mirza',
  name: 'Mirza',
  about: 'Available for chat & collaboration 🚀',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80',
  phone: '+62 812-3456-7890',
  username: 'mirza_id',
  thought: 'WhatsApp Web Clone with Groq AI ⚡',
};

export const INITIAL_CONTACTS: Contact[] = [
  // Active contacts
  {
    id: 'usr_gemini',
    name: 'Groq AI Assistant',
    phoneNumber: '+1 800-436-464',
    avatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&auto=format&fit=crop&q=80',
    about: 'Powered by Groq openai/gpt-oss-120b 🤖',
    isOnline: true,
  },
  {
    id: 'usr_sarah',
    name: 'Sarah Jenkins',
    phoneNumber: '+62 811-2233-4455',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80',
    about: 'UI/UX Designer & Design Systems 🎨',
    isOnline: true,
  },
  {
    id: 'usr_alex',
    name: 'Alex Rivera',
    phoneNumber: '+62 812-9876-5432',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    about: 'Full-Stack Lead & Cloud Architect ⚡',
    isOnline: true,
  },
  {
    id: 'usr_david',
    name: 'David Kim',
    phoneNumber: '+62 813-5566-7788',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
    about: 'Mobile Dev & Coffee lover ☕',
    isOnline: false,
    lastSeen: 'Today at 07:45',
  },
  {
    id: 'conv_team_group',
    name: 'Core Engineering & Design',
    phoneNumber: '',
    avatar: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=200&auto=format&fit=crop&q=80',
    about: 'Grup Kolaborasi WhatsApp Web Clone',
    isOnline: true,
    isGroup: true,
    groupMembers: ['Sarah Jenkins', 'Alex Rivera', 'David Kim', 'Mirza'],
  },

  // Archived contact
  {
    id: 'usr_elena',
    name: 'Elena Rostova',
    phoneNumber: '+62 814-8899-0011',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=80',
    about: 'Quality & Test Automation Specialist 🧪',
    isOnline: true,
    isArchived: true,
  },
];

export const INITIAL_MESSAGES: { [chatId: string]: Message[] } = {
  conv_gemini: [
    {
      id: 'msg_gemini_1',
      chatId: 'conv_gemini',
      senderId: 'usr_gemini',
      text: 'Halo Mirza! Saya Groq AI Assistant. Semua chat di web ini sekarang terhubung ke AI langsung. Tanya saya apa saja! ✨',
      type: 'text',
      timestamp: '08:12 AM',
      timestampRaw: Date.now() - 1200000,
      status: 'read',
      isOutgoing: false,
    },
  ],
  conv_sarah: [
    {
      id: 'msg_sarah_1',
      chatId: 'conv_sarah',
      senderId: 'usr_sarah',
      text: 'Hai Mirza! Desain UI WhatsApp Web yang kamu bangun ini keren banget, detailnya rapi! 👍',
      type: 'text',
      timestamp: '08:15 AM',
      timestampRaw: Date.now() - 600000,
      status: 'read',
      isOutgoing: false,
    },
  ],
  conv_alex: [
    {
      id: 'msg_alex_1',
      chatId: 'conv_alex',
      senderId: 'usr_alex',
      text: 'Bro, backend Express + Socket.IO + SQLite sudah jalan stabil di port 3001. Siap deploy!',
      type: 'text',
      timestamp: '08:20 AM',
      timestampRaw: Date.now() - 300000,
      status: 'read',
      isOutgoing: false,
    },
  ],
  conv_team_group: [
    {
      id: 'msg_grp_1',
      chatId: 'conv_team_group',
      senderId: 'usr_mirza',
      text: 'Selamat datang di tim! Semua fitur realtime, media upload, dan integrasi AI sudah aktif.',
      type: 'text',
      timestamp: 'Yesterday',
      timestampRaw: Date.now() - 86000000,
      status: 'read',
      isOutgoing: true,
    },
  ],
  conv_elena: [
    {
      id: 'msg_elena_1',
      chatId: 'conv_elena',
      senderId: 'usr_elena',
      text: 'Test report sudah selesai diarsipkan ya Mirza. Silakan unarchive kapan saja!',
      type: 'text',
      timestamp: '07:30 AM',
      timestampRaw: Date.now() - 7200000,
      status: 'read',
      isOutgoing: false,
    },
  ],
};

export const INITIAL_CHATS: Chat[] = [
  {
    id: 'conv_gemini',
    contactId: 'usr_gemini',
    unreadCount: 0,
    isPinned: true,
    lastMessage: INITIAL_MESSAGES.conv_gemini[0],
  },
  {
    id: 'conv_sarah',
    contactId: 'usr_sarah',
    unreadCount: 1,
    isPinned: false,
    lastMessage: INITIAL_MESSAGES.conv_sarah[0],
  },
  {
    id: 'conv_alex',
    contactId: 'usr_alex',
    unreadCount: 0,
    isPinned: false,
    lastMessage: INITIAL_MESSAGES.conv_alex[0],
  },
  {
    id: 'conv_team_group',
    contactId: 'conv_team_group',
    unreadCount: 0,
    isPinned: false,
    lastMessage: INITIAL_MESSAGES.conv_team_group[0],
  },
  // Archived chat
  {
    id: 'conv_elena',
    contactId: 'usr_elena',
    unreadCount: 0,
    isArchived: true,
    lastMessage: INITIAL_MESSAGES.conv_elena[0],
  },
];

export const INITIAL_CHANNELS: ChannelItem[] = [
  {
    id: 'ch_wa',
    name: 'WhatsApp Official',
    avatar: 'https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg',
    followers: '12.5M followers',
    isVerified: true,
    isFollowing: true,
    description: 'Berita dan pembaruan resmi fitur WhatsApp Web Clone.',
  },
  {
    id: 'ch_tech',
    name: 'Tech & AI Insights',
    avatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80',
    followers: '2.4M followers',
    isFollowing: false,
    description: 'Update seputar perkembangan artificial intelligence dan teknologi modern.',
  },
  {
    id: 'ch_design',
    name: 'UI/UX Designers Hub',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    followers: '850K followers',
    isFollowing: false,
    description: 'Komunitas desainer UI/UX global.',
  },
];

export const INITIAL_STATUSES: UserStatus[] = [
  {
    userId: 'usr_sarah',
    userName: 'Sarah Jenkins',
    userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80',
    allSeen: false,
    items: [
      {
        id: 'st_sarah_1',
        userId: 'usr_sarah',
        type: 'image',
        mediaUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80',
        caption: 'Desain WhatsApp Web Clone sudah rampung! ✨',
        timestamp: 'Today at 07:30',
      },
    ],
  },
  {
    userId: 'usr_alex',
    userName: 'Alex Rivera',
    userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    allSeen: false,
    items: [
      {
        id: 'st_alex_1',
        userId: 'usr_alex',
        type: 'text',
        caption: 'Ngoding backend realtime seru banget hari ini! 💻🔥',
        backgroundColor: '#008069',
        timestamp: 'Today at 06:45',
        mediaUrl: 'https://via.placeholder.com/1',
      },
    ],
  },
];
