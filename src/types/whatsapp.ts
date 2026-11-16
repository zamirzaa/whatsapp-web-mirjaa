export type MessageStatus = 'sent' | 'delivered' | 'read';

export type MessageType = 'text' | 'image' | 'audio' | 'document' | 'poll';

export interface Reaction {
  emoji: string;
  count: number;
  byMe: boolean;
  users: string[];
}

export interface PollOption {
  id: string;
  text: string;
  votes: string[];
}

export interface Message {
  id: string;
  chatId: string;
  senderId: string;
  text?: string;
  type: MessageType;
  timestamp: string;
  timestampRaw: number;
  status: MessageStatus;
  isOutgoing: boolean;
  replyTo?: {
    id: string;
    senderName: string;
    text: string;
  };
  mediaUrl?: string;
  fileName?: string;
  fileSize?: string;
  audioDuration?: number;
  poll?: {
    question: string;
    options: PollOption[];
    allowMultiple: boolean;
  };
  reactions?: { [emoji: string]: Reaction };
  isStarred?: boolean;
}

export interface Contact {
  id: string;
  name: string;
  phoneNumber: string;
  avatar: string;
  about: string;
  isOnline: boolean;
  lastSeen?: string;
  isGroup?: boolean;
  groupMembers?: string[];
  isArchived?: boolean;
  isFavorite?: boolean;
  isChannel?: boolean;
}

export interface Chat {
  id: string;
  contactId: string;
  unreadCount: number;
  isPinned?: boolean;
  isMuted?: boolean;
  isArchived?: boolean;
  isFavorite?: boolean;
  draft?: string;
  lastMessage?: Message;
}

export interface ChannelItem {
  id: string;
  name: string;
  avatar: string;
  followers: string;
  isVerified?: boolean;
  isFollowing?: boolean;
  description?: string;
  posts?: {
    id: string;
    text: string;
    mediaUrl?: string;
    timestamp: string;
    views: string;
  }[];
}

export interface StatusItem {
  id: string;
  userId: string;
  mediaUrl: string;
  caption?: string;
  timestamp: string;
  type: 'image' | 'video' | 'text';
  backgroundColor?: string;
}

export interface UserStatus {
  userId: string;
  userName: string;
  userAvatar: string;
  items: StatusItem[];
  allSeen: boolean;
}

export interface UserProfile {
  id: string;
  name: string;
  about: string;
  avatar: string;
  phone: string;
  username?: string;
  thought?: string;
}

export type NavTab = 'chats' | 'status' | 'channels' | 'communities' | 'meta-ai' | 'starred' | 'settings';

export type SubView =
  | 'none'
  | 'archived'
  | 'new-chat'
  | 'new-group'
  | 'new-group-info'
  | 'new-contact'
  | 'new-community'
  | 'starred'
  | 'app-lock'
  | 'select-chats'
  | 'settings-profile'
  | 'settings-account'
  | 'settings-privacy'
  | 'settings-chats'
  | 'settings-notifications'
  | 'settings-keyboard'
  | 'settings-help';

export type RightDrawer = 'none' | 'contact-info' | 'search-chat' | 'starred-messages';

export interface CallState {
  isActive: boolean;
  contact?: Contact;
  type: 'audio' | 'video';
  status: 'ringing' | 'connected' | 'ended';
  durationSeconds: number;
  isMuted: boolean;
  isVideoOff: boolean;
}
