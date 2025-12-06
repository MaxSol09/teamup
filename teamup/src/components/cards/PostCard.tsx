'use client';

import React from 'react';
import { Post } from '@/types/posts';
import { useRouter } from 'next/navigation';

interface PostCardProps {
  post: Post;
  hasResponded?: boolean; // Передаётся извне, если нужно проверить отклик
}

export const PostCard = ({ post, hasResponded = false }: PostCardProps) => {
  const router = useRouter();

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

  const handleCardClick = () => {
    router.push(`/posts/${post._id}`);
  };

  const handleRespondClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    // TODO: Реализовать логику отклика
    console.log('Отклик на объявление:', post._id);
  };

  return (
    <div
      onClick={handleCardClick}
      className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:shadow-md hover:border-blue-300 transition-all duration-200 cursor-pointer flex flex-col h-full"
    >
      {/* Бейдж типа и тема */}
      <div className="flex items-center gap-2 mb-3 flex-wrap">
        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
          Объявление
        </span>
        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
          {post.theme}
        </span>
      </div>

      {/* Заголовок */}
      <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
        {post.title}
      </h3>

      {/* Описание (3 строки) */}
      <p className="text-sm text-gray-600 mb-4 line-clamp-3 flex-1">
        {post.description}
      </p>

      {/* Теги */}
      {post.tags && post.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-4">
          {post.tags.slice(0, 3).map((tag, index) => (
            <span
              key={index}
              className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-50 text-gray-600 border border-gray-200"
            >
              {tag}
            </span>
          ))}
          {post.tags.length > 3 && (
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium text-gray-500">
              +{post.tags.length - 3}
            </span>
          )}
        </div>
      )}

      {/* Владелец и дата */}
      <div className="flex items-center justify-between mb-4 pt-4 border-t border-gray-100">
        <div className="flex items-center gap-2">
          {post.owner.avatar ? (
            <img
              src={post.owner.avatar}
              alt={post.owner.name}
              className="w-8 h-8 rounded-full object-cover"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-xs font-semibold">
              {post.owner.name.charAt(0).toUpperCase()}
            </div>
          )}
          <span className="text-sm font-medium text-gray-700">
            {post.owner.name}
          </span>
        </div>
        <span className="text-xs text-gray-500">
          {formatDate(post.createdAt)}
        </span>
      </div>

      {/* Кнопка отклика */}
      <button
        onClick={handleRespondClick}
        disabled={hasResponded}
        className={`w-full px-4 py-2.5 rounded-lg font-medium text-sm transition-colors ${
          hasResponded
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
            : 'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800'
        }`}
      >
        {hasResponded ? 'Отклик отправлен' : 'Откликнуться'}
      </button>
    </div>
  );
};
