import React from 'react';
import { useWhatsApp } from '../../context/WhatsAppContext';
import { Plus, MoreVertical, Trash2 } from 'lucide-react';

export const StatusListView: React.FC = () => {
  const { userStatuses, setViewingStatus, currentUser, setIsNewStatusModalOpen, deleteStatus } = useWhatsApp();

  const myStatus = userStatuses.find(s => s.userId === 'me');

  return (
    <div className="flex-1 flex flex-col h-full bg-[#111b21] select-none overflow-hidden animate-in slide-in-from-left duration-150">
      {/* Header */}
      <div className="h-[60px] px-4 flex items-center justify-between border-b border-[#222d34] shrink-0">
        <h2 className="text-xl font-bold text-[#e9edef]">Status</h2>
        <div className="flex items-center space-x-2 text-[#aebac1]">
          <button className="p-2 hover:bg-[#202c33] rounded-full transition-colors cursor-pointer">
            <MoreVertical className="w-5 h-5" />
          </button>
          <button
            onClick={() => setIsNewStatusModalOpen(true)}
            className="p-2 hover:bg-[#202c33] rounded-full transition-colors cursor-pointer text-[#00a884]"
            title="Add status update"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {/* My Status */}
        <div
          onClick={() => {
            if (myStatus && myStatus.items.length > 0) {
              setViewingStatus(myStatus);
            } else {
              setIsNewStatusModalOpen(true);
            }
          }}
          className="flex items-center space-x-4 p-2 rounded-lg hover:bg-[#202c33] cursor-pointer transition-colors"
        >
          <div className="relative">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-11 h-11 rounded-full object-cover"
            />
            <button
              onClick={e => {
                e.stopPropagation();
                setIsNewStatusModalOpen(true);
              }}
              className="absolute bottom-0 right-0 w-4 h-4 bg-[#00a884] rounded-full flex items-center justify-center text-white border-2 border-[#111b21] hover:scale-110 cursor-pointer"
            >
              <Plus className="w-3 h-3 stroke-[3]" />
            </button>
          </div>
          <div className="flex-1">
            <h3 className="text-base font-normal text-[#e9edef]">My status</h3>
            <p className="text-xs text-[#8696a0]">
              {myStatus && myStatus.items.length > 0
                ? `${myStatus.items.length} update(s)`
                : 'Click to add status update'}
            </p>
          </div>
          {myStatus && myStatus.items.length > 0 && (
            <button
              onClick={e => {
                e.stopPropagation();
                if (myStatus.items[0]) {
                  deleteStatus(myStatus.items[0].id);
                }
              }}
              className="p-1.5 text-[#8696a0] hover:text-red-400 rounded-full hover:bg-white/5 transition-colors cursor-pointer"
              title="Delete latest status"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Recent updates */}
        {userStatuses.filter(s => s.userId !== 'me').length > 0 && (
          <div>
            <h4 className="text-xs font-semibold text-[#00a884] uppercase tracking-wider px-2 mb-2">
              Recent updates
            </h4>
            <div className="space-y-1">
              {userStatuses
                .filter(s => s.userId !== 'me')
                .map(st => (
                  <div
                    key={st.userId}
                    onClick={() => setViewingStatus(st)}
                    className="flex items-center space-x-3.5 p-2 rounded-lg hover:bg-[#202c33] cursor-pointer transition-colors"
                  >
                    <div
                      className={`p-0.5 rounded-full ${
                        st.allSeen ? 'border-2 border-[#8696a0]' : 'border-2 border-[#00a884]'
                      }`}
                    >
                      <img
                        src={st.userAvatar}
                        alt={st.userName}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    </div>
                    <div className="flex-1 border-b border-[#222d34] pb-2">
                      <h3 className="text-base font-normal text-[#e9edef]">{st.userName}</h3>
                      <p className="text-xs text-[#8696a0]">{st.items[0]?.timestamp}</p>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
