import React from 'react';
import { useWhatsApp } from '../../context/WhatsAppContext';
import { ChatsListView } from '../views/ChatsListView';
import { ArchivedView } from '../views/ArchivedView';
import { StatusListView } from '../views/StatusListView';
import { ChannelsListView } from '../views/ChannelsListView';
import { CommunitiesListView } from '../views/CommunitiesListView';
import { NewChatView } from '../views/NewChatView';
import { NewContactView } from '../views/NewContactView';
import { NewGroupView } from '../views/NewGroupView';
import { StarredMessagesView } from '../views/StarredMessagesView';
import { AppLockView } from '../views/AppLockView';
import { SelectChatsView } from '../views/SelectChatsView';
import { SettingsView } from '../views/SettingsView';
import { SettingsProfileView } from '../views/settings/SettingsProfileView';
import { SettingsAccountView } from '../views/settings/SettingsAccountView';
import { SettingsPrivacyView } from '../views/settings/SettingsPrivacyView';
import { SettingsChatsView } from '../views/settings/SettingsChatsView';
import { SettingsNotificationsView } from '../views/settings/SettingsNotificationsView';
import { SettingsKeyboardShortcutsView } from '../views/settings/SettingsKeyboardShortcutsView';
import { SettingsHelpView } from '../views/settings/SettingsHelpView';

export const Sidebar: React.FC = () => {
  const { activeNavTab, subView } = useWhatsApp();

  const renderContent = () => {
    // 1. Settings subviews
    if (subView === 'settings-profile') return <SettingsProfileView />;
    if (subView === 'settings-account') return <SettingsAccountView />;
    if (subView === 'settings-privacy') return <SettingsPrivacyView />;
    if (subView === 'settings-chats') return <SettingsChatsView />;
    if (subView === 'settings-notifications') return <SettingsNotificationsView />;
    if (subView === 'settings-keyboard') return <SettingsKeyboardShortcutsView />;
    if (subView === 'settings-help') return <SettingsHelpView />;

    // 2. Chat action subviews
    if (subView === 'archived') return <ArchivedView />;
    if (subView === 'new-chat') return <NewChatView />;
    if (subView === 'new-group' || subView === 'new-group-info') return <NewGroupView />;
    if (subView === 'new-contact') return <NewContactView />;
    if (subView === 'new-community') return <CommunitiesListView />;
    if (subView === 'starred') return <StarredMessagesView />;
    if (subView === 'app-lock') return <AppLockView />;
    if (subView === 'select-chats') return <SelectChatsView />;

    // 3. Navigation Tabs
    switch (activeNavTab) {
      case 'status':
        return <StatusListView />;
      case 'channels':
        return <ChannelsListView />;
      case 'communities':
        return <CommunitiesListView />;
      case 'settings':
        return <SettingsView />;
      case 'chats':
      default:
        return <ChatsListView />;
    }
  };

  return (
    <div className="w-full md:w-[400px] lg:w-[450px] h-full flex flex-col bg-[#111b21] border-r border-[#222d34] select-none shrink-0 overflow-hidden">
      {renderContent()}
    </div>
  );
};
