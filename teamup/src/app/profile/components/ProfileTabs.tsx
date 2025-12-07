'use client';

import { useProfileStore, TabType } from '@/store/profileStore';
import { FileText, FolderKanban, Users, MessageSquare } from 'lucide-react';

export const ProfileTabs = () => {
  const { activeTab, setActiveTab } = useProfileStore();

  const tabs: { key: TabType; label: string; icon: React.ReactNode }[] = [
    { key: 'posts', label: 'Объявления', icon: <FileText className="w-4 h-4" /> },
    { key: 'projects', label: 'Проекты', icon: <FolderKanban className="w-4 h-4" /> },
    { key: 'communities', label: 'Сообщества', icon: <Users className="w-4 h-4" /> },
    { key: 'my-responses', label: 'Мои отклики', icon: <MessageSquare className="w-4 h-4" /> },
  ];

  return (
    <div className="border-t border-gray-100 bg-gray-50/50">
      <div className="flex overflow-x-auto scrollbar-hide">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`relative px-6 py-4 text-sm font-medium transition-all duration-200 whitespace-nowrap flex items-center gap-2 ${
                isActive
                  ? 'text-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <span className={isActive ? 'text-blue-600' : 'text-gray-500'}>
                {tab.icon}
              </span>
              {tab.label}
              {isActive && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 transition-all duration-200" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
