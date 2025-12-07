'use client';

import React from 'react';
import { Community } from '@/types/communities';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';

interface CommunityCardProps {
  community: Community;
  hasJoined?: boolean; // Передаётся извне, если нужно проверить участие
}

export const CommunityCard = ({ community, hasJoined = false }: CommunityCardProps) => {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const isOwner = user?._id === community.owner._id;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) return 'Сегодня';
    if (days === 1) return 'Вчера';
    if (days < 7) return `${days} дня назад`;
    if (days < 30) return `${Math.floor(days / 7)} недели назад`;
    
    return date.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const formatMembersCount = (count: number) => {
    if (count === 1) return '1 участник';
    if (count < 5) return `${count} участника`;
    return `${count} участников`;
  };

  const handleCardClick = () => {
    router.push(`/communities/${community._id}`);
  };

  const handleActionClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (hasJoined) {
      router.push(`/communities/${community._id}`);
    } else {
      // TODO: Реализовать логику вступления/заявки
      console.log(community.isPublic ? 'Вступление в сообщество' : 'Отправка заявки:', community._id);
    }
  };

  return (
    <div
      onClick={handleCardClick}
      className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:shadow-md hover:border-green-300 transition-all duration-200 cursor-pointer flex flex-col h-full"
    >
      {/* Бейдж типа и тема */}
      <div className="flex items-center gap-2 mb-3 flex-wrap">
        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
          Сообщество
        </span>
        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
          {community.theme}
        </span>
      </div>

      {/* Заголовок */}
      <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
        {community.title}
      </h3>

      {/* Описание (3 строки) */}
      <p className="text-sm text-gray-600 mb-4 line-clamp-3 flex-1">
        {community.description}
      </p>

      {/* Теги */}
      {community.tags && community.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-4">
          {community.tags.slice(0, 3).map((tag, index) => (
            <span
              key={index}
              className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-50 text-gray-600 border border-gray-200"
            >
              {tag}
            </span>
          ))}
          {community.tags.length > 3 && (
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium text-gray-500">
              +{community.tags.length - 3}
            </span>
          )}
        </div>
      )}

      {/* Владелец, участники и дата */}
      <div className="flex items-center justify-between mb-4 pt-4 border-t border-gray-100">
        <div className="flex items-center gap-2">
          {community.owner.avatar ? (
            <img
              src={community.owner.avatar}
              alt={community.owner.name}
              className="w-8 h-8 rounded-full object-cover"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600 text-xs font-semibold">
              {community.owner.name.charAt(0).toUpperCase()}
            </div>
          )}
          <div className="flex flex-col">
            <span className="text-sm font-medium text-gray-700">
              {community.owner.name}
            </span>
            <span className="text-xs text-gray-500">
              {formatMembersCount(community.membersCount)}
            </span>
          </div>
        </div>
        <span className="text-xs text-gray-500">
          {formatDate(community.createdAt)}
        </span>
      </div>

      {/* Кнопка действия */}
      {!isOwner && (
        <button
          onClick={handleActionClick}
          disabled={hasJoined}
          className={`w-full px-4 py-2.5 rounded-lg font-medium text-sm transition-colors ${
            hasJoined
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-green-600 text-white hover:bg-green-700 active:bg-green-800'
          }`}
        >
          {hasJoined
            ? 'Вы участник'
            : community.isPublic
            ? 'Вступить'
            : 'Отправить заявку'}
        </button>
      )}
    </div>
  );
};
