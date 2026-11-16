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
  } = useWhatsApp();

  const [showOptions, setShowOptions] = useState(false);
  const [showReactionsBar, setShowReactionsBar] = useState(false);

  const isOut = message.isOutgoing;

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

  return (
    <div
      className={`group relative flex w-full my-1 ${
        isOut ? 'justify-end' : 'justify-start'
      }`}
    >
      {/* Quick Reaction floating toolbar on hover */}
      <div
        className={`absolute -top-7 ${
          isOut ? 'right-4' : 'left-4'
        } z-20 hidden group-hover:flex items-center space-x-1 bg-[#233138] rounded-full px-2 py-1 shadow-lg border border-[#313d45]`}
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
          className="text-[#8696a0] hover:text-white p-1 cursor-pointer"
        >
          <Smile className="w-4 h-4" />
        </button>
      </div>

      {/* Bubble Box */}
      <div
        className={`relative max-w-[85%] md:max-w-[65%] rounded-lg px-2.5 py-1.5 shadow-sm text-sm ${
          isOut
            ? 'bg-[#005c4b] text-[#e9edef] rounded-tr-none'
            : 'bg-[#202c33] text-[#e9edef] rounded-tl-none'
        }`}
      >
        {/* Reply Quote Banner */}
        {message.replyTo && (
          <div
            className={`mb-1.5 p-2 rounded border-l-4 text-xs cursor-pointer ${
              isOut
                ? 'bg-black/20 border-[#00a884]'
                : 'bg-black/20 border-[#53bdeb]'
            }`}
          >
            <div className="font-semibold text-[#00a884] mb-0.5">
              {message.replyTo.senderName}
            </div>
            <div className="text-[#aebac1] truncate">{message.replyTo.text}</div>
          </div>
        )}

        {/* Bubble Content by Type */}
        {message.type === 'image' && message.mediaUrl && (
          <div className="rounded overflow-hidden mb-1 cursor-pointer" onClick={() => onImageClick?.(message.mediaUrl!)}>
            <img
              src={message.mediaUrl}
              alt="attachment"
              className="max-h-[300px] w-full object-cover rounded hover:opacity-95 transition-opacity"
            />
          </div>
        )}

        {message.type === 'audio' && (
          <VoiceNotePlayer duration={message.audioDuration} isOutgoing={isOut} />
        )}

        {message.type === 'document' && (
          <div className="flex items-center space-x-3 p-2 bg-black/20 rounded-md mb-1">
            <div className="p-2 bg-[#ea4335]/20 text-[#ea4335] rounded">
              <FileText className="w-6 h-6" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{message.fileName}</p>
              <p className="text-[11px] text-[#8696a0]">{message.fileSize}</p>
            </div>
            <button className="p-2 hover:bg-white/10 rounded-full text-white cursor-pointer">
              <Download className="w-4 h-4" />
            </button>
          </div>
        )}

        {message.type === 'poll' && message.poll && (
          <div className="p-2 space-y-2 min-w-[260px]">
            <h4 className="font-semibold text-base text-white">{message.poll.question}</h4>
            <div className="space-y-1.5">
              {message.poll.options.map(option => {
                const totalVotes = message.poll!.options.reduce((sum, o) => sum + o.votes.length, 0);
                const pct = totalVotes > 0 ? Math.round((option.votes.length / totalVotes) * 100) : 0;
                const isSelected = option.votes.includes('me');

                return (
                  <div
                    key={option.id}
                    onClick={() => votePoll(message.id, option.id)}
                    className="relative overflow-hidden p-2 rounded-md bg-white/10 hover:bg-white/15 cursor-pointer transition-colors"
                  >
                    <div
                      className="absolute inset-y-0 left-0 bg-[#00a884]/30 transition-all duration-300"
                      style={{ width: `${pct}%` }}
                    />
                    <div className="relative flex items-center justify-between text-xs z-10">
                      <span className={`font-medium ${isSelected ? 'text-[#00a884]' : 'text-white'}`}>
                        {option.text}
                      </span>
                      <span className="text-[#8696a0] ml-2 font-mono">{pct}%</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Text Message with Link / Formatting */}
        {message.text && (
          <div className="text-[14.2px] leading-relaxed whitespace-pre-wrap break-words pr-2">
            {message.text}
          </div>
        )}

        {/* Footer: Time & Status Ticks & Star */}
        <div className="flex items-center justify-end space-x-1 float-right ml-3 mt-0.5 text-[11px] text-[#8696a0] select-none">
          {message.isStarred && <Star className="w-3 h-3 text-[#f0be38] fill-current mr-0.5" />}
          <span>{message.timestamp}</span>
          {renderStatus()}
        </div>

        {/* Reactions Counter Pill */}
        {message.reactions && Object.keys(message.reactions).length > 0 && (
          <div className="absolute -bottom-3 right-2 flex items-center bg-[#202c33] border border-[#313d45] rounded-full px-1.5 py-0.5 shadow-sm space-x-1">
            {Object.values(message.reactions).map(rx => (
              <span key={rx.emoji} className="text-xs">
                {rx.emoji} {rx.count > 1 ? rx.count : ''}
              </span>
            ))}
          </div>
        )}

        {/* Hover chevron for options dropdown */}
        <button
          onClick={() => setShowOptions(!showOptions)}
          className="absolute right-1.5 top-1 opacity-0 group-hover:opacity-100 text-[#8696a0] hover:text-white transition-opacity p-0.5 rounded cursor-pointer"
        >
          <ChevronDown className="w-3.5 h-3.5" />
        </button>

        {/* Dropdown Menu */}
        {showOptions && (
          <div
            onClick={e => e.stopPropagation()}
            className="absolute right-0 top-6 z-30 bg-[#233138] rounded-md shadow-xl py-1.5 w-40 border border-[#313d45] text-xs text-[#d1d7db]"
          >
            <div
              onClick={() => {
                setShowOptions(false);
                setReplyingMessage(message);
              }}
              className="px-3 py-2 hover:bg-[#182229] cursor-pointer flex items-center space-x-2"
            >
              <Reply className="w-3.5 h-3.5" />
              <span>Reply</span>
            </div>
            <div
              onClick={() => {
                setShowOptions(false);
                toggleStarMessage(message.id);
              }}
              className="px-3 py-2 hover:bg-[#182229] cursor-pointer flex items-center space-x-2"
            >
              <Star className="w-3.5 h-3.5" />
              <span>{message.isStarred ? 'Unstar' : 'Star'}</span>
            </div>
            <div
              onClick={() => {
                setShowOptions(false);
                deleteMessage(message.id);
              }}
              className="px-3 py-2 hover:bg-[#182229] cursor-pointer flex items-center space-x-2 text-red-400"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
