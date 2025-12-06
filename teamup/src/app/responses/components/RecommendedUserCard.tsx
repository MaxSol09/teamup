/**
 * Карточка рекомендованного пользователя
 * Отображается во вкладке "Рекомендованные" на странице деталей
 */

import { RecommendedUser } from '@/types/responses';

interface RecommendedUserCardProps {
  user: RecommendedUser;
}

export const RecommendedUserCard = ({ user }: RecommendedUserCardProps) => {
  const getMatchColor = (score: number) => {
    if (score >= 90) return 'bg-green-100 text-green-700 border-green-200';
    if (score >= 70) return 'bg-blue-100 text-blue-700 border-blue-200';
    return 'bg-yellow-100 text-yellow-700 border-yellow-200';
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-5 hover:border-gray-300 transition-colors">
      <div className="flex items-start gap-4">
        {/* Аватар */}
        <div className="flex-shrink-0">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-semibold text-lg">
            {user.name.charAt(0).toUpperCase()}
          </div>
        </div>

        {/* Контент */}
        <div className="flex-1 min-w-0">
          {/* Имя и специализация */}
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className="flex-1">
              <h4 className="font-semibold text-gray-900 mb-1">{user.name}</h4>
              {user.specialization && (
                <p className="text-sm text-gray-600">{user.specialization}</p>
              )}
            </div>
            {/* Процент совпадения */}
            <div className={`px-2 py-1 rounded border text-xs font-medium ${getMatchColor(user.matchScore)}`}>
              {user.matchScore}% совпадение
            </div>
          </div>

          {/* Навыки */}
          {user.skills.length > 0 && (
            <div className="mb-3">
              <div className="flex flex-wrap gap-1.5">
                {user.skills.slice(0, 4).map((skill, index) => (
                  <span
                    key={index}
                    className="px-2 py-0.5 bg-gray-100 text-gray-700 text-xs rounded"
                  >
                    {skill}
                  </span>
                ))}
                {user.skills.length > 4 && (
                  <span className="px-2 py-0.5 bg-gray-100 text-gray-500 text-xs rounded">
                    +{user.skills.length - 4}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Интересы */}
          {user.interests.length > 0 && (
            <div className="mb-3">
              <p className="text-xs text-gray-500 mb-1">Интересы:</p>
              <div className="flex flex-wrap gap-1.5">
                {user.interests.slice(0, 3).map((interest, index) => (
                  <span
                    key={index}
                    className="px-2 py-0.5 bg-blue-50 text-blue-700 text-xs rounded"
                  >
                    {interest}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
