import { useProfileStore, TabType } from '@/store/profileStore';

export const ProfileTabs = () => {
    const { activeTab, setActiveTab } = useProfileStore();

    const tabs: { key: TabType; label: string }[] = [
        { key: 'posts', label: 'Объявления' },
        { key: 'projects', label: 'Проекты' },
        { key: 'communities', label: 'Сообщества' },
        { key: 'my-responses', label: 'Мои отклики' },
    ];

    return (
        <div className="border-t border-gray-200">
            <div className="flex overflow-x-auto scrollbar-hide">
            {tabs.map((tab) => (
                <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`relative px-6 py-4 text-sm font-medium transition-colors whitespace-nowrap ${
                        activeTab === tab.key
                        ? 'text-blue-600'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                >
                {tab.label}
                {/* Underline Animation */}
                <span
                    className={`absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 transition-all duration-300 ${
                    activeTab === tab.key ? 'opacity-100' : 'opacity-0'
                    }`}
                />
                </button>
            ))}
            </div>
        </div>
    )
}
