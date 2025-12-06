import { OwnerItem, Response } from '@/types/responses';
import { ResponseCard } from './ResponseCard';

interface OwnerItemCardProps {
  item: OwnerItem;
  targetType: 'posts' | 'projects' | 'communities';
}

export const OwnerItemCard = ({ item, targetType }: OwnerItemCardProps) => {
  const hasResponses = item.responses.length > 0;
  
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow overflow-hidden">
      {/* Заголовок карточки */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-start justify-between gap-4 mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded">
                {item.theme}
              </span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {item.title}
            </h3>
            {item.description && (
              <p className="text-sm text-gray-600 line-clamp-2">
                {item.description}
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center justify-between text-sm text-gray-500">
          <span>
            {item.responses.length}{' '}
            {item.responses.length === 1
              ? 'отклик'
              : item.responses.length < 5
              ? 'отклика'
              : 'откликов'}
          </span>
        </div>
      </div>
      
      {/* Список откликов */}
      <div className="p-6 bg-gray-50">
        {hasResponses ? (
          <div className="space-y-3">
            {item.responses.map((response: Response) => (
              <ResponseCard
                key={response._id}
                response={response}
                itemTheme={item.theme}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="text-gray-400 mb-2">
              <svg
                className="w-12 h-12 mx-auto"
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
            </div>
            <p className="text-sm text-gray-500 font-medium">
              Пока нет откликов
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Отклики появятся здесь, когда пользователи откликнутся
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
