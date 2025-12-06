/**
 * Главная страница "Отклики"
 * Показывает список моих проектов, объявлений и сообществ с метаданными об откликах
 * При клике на карточку - переход на страницу деталей /responses/:type/:id
 */

'use client';

import { useEffect } from 'react';
import MainLayout from '@/components/MainLayout';
import { EmptyState } from '@/components/EmptyState';
import { useResponsesStore } from '@/store/responsesStore';
import { MyItemCard } from './components/MyItemCard';

export default function ResponsesPage() {
  const { myItems, myItemsLoading, myItemsError, fetchMyItems } = useResponsesStore();

  useEffect(() => {
    fetchMyItems();
  }, [fetchMyItems]);

  const getEmptyStateConfig = () => {
    return {
      title: 'Нет объявлений, проектов и сообществ',
      description: 'У вас пока нет объявлений, проектов или сообществ. Создайте первую сущность, чтобы начать получать отклики.',
      buttonText: 'Создать объявление',
      onClick: () => {
        // TODO: Навигация на страницу создания
        console.log('Создать объявление/проект/сообщество');
      },
    };
  };

  // Группируем по типам для лучшего UX
  const posts = myItems.filter(item => item.type === 'post');
  const projects = myItems.filter(item => item.type === 'project');
  const communities = myItems.filter(item => item.type === 'community');

  const hasItems = myItems.length > 0;

  return (
    <MainLayout>
          {/* Заголовок страницы */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Отклики</h1>
            <p className="text-gray-600">
              Управляйте откликами на ваши объявления, проекты и сообщества
            </p>
          </div>

          {/* Ошибка загрузки */}
          {myItemsError && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-700">{myItemsError}</p>
            </div>
          )}

          {/* Загрузка */}
          {myItemsLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : !hasItems ? (
            <EmptyState {...getEmptyStateConfig()} />
          ) : (
            <div className="space-y-8">
              {/* Объявления */}
              {posts.length > 0 && (
                <section>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Объявления</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {posts.map((item) => (
                      <MyItemCard key={item._id} item={item} />
                    ))}
                  </div>
                </section>
              )}

              {/* Проекты */}
              {projects.length > 0 && (
                <section>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Проекты</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {projects.map((item) => (
                      <MyItemCard key={item._id} item={item} />
                    ))}
                  </div>
                </section>
              )}

              {/* Сообщества */}
              {communities.length > 0 && (
                <section>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Сообщества</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {communities.map((item) => (
                      <MyItemCard key={item._id} item={item} />
                    ))}
                  </div>
                </section>
              )}
            </div>
          )}
    </MainLayout>
  );
}
