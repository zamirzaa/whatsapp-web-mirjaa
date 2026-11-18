const API_BASE = '/api';

export function getAuthToken(): string | null {
  return localStorage.getItem('wa_token');
}

export function setAuthToken(token: string) {
  localStorage.setItem('wa_token', token);
}

export function removeAuthToken() {
  localStorage.removeItem('wa_token');
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getAuthToken();
  const headers = new Headers(options.headers || {});

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  if (!(options.body instanceof FormData) && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
  }

  return response.json();
}

export const api = {
  // Auth
  quickLogin: () => request<{ token: string; user: any }>('/auth/quick-login', { method: 'POST' }),
  login: (identifier: string, password: string) =>
    request<{ token: string; user: any }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ identifier, password }),
    }),
  register: (data: { username: string; phone: string; displayName: string; password: string }) =>
    request<{ token: string; user: any }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  generateQR: () => request<{ qrToken: string; expiresAt: number }>('/auth/qr/generate'),
  checkQRStatus: (token: string) => request<{ status: string; token?: string; user?: any }>(`/auth/qr/status/${token}`),
  getMe: () => request<any>('/auth/me'),
  updateProfile: (data: { name?: string; about?: string; avatar?: string; thought?: string }) =>
    request<{ success: boolean }>('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  // Chats
  getChats: () => request<any[]>('/chats'),
  createChat: (payload: { type: 'direct' | 'group'; recipientId?: string; name?: string; avatar?: string; memberIds?: string[] }) =>
    request<{ id: string }>('/chats', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  getMessages: (chatId: string) => request<any[]>(`/chats/${chatId}/messages`),
  markAsRead: (chatId: string) => request<{ success: boolean }>(`/chats/${chatId}/read`, { method: 'PUT' }),
  archiveChat: (chatId: string, isArchived: boolean) =>
    request<{ success: boolean }>(`/chats/${chatId}/archive`, {
      method: 'PUT',
      body: JSON.stringify({ isArchived }),
    }),
  pinChat: (chatId: string, isPinned: boolean) =>
    request<{ success: boolean }>(`/chats/${chatId}/pin`, {
      method: 'PUT',
      body: JSON.stringify({ isPinned }),
    }),
  muteChat: (chatId: string, isMuted: boolean) =>
    request<{ success: boolean }>(`/chats/${chatId}/mute`, {
      method: 'PUT',
      body: JSON.stringify({ isMuted }),
    }),
  clearChat: (chatId: string) =>
    request<{ success: boolean }>(`/chats/${chatId}/messages`, {
      method: 'DELETE',
    }),
  updateChat: (chatId: string, data: { name?: string; avatar?: string; description?: string }) =>
    request<{ success: boolean }>(`/chats/${chatId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  addChatMembers: (chatId: string, memberIds: string[]) =>
    request<{ success: boolean }>(`/chats/${chatId}/members`, {
      method: 'POST',
      body: JSON.stringify({ memberIds }),
    }),
  removeChatMember: (chatId: string, memberId: string) =>
    request<{ success: boolean }>(`/chats/${chatId}/members/${memberId}`, {
      method: 'DELETE',
    }),
  toggleFavoriteChat: (chatId: string, isFavorite: boolean) =>
    request<{ success: boolean }>(`/chats/${chatId}/favorite`, {
      method: 'PUT',
      body: JSON.stringify({ isFavorite }),
    }),

  // Messages
  sendMessage: (payload: {
    chatId: string;
    text?: string;
    type?: string;
    mediaUrl?: string;
    fileName?: string;
    fileSize?: string;
    audioDuration?: number;
    replyToId?: string;
    poll?: any;
    isViewOnce?: boolean;
  }) =>
    request<any>('/messages', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  openViewOnce: (messageId: string) =>
    request<{ success: boolean }>(`/messages/${messageId}/view-once-open`, { method: 'POST' }),
  deleteMessage: (messageId: string) =>
    request<{ success: boolean }>(`/messages/${messageId}`, { method: 'DELETE' }),
  toggleReaction: (messageId: string, emoji: string) =>
    request<{ success: boolean; active: boolean }>(`/messages/${messageId}/reaction`, {
      method: 'POST',
      body: JSON.stringify({ emoji }),
    }),
  toggleStar: (messageId: string) =>
    request<{ isStarred: boolean }>(`/messages/${messageId}/star`, { method: 'POST' }),
  votePoll: (messageId: string, optionId: string) =>
    request<{ success: boolean }>(`/messages/${messageId}/poll-vote`, {
      method: 'POST',
      body: JSON.stringify({ optionId }),
    }),
  searchMessages: (query: string) => request<any[]>(`/messages/search?q=${encodeURIComponent(query)}`),

  // Contacts
  getContacts: () => request<any[]>('/contacts'),
  addContact: (data: { phone?: string; username?: string; aliasName?: string }) =>
    request<{ success: boolean; contactId: string }>('/contacts', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // Status
  getStatuses: () => request<any[]>('/status'),
  createStatus: (data: { type?: string; mediaUrl?: string; caption?: string; backgroundColor?: string }) =>
    request<{ success: boolean; id: string }>('/status', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  markStatusViewed: (statusId: string) =>
    request<{ success: boolean }>(`/status/${statusId}/view`, { method: 'POST' }),

  // Channels
  getChannels: () => request<any[]>('/channels'),
  followChannel: (channelId: string) =>
    request<{ isFollowing: boolean }>(`/channels/${channelId}/follow`, { method: 'POST' }),
  createChannel: (data: { name: string; description?: string; avatar?: string }) =>
    request<{ success: boolean; id: string }>('/channels', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // Upload
  uploadFile: async (file: File): Promise<{ url: string; fileName: string; fileSize: string; mimeType: string }> => {
    const formData = new FormData();
    formData.append('file', file);
    return request('/upload', {
      method: 'POST',
      body: formData,
    });
  },
};
