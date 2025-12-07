'use client';

import React from 'react';
import { Project } from '@/types/project';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';

interface ProjectCardProps {
  project: Project;
  hasResponded?: boolean; // Передаётся извне, если нужно проверить отклик
}

export const ProjectCard = ({ project, hasResponded = false }: ProjectCardProps) => {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const isOwner = user?._id === project.owner._id;

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
    router.push(`/projects/${project._id}`);
  };

  const handleActionClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (project.chatId) {
      // TODO: Переход в чат
      router.push(`/chat/${project.chatId}`);
    } else {
      // TODO: Реализовать логику отклика
      console.log('Отклик на проект:', project._id);
    }
  };

  const showChatButton = hasResponded && project.chatId;

  return (
    <div
      onClick={handleCardClick}
      className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:shadow-md hover:border-purple-300 transition-all duration-200 cursor-pointer flex flex-col h-full"
    >
      {/* Бейдж типа и тема */}
      <div className="flex items-center gap-2 mb-3 flex-wrap">
        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
          Проект
        </span>
        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
          {project.theme}
        </span>
      </div>

      {/* Заголовок */}
      <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
        {project.title}
      </h3>

      {/* Описание (3 строки) */}
      <p className="text-sm text-gray-600 mb-4 line-clamp-3 flex-1">
        {project.description}
      </p>

      {/* Теги */}
      {project.tags && project.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-4">
          {project.tags.slice(0, 3).map((tag, index) => (
            <span
              key={index}
              className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-50 text-gray-600 border border-gray-200"
            >
              {tag}
            </span>
          ))}
          {project.tags.length > 3 && (
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium text-gray-500">
              +{project.tags.length - 3}
            </span>
          )}
        </div>
      )}

      {/* Владелец и дата */}
      <div className="flex items-center justify-between mb-4 pt-4 border-t border-gray-100">
        <div className="flex items-center gap-2">
          {project.owner.avatar ? (
            <img
              src={project.owner.avatar}
              alt={project.owner.name}
              className="w-8 h-8 rounded-full object-cover"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 text-xs font-semibold">
              {project.owner.name.charAt(0).toUpperCase()}
            </div>
          )}
          <span className="text-sm font-medium text-gray-700">
            {project.owner.name}
          </span>
        </div>
        <span className="text-xs text-gray-500">
          {formatDate(project.createdAt)}
        </span>
      </div>

      {/* Кнопка действия */}
      {!isOwner && (
        <button
          onClick={handleActionClick}
          className="w-full px-4 py-2.5 rounded-lg font-medium text-sm bg-purple-600 text-white hover:bg-purple-700 active:bg-purple-800 transition-colors"
        >
          {showChatButton ? 'Написать владельцу' : 'Откликнуться в проект'}
        </button>
      )}
    </div>
  );
};
