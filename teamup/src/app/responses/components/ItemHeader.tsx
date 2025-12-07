/**
 * Заголовок страницы деталей с информацией о сущности
 */

import { OwnerResponsesDTO } from '@/types/responses';

interface ItemHeaderProps {
  data: OwnerResponsesDTO;
}

export const ItemHeader = ({ data }: ItemHeaderProps) => {
  const getTypeLabel = () => {
    switch (data.target.type) {
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
    switch (data.target.type) {
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
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-3">
            <span className={`text-xs font-medium px-2 py-1 rounded border ${getTypeColor()}`}>
              {getTypeLabel()}
            </span>
            <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded">
              {data.target.theme}
            </span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{data.target.title}</h1>
          
          {/* Теги */}
          {data.target.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {data.target.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Дополнительная информация */}
      <div className="flex items-center gap-6 pt-4 border-t border-gray-100 text-sm text-gray-500">
        <div>
          <span className="font-medium">Создано:</span>{' '}
          {new Date(data.target.createdAt).toLocaleDateString('ru-RU', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          })}
        </div>
        <div>
          <span className="font-medium">Откликов:</span> {data.responses.length}
        </div>
      </div>
    </div>
  );
};

