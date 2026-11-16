import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import type {
  Chat,
  Contact,
  Message,
  UserProfile,
  UserStatus,
  RightDrawer,
  CallState,
  MessageType,
  NavTab,
  SubView,
  ChannelItem,
} from '../types/whatsapp';
import {
  CURRENT_USER,
  INITIAL_CHATS,
  INITIAL_CONTACTS,
  INITIAL_MESSAGES,
  INITIAL_STATUSES,
  INITIAL_CHANNELS,
} from '../mock/initialData';
import { sounds } from '../utils/audio';

interface WhatsAppContextType {
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;

  theme: 'dark' | 'light';
  toggleTheme: () => void;
  setThemeMode: (mode: 'dark' | 'light') => void;

  currentUser: UserProfile;
  updateCurrentUser: (profile: Partial<UserProfile>) => void;
  setUserThought: (thought: string) => void;

  activeNavTab: NavTab;
  setActiveNavTab: (tab: NavTab) => void;

  subView: SubView;
  setSubView: (view: SubView) => void;

  activeFilter: 'all' | 'unread' | 'favorites' | 'groups';
  setActiveFilter: (filter: 'all' | 'unread' | 'favorites' | 'groups') => void;

  contacts: Contact[];
  chats: Chat[];
  activeChatId: string | null;
  setActiveChatId: (id: string | null) => void;
  activeContact: Contact | undefined;
  activeMessages: Message[];

  sendMessage: (payload: {
    text?: string;
    type?: MessageType;
    mediaUrl?: string;
    fileName?: string;
    fileSize?: string;
    audioDuration?: number;
    poll?: {
      question: string;
      options: { id: string; text: string; votes: string[] }[];
      allowMultiple: boolean;
    };
    replyTo?: { id: string; senderName: string; text: string };
  }) => void;

  toggleReaction: (messageId: string, emoji: string) => void;
  deleteMessage: (messageId: string) => void;
  toggleStarMessage: (messageId: string) => void;
  votePoll: (messageId: string, optionId: string) => void;

  replyingMessage: Message | null;
  setReplyingMessage: (msg: Message | null) => void;

  activeRightDrawer: RightDrawer;
  setActiveRightDrawer: (drawer: RightDrawer) => void;

  searchQuery: string;
  setSearchQuery: (query: string) => void;

  userStatuses: UserStatus[];
  viewingStatus: UserStatus | null;
  setViewingStatus: (status: UserStatus | null) => void;
  markStatusSeen: (userId: string) => void;
  addNewStatus: (caption: string, mediaUrl?: string, bgColor?: string) => void;

  channels: ChannelItem[];
  activeChannel: ChannelItem | null;
  setActiveChannel: (channel: ChannelItem | null) => void;
  toggleFollowChannel: (id: string) => void;
  createChannel: (name: string, description: string, avatar?: string) => void;

  callState: CallState;
  startCall: (contact: Contact, type: 'audio' | 'video') => void;
  endCall: () => void;
  toggleMuteCall: () => void;
  toggleVideoCall: () => void;

  isTyping: boolean;

  // Multi-select chats
  selectedChatIds: string[];
  toggleSelectChat: (id: string) => void;
  clearSelectedChats: () => void;
  archiveSelectedChats: () => void;
  deleteSelectedChats: () => void;
  muteSelectedChats: () => void;
  markAllAsRead: () => void;

  // New Group creation
  selectedGroupMembers: string[];
  toggleGroupMember: (contactId: string) => void;
  clearGroupMembers: () => void;
  createGroup: (name: string, icon?: string) => void;

  // New Contact creation
  addNewContact: (firstName: string, lastName: string, phone: string, username?: string) => void;

  // App Lock
  isAppLocked: boolean;
  setIsAppLocked: (locked: boolean) => void;
  appLockEnabled: boolean;
  setAppLockEnabled: (enabled: boolean) => void;

  // Notification Banner
  showNotificationBanner: boolean;
  setShowNotificationBanner: (show: boolean) => void;

  // Thought Modal
  isThoughtModalOpen: boolean;
  setIsThoughtModalOpen: (open: boolean) => void;

  // New Status Modal
  isNewStatusModalOpen: boolean;
  setIsNewStatusModalOpen: (open: boolean) => void;

  // Meta AI
  askMetaAI: () => void;
}

const WhatsAppContext = createContext<WhatsAppContextType | undefined>(undefined);

export const WhatsAppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('wa_auth') === 'true';
  });

  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    return (localStorage.getItem('wa_theme') as 'dark' | 'light') || 'dark';
  });

  const [currentUser, setCurrentUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('wa_user');
    return saved
      ? JSON.parse(saved)
      : {
          ...CURRENT_USER,
          thought: 'Share a thought',
        };
  });

  const [activeNavTab, setActiveNavTab] = useState<NavTab>('chats');
  const [subView, setSubView] = useState<SubView>('none');
  const [activeFilter, setActiveFilter] = useState<'all' | 'unread' | 'favorites' | 'groups'>('all');

  const [contacts, setContacts] = useState<Contact[]>(INITIAL_CONTACTS);
  const [chats, setChats] = useState<Chat[]>(INITIAL_CHATS);
  const [messages, setMessages] = useState<{ [chatId: string]: Message[] }>(INITIAL_MESSAGES);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);

  const [replyingMessage, setReplyingMessage] = useState<Message | null>(null);
  const [activeRightDrawer, setActiveRightDrawer] = useState<RightDrawer>('none');
  const [searchQuery, setSearchQuery] = useState('');

  const [userStatuses, setUserStatuses] = useState<UserStatus[]>(INITIAL_STATUSES);
  const [viewingStatus, setViewingStatus] = useState<UserStatus | null>(null);
  const [channels, setChannels] = useState<ChannelItem[]>(INITIAL_CHANNELS);
  const [activeChannel, setActiveChannel] = useState<ChannelItem | null>(null);

  const [selectedChatIds, setSelectedChatIds] = useState<string[]>([]);
  const [selectedGroupMembers, setSelectedGroupMembers] = useState<string[]>([]);

  const [isAppLocked, setIsAppLocked] = useState<boolean>(false);
  const [appLockEnabled, setAppLockEnabled] = useState<boolean>(false);
  const [showNotificationBanner, setShowNotificationBanner] = useState<boolean>(true);
  const [isThoughtModalOpen, setIsThoughtModalOpen] = useState(false);
  const [isNewStatusModalOpen, setIsNewStatusModalOpen] = useState(false);

  const [isTyping, setIsTyping] = useState<boolean>(false);

  const [callState, setCallState] = useState<CallState>({
    isActive: false,
    type: 'audio',
    status: 'ringing',
    durationSeconds: 0,
    isMuted: false,
    isVideoOff: false,
  });

  useEffect(() => {
    localStorage.setItem('wa_theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  const setThemeMode = (mode: 'dark' | 'light') => {
    setTheme(mode);
  };

  const login = () => {
    setIsAuthenticated(true);
    localStorage.setItem('wa_auth', 'true');
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('wa_auth');
    setActiveChatId(null);
  };

  const updateCurrentUser = (profile: Partial<UserProfile>) => {
    setCurrentUser(prev => {
      const updated = { ...prev, ...profile };
      localStorage.setItem('wa_user', JSON.stringify(updated));
      return updated;
    });
  };

  const setUserThought = (thought: string) => {
    updateCurrentUser({ thought });
  };

  const activeContact = useMemo(() => {
    if (!activeChatId) return undefined;
    const chat = chats.find(c => c.id === activeChatId);
    if (!chat) return undefined;
    return contacts.find(c => c.id === chat.contactId);
  }, [activeChatId, chats, contacts]);

  const activeMessages = useMemo(() => {
    if (!activeChatId) return [];
    return messages[activeChatId] || [];
  }, [activeChatId, messages]);

  useEffect(() => {
    if (!activeChatId) return;
    setChats(prev =>
      prev.map(c => (c.id === activeChatId ? { ...c, unreadCount: 0 } : c))
    );
  }, [activeChatId]);

  useEffect(() => {
    let interval: number;
    if (callState.isActive && callState.status === 'connected') {
      interval = window.setInterval(() => {
        setCallState(prev => ({
          ...prev,
          durationSeconds: prev.durationSeconds + 1,
        }));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [callState.isActive, callState.status]);

  const startCall = (contact: Contact, type: 'audio' | 'video') => {
    sounds.startRingtone();
    setCallState({
      isActive: true,
      contact,
      type,
      status: 'ringing',
      durationSeconds: 0,
      isMuted: false,
      isVideoOff: false,
    });

    setTimeout(() => {
      sounds.stopRingtone();
      setCallState(prev => {
        if (!prev.isActive) return prev;
        return { ...prev, status: 'connected' };
      });
    }, 3500);
  };

  const endCall = () => {
    sounds.stopRingtone();
    setCallState(prev => ({
      ...prev,
      status: 'ended',
    }));
    setTimeout(() => {
      setCallState({
        isActive: false,
        type: 'audio',
        status: 'ringing',
        durationSeconds: 0,
        isMuted: false,
        isVideoOff: false,
      });
    }, 500);
  };

  const toggleMuteCall = () => {
    setCallState(prev => ({ ...prev, isMuted: !prev.isMuted }));
  };

  const toggleVideoCall = () => {
    setCallState(prev => ({ ...prev, isVideoOff: !prev.isVideoOff }));
  };

  const triggerAutoReply = useCallback((chatId: string, contact: Contact, userText: string) => {
    setIsTyping(true);
    const delay = Math.min(Math.max(userText.length * 40, 1500), 2800);

    setTimeout(() => {
      setIsTyping(false);
      let replyText = `Siap Mirza! Pesan diterima 👍`;
      if (contact.id === 'c_meta_ai') {
        const aiReplies = [
          `Halo Mirza! Sebagai Meta AI, saya siap membantu kamu menulis pesan, menerjemahkan bahasa, atau menjelaskan konsep teknis apapun! 🤖✨`,
          `Pertanyaan bagus! Untuk mengoptimalkan WhatsApp Web ini, semua komponen sudah menggunakan arsitektur modular dengan animasi halus dan audio sintesis.`,
          `Ada yang bisa saya bantu lagi, Mirza? Saya bisa membantu membuat resep, ide konten, atau ringkasan materi!`,
        ];
        replyText = aiReplies[Math.floor(Math.random() * aiReplies.length)];
      } else {
        const responses = [
          `Siap Mirza! Pesan diterima 👍`,
          `Oke, noted ya! Nanti langsung ku follow-up.`,
          `Wah keren banget fiturnya, mirip WhatsApp Web asli! 🔥`,
          `Halo Mirza! Lagi santai nih, ada info apa lagi?`,
          `Mantap, lancar jaya ya project-nya!`,
          `Wkwkwk iya bener banget! 😆`,
        ];
        replyText = responses[Math.floor(Math.random() * responses.length)];
      }

      const replyMsg: Message = {
        id: `reply_${Date.now()}`,
        chatId,
        senderId: contact.id,
        text: replyText,
        type: 'text',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        timestampRaw: Date.now(),
        status: 'read',
        isOutgoing: false,
      };

      setMessages(prev => {
        const list = prev[chatId] || [];
        return { ...prev, [chatId]: [...list, replyMsg] };
      });

      setChats(prev =>
        prev.map(c => {
          if (c.id === chatId) {
            return {
              ...c,
              lastMessage: replyMsg,
              unreadCount: activeChatId === chatId ? 0 : c.unreadCount + 1,
            };
          }
          return c;
        })
      );

      sounds.playMessageReceived();
    }, delay);
  }, [activeChatId]);

  const sendMessage = useCallback((payload: {
    text?: string;
    type?: MessageType;
    mediaUrl?: string;
    fileName?: string;
    fileSize?: string;
    audioDuration?: number;
    poll?: {
      question: string;
      options: { id: string; text: string; votes: string[] }[];
      allowMultiple: boolean;
    };
    replyTo?: { id: string; senderName: string; text: string };
  }) => {
    if (!activeChatId) return;

    const newMsg: Message = {
      id: `msg_${Date.now()}`,
      chatId: activeChatId,
      senderId: 'me',
      text: payload.text,
      type: payload.type || 'text',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      timestampRaw: Date.now(),
      status: 'sent',
      isOutgoing: true,
      mediaUrl: payload.mediaUrl,
      fileName: payload.fileName,
      fileSize: payload.fileSize,
      audioDuration: payload.audioDuration,
      poll: payload.poll,
      replyTo: payload.replyTo || (replyingMessage ? {
        id: replyingMessage.id,
        senderName: replyingMessage.isOutgoing ? 'You' : (activeContact?.name || 'Contact'),
        text: replyingMessage.text || (replyingMessage.type === 'image' ? '📷 Photo' : 'Voice message'),
      } : undefined),
    };

    sounds.playMessageSent();
    setReplyingMessage(null);

    setMessages(prev => {
      const list = prev[activeChatId] || [];
      return { ...prev, [activeChatId]: [...list, newMsg] };
    });

    setChats(prev => {
      const chatIndex = prev.findIndex(c => c.id === activeChatId);
      if (chatIndex === -1) return prev;
      const updatedChat = { ...prev[chatIndex], lastMessage: newMsg };
      const rest = prev.filter(c => c.id !== activeChatId);
      return [updatedChat, ...rest];
    });

    setTimeout(() => {
      setMessages(prev => {
        const list = prev[activeChatId] || [];
        return {
          ...prev,
          [activeChatId]: list.map(m => (m.id === newMsg.id ? { ...m, status: 'delivered' } : m)),
        };
      });
    }, 800);

    setTimeout(() => {
      setMessages(prev => {
        const list = prev[activeChatId] || [];
        return {
          ...prev,
          [activeChatId]: list.map(m => (m.id === newMsg.id ? { ...m, status: 'read' } : m)),
        };
      });
    }, 1800);

    if (activeContact && !activeContact.isGroup && payload.text) {
      triggerAutoReply(activeChatId, activeContact, payload.text);
    }
  }, [activeChatId, activeContact, replyingMessage, triggerAutoReply]);

  const toggleReaction = (messageId: string, emoji: string) => {
    if (!activeChatId) return;
    setMessages(prev => {
      const list = prev[activeChatId] || [];
      return {
        ...prev,
        [activeChatId]: list.map(m => {
          if (m.id !== messageId) return m;
          const reactions = { ...(m.reactions || {}) };
          if (reactions[emoji] && reactions[emoji].byMe) {
            delete reactions[emoji];
          } else {
            reactions[emoji] = {
              emoji,
              count: (reactions[emoji]?.count || 0) + 1,
              byMe: true,
              users: [...(reactions[emoji]?.users || []), 'You'],
            };
          }
          return { ...m, reactions };
        }),
      };
    });
  };

  const deleteMessage = (messageId: string) => {
    if (!activeChatId) return;
    setMessages(prev => {
      const list = prev[activeChatId] || [];
      return {
        ...prev,
        [activeChatId]: list.filter(m => m.id !== messageId),
      };
    });
  };

  const toggleStarMessage = (messageId: string) => {
    if (!activeChatId) return;
    setMessages(prev => {
      const list = prev[activeChatId] || [];
      return {
        ...prev,
        [activeChatId]: list.map(m => (m.id === messageId ? { ...m, isStarred: !m.isStarred } : m)),
      };
    });
  };

  const votePoll = (messageId: string, optionId: string) => {
    if (!activeChatId) return;
    setMessages(prev => {
      const list = prev[activeChatId] || [];
      return {
        ...prev,
        [activeChatId]: list.map(m => {
          if (m.id !== messageId || !m.poll) return m;
          const newOptions = m.poll.options.map(opt => {
            const hasVoted = opt.votes.includes('me');
            if (opt.id === optionId) {
              return {
                ...opt,
                votes: hasVoted ? opt.votes.filter(v => v !== 'me') : [...opt.votes, 'me'],
              };
            }
            if (!m.poll?.allowMultiple && hasVoted) {
              return { ...opt, votes: opt.votes.filter(v => v !== 'me') };
            }
            return opt;
          });
          return {
            ...m,
            poll: { ...m.poll, options: newOptions },
          };
        }),
      };
    });
  };

  const markStatusSeen = (userId: string) => {
    setUserStatuses(prev =>
      prev.map(s => (s.userId === userId ? { ...s, allSeen: true } : s))
    );
  };

  const addNewStatus = (caption: string, mediaUrl?: string, bgColor?: string) => {
    const newStatusItem = {
      id: `st_${Date.now()}`,
      userId: 'me',
      type: (mediaUrl ? 'image' : 'text') as 'image' | 'text',
      mediaUrl: mediaUrl || '',
      caption,
      backgroundColor: bgColor || '#005c4b',
      timestamp: 'Just now',
    };

    setUserStatuses(prev => {
      const myIdx = prev.findIndex(s => s.userId === 'me');
      if (myIdx >= 0) {
        const updated = [...prev];
        updated[myIdx] = {
          ...updated[myIdx],
          items: [newStatusItem, ...updated[myIdx].items],
        };
        return updated;
      } else {
        return [
          {
            userId: 'me',
            userName: currentUser.name,
            userAvatar: currentUser.avatar,
            allSeen: true,
            items: [newStatusItem],
          },
          ...prev,
        ];
      }
    });
  };

  const toggleFollowChannel = (id: string) => {
    setChannels(prev =>
      prev.map(ch => (ch.id === id ? { ...ch, isFollowing: !ch.isFollowing } : ch))
    );
  };

  const createChannel = (name: string, description: string, avatar?: string) => {
    const newCh: ChannelItem = {
      id: `ch_${Date.now()}`,
      name,
      description,
      avatar: avatar || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80',
      followers: '1 follower',
      isFollowing: true,
    };
    setChannels(prev => [newCh, ...prev]);
  };

  const toggleSelectChat = (id: string) => {
    setSelectedChatIds(prev =>
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );
  };

  const clearSelectedChats = () => {
    setSelectedChatIds([]);
    setSubView('none');
  };

  const archiveSelectedChats = () => {
    setChats(prev =>
      prev.map(c => (selectedChatIds.includes(c.id) ? { ...c, isArchived: true } : c))
    );
    clearSelectedChats();
  };

  const deleteSelectedChats = () => {
    setChats(prev => prev.filter(c => !selectedChatIds.includes(c.id)));
    if (activeChatId && selectedChatIds.includes(activeChatId)) {
      setActiveChatId(null);
    }
    clearSelectedChats();
  };

  const muteSelectedChats = () => {
    setChats(prev =>
      prev.map(c => (selectedChatIds.includes(c.id) ? { ...c, isMuted: !c.isMuted } : c))
    );
    clearSelectedChats();
  };

  const markAllAsRead = () => {
    setChats(prev => prev.map(c => ({ ...c, unreadCount: 0 })));
  };

  // Group members selector
  const toggleGroupMember = (contactId: string) => {
    setSelectedGroupMembers(prev =>
      prev.includes(contactId) ? prev.filter(id => id !== contactId) : [...prev, contactId]
    );
  };

  const clearGroupMembers = () => {
    setSelectedGroupMembers([]);
  };

  const createGroup = (name: string, icon?: string) => {
    const groupId = `group_${Date.now()}`;
    const newGroupContact: Contact = {
      id: groupId,
      name,
      phoneNumber: '',
      avatar: icon || 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=150&auto=format&fit=crop&q=80',
      about: 'WhatsApp Group',
      isOnline: true,
      isGroup: true,
      groupMembers: ['You', ...selectedGroupMembers.map(id => contacts.find(c => c.id === id)?.name || id)],
    };

    const newGroupChat: Chat = {
      id: `chat_${groupId}`,
      contactId: groupId,
      unreadCount: 0,
      lastMessage: {
        id: `m_init_${Date.now()}`,
        chatId: `chat_${groupId}`,
        senderId: 'me',
        text: 'You created this group',
        type: 'text',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        timestampRaw: Date.now(),
        status: 'read',
        isOutgoing: true,
      },
    };

    setContacts(prev => [newGroupContact, ...prev]);
    setChats(prev => [newGroupChat, ...prev]);
    setMessages(prev => ({
      ...prev,
      [`chat_${groupId}`]: [newGroupChat.lastMessage!],
    }));

    clearGroupMembers();
    setSubView('none');
    setActiveChatId(`chat_${groupId}`);
  };

  // Add new single contact
  const addNewContact = (firstName: string, lastName: string, phone: string, username?: string) => {
    const fullName = `${firstName} ${lastName}`.trim();
    const contactId = `c_${Date.now()}`;
    const newContact: Contact = {
      id: contactId,
      name: fullName,
      phoneNumber: phone,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      about: username ? `@${username}` : 'Hey there! I am using WhatsApp.',
      isOnline: true,
    };

    const chatId = `chat_${contactId}`;
    const newChat: Chat = {
      id: chatId,
      contactId: contactId,
      unreadCount: 0,
      lastMessage: {
        id: `m_greet_${Date.now()}`,
        chatId,
        senderId: 'me',
        text: 'Halo!',
        type: 'text',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        timestampRaw: Date.now(),
        status: 'sent',
        isOutgoing: true,
      },
    };

    setContacts(prev => [newContact, ...prev]);
    setChats(prev => [newChat, ...prev]);
    setMessages(prev => ({
      ...prev,
      [chatId]: [newChat.lastMessage!],
    }));

    setSubView('none');
    setActiveChatId(chatId);
  };

  const askMetaAI = () => {
    let metaContact = contacts.find(c => c.id === 'c_meta_ai');
    if (!metaContact) {
      metaContact = {
        id: 'c_meta_ai',
        name: 'Meta AI',
        phoneNumber: '',
        avatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80',
        about: 'Ask me anything',
        isOnline: true,
      };
      setContacts(prev => [metaContact!, ...prev]);
    }
    const metaChatId = 'chat_meta_ai';
    if (!chats.find(c => c.id === metaChatId)) {
      setChats(prev => [
        {
          id: metaChatId,
          contactId: 'c_meta_ai',
          unreadCount: 0,
          lastMessage: {
            id: 'm_meta_intro',
            chatId: metaChatId,
            senderId: 'c_meta_ai',
            text: 'Halo Mirza! Saya Meta AI. Ada yang bisa saya bantu hari ini? ✨',
            type: 'text',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            timestampRaw: Date.now(),
            status: 'read',
            isOutgoing: false,
          },
        },
        ...prev,
      ]);
    }
    setActiveNavTab('chats');
    setSubView('none');
    setActiveChatId(metaChatId);
  };

  return (
    <WhatsAppContext.Provider
      value={{
        isAuthenticated,
        login,
        logout,
        theme,
        toggleTheme,
        setThemeMode,
        currentUser,
        updateCurrentUser,
        setUserThought,
        activeNavTab,
        setActiveNavTab,
        subView,
        setSubView,
        activeFilter,
        setActiveFilter,
        contacts,
        chats,
        activeChatId,
        setActiveChatId,
        activeContact,
        activeMessages,
        sendMessage,
        toggleReaction,
        deleteMessage,
        toggleStarMessage,
        votePoll,
        replyingMessage,
        setReplyingMessage,
        activeRightDrawer,
        setActiveRightDrawer,
        searchQuery,
        setSearchQuery,
        userStatuses,
        viewingStatus,
        setViewingStatus,
        markStatusSeen,
        addNewStatus,
        channels,
        activeChannel,
        setActiveChannel,
        toggleFollowChannel,
        createChannel,
        callState,
        startCall,
        endCall,
        toggleMuteCall,
        toggleVideoCall,
        isTyping,
        selectedChatIds,
        toggleSelectChat,
        clearSelectedChats,
        archiveSelectedChats,
        deleteSelectedChats,
        muteSelectedChats,
        markAllAsRead,
        selectedGroupMembers,
        toggleGroupMember,
        clearGroupMembers,
        createGroup,
        addNewContact,
        isAppLocked,
        setIsAppLocked,
        appLockEnabled,
        setAppLockEnabled,
        showNotificationBanner,
        setShowNotificationBanner,
        isThoughtModalOpen,
        setIsThoughtModalOpen,
        isNewStatusModalOpen,
        setIsNewStatusModalOpen,
        askMetaAI,
      }}
    >
      {children}
    </WhatsAppContext.Provider>
  );
};

export const useWhatsApp = () => {
  const context = useContext(WhatsAppContext);
  if (!context) {
    throw new Error('useWhatsApp must be used within a WhatsAppProvider');
  }
  return context;
};
