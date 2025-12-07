'use client';

import React from 'react';
import { Event } from '@/types/events';
import { useJoinEvent, useLeaveEvent } from '@/hooks/useEvents';
import { useAuthStore } from '@/store/authStore';
import { Calendar, Users, Heart, UserCheck } from 'lucide-react';
import { UserStatus } from '@/types/user';
import { getMatchingStatuses } from '@/utils/mockEvents';

interface EventCardProps {
  event: Event;
  isLikeMinded?: boolean; // Подходит ли пользователь по навыкам/интересам
}

export const EventCard = ({ event, isLikeMinded = false }: EventCardProps) => {
  const joinMutation = useJoinEvent();
  const leaveMutation = useLeaveEvent();
  const user = useAuthStore((state) => state.user);
  const isParticipant = event.isParticipant || false;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleJoin = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) return;
    try {
      await joinMutation.mutateAsync(event._id);
    } catch (error) {
      console.error('Ошибка при записи на мероприятие:', error);
    }
  };

  const handleLeave = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) return;
    try {
      await leaveMutation.mutateAsync(event._id);
    } catch (error) {
      console.error('Ошибка при отписке от мероприятия:', error);
    }
  };

  const isLoading = joinMutation.isPending || leaveMutation.isPending;

  return (
    <div
      className={`bg-white rounded-xl shadow-sm p-6 border transition-all duration-200 flex flex-col h-full ${
        isLikeMinded
          ? 'border-orange-300 hover:shadow-lg hover:border-orange-400 bg-orange-50/30'
          : 'border-gray-200 hover:shadow-md hover:border-orange-300'
      }`}
    >
      {/* Бейдж типа и тема */}
      <div className="flex items-center gap-2 mb-3 flex-wrap">
        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-700">
          Мероприятие
        </span>
        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
          {event.theme}
        </span>
        {isLikeMinded && (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-orange-200 text-orange-800">
            <Heart className="w-3 h-3" />
            Подходящий матч
          </span>
        )}
      </div>

      {/* Заголовок */}
      <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
        {event.title}
      </h3>

      {/* Описание */}
      <p className="text-sm text-gray-600 mb-4 line-clamp-3 flex-1">
        {event.description}
      </p>

      {/* Теги */}
      {event.tags && event.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-4">
          {event.tags.slice(0, 3).map((tag, index) => (
            <span
              key={index}
              className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-50 text-gray-600 border border-gray-200"
            >
              {tag}
            </span>
          ))}
          {event.tags.length > 3 && (
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium text-gray-500">
              +{event.tags.length - 3}
            </span>
          )}
        </div>
      )}

      {/* Дата и статистика */}
      <div className="space-y-3 mb-4 pt-4 border-t border-gray-100">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Calendar className="w-4 h-4" />
          <span>{formatDate(event.date)}</span>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1.5 text-gray-600">
            <Users className="w-4 h-4" />
            <span>{event.participantsCount} участников</span>
          </div>
          {event.likeMindedCount > 0 && (
            <div className="flex items-center gap-1.5 text-orange-600">
              <Heart className="w-4 h-4" />
              <span>{event.likeMindedCount} единомышленников</span>
            </div>
          )}
        </div>

        {/* Статистика по статусам участников */}
        {event.participantsByStatus && (() => {
          // Если пользователь авторизован, показываем подходящие для него статусы
          let matchingStatuses: UserStatus[] = [];
          let matchingCount = 0;
          
          if (user) {
            matchingStatuses = getMatchingStatuses(user.status);
            matchingCount = matchingStatuses.reduce((sum, status) => {
              return sum + (event.participantsByStatus?.[status] || 0);
            }, 0);
          }

          const totalParticipants = Object.values(event.participantsByStatus).reduce((sum, count) => sum + count, 0);

          return (
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-3 border-2 border-blue-200">
              {user && matchingCount > 0 && (
                <div className="flex items-center gap-2 mb-3 pb-2 border-b border-blue-200">
                  <UserCheck className="w-5 h-5 text-blue-600" />
                  <div className="flex-1">
                    <span className="text-sm font-bold text-blue-900 block">
                      Участники с подходящим статусом
                    </span>
                    <span className="text-lg font-extrabold text-blue-700">
                      {matchingCount} из {totalParticipants}
                    </span>
                  </div>
                </div>
              )}
              <div className="space-y-1.5">
                <span className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
                  Распределение по статусам:
                </span>
                <div className="grid grid-cols-1 gap-1.5">
                  {Object.entries(event.participantsByStatus).map(([status, count]) => {
                    const isMatching = user ? matchingStatuses.includes(status as UserStatus) : false;
                    const percentage = totalParticipants > 0 ? Math.round((count / totalParticipants) * 100) : 0;
                    return (
                      <div
                        key={status}
                        className={`flex items-center justify-between px-3 py-2 rounded-lg transition-all ${
                          isMatching
                            ? 'bg-blue-200 text-blue-900 border-2 border-blue-400 shadow-sm'
                            : 'bg-white text-gray-700 border border-gray-200'
                        }`}
                      >
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          {isMatching && (
                            <div className="w-2 h-2 rounded-full bg-blue-600 flex-shrink-0"></div>
                          )}
                          <span className={`text-xs font-medium truncate ${isMatching ? 'font-semibold' : ''}`}>
                            {status}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <div className={`w-16 h-1.5 rounded-full overflow-hidden ${
                            isMatching ? 'bg-blue-300' : 'bg-gray-200'
                          }`}>
                            <div
                              className={`h-full ${
                                isMatching ? 'bg-blue-600' : 'bg-gray-400'
                              }`}
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                          <span className={`text-xs font-bold min-w-[2rem] text-right ${
                            isMatching ? 'text-blue-900' : 'text-gray-600'
                          }`}>
                            {count}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })()}
      </div>

      {/* Кнопка действия */}
      {user && (
        <button
          onClick={isParticipant ? handleLeave : handleJoin}
          disabled={isLoading}
          className={`w-full px-4 py-2.5 rounded-lg font-medium text-sm transition-colors ${
            isParticipant
              ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              : 'bg-orange-600 text-white hover:bg-orange-700 active:bg-orange-800'
          } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {isLoading
            ? 'Загрузка...'
            : isParticipant
            ? 'Отписаться'
            : 'Записаться'}
        </button>
      )}
    </div>
  );
};


