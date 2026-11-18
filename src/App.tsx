import React, { useState } from 'react';
import { WhatsAppProvider, useWhatsApp } from './context/WhatsAppContext';
import { AuthQRScreen } from './components/auth/AuthQRScreen';
import { NavRail } from './components/navigation/NavRail';
import { Sidebar } from './components/sidebar/Sidebar';
import { ChatArea } from './components/chat/ChatArea';
import { ContactInfoDrawer } from './components/rightpanel/ContactInfoDrawer';
import { SearchMessagesDrawer } from './components/rightpanel/SearchMessagesDrawer';
import { CallModal } from './components/modals/CallModal';
import { MediaViewerModal } from './components/modals/MediaViewerModal';
import { PollModal } from './components/modals/PollModal';
import { AppLockModal } from './components/modals/AppLockModal';
import { ThoughtModal } from './components/modals/ThoughtModal';
import { NewStatusModal } from './components/modals/NewStatusModal';
import { StatusViewerModal } from './components/modals/StatusViewerModal';
import { ChatNotificationToast } from './components/chat/ChatNotificationToast';

const WhatsAppMain: React.FC = () => {
  const { isAuthenticated, activeRightDrawer, activeToast, dismissToast, setActiveChatId } = useWhatsApp();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isPollModalOpen, setIsPollModalOpen] = useState(false);

  if (!isAuthenticated) {
    return <AuthQRScreen />;
  }

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#f0f2f5] dark:bg-[#111b21] flex select-none">
      {/* 1. Far Left Navigation Rail (60px) */}
      <NavRail />

      {/* 2. Middle Panel (Chats / Archived / Status / Channels / Communities / Settings) */}
      <Sidebar />

      {/* 3. Main Center Canvas (Active Chat or Empty State) */}
      <ChatArea
        onOpenPollModal={() => setIsPollModalOpen(true)}
        onImageClick={url => setSelectedImage(url)}
      />

      {/* 4. Right Drawers */}
      {activeRightDrawer === 'contact-info' && <ContactInfoDrawer />}
      {activeRightDrawer === 'search-chat' && <SearchMessagesDrawer />}

      {/* Global Modals */}
      <CallModal />
      <AppLockModal />
      <ThoughtModal />
      <NewStatusModal />
      <StatusViewerModal />
      <MediaViewerModal
        imageUrl={selectedImage}
        onClose={() => setSelectedImage(null)}
      />
      <PollModal
        isOpen={isPollModalOpen}
        onClose={() => setIsPollModalOpen(false)}
      />

      {/* Bottom Right WhatsApp Notification Toast */}
      <ChatNotificationToast
        notification={activeToast}
        onClose={dismissToast}
        onClick={chatId => {
          setActiveChatId(chatId);
          dismissToast();
        }}
      />
    </div>
  );
};

export function App() {
  return (
    <WhatsAppProvider>
      <WhatsAppMain />
    </WhatsAppProvider>
  );
}

export default App;
