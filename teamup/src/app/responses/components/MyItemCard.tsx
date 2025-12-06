/**
 * Карточка моей сущности (проект/объявление/сообщество)
 * Отображается на главной странице /responses
 */

import Link from 'next/link';

interface MyItemCardProps {
  item: {
    _id: string;
    type: 'post' | 'project' | 'community';
    title: string;
    theme: string;
    tags: string[];
    totalResponses: number;
    newResponses: number;
    createdAt: string;
  };
}

export const MyItemCard = ({ item }: MyItemCardProps) => {
  const getTypeLabel = () => {
    switch (item.type) {
      case 'post':
        return 'Объявление';
      case 'project':
        return 'Проект';
      case 'community':
        return 'Сообщество';
      default:
        return '';
    }
  };

  const getTypeColor = () => {
    switch (item.type) {
      case 'post':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'project':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'community':
        return 'bg-green-100 text-green-700 border-green-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <Link href={`/responses/${item.type}/${item._id}`}>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md hover:border-blue-300 transition-all p-6 h-full flex flex-col">
        {/* Заголовок с типом */}
        <div className="flex items-start justify-between mb-3">
          <span className={`text-xs font-medium px-2 py-1 rounded border ${getTypeColor()}`}>
            {getTypeLabel()}
          </span>
          <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded">
            {item.theme}
          </span>
        </div>

        {/* Название */}
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
          {item.title}
        </h3>

        {/* Теги */}
        {item.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {item.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="px-2 py-0.5 bg-gray-100 text-gray-700 text-xs rounded"
              >
                {tag}
              </span>
            ))}
            {item.tags.length > 3 && (
              <span className="px-2 py-0.5 bg-gray-100 text-gray-500 text-xs rounded">
                +{item.tags.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Статистика откликов */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-auto">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <svg
                className="w-4 h-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"
                />
              </svg>
              <span className="text-sm text-gray-600">
                {item.totalResponses} {item.totalResponses === 1 ? 'отклик' : item.totalResponses < 5 ? 'отклика' : 'откликов'}
              </span>
            </div>
            {item.newResponses > 0 && (
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></span>
                <span className="text-sm font-medium text-blue-600">
                  {item.newResponses} новых
                </span>
              </div>
            )}
          </div>

          {/* Кнопка "Открыть" */}
          <button className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors">
            Открыть
          </button>
        </div>
      </div>
    </Link>
  );
};
