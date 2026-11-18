import React, { useState, useEffect } from 'react';
import { useWhatsApp } from '../../context/WhatsAppContext';
import { X, Play, Pause, ChevronLeft, ChevronRight, Send, Trash2, Eye } from 'lucide-react';

export const StatusViewerModal: React.FC = () => {
  const { viewingStatus, setViewingStatus, markStatusSeen, sendMessage, setActiveChatId, chats, deleteStatus, contacts } = useWhatsApp();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const [replyText, setReplyText] = useState('');

  const isMyStatus = viewingStatus?.userId === 'me';
  const items = viewingStatus?.items || [];
  const currentItem = items[currentIndex];

  useEffect(() => {
    setCurrentIndex(0);
    setProgress(0);
    setIsPaused(false);
    setReplyText('');
  }, [viewingStatus]);

  useEffect(() => {
    if (!viewingStatus || items.length === 0 || isPaused) return;

    const interval = 50; // update every 50ms
    const step = (interval / 5000) * 100; // 5 seconds per story

    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev + step >= 100) {
          if (currentIndex < items.length - 1) {
            setCurrentIndex(i => i + 1);
            return 0;
          } else {
            // Finished all stories
            markStatusSeen(viewingStatus.userId);
            setViewingStatus(null);
            return 100;
          }
        }
        return prev + step;
      });
    }, interval);

    return () => clearInterval(timer);
  }, [viewingStatus, currentIndex, items.length, isPaused, markStatusSeen, setViewingStatus]);

  if (!viewingStatus || !currentItem) return null;

  const handleNext = () => {
    if (currentIndex < items.length - 1) {
      setCurrentIndex(i => i + 1);
      setProgress(0);
    } else {
      markStatusSeen(viewingStatus.userId);
      setViewingStatus(null);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(i => i - 1);
      setProgress(0);
    }
  };

  const handleSendReply = (customText?: string) => {
    if (isMyStatus) return; // Do not allow replying to own status

    const textToSend = customText || replyText;
    if (!textToSend.trim()) return;

    // Find chat with this contact
    let targetChat = chats.find(c => c.contactId === viewingStatus.userId);
    if (!targetChat) {
      // Find matching contact
      const contact = contacts.find(c => c.id === viewingStatus.userId);
      if (contact) {
        // Fallback chat id
        targetChat = { id: `chat_${contact.id}`, contactId: contact.id, unreadCount: 0 };
      }
    }

    if (targetChat) {
      setActiveChatId(targetChat.id);
      sendMessage({
        text: `[Reply to Status]: ${textToSend}`,
        replyTo: {
          id: currentItem.id,
          senderName: viewingStatus.userName,
          text: currentItem.caption || (currentItem.type === 'image' ? '📷 Status Photo' : 'Status update'),
        },
      });
    }

    setReplyText('');
    setViewingStatus(null);
  };

  const handleDeleteCurrent = () => {
    if (!currentItem) return;
    deleteStatus(currentItem.id);
    setViewingStatus(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 select-none animate-in fade-in duration-200">
      {/* Container 16:9 / Mobile ratio */}
      <div className="relative w-full max-w-[440px] h-[92vh] max-h-[820px] bg-[#111b21] rounded-xl overflow-hidden flex flex-col shadow-2xl border border-[#222d34]">
        {/* Top Progress Bars */}
        <div className="absolute top-3 inset-x-3 z-30 flex space-x-1.5">
          {items.map((item, idx) => {
            let widthPercent = 0;
            if (idx < currentIndex) widthPercent = 100;
            else if (idx === currentIndex) widthPercent = progress;

            return (
              <div key={item.id || idx} className="h-1 flex-1 bg-white/30 rounded-full overflow-hidden">
                <div
                  className="h-full bg-white transition-all duration-75 ease-linear"
                  style={{ width: `${widthPercent}%` }}
                />
              </div>
            );
          })}
        </div>

        {/* Header Bar */}
        <div className="absolute top-6 inset-x-4 z-30 flex items-center justify-between text-white drop-shadow-md">
          <div className="flex items-center space-x-3">
            <img
              src={viewingStatus.userAvatar}
              alt={viewingStatus.userName}
              className="w-10 h-10 rounded-full object-cover border-2 border-white/40"
            />
            <div>
              <h4 className="text-sm font-semibold leading-tight">{viewingStatus.userName}</h4>
              <p className="text-xs text-white/70">{currentItem.timestamp}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {isMyStatus && (
              <button
                onClick={() => handleDeleteCurrent()}
                className="p-1.5 rounded-full hover:bg-red-500/20 text-red-400 transition-colors cursor-pointer"
                title="Delete status"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            )}
            <button
              onClick={() => setIsPaused(!isPaused)}
              className="p-1.5 rounded-full hover:bg-white/10 transition-colors cursor-pointer"
              title={isPaused ? 'Resume' : 'Pause'}
            >
              {isPaused ? <Play className="w-5 h-5" /> : <Pause className="w-5 h-5" />}
            </button>
            <button
              onClick={() => {
                markStatusSeen(viewingStatus.userId);
                setViewingStatus(null);
              }}
              className="p-1.5 rounded-full hover:bg-white/10 transition-colors cursor-pointer"
              title="Close"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Center Content View */}
        <div
          className="flex-1 relative flex items-center justify-center cursor-pointer overflow-hidden"
          onClick={handleNext}
        >
          {currentItem.type === 'image' && currentItem.mediaUrl ? (
            <img
              src={currentItem.mediaUrl}
              alt="Status"
              className="w-full h-full object-contain bg-black"
            />
          ) : (
            <div
              className="w-full h-full flex items-center justify-center p-8 text-center"
              style={{ backgroundColor: currentItem.backgroundColor || '#005c4b' }}
            >
              <span className="text-2xl md:text-3xl font-medium text-white leading-relaxed">
                {currentItem.caption}
              </span>
            </div>
          )}

          {/* Caption for image */}
          {currentItem.type === 'image' && currentItem.caption && (
            <div className="absolute bottom-20 inset-x-0 px-6 py-3 bg-gradient-to-t from-black/80 via-black/40 to-transparent text-center">
              <p className="text-sm text-white drop-shadow-md">{currentItem.caption}</p>
            </div>
          )}

          {/* Navigation Click Zones / Buttons */}
          {currentIndex > 0 && (
            <button
              onClick={e => {
                e.stopPropagation();
                handlePrev();
              }}
              className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/40 hover:bg-black/70 text-white transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
          )}

          <button
            onClick={e => {
              e.stopPropagation();
              handleNext();
            }}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/40 hover:bg-black/70 text-white transition-colors cursor-pointer"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>

        {/* Bottom Reply Bar (Hidden when viewing own status, displays views count instead) */}
        {isMyStatus ? (
          <div className="p-3 bg-[#202c33] border-t border-[#2a3942] flex items-center justify-between text-xs text-[#8696a0]">
            <div className="flex items-center space-x-2">
              <Eye className="w-4 h-4 text-[#00a884]" />
              <span className="text-[#e9edef] font-medium">12 views</span>
            </div>
            <button
              onClick={handleDeleteCurrent}
              className="flex items-center space-x-1 text-red-400 hover:text-red-300 cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
              <span>Delete update</span>
            </button>
          </div>
        ) : (
          <div className="p-3 bg-[#202c33] border-t border-[#2a3942] flex flex-col space-y-2">
            {/* Quick Reaction Emojis */}
            <div className="flex items-center justify-around py-1 text-xl">
              {['❤️', '😂', '😮', '😢', '🙏', '👏'].map(emoji => (
                <button
                  key={emoji}
                  onClick={() => handleSendReply(emoji)}
                  className="hover:scale-125 transition-transform cursor-pointer"
                >
                  {emoji}
                </button>
              ))}
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={replyText}
                onChange={e => setReplyText(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSendReply()}
                onFocus={() => setIsPaused(true)}
                onBlur={() => setIsPaused(false)}
                placeholder="Reply to status..."
                className="flex-1 bg-[#2a3942] text-sm text-[#e9edef] px-4 py-2.5 rounded-lg outline-none placeholder-[#8696a0]"
              />
              <button
                onClick={() => handleSendReply()}
                disabled={!replyText.trim()}
                className="p-2.5 bg-[#00a884] disabled:bg-[#2a3942] text-white disabled:text-[#8696a0] rounded-lg transition-colors cursor-pointer"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
