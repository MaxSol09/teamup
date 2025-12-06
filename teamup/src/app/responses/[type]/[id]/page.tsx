/**
 * Страница деталей сущности с откликами и рекомендованными пользователями
 * /responses/:type/:id
 */

'use client';

import { useEffect, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import MainLayout from '@/components/MainLayout';
import { EmptyState } from '@/components/EmptyState';
import { useResponsesStore } from '@/store/responsesStore';
import { ItemHeader } from '../../components/ItemHeader';
import { DetailsTabs } from '../../components/DetailsTabs';
import { ApplicantsFilters } from '../../components/ApplicantsFilters';
import { ApplicantCard } from '../../components/ApplicantCard';
import { RecommendedUserCard } from '../../components/RecommendedUserCard';
import { ResponseStatus } from '@/types/responses';

export default function ResponseDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const type = params.type as string;
  const id = params.id as string;

  const {
    ownerData,
    ownerDataLoading,
    ownerDataError,
    activeTab,
    statusFilter,
    fetchOwnerResponses,
    setActiveTab,
  } = useResponsesStore();

  // Загружаем данные при монтировании и изменении параметров
  useEffect(() => {
    if (type && id) {
      fetchOwnerResponses(type, id);
    }
  }, [type, id, fetchOwnerResponses]);

  // Фильтруем отклики по статусу
  const filteredResponses = useMemo(() => {
    if (!ownerData) return [];
    
    if (statusFilter === 'all') {
      return ownerData.responses;
    }
    
    return ownerData.responses.filter(r => r.status === statusFilter);
  }, [ownerData, statusFilter]);

  // Обработка ошибок
  if (ownerDataError) {
    return (
      <MainLayout>
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <p className="text-red-700">{ownerDataError}</p>
          <button
            onClick={() => router.back()}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Назад
          </button>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
          {/* Кнопка "Назад" */}
          <button
            onClick={() => router.back()}
            className="mb-4 flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Назад
          </button>

          {/* Загрузка деталей */}
          {ownerDataLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : ownerData ? (
            <>
              {/* Заголовок с информацией о сущности */}
              <ItemHeader data={ownerData} />

              {/* Вкладки */}
              <DetailsTabs />

              {/* Контент вкладок */}
              {activeTab === 'applicants' ? (
                <>
                  {/* Фильтры */}
                  <ApplicantsFilters />

                  {/* Список откликов */}
                  {filteredResponses.length > 0 ? (
                    <div className="space-y-4">
                      {filteredResponses.map((applicant) => (
                        <ApplicantCard
                          key={applicant._id}
                          applicant={applicant}
                          itemTheme={ownerData.target.theme}
                        />
                      ))}
                    </div>
                  ) : (
                    <EmptyState
                      title="Нет откликов"
                      description="Пока никто не откликнулся на это объявление/проект/сообщество."
                    />
                  )}
                </>
              ) : (
                <>
                  {/* Рекомендованные пользователи */}
                  {ownerData.recommendedUsers.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {ownerData.recommendedUsers.map((user) => (
                        <RecommendedUserCard
                          key={user._id}
                          user={user}
                        />
                      ))}
                    </div>
                  ) : (
                    <EmptyState
                      title="Нет рекомендованных пользователей"
                      description="Пока нет пользователей, которые подходят по навыкам и интересам."
                    />
                  )}
                </>
              )}
            </>
          ) : null}
    </MainLayout>
  );
}
