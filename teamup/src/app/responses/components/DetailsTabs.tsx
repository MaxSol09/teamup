/**
 * Вкладки на странице деталей: "Отклики" и "Рекомендованные"
 */

import { useResponsesStore } from '@/store/responsesStore';

export const DetailsTabs = () => {
  const { activeTab, setActiveTab } = useResponsesStore();

  return (
    <div className="border-b border-gray-200 mb-6">
      <div className="flex">
        <button
          onClick={() => setActiveTab('applicants')}
          className={`relative px-6 py-4 text-sm font-medium transition-colors ${
            activeTab === 'applicants'
              ? 'text-blue-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Отклики
          <span
            className={`absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 transition-all duration-300 ${
              activeTab === 'applicants' ? 'opacity-100' : 'opacity-0'
            }`}
          />
        </button>
        <button
          onClick={() => setActiveTab('recommended')}
          className={`relative px-6 py-4 text-sm font-medium transition-colors ${
            activeTab === 'recommended'
              ? 'text-blue-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Рекомендованные
          <span
            className={`absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 transition-all duration-300 ${
              activeTab === 'recommended' ? 'opacity-100' : 'opacity-0'
            }`}
          />
        </button>
      </div>
    </div>
  );
};

