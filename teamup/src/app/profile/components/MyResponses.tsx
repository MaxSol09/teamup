'use client';

import { useEffect, useState } from 'react';
import { MyResponseDTO, ResponseStatus, TargetType } from '@/types/responses';
import { fetchMyResponses } from '@/api/responses';
import { EmptyState } from '@/components/EmptyState';
import Link from 'next/link';

type QuickTab = 'all' | 'active' | 'accepted' | 'rejected';

export const MyResponses = () => {
  const [allResponses, setAllResponses] = useState<MyResponseDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<ResponseStatus | 'all'>('all');
  const [targetTypeFilter, setTargetTypeFilter] = useState<TargetType | 'all'>('all');
  const [quickTab, setQuickTab] = useState<QuickTab>('all');

  useEffect(() => {
    loadResponses();
  }, []);

  // Синхронизация быстрых табов с фильтрами
  useEffect(() => {
    if (quickTab === 'all') {
      setStatusFilter('all');
    } else if (quickTab === 'active') {
      setStatusFilter('pending');
    } else if (quickTab === 'accepted') {
      setStatusFilter('accepted');
    } else if (quickTab === 'rejected') {
      setStatusFilter('rejected');
    }
  }, [quickTab]);

  const loadResponses = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchMyResponses();
      setAllResponses(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка загрузки откликов');
    } finally {
      setLoading(false);
    }
  };

  // Применяем фильтры к данным
  const getFilteredResponses = () => {
    let filtered = [...allResponses];

    // Фильтр по типу
    if (targetTypeFilter && targetTypeFilter !== 'all') {
      filtered = filtered.filter(r => r.target.type === targetTypeFilter);
    }

    // Фильтр по статусу
    if (statusFilter && statusFilter !== 'all') {
      filtered = filtered.filter(r => r.status === statusFilter);
    }

    // Сортировка по дате (новые сначала)
    filtered.sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return dateB - dateA;
    });

    return filtered;
  };

  const responses = getFilteredResponses();

  const getStatusBadge = (status: ResponseStatus) => {
    const config = {
      pending: { label: 'В ожидании', className: 'bg-yellow-100 text-yellow-800' },
      accepted: { label: 'Принят', className: 'bg-green-100 text-green-800' },
      rejected: { label: 'Отклонён', className: 'bg-red-100 text-red-800' },
    };

    const { label, className } = config[status] || config.pending;

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${className}`}>
        {label}
      </span>
    );
  };

  const getCardStyles = (status: ResponseStatus) => {
    const baseStyles = 'rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow border border-gray-100 flex flex-col';
    
    if (status === 'rejected') {
      return `${baseStyles} bg-gray-50 opacity-90`;
    }
    if (status === 'accepted') {
      return `${baseStyles} bg-green-50`;
    }
    if (status === 'pending') {
      return `${baseStyles} bg-yellow-50`;
    }
    return `${baseStyles} bg-white`;
  };

  const getTextColor = (status: ResponseStatus) => {
    if (status === 'rejected') {
      return {
        title: 'text-gray-700',
        owner: 'text-gray-600',
        date: 'text-gray-500',
        message: 'text-gray-600',
      };
    }
    return {
      title: 'text-gray-900',
      owner: 'text-gray-600',
      date: 'text-gray-500',
      message: 'text-gray-700',
    };
  };

  const getResponseContextText = (targetType: TargetType) => {
    const texts = {
      post: 'Вы отправили отклик владельцу объявления',
      project: 'Вы подали заявку на участие в проекте',
      community: 'Вы подали заявку на вступление в сообщество',
    };
    return texts[targetType] || texts.post;
  };

  const getTypeLabel = (type: string) => {
    const labels = {
      post: 'Объявление',
      project: 'Проект',
      community: 'Сообщество',
    };
    return labels[type as keyof typeof labels] || type;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const getTargetUrl = (type: string, id: string) => {
    const urls = {
      post: `/posts/${id}`,
      project: `/projects/${id}`,
      community: `/communities/${id}`,
    };
    return urls[type as keyof typeof urls] || '#';
  };

  const getChatUrl = (chatId?: string) => {
    return chatId ? `/chats/${chatId}` : '#';
  };

  // Скелетоны загрузки
  if (loading) {
    return (
      <div className="mt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-lg shadow-sm p-6 border border-gray-100 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
              <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3 mb-4"></div>
              <div className="flex gap-2">
                <div className="h-9 bg-gray-200 rounded flex-1"></div>
                <div className="h-9 bg-gray-200 rounded w-24"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Ошибка
  if (error) {
    return (
      <div className="mt-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      </div>
    );
  }

  // Пустое состояние
  if (responses.length === 0) {
    return (
      <div className="mt-6">
        <div className="bg-white rounded-lg border border-dashed border-gray-300 p-12 text-center">
          <div className="w-20 h-20 mx-auto mb-6 flex items-center justify-center">
            <svg
              className="w-full h-full text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            У вас пока нет откликов
          </h3>
          <p className="text-sm text-gray-500 mb-6 max-w-md mx-auto">
            Откликайтесь на проекты, объявления и сообщества, чтобы найти команду или участие
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            aria-label="Перейти к поиску проектов и объявлений"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
              />
            </svg>
            Перейти к поиску
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-6">
      {/* Быстрые табы */}
      <div className="mb-6">
        <div className="flex gap-2 border-b border-gray-200">
          {(['all', 'active', 'accepted', 'rejected'] as QuickTab[]).map((tab) => {
            const labels = {
              all: 'Все',
              active: 'Активные',
              accepted: 'Принятые',
              rejected: 'Отклонённые',
            };
            return (
              <button
                key={tab}
                onClick={() => setQuickTab(tab)}
                className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-t ${
                  quickTab === tab
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                }`}
                aria-label={`Показать ${labels[tab].toLowerCase()} отклики`}
              >
                {labels[tab]}
              </button>
            );
          })}
        </div>
      </div>

      {/* Фильтры и сортировка */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6 border border-gray-100">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Фильтр по типу */}
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Тип
            </label>
            <select
              value={targetTypeFilter}
              onChange={(e) =>
                setTargetTypeFilter(e.target.value as TargetType | 'all')
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              aria-label="Фильтр по типу объекта"
            >
              <option value="all">Все</option>
              <option value="post">Объявление</option>
              <option value="project">Проект</option>
              <option value="community">Сообщество</option>
            </select>
          </div>

          {/* Фильтр по статусу */}
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Статус
            </label>
            <select
              value={statusFilter}
              onChange={(e) => {
                const newStatus = e.target.value as ResponseStatus | 'all';
                setStatusFilter(newStatus);
                // Сбрасываем быстрый таб при ручном изменении статуса
                if (newStatus === 'all') setQuickTab('all');
                else if (newStatus === 'pending') setQuickTab('active');
                else if (newStatus === 'accepted') setQuickTab('accepted');
                else if (newStatus === 'rejected') setQuickTab('rejected');
                else setQuickTab('all');
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              aria-label="Фильтр по статусу отклика"
            >
              <option value="all">Все</option>
              <option value="pending">В ожидании</option>
              <option value="accepted">Принят</option>
              <option value="rejected">Отклонён</option>
            </select>
          </div>
        </div>
      </div>

      {/* Список откликов */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {responses.map((response) => {
          const targetUrl = getTargetUrl(response.target.type, response.target._id);
          const textColors = getTextColor(response.status);
          const minButtonHeight = 'min-h-[44px]';
          
          return (
            <div
              key={response._id}
              className={getCardStyles(response.status)}
            >
              {/* Тип объекта и статус */}
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded">
                  {getTypeLabel(response.target.type)}
                </span>
                {getStatusBadge(response.status)}
              </div>

              {/* Название объекта - кликабельное */}
              <Link
                href={targetUrl}
                className={`text-lg font-semibold ${textColors.title} mb-3 line-clamp-2 hover:text-blue-600 transition-colors cursor-pointer focus:outline-none`}
                aria-label={`Перейти к ${response.target.title}`}
              >
                {response.target.title}
              </Link>

              {/* Владелец */}
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
                  {response.target.owner.name.charAt(0).toUpperCase()}
                </div>
                <span className={`text-sm ${textColors.owner}`}>
                  {response.target.owner.name}
                </span>
              </div>

              {/* Контекстный микротекст */}
              <p className={`text-xs ${textColors.owner} mb-3`}>
                {getResponseContextText(response.target.type)}
              </p>

              {/* Дата отклика */}
              <p className={`text-xs ${textColors.date} mb-4`}>
                Отклик отправлен: {formatDate(response.createdAt)}
              </p>

              {/* Комментарий */}
              {response.message && (
                <p className={`text-sm ${textColors.message} mb-6 line-clamp-3 flex-1`}>
                  {response.message}
                </p>
              )}

              {/* Разделитель и кнопки действий */}
              <div className="border-t border-gray-200 pt-4 mt-auto">
                <div className="flex flex-col gap-3" style={{ minHeight: response.status === 'accepted' ? '88px' : '44px' }}>
                  {/* СТАТУС: "Принят" - главная кнопка "Написать", второстепенная "Перейти" */}
                  {response.status === 'accepted' && response.chatId ? (
                    <>
                      <Link
                        href={getChatUrl(response.chatId)}
                        className={`w-full px-4 py-2.5 ${minButtonHeight} flex items-center justify-center bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
                        aria-label="Написать сообщение владельцу"
                      >
                        Написать
                      </Link>
                      <Link
                        href={targetUrl}
                        className={`w-full px-4 py-2.5 ${minButtonHeight} flex items-center justify-center border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm`}
                        aria-label="Перейти к объекту"
                      >
                        Перейти
                      </Link>
                      <p className="text-xs text-gray-400 text-center mt-1">
                        Контакт открыт. Можно начать диалог.
                      </p>
                    </>
                  ) : (
                    /* СТАТУС: "В ожидании" или "Отклонён" - только кнопка "Перейти" */
                    <Link
                      href={targetUrl}
                      className={`w-full px-4 py-2.5 ${minButtonHeight} flex items-center justify-center bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
                      aria-label="Перейти к объекту"
                    >
                      Перейти
                    </Link>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
