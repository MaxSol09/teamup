import { useMainStore } from '@/store/mainStore';

type TabType = 'posts' | 'projects' | 'communities';

export const ResponsesTabs = () => {
  const { activeTab, setActiveTab } = useMainStore();

  return (
    <div className="border-b border-gray-200">
      <div className="flex overflow-x-auto scrollbar-hide">
        {(['posts', 'projects', 'communities'] as TabType[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`relative px-6 py-4 text-sm font-medium transition-colors whitespace-nowrap ${
              activeTab === tab
                ? 'text-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {tab === 'posts' && 'Объявления'}
            {tab === 'projects' && 'Проекты'}
            {tab === 'communities' && 'Сообщества'}
            {/* Underline Animation */}
            <span
              className={`absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 transition-all duration-300 ${
                activeTab === tab ? 'opacity-100' : 'opacity-0'
              }`}
            />
          </button>
        ))}
      </div>
    </div>
  );
};
