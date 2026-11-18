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
import { api, getAuthToken, setAuthToken, removeAuthToken } from '../services/api';
import { getSocket, initSocket, disconnectSocket } from '../services/socket';

interface WhatsAppContextType {
  isAuthenticated: boolean;
  login: (token?: string, userData?: any) => void;
  logout: () => void;

  theme: 'dark' | 'light';
  toggleTheme: () => void;
  setThemeMode: (mode: 'dark' | 'light') => void;

  chatWallpaper: string;
  setChatWallpaper: (wallpaper: string) => void;
  chatDoodlesEnabled: boolean;
  setChatDoodlesEnabled: (enabled: boolean) => void;

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
    isViewOnce?: boolean;
    poll?: {
      question: string;
      options: { id: string; text: string; votes: string[] }[];
      allowMultiple: boolean;
    };
    replyTo?: { id: string; senderName: string; text: string };
  }) => void;

  openViewOnceMessage: (messageId: string) => void;

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

  deleteStatus: (statusId: string) => void;
  // Multi-select chats
  selectedChatIds: string[];
  toggleSelectChat: (id: string) => void;
  clearSelectedChats: () => void;
  archiveSelectedChats: () => void;
  deleteSelectedChats: () => void;
  muteSelectedChats: () => void;
  markAllAsRead: () => void;

  // Single chat actions
  archiveChat: (chatId: string, isArchived: boolean) => void;
  pinChat: (chatId: string, isPinned: boolean) => void;
  muteChatSingle: (chatId: string, isMuted: boolean) => void;
  clearChatMessages: (chatId: string) => void;

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

  // Toast Notification
  activeToast: {
    id: string;
    senderName: string;
    senderAvatar: string;
    chatId: string;
    text: string;
    timestamp: string;
  } | null;
  dismissToast: () => void;

  // Meta AI
  askMetaAI: () => void;

  // Message Selection Mode (Screenshot 14)
  isSelectingMessages: boolean;
  setIsSelectingMessages: (val: boolean) => void;
  selectedMessageIds: string[];
  toggleSelectMessage: (id: string) => void;
  clearSelectedMessages: () => void;
  deleteSelectedMessages: () => void;
  starSelectedMessages: () => void;

  // Group Management & Actions
  updateGroupInfo: (chatId: string, updates: { name?: string; avatar?: string; description?: string }) => void;
  addMembersToGroup: (chatId: string, memberIds: string[]) => void;
  removeGroupMember: (chatId: string, memberId: string) => void;
  exitGroupAction: (chatId: string, deleteForMe?: boolean) => void;
  toggleFavoriteChat: (chatId: string) => void;
}

const WhatsAppContext = createContext<WhatsAppContextType | undefined>(undefined);

export const WhatsAppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return Boolean(getAuthToken()) || localStorage.getItem('wa_auth') === 'true';
  });

  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    return (localStorage.getItem('wa_theme') as 'dark' | 'light') || 'dark';
  });

  const [chatWallpaper, setChatWallpaper] = useState<string>(() => {
    return localStorage.getItem('wa_wallpaper') || '#0b141a';
  });

  const [chatDoodlesEnabled, setChatDoodlesEnabled] = useState<boolean>(() => {
    const val = localStorage.getItem('wa_doodles');
    return val !== null ? val === 'true' : true;
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

  // Message selection state (Screenshot 14)
  const [isSelectingMessages, setIsSelectingMessages] = useState<boolean>(false);
  const [selectedMessageIds, setSelectedMessageIds] = useState<string[]>([]);

  const [isAppLocked, setIsAppLocked] = useState<boolean>(false);
  const [appLockEnabled, setAppLockEnabled] = useState<boolean>(false);
  const [showNotificationBanner, setShowNotificationBanner] = useState<boolean>(true);
  const [isThoughtModalOpen, setIsThoughtModalOpen] = useState(false);
  const [isNewStatusModalOpen, setIsNewStatusModalOpen] = useState(false);
  const [activeToast, setActiveToast] = useState<{
    id: string;
    senderName: string;
    senderAvatar: string;
    chatId: string;
    text: string;
    timestamp: string;
  } | null>(null);

  const dismissToast = () => setActiveToast(null);

  const [isTyping, setIsTyping] = useState<boolean>(false);

  const [callState, setCallState] = useState<CallState>({
    isActive: false,
    type: 'audio',
    status: 'ringing',
    durationSeconds: 0,
    isMuted: false,
    isVideoOff: false,
  });

  // Apply theme to document element
  useEffect(() => {
    localStorage.setItem('wa_theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Load initial backend data upon authentication
  useEffect(() => {
    if (!isAuthenticated) return;

    // Connect WebSocket
    const socket = initSocket();

    // Fetch user profile from API
    api.getMe()
      .then(user => {
        if (user) {
          setCurrentUser({
            id: user.id,
            name: user.name,
            about: user.about,
            avatar: user.avatar,
            phone: user.phone,
            username: user.username,
            thought: user.thought || 'Share a thought',
          });
        }
      })
      .catch(() => {});

    // Fetch Chats from API
    api.getChats()
      .then(serverChats => {
        if (Array.isArray(serverChats) && serverChats.length > 0) {
          setChats(serverChats);
          // Sync group contacts from server chats
          setContacts(prevContacts => {
            const newGroupContacts = serverChats
              .filter(sc => sc.isGroup)
              .filter(sc => !prevContacts.some(pc => pc.id === sc.contactId || pc.id === sc.id))
              .map(sc => ({
                id: sc.contactId || sc.id,
                name: sc.name || 'Group',
                phoneNumber: '',
                avatar: sc.avatar || 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=150&auto=format&fit=crop&q=80',
                about: sc.about || 'WhatsApp Group',
                isOnline: true,
                isGroup: true,
                groupMembers: sc.groupMembers || ['You'],
              }));
            return [...newGroupContacts, ...prevContacts];
          });
        }
      })
      .catch(() => {});

    // Fetch Contacts from API
    api.getContacts()
      .then(serverContacts => {
        if (Array.isArray(serverContacts) && serverContacts.length > 0) {
          setContacts(serverContacts);
        }
      })
      .catch(() => {});

    // Fetch Statuses from API
    api.getStatuses()
      .then(serverStatuses => {
        if (Array.isArray(serverStatuses) && serverStatuses.length > 0) {
          setUserStatuses(serverStatuses);
        }
      })
      .catch(() => {});

    // Fetch Channels from API
    api.getChannels()
      .then(serverChannels => {
        if (Array.isArray(serverChannels) && serverChannels.length > 0) {
          setChannels(serverChannels);
        }
      })
      .catch(() => {});

    // WebSocket Listeners
    socket.on('message:new', (data: { chatId: string; message: any }) => {
      const incoming = data.message;
      // Skip own messages - already added optimistically to avoid duplication
      if (incoming.senderId === currentUser.id || incoming.senderId === 'me') return;

      setMessages(prev => {
        // When someone else replies, all our previous outgoing messages are read
        const list = (prev[data.chatId] || []).map(m =>
          m.isOutgoing ? { ...m, status: 'read' as const } : m
        );
        if (list.some(m => m.id === incoming.id)) return prev;
        return {
          ...prev,
          [data.chatId]: [...list, incoming],
        };
      });

      setChats(prev =>
        prev.map(c => {
          if (c.id === data.chatId) {
            return {
              ...c,
              lastMessage: incoming,
              unreadCount: activeChatId === data.chatId ? 0 : c.unreadCount + 1,
            };
          }
          return c;
        })
      );

      if (incoming.senderId !== 'me' && incoming.senderId !== currentUser.id) {
        sounds.playMessageReceived();
        if (activeChatId !== data.chatId) {
          const senderContact = contacts.find(c => c.id === incoming.senderId);
          setActiveToast({
            id: incoming.id || `toast_${Date.now()}`,
            senderName: incoming.senderName || senderContact?.name || 'WhatsApp Contact',
            senderAvatar: senderContact?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
            chatId: data.chatId,
            text: incoming.text || (incoming.type === 'image' ? '📷 Photo' : 'New message'),
            timestamp: incoming.timestamp || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          });
        }
      }
    });

    socket.on('messages:read', (data: { chatId: string }) => {
      setMessages(prev => {
        const list = prev[data.chatId] || [];
        return {
          ...prev,
          [data.chatId]: list.map(m => (m.isOutgoing ? { ...m, status: 'read' as const } : m)),
        };
      });
      setChats(prev =>
        prev.map(c => {
          if (c.id === data.chatId && c.lastMessage?.isOutgoing) {
            return {
              ...c,
              lastMessage: { ...c.lastMessage, status: 'read' as const },
            };
          }
          return c;
        })
      );
    });

    socket.on('message:view_once_opened', (data: { chatId: string; messageId: string }) => {
      setMessages(prev => {
        const list = prev[data.chatId] || [];
        return {
          ...prev,
          [data.chatId]: list.map(m =>
            m.id === data.messageId ? { ...m, isViewOnceOpened: true } : m
          ),
        };
      });
    });

    socket.on('message:deleted', (data: { chatId: string; messageId: string }) => {
      setMessages(prev => {
        const list = prev[data.chatId] || [];
        return {
          ...prev,
          [data.chatId]: list.map(m =>
            m.id === data.messageId ? { ...m, text: 'This message was deleted' } : m
          ),
        };
      });
    });

    socket.on('conversation:typing', (data: { chatId: string; isTyping: boolean }) => {
      if (activeChatId === data.chatId) {
        setIsTyping(data.isTyping);
      }
    });

    socket.on('user:online', (data: { userId: string }) => {
      setContacts(prev =>
        prev.map(c => (c.id === data.userId ? { ...c, isOnline: true } : c))
      );
    });

    socket.on('user:offline', (data: { userId: string; lastSeen: string }) => {
      setContacts(prev =>
        prev.map(c => (c.id === data.userId ? { ...c, isOnline: false, lastSeen: data.lastSeen } : c))
      );
    });

    socket.on('call:incoming', (data: any) => {
      sounds.startRingtone();
      setCallState({
        isActive: true,
        contact: {
          id: data.caller.id,
          name: data.caller.name,
          phoneNumber: '',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
          about: '',
          isOnline: true,
        },
        type: data.type || 'audio',
        status: 'ringing',
        durationSeconds: 0,
        isMuted: false,
        isVideoOff: false,
      });
    });

    return () => {
      disconnectSocket();
    };
  }, [isAuthenticated, activeChatId, currentUser.id]);

  // Load messages whenever activeChatId changes
  useEffect(() => {
    if (!activeChatId) return;

    // Load from backend
    api.getMessages(activeChatId)
      .then(serverMsgs => {
        if (Array.isArray(serverMsgs)) {
          setMessages(prev => ({
            ...prev,
            [activeChatId]: serverMsgs,
          }));
        }
      })
      .catch(() => {});

    api.markAsRead(activeChatId).catch(() => {});

    setChats(prev =>
      prev.map(c => (c.id === activeChatId ? { ...c, unreadCount: 0 } : c))
    );
  }, [activeChatId]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  const setThemeMode = (mode: 'dark' | 'light') => {
    setTheme(mode);
  };

  const handleSetWallpaper = (wp: string) => {
    setChatWallpaper(wp);
    localStorage.setItem('wa_wallpaper', wp);
  };

  const handleSetDoodles = (enabled: boolean) => {
    setChatDoodlesEnabled(enabled);
    localStorage.setItem('wa_doodles', String(enabled));
  };

  const login = (token?: string, userData?: any) => {
    if (token) {
      setAuthToken(token);
    }
    if (userData) {
      setCurrentUser(prev => ({
        ...prev,
        id: userData.id || prev.id,
        name: userData.displayName || userData.name || prev.name,
        phone: userData.phone || prev.phone,
        avatar: userData.avatarUrl || userData.avatar || prev.avatar,
        about: userData.about || prev.about,
      }));
    }
    setIsAuthenticated(true);
    localStorage.setItem('wa_auth', 'true');
  };

  const logout = () => {
    removeAuthToken();
    setIsAuthenticated(false);
    localStorage.removeItem('wa_auth');
    setActiveChatId(null);
    disconnectSocket();
  };

  const updateCurrentUser = (profile: Partial<UserProfile>) => {
    setCurrentUser(prev => {
      const updated = { ...prev, ...profile };
      localStorage.setItem('wa_user', JSON.stringify(updated));
      return updated;
    });
    api.updateProfile(profile).catch(() => {});
  };

  const setUserThought = (thought: string) => {
    updateCurrentUser({ thought });
  };

  const activeContact = useMemo(() => {
    if (!activeChatId) return undefined;
    const chat = chats.find(c => c.id === activeChatId);
    if (!chat) return undefined;
    const found = contacts.find(c => c.id === chat.contactId);
    if (found) return found;

    if ((chat as any).isGroup || (chat as any).name) {
      return {
        id: chat.contactId || chat.id,
        name: (chat as any).name || 'Group',
        phoneNumber: '',
        avatar: (chat as any).avatar || 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=150&auto=format&fit=crop&q=80',
        about: (chat as any).about || 'WhatsApp Group',
        isOnline: true,
        isGroup: (chat as any).isGroup ?? true,
        groupMembers: (chat as any).groupMembers || ['You'],
      } as Contact;
    }
    return undefined;
  }, [activeChatId, chats, contacts]);

  const activeMessages = useMemo(() => {
    if (!activeChatId) return [];
    return messages[activeChatId] || [];
  }, [activeChatId, messages]);

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

    const socket = getSocket();
    if (socket) {
      socket.emit('call:initiate', {
        recipientId: contact.id,
        type,
      });
    }

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

    const socket = getSocket();
    if (socket && callState.contact) {
      socket.emit('call:end', { recipientId: callState.contact.id });
    }

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

  const sendMessage = useCallback((payload: {
    text?: string;
    type?: MessageType;
    mediaUrl?: string;
    fileName?: string;
    fileSize?: string;
    audioDuration?: number;
    isViewOnce?: boolean;
    poll?: {
      question: string;
      options: { id: string; text: string; votes: string[] }[];
      allowMultiple: boolean;
    };
    replyTo?: { id: string; senderName: string; text: string };
  }) => {
    if (!activeChatId) return;

    const optimisticId = `msg_${Date.now()}`;
    const newMsg: Message = {
      id: optimisticId,
      chatId: activeChatId,
      senderId: 'me',
      text: payload.text,
      type: payload.type || 'text',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      timestampRaw: Date.now(),
      status: 'delivered',
      isOutgoing: true,
      mediaUrl: payload.mediaUrl,
      fileName: payload.fileName,
      fileSize: payload.fileSize,
      audioDuration: payload.audioDuration,
      isViewOnce: payload.isViewOnce,
      isViewOnceOpened: false,
      poll: payload.poll,
      replyTo: payload.replyTo || (replyingMessage ? {
        id: replyingMessage.id,
        senderName: replyingMessage.isOutgoing ? 'You' : (activeContact?.name || 'Contact'),
        text: replyingMessage.text || (replyingMessage.type === 'image' ? '📷 Photo' : 'Voice message'),
      } : undefined),
    };

    sounds.playMessageSent();
    setReplyingMessage(null);

    // Optimistic UI update
    setMessages(prev => {
      const list = prev[activeChatId] || [];
      return { ...prev, [activeChatId]: [...list, newMsg] };
    });

    setChats(prev => {
      const chatIndex = prev.findIndex(c => c.id === activeChatId);
      if (chatIndex === -1) return prev;
      const target = { ...prev[chatIndex], lastMessage: newMsg };
      const rest = prev.filter(c => c.id !== activeChatId);
      const combined = [target, ...rest];
      return combined.sort((a, b) => {
        if (a.isPinned && !b.isPinned) return -1;
        if (!a.isPinned && b.isPinned) return 1;
        return (b.lastMessage?.timestampRaw || 0) - (a.lastMessage?.timestampRaw || 0);
      });
    });

    // Send to backend API
    api.sendMessage({
      chatId: activeChatId,
      text: payload.text,
      type: payload.type,
      mediaUrl: payload.mediaUrl,
      fileName: payload.fileName,
      fileSize: payload.fileSize,
      audioDuration: payload.audioDuration,
      isViewOnce: payload.isViewOnce,
      replyToId: replyingMessage?.id,
      poll: payload.poll,
    })
      .then(savedMsg => {
        if (savedMsg?.id) {
          setMessages(prev => {
            const list = prev[activeChatId] || [];
            return {
              ...prev,
              [activeChatId]: list.map(m => (m.id === optimisticId ? { ...m, id: savedMsg.id, status: 'delivered' } : m)),
            };
          });

          setChats(prev =>
            prev.map(c => {
              if (c.id === activeChatId && c.lastMessage?.id === optimisticId) {
                return {
                  ...c,
                  lastMessage: { ...c.lastMessage, id: savedMsg.id, status: 'delivered' },
                };
              }
              return c;
            })
          );
        }
      })
      .catch(() => {});
  }, [activeChatId, replyingMessage]);

  const openViewOnceMessage = (messageId: string) => {
    if (!activeChatId) return;
    setMessages(prev => {
      const list = prev[activeChatId] || [];
      return {
        ...prev,
        [activeChatId]: list.map(m => (m.id === messageId ? { ...m, isViewOnceOpened: true } : m)),
      };
    });
    api.openViewOnce(messageId).catch(() => {});
  };

  const toggleReaction = (messageId: string, emoji: string) => {
    if (!activeChatId) return;

    // Optimistic
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

    api.toggleReaction(messageId, emoji).catch(() => {});
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
    api.deleteMessage(messageId).catch(() => {});
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
    api.toggleStar(messageId).catch(() => {});
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
    api.votePoll(messageId, optionId).catch(() => {});
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

    api.createStatus({
      type: mediaUrl ? 'image' : 'text',
      mediaUrl,
      caption,
      backgroundColor: bgColor || '#005c4b',
    }).catch(() => {});
  };

  const deleteStatus = (statusId: string) => {
    setUserStatuses(prev => {
      const myIdx = prev.findIndex(s => s.userId === 'me');
      if (myIdx === -1) return prev;
      const updatedItems = prev[myIdx].items.filter(item => item.id !== statusId);
      if (updatedItems.length === 0) {
        return prev.filter(s => s.userId !== 'me');
      }
      const updated = [...prev];
      updated[myIdx] = { ...updated[myIdx], items: updatedItems };
      return updated;
    });
  };

  const toggleFollowChannel = (id: string) => {
    setChannels(prev =>
      prev.map(ch => (ch.id === id ? { ...ch, isFollowing: !ch.isFollowing } : ch))
    );
    api.followChannel(id).catch(() => {});
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
    api.createChannel({ name, description, avatar }).catch(() => {});
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
    for (const id of selectedChatIds) {
      api.archiveChat(id, true).catch(() => {});
    }
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
    for (const id of selectedChatIds) {
      api.muteChat(id, true).catch(() => {});
    }
    clearSelectedChats();
  };

  const markAllAsRead = () => {
    setChats(prev => prev.map(c => ({ ...c, unreadCount: 0 })));
  };

  const archiveChat = (chatId: string, isArchived: boolean) => {
    setChats(prev => prev.map(c => c.id === chatId ? { ...c, isArchived } : c));
    api.archiveChat(chatId, isArchived).catch(() => {});
  };

  const pinChat = (chatId: string, isPinned: boolean) => {
    setChats(prev => {
      const updated = prev.map(c => (c.id === chatId ? { ...c, isPinned } : c));
      return updated.sort((a, b) => {
        if (a.isPinned && !b.isPinned) return -1;
        if (!a.isPinned && b.isPinned) return 1;
        return (b.lastMessage?.timestampRaw || 0) - (a.lastMessage?.timestampRaw || 0);
      });
    });
    api.pinChat(chatId, isPinned).catch(() => {});
  };

  const muteChatSingle = (chatId: string, isMuted: boolean) => {
    setChats(prev => prev.map(c => c.id === chatId ? { ...c, isMuted } : c));
    api.muteChat(chatId, isMuted).catch(() => {});
  };

  const clearChatMessages = (chatId: string) => {
    setMessages(prev => ({
      ...prev,
      [chatId]: [],
    }));
    setChats(prev =>
      prev.map(c => (c.id === chatId ? { ...c, lastMessage: undefined, unreadCount: 0 } : c))
    );
    api.clearChat(chatId).catch(() => {});
  };

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
      name,
      avatar: icon || 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=150&auto=format&fit=crop&q=80',
      isGroup: true,
      groupMembers: newGroupContact.groupMembers,
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

    api.createChat({
      type: 'group',
      name,
      avatar: icon,
      memberIds: selectedGroupMembers,
    }).then(res => {
      if (res?.id) {
        setContacts(prev => prev.map(c => c.id === groupId ? { ...c, id: res.id } : c));
        setChats(prev => prev.map(c => c.id === `chat_${groupId}` ? { ...c, id: res.id, contactId: res.id } : c));
        setMessages(prev => {
          const msgs = prev[`chat_${groupId}`] || [];
          return {
            ...prev,
            [res.id]: msgs.map(m => ({ ...m, chatId: res.id })),
          };
        });
        setActiveChatId(res.id);
      }
    }).catch(() => {
      setActiveChatId(`chat_${groupId}`);
    });

    clearGroupMembers();
    setActiveNavTab('chats');
    setSubView('none');
  };

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

    api.addContact({ phone, username, aliasName: fullName }).catch(() => {});

    setSubView('none');
    setActiveChatId(chatId);
  };

  const askMetaAI = () => {
    let metaContact = contacts.find(c => c.id === 'c_meta_ai' || c.id === 'usr_meta_ai');
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
          contactId: metaContact!.id,
          unreadCount: 0,
          lastMessage: {
            id: 'm_meta_intro',
            chatId: metaChatId,
            senderId: metaContact!.id,
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

  // Message selection methods (Screenshot 14)
  const toggleSelectMessage = (id: string) => {
    setSelectedMessageIds(prev =>
      prev.includes(id) ? prev.filter(mId => mId !== id) : [...prev, id]
    );
  };

  const clearSelectedMessages = () => {
    setSelectedMessageIds([]);
    setIsSelectingMessages(false);
  };

  const deleteSelectedMessages = () => {
    if (!activeChatId) return;
    setMessages(prev => {
      const list = prev[activeChatId] || [];
      return {
        ...prev,
        [activeChatId]: list.filter(m => !selectedMessageIds.includes(m.id)),
      };
    });
    for (const mId of selectedMessageIds) {
      api.deleteMessage(mId).catch(() => {});
    }
    clearSelectedMessages();
  };

  const starSelectedMessages = () => {
    if (!activeChatId) return;
    setMessages(prev => {
      const list = prev[activeChatId] || [];
      return {
        ...prev,
        [activeChatId]: list.map(m =>
          selectedMessageIds.includes(m.id) ? { ...m, isStarred: !m.isStarred } : m
        ),
      };
    });
    for (const mId of selectedMessageIds) {
      api.toggleStar(mId).catch(() => {});
    }
    clearSelectedMessages();
  };

  // Group Management & Actions
  const updateGroupInfo = (chatId: string, updates: { name?: string; avatar?: string; description?: string }) => {
    setChats(prev =>
      prev.map(c => {
        if (c.id === chatId) {
          return {
            ...c,
            name: updates.name !== undefined ? updates.name : c.name,
            avatar: updates.avatar !== undefined ? updates.avatar : c.avatar,
            about: updates.description !== undefined ? updates.description : c.about,
          };
        }
        return c;
      })
    );
    setContacts(prev =>
      prev.map(c => {
        if (c.id === chatId || (chats.find(ch => ch.id === chatId)?.contactId === c.id)) {
          return {
            ...c,
            name: updates.name !== undefined ? updates.name : c.name,
            avatar: updates.avatar !== undefined ? updates.avatar : c.avatar,
            about: updates.description !== undefined ? updates.description : c.about,
          };
        }
        return c;
      })
    );
    api.updateChat(chatId, updates).catch(() => {});
  };

  const addMembersToGroup = (chatId: string, memberIds: string[]) => {
    const memberNames = memberIds.map(id => contacts.find(c => c.id === id)?.name || id);
    setChats(prev =>
      prev.map(c => {
        if (c.id === chatId) {
          const current = c.groupMembers || ['You'];
          const updated = Array.from(new Set([...current, ...memberNames]));
          return { ...c, groupMembers: updated };
        }
        return c;
      })
    );
    setContacts(prev =>
      prev.map(c => {
        if (c.id === chatId || (chats.find(ch => ch.id === chatId)?.contactId === c.id)) {
          const current = c.groupMembers || ['You'];
          const updated = Array.from(new Set([...current, ...memberNames]));
          return { ...c, groupMembers: updated };
        }
        return c;
      })
    );
    api.addChatMembers(chatId, memberIds).catch(() => {});
  };

  const removeGroupMember = (chatId: string, memberId: string) => {
    const contact = contacts.find(c => c.id === memberId);
    const memberName = contact?.name || memberId;
    setChats(prev =>
      prev.map(c => {
        if (c.id === chatId) {
          return {
            ...c,
            groupMembers: (c.groupMembers || []).filter(m => m !== memberName && m !== memberId),
          };
        }
        return c;
      })
    );
    api.removeChatMember(chatId, memberId).catch(() => {});
  };

  const exitGroupAction = (chatId: string, deleteForMe = false) => {
    if (deleteForMe) {
      setChats(prev => prev.filter(c => c.id !== chatId));
      setContacts(prev => prev.filter(c => c.id !== chatId));
    } else {
      setChats(prev =>
        prev.map(c => (c.id === chatId ? { ...c, groupMembers: (c.groupMembers || []).filter(m => m !== 'You') } : c))
      );
    }
    if (activeChatId === chatId) {
      setActiveChatId(null);
      setActiveRightDrawer('none');
    }
    api.removeChatMember(chatId, 'me').catch(() => {});
  };

  const toggleFavoriteChat = (chatId: string) => {
    let nextFav = false;
    setChats(prev =>
      prev.map(c => {
        if (c.id === chatId) {
          nextFav = !c.isFavorite;
          return { ...c, isFavorite: nextFav };
        }
        return c;
      })
    );
    api.toggleFavoriteChat(chatId, nextFav).catch(() => {});
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
        chatWallpaper,
        setChatWallpaper: handleSetWallpaper,
        chatDoodlesEnabled,
        setChatDoodlesEnabled: handleSetDoodles,
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
        openViewOnceMessage,
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
        deleteStatus,
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
        archiveChat,
        pinChat,
        muteChatSingle,
        clearChatMessages,
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
        activeToast,
        dismissToast,
        askMetaAI,
        isSelectingMessages,
        setIsSelectingMessages,
        selectedMessageIds,
        toggleSelectMessage,
        clearSelectedMessages,
        deleteSelectedMessages,
        starSelectedMessages,
        updateGroupInfo,
        addMembersToGroup,
        removeGroupMember,
        exitGroupAction,
        toggleFavoriteChat,
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
