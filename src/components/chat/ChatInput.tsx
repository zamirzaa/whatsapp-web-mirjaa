import React, { useState, useRef } from 'react';
import { useWhatsApp } from '../../context/WhatsAppContext';
import {
  Smile,
  Plus,
  Mic,
  Send,
  X,
  FileText,
  Image,
  Camera,
  User,
  BarChart2,
} from 'lucide-react';
import { VoiceRecorder } from './VoiceRecorder';
import { api } from '../../services/api';
import { MediaEditorModal } from './MediaEditorModal';

interface ChatInputProps {
  onOpenPollModal: () => void;
}

const EMOJI_LIST = [
  '😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '😊', '😇',
  '🙂', '🙃', '😉', '😌', '😍', '🥰', '😘', '😗', '😙', '😚',
  '😋', '😛', '😜', '🤪', '😝', '🤑', '🤗', '🤭', '🤫', '🤔',
  '🤐', '🤨', '😐', '😑', '😶', '😏', '😒', '🙄', '😬', '🤥',
  '😌', '😔', '😪', '🤤', '😴', '😷', '🤒', '🤕', '🤢', '🤮',
  '🤧', '🥵', '🥶', '🥴', '😵', '🤯', '🤠', '🥳', '😎', '🤓',
  '🧐', '😕', '😟', '🙁', '😮', '😯', '😲', '😳', '🥺', '😦',
  '👍', '👎', '👌', '✌️', '🤞', '🤟', '🤘', '🤙', '👈', '👉',
  '👆', '🖕', '👇', '☝️', '👋', '🤚', '🖐️', '✋', '🖖', '👏',
  '🙌', '👐', '🤲', '🤝', '🙏', '✍️', '💪', '❤️', '🧡', '💛',
  '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔', '❣️', '💕', '💞',
  '💓', '💗', '💖', '💘', '💝', '🔥', '✨', '🎉', '🚀', '💯',
];

export const ChatInput: React.FC<ChatInputProps> = ({ onOpenPollModal }) => {
  const { sendMessage, replyingMessage, setReplyingMessage } = useWhatsApp();
  const [text, setText] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showAttachmentMenu, setShowAttachmentMenu] = useState(false);
  const [isRecordingVoice, setIsRecordingVoice] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [stagedImage, setStagedImage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const handleSend = () => {
    if (!text.trim()) return;
    sendMessage({ text: text.trim(), type: 'text' });
    setText('');
    setShowEmojiPicker(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleAddEmoji = (emoji: string) => {
    setText(prev => prev + emoji);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploading(true);
      try {
        const uploadRes = await api.uploadFile(file);
        sendMessage({
          type: 'document',
          fileName: uploadRes.fileName,
          fileSize: uploadRes.fileSize,
          mediaUrl: uploadRes.url,
        });
      } catch {
        // Fallback local URL
        const url = URL.createObjectURL(file);
        sendMessage({
          type: 'document',
          fileName: file.name,
          fileSize: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
          mediaUrl: url,
        });
      } finally {
        setIsUploading(false);
        setShowAttachmentMenu(false);
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setStagedImage(reader.result);
        }
      };
      reader.readAsDataURL(file);
      setShowAttachmentMenu(false);
      if (imageInputRef.current) imageInputRef.current.value = '';
    }
  };

  const handleEditorSend = (data: { mediaUrl: string; caption?: string; isViewOnce: boolean }) => {
    sendMessage({
      type: 'image',
      mediaUrl: data.mediaUrl,
      text: data.caption,
      isViewOnce: data.isViewOnce,
    });
    setStagedImage(null);
  };

  return (
    <div className="relative bg-[#f0f2f5] dark:bg-[#202c33] px-4 py-2 border-t border-[#e9edef] dark:border-[#222d34] select-none shrink-0 transition-colors">
      {/* Hidden file inputs */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        className="hidden"
      />
      <input
        type="file"
        accept="image/*"
        ref={imageInputRef}
        onChange={handleImageUpload}
        className="hidden"
      />

      {/* Quoted Reply Preview Bar */}
      {replyingMessage && (
        <div className="flex items-center justify-between bg-white dark:bg-[#182229] p-2.5 rounded-lg mb-2 border-l-4 border-[#00a884] shadow-sm">
          <div className="flex-1 min-w-0 pr-3">
            <span className="text-xs font-semibold text-[#00a884]">
              Replying to {replyingMessage.isOutgoing ? 'You' : 'Contact'}
            </span>
            <p className="text-xs text-[#54656f] dark:text-[#aebac1] truncate">
              {replyingMessage.text || 'Attachment'}
            </p>
          </div>
          <button
            onClick={() => setReplyingMessage(null)}
            className="text-[#8696a0] hover:text-[#111b21] dark:hover:text-white p-1 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Emoji Picker Popover */}
      {showEmojiPicker && (
        <div className="absolute bottom-16 left-4 z-40 bg-white dark:bg-[#202c33] border border-[#e9edef] dark:border-[#313d45] rounded-xl shadow-2xl p-3 w-80 max-h-72 overflow-y-auto">
          <div className="grid grid-cols-8 gap-2">
            {EMOJI_LIST.map((emoji, idx) => (
              <button
                key={idx}
                onClick={() => handleAddEmoji(emoji)}
                className="text-2xl hover:scale-125 transition-transform cursor-pointer p-1"
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Attachment Popover Menu */}
      {showAttachmentMenu && (
        <div
          onClick={() => setShowAttachmentMenu(false)}
          className="absolute bottom-16 left-14 z-40 bg-white dark:bg-[#233138] border border-[#e9edef] dark:border-[#313d45] rounded-2xl shadow-2xl p-4 w-48 space-y-3 animate-in fade-in zoom-in-95 duration-100"
        >
          {/* Document */}
          <div
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center space-x-3 text-sm text-[#111b21] dark:text-[#d1d7db] hover:text-[#00a884] dark:hover:text-white cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-full bg-[#7f66ff] flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
              <FileText className="w-5 h-5" />
            </div>
            <span>Document</span>
          </div>

          {/* Photos & Videos */}
          <div
            onClick={() => imageInputRef.current?.click()}
            className="flex items-center space-x-3 text-sm text-[#111b21] dark:text-[#d1d7db] hover:text-[#00a884] dark:hover:text-white cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-full bg-[#007bfc] flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
              <Image className="w-5 h-5" />
            </div>
            <span>Photos & videos</span>
          </div>

          {/* Camera */}
          <div
            onClick={() => imageInputRef.current?.click()}
            className="flex items-center space-x-3 text-sm text-[#111b21] dark:text-[#d1d7db] hover:text-[#00a884] dark:hover:text-white cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-full bg-[#ff2e74] flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
              <Camera className="w-5 h-5" />
            </div>
            <span>Camera</span>
          </div>

          {/* Poll */}
          <div
            onClick={onOpenPollModal}
            className="flex items-center space-x-3 text-sm text-[#111b21] dark:text-[#d1d7db] hover:text-[#00a884] dark:hover:text-white cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-full bg-[#ffbc38] flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
              <BarChart2 className="w-5 h-5" />
            </div>
            <span>Poll</span>
          </div>

          {/* Contact */}
          <div className="flex items-center space-x-3 text-sm text-[#111b21] dark:text-[#d1d7db] hover:text-[#00a884] dark:hover:text-white cursor-pointer group">
            <div className="w-10 h-10 rounded-full bg-[#009de2] flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
              <User className="w-5 h-5" />
            </div>
            <span>Contact</span>
          </div>
        </div>
      )}

      {/* Main Input Row or Voice Recording Row */}
      {isRecordingVoice ? (
        <VoiceRecorder
          onCancel={() => setIsRecordingVoice(false)}
          onSend={duration => {
            setIsRecordingVoice(false);
            sendMessage({
              type: 'audio',
              audioDuration: duration,
            });
          }}
        />
      ) : (
        <div className="flex items-end space-x-2">
          {/* Emoji Button */}
          <button
            onClick={() => {
              setShowEmojiPicker(!showEmojiPicker);
              setShowAttachmentMenu(false);
            }}
            className="p-2.5 text-[#54656f] dark:text-[#8696a0] hover:text-[#111b21] dark:hover:text-[#e9edef] transition-colors cursor-pointer"
            title="Emojis"
          >
            <Smile className="w-6 h-6" />
          </button>

          {/* Attachment Button */}
          <button
            onClick={() => {
              setShowAttachmentMenu(!showAttachmentMenu);
              setShowEmojiPicker(false);
            }}
            className="p-2.5 text-[#54656f] dark:text-[#8696a0] hover:text-[#111b21] dark:hover:text-[#e9edef] transition-colors cursor-pointer"
            title="Attach"
          >
            <Plus className="w-6 h-6" />
          </button>

          {/* Message Text Input */}
          <div className="flex-1 bg-white dark:bg-[#2a3942] rounded-lg px-3 py-2 flex items-center min-h-[42px] max-h-32 border border-transparent focus-within:border-[#00a884] shadow-xs">
            <textarea
              value={text}
              onChange={e => setText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={isUploading ? 'Mengunggah file...' : 'Type a message'}
              disabled={isUploading}
              rows={1}
              className="bg-transparent flex-1 text-[#111b21] dark:text-[#e9edef] placeholder-[#8696a0] text-[15px] outline-none resize-none max-h-28 overflow-y-auto"
            />
          </div>

          {/* Send or Voice Record Button */}
          {text.trim().length > 0 ? (
            <button
              onClick={handleSend}
              className="p-2.5 text-[#00a884] hover:text-[#008f70] transition-colors cursor-pointer"
              title="Send message"
            >
              <Send className="w-6 h-6 fill-current" />
            </button>
          ) : (
            <button
              onClick={() => setIsRecordingVoice(true)}
              className="p-2.5 text-[#54656f] dark:text-[#8696a0] hover:text-[#111b21] dark:hover:text-[#e9edef] transition-colors cursor-pointer"
              title="Voice message"
            >
              <Mic className="w-6 h-6" />
            </button>
          )}
        </div>
      )}

      {/* Media Editor Modal */}
      {stagedImage && (
        <MediaEditorModal
          isOpen={Boolean(stagedImage)}
          imageUrl={stagedImage}
          onClose={() => setStagedImage(null)}
          onSend={handleEditorSend}
        />
      )}
    </div>
  );
};
