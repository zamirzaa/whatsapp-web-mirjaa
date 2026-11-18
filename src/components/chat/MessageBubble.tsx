import React, { useState } from 'react';
import type { Message } from '../../types/whatsapp';
import { useWhatsApp } from '../../context/WhatsAppContext';
import {
  Check,
  CheckCheck,
  ChevronDown,
  Star,
  FileText,
  Download,
  Smile,
  Reply,
  Trash2,
  Copy,
  Pin,
  CornerUpRight,
  Bot,
  ThumbsDown,
  MessageSquare,
  Plus,
} from 'lucide-react';
import { VoiceNotePlayer } from './VoiceNotePlayer';

interface MessageBubbleProps {
  message: Message;
  onImageClick?: (url: string) => void;
}

const QUICK_REACTIONS = ['👍', '❤️', '😂', '😮', '😢', '🙏'];

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message, onImageClick }) => {
  const {
    toggleReaction,
    deleteMessage,
    toggleStarMessage,
    setReplyingMessage,
    votePoll,
    openViewOnceMessage,
    isSelectingMessages,
    selectedMessageIds,
    toggleSelectMessage,
    activeContact,
    contacts,
    chats,
    setActiveChatId,
    askMetaAI,
  } = useWhatsApp();

  const [showOptions, setShowOptions] = useState(false);
  const [showReactionsBar, setShowReactionsBar] = useState(false);

  const isOut = message.isOutgoing;
  const isGroup = activeContact?.isGroup;
  const isSelected = selectedMessageIds.includes(message.id);

  // Determine sender display name in group
  const senderContact = contacts.find(c => c.id === message.senderId);
  const senderDisplayName = message.senderId === 'me' || isOut
    ? 'You'
    : (senderContact?.name || (message as any).senderName || 'Member');

  const renderStatus = () => {
    if (!isOut) return null;
    if (message.status === 'read') {
      return <CheckCheck className="w-4 h-4 text-[#53bdeb] ml-1 inline" />;
    }
    if (message.status === 'delivered') {
      return <CheckCheck className="w-4 h-4 text-[#8696a0] ml-1 inline" />;
    }
    return <Check className="w-4 h-4 text-[#8696a0] ml-1 inline" />;
  };

  const handleCopy = () => {
    if (message.text) {
      navigator.clipboard?.writeText(message.text);
    }
    setShowOptions(false);
  };

  const handleReplyPrivately = () => {
    setShowOptions(false);
    if (!message.senderId || message.senderId === 'me') return;
    const directChat = chats.find(c => !c.isGroup && c.contactId === message.senderId);
    if (directChat) {
      setActiveChatId(directChat.id);
    } else {
      alert(`Opening private chat with ${senderDisplayName}`);
    }
  };

  const handleMessageSender = () => {
    setShowOptions(false);
    if (!message.senderId || message.senderId === 'me') return;
    const directChat = chats.find(c => !c.isGroup && c.contactId === message.senderId);
    if (directChat) {
      setActiveChatId(directChat.id);
    } else {
      alert(`Starting direct message with ${senderDisplayName}`);
    }
  };

  return (
    <div
      onClick={() => {
        if (isSelectingMessages) {
          toggleSelectMessage(message.id);
        }
      }}
      className={`group relative flex w-full my-1 items-center ${
        isOut ? 'justify-end' : 'justify-start'
      } ${isSelectingMessages ? 'cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 py-1 px-2 rounded-lg' : ''}`}
    >
      {/* Checkbox for Message Selection Mode (Screenshot 14) */}
      {isSelectingMessages && (
        <div className="mr-3 shrink-0">
          <div
            className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
              isSelected
                ? 'bg-[#00a884] border-[#00a884] text-[#111b21]'
                : 'border-[#8696a0] bg-transparent'
            }`}
          >
            {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
          </div>
        </div>
      )}

      {/* Quick Reaction floating toolbar on hover */}
      {!isSelectingMessages && (
        <div
          className={`absolute -top-7 ${
            isOut ? 'right-4' : 'left-4'
          } z-20 hidden group-hover:flex items-center space-x-1 bg-white dark:bg-[#233138] rounded-full px-2 py-1 shadow-lg border border-[#e9edef] dark:border-[#313d45]`}
        >
          {QUICK_REACTIONS.map(emoji => (
            <button
              key={emoji}
              onClick={() => toggleReaction(message.id, emoji)}
              className="text-base hover:scale-125 transition-transform p-1 cursor-pointer"
            >
              {emoji}
            </button>
          ))}
          <button
            onClick={() => setShowReactionsBar(!showReactionsBar)}
            className="text-[#8696a0] hover:text-[#111b21] dark:hover:text-white p-1 cursor-pointer"
          >
            <Smile className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Bubble Box */}
      <div
        className={`relative max-w-[85%] md:max-w-[65%] rounded-lg px-2.5 py-1.5 shadow-xs text-sm transition-colors ${
          isOut
            ? 'bg-[#d9fdd3] text-[#111b21] dark:bg-[#005c4b] dark:text-[#e9edef] rounded-tr-none'
            : 'bg-white text-[#111b21] dark:bg-[#202c33] dark:text-[#e9edef] rounded-tl-none'
        }`}
      >
        {/* In group chats, display sender name on incoming messages */}
        {isGroup && !isOut && (
          <div className="text-xs font-semibold text-[#53bdeb] mb-0.5 select-none">
            {senderDisplayName}
          </div>
        )}

        {/* Reply Quote Banner */}
        {message.replyTo && (
          <div
            className={`mb-1.5 p-2 rounded border-l-4 text-xs cursor-pointer ${
              isOut
                ? 'bg-black/5 dark:bg-black/20 border-[#00a884]'
                : 'bg-black/5 dark:bg-black/20 border-[#00a884] dark:border-[#53bdeb]'
            }`}
          >
            <div className="font-semibold text-[#00a884] mb-0.5">
              {message.replyTo.senderName}
            </div>
            <div className="text-[#54656f] dark:text-[#aebac1] truncate">{message.replyTo.text}</div>
          </div>
        )}

        {/* Bubble Content by Type */}
        {message.isViewOnce ? (
          message.isViewOnceOpened ? (
            <div className="flex items-center space-x-2 py-1 px-1.5 select-none text-[#8696a0]">
              <div className="w-5 h-5 rounded-full border border-dashed border-[#8696a0] flex items-center justify-center text-[11px] font-bold">
                1
              </div>
              <span className="text-[14px] italic">Photo (Opened)</span>
            </div>
          ) : (
            <button
              onClick={() => {
                if (message.mediaUrl) {
                  onImageClick?.(message.mediaUrl);
                  openViewOnceMessage(message.id);
                }
              }}
              className="flex items-center space-x-2.5 py-1 px-1.5 rounded-md hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer select-none text-[#111b21] dark:text-[#e9edef]"
            >
              <div className="w-6 h-6 rounded-full border-2 border-dashed border-[#00a884] text-[#00a884] flex items-center justify-center text-xs font-bold">
                1
              </div>
              <span className="text-[14.2px] font-medium">Photo</span>
            </button>
          )
        ) : (
          message.type === 'image' && message.mediaUrl && (
            <div className="rounded overflow-hidden mb-1 cursor-pointer" onClick={() => onImageClick?.(message.mediaUrl!)}>
              <img
                src={message.mediaUrl}
                alt="attachment"
                className="max-h-[300px] w-full object-cover rounded hover:opacity-95 transition-opacity"
              />
            </div>
          )
        )}

        {message.type === 'audio' && (
          <VoiceNotePlayer duration={message.audioDuration} isOutgoing={isOut} />
        )}

        {message.type === 'document' && (
          <div className="flex items-center space-x-3 p-2 bg-black/5 dark:bg-black/20 rounded-md mb-1">
            <div className="p-2 bg-[#ea4335]/20 text-[#ea4335] rounded">
              <FileText className="w-6 h-6" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-[#111b21] dark:text-white truncate">{message.fileName}</p>
              <p className="text-[11px] text-[#667781] dark:text-[#8696a0]">{message.fileSize}</p>
            </div>
            <a
              href={message.mediaUrl}
              download={message.fileName || 'document'}
              target="_blank"
              rel="noreferrer"
              className="p-2 hover:bg-black/10 dark:hover:bg-white/10 rounded-full text-[#111b21] dark:text-white cursor-pointer"
            >
              <Download className="w-4 h-4" />
            </a>
          </div>
        )}

        {message.type === 'poll' && message.poll && (
          <div className="p-2 space-y-2 min-w-[260px]">
            <h4 className="font-semibold text-base text-[#111b21] dark:text-white">{message.poll.question}</h4>
            <div className="space-y-1.5">
              {message.poll.options.map(option => {
                const totalVotes = message.poll!.options.reduce((sum, o) => sum + o.votes.length, 0);
                const pct = totalVotes > 0 ? Math.round((option.votes.length / totalVotes) * 100) : 0;
                const isSelected = option.votes.includes('me');

                return (
                  <div
                    key={option.id}
                    onClick={() => votePoll(message.id, option.id)}
                    className="relative overflow-hidden p-2 rounded-md bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/15 cursor-pointer transition-colors"
                  >
                    <div
                      className="absolute inset-y-0 left-0 bg-[#00a884]/30 transition-all duration-300"
                      style={{ width: `${pct}%` }}
                    />
                    <div className="relative flex items-center justify-between text-xs z-10">
                      <span className={`font-medium ${isSelected ? 'text-[#00a884]' : 'text-[#111b21] dark:text-white'}`}>
                        {option.text}
                      </span>
                      <span className="text-[#667781] dark:text-[#8696a0] ml-2 font-mono">{pct}%</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Text Message with Link / Formatting (do NOT show if it's just raw filename) */}
        {message.text && message.text !== message.fileName && (
          <div className="text-[14.2px] leading-relaxed whitespace-pre-wrap break-words pr-2">
            {message.text}
          </div>
        )}

        {/* Footer: Time & Status Ticks & Star */}
        <div className="flex items-center justify-end space-x-1 float-right ml-3 mt-0.5 text-[11px] text-[#667781] dark:text-[#8696a0] select-none">
          {message.isStarred && <Star className="w-3 h-3 text-[#f0be38] fill-current mr-0.5" />}
          <span>{message.timestamp}</span>
          {renderStatus()}
        </div>

        {/* Reactions Counter Pill */}
        {message.reactions && Object.keys(message.reactions).length > 0 && (
          <div className="absolute -bottom-3 right-2 flex items-center bg-white dark:bg-[#202c33] border border-[#e9edef] dark:border-[#313d45] rounded-full px-1.5 py-0.5 shadow-sm space-x-1">
            {Object.values(message.reactions).map(rx => (
              <span key={rx.emoji} className="text-xs">
                {rx.emoji} {rx.count > 1 ? rx.count : ''}
              </span>
            ))}
          </div>
        )}

        {/* Hover chevron for options dropdown */}
        {!isSelectingMessages && (
          <button
            onClick={() => setShowOptions(!showOptions)}
            className="absolute right-1.5 top-1 opacity-0 group-hover:opacity-100 text-[#8696a0] hover:text-[#111b21] dark:hover:text-white transition-opacity p-0.5 rounded cursor-pointer"
          >
            <ChevronDown className="w-3.5 h-3.5" />
          </button>
        )}

        {/* Dropdown Menu (Screenshot 15) */}
        {showOptions && !isSelectingMessages && (
          <div
            onClick={e => e.stopPropagation()}
            className="absolute right-0 top-6 z-40 bg-[#233138] rounded-xl shadow-2xl py-2 w-52 border border-[#313d45] text-sm text-[#d1d7db] animate-in fade-in zoom-in-95 duration-100"
          >
            {/* Quick Emoji Reaction Row on top (Screenshot 15) */}
            <div className="flex items-center justify-between px-3 py-1.5 border-b border-[#313d45] mb-1">
              {QUICK_REACTIONS.map(emoji => (
                <button
                  key={emoji}
                  onClick={() => {
                    toggleReaction(message.id, emoji);
                    setShowOptions(false);
                  }}
                  className="text-base hover:scale-125 transition-transform p-0.5 cursor-pointer"
                >
                  {emoji}
                </button>
              ))}
              <button
                onClick={() => {
                  setShowOptions(false);
                  setShowReactionsBar(true);
                }}
                className="text-[#8696a0] hover:text-white p-0.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* Reply */}
            <div
              onClick={() => {
                setShowOptions(false);
                setReplyingMessage(message);
              }}
              className="px-4 py-2 hover:bg-[#182229] cursor-pointer flex items-center space-x-3"
            >
              <Reply className="w-4 h-4 text-[#8696a0]" />
              <span>Reply</span>
            </div>

            {/* Reply privately (groups only, incoming only) */}
            {isGroup && !isOut && (
              <div
                onClick={handleReplyPrivately}
                className="px-4 py-2 hover:bg-[#182229] cursor-pointer flex items-center space-x-3"
              >
                <MessageSquare className="w-4 h-4 text-[#8696a0]" />
                <span>Reply privately</span>
              </div>
            )}

            {/* Message <sender> (groups only, incoming only) */}
            {isGroup && !isOut && (
              <div
                onClick={handleMessageSender}
                className="px-4 py-2 hover:bg-[#182229] cursor-pointer flex items-center space-x-3"
              >
                <MessageSquare className="w-4 h-4 text-[#8696a0]" />
                <span className="truncate">Message {senderDisplayName}</span>
              </div>
            )}

            {/* Copy */}
            {message.text && (
              <div
                onClick={handleCopy}
                className="px-4 py-2 hover:bg-[#182229] cursor-pointer flex items-center space-x-3"
              >
                <Copy className="w-4 h-4 text-[#8696a0]" />
                <span>Copy</span>
              </div>
            )}

            {/* React */}
            <div
              onClick={() => {
                setShowOptions(false);
                setShowReactionsBar(!showReactionsBar);
              }}
              className="px-4 py-2 hover:bg-[#182229] cursor-pointer flex items-center space-x-3"
            >
              <Smile className="w-4 h-4 text-[#8696a0]" />
              <span>React</span>
            </div>

            {/* Forward */}
            <div
              onClick={() => {
                setShowOptions(false);
                alert('Forward message to another chat');
              }}
              className="px-4 py-2 hover:bg-[#182229] cursor-pointer flex items-center space-x-3"
            >
              <CornerUpRight className="w-4 h-4 text-[#8696a0]" />
              <span>Forward</span>
            </div>

            {/* Pin */}
            <div
              onClick={() => {
                setShowOptions(false);
                alert('Pinned message');
              }}
              className="px-4 py-2 hover:bg-[#182229] cursor-pointer flex items-center space-x-3"
            >
              <Pin className="w-4 h-4 text-[#8696a0]" />
              <span>Pin</span>
            </div>

            {/* Ask Meta AI */}
            {message.text && (
              <div
                onClick={() => {
                  setShowOptions(false);
                  askMetaAI();
                }}
                className="px-4 py-2 hover:bg-[#182229] cursor-pointer flex items-center space-x-3"
              >
                <Bot className="w-4 h-4 text-[#00a884]" />
                <span>Ask Meta AI</span>
              </div>
            )}

            {/* Star / Unstar */}
            <div
              onClick={() => {
                setShowOptions(false);
                toggleStarMessage(message.id);
              }}
              className="px-4 py-2 hover:bg-[#182229] cursor-pointer flex items-center space-x-3"
            >
              <Star className="w-4 h-4 text-[#8696a0]" />
              <span>{message.isStarred ? 'Unstar' : 'Star'}</span>
            </div>

            {/* Report */}
            <div
              onClick={() => {
                setShowOptions(false);
                alert('Message reported to WhatsApp');
              }}
              className="px-4 py-2 hover:bg-[#182229] cursor-pointer flex items-center space-x-3"
            >
              <ThumbsDown className="w-4 h-4 text-[#8696a0]" />
              <span>Report</span>
            </div>

            {/* Delete */}
            <div
              onClick={() => {
                setShowOptions(false);
                deleteMessage(message.id);
              }}
              className="px-4 py-2 hover:bg-[#182229] cursor-pointer flex items-center space-x-3 text-red-400 border-t border-[#313d45] mt-1"
            >
              <Trash2 className="w-4 h-4" />
              <span>Delete</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
