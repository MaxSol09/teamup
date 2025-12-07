'use client';

import { useState } from 'react';
import MainLayout from '@/components/MainLayout';
import { useEvents } from '@/hooks/useEvents';
import { EventCard } from '@/components/cards/EventCard';
import { EmptyState } from '@/components/EmptyState';
import { Event } from '@/types/events';
import { useAuthStore } from '@/store/authStore';
import { THEMES, ThemeType, getTagsForTheme } from '@/config/themes';
import { useFiltersStore } from '@/store/filtersStore';
import { mockEvents } from '@/utils/mockEvents';

export default function EventsPage() {
  const { data: events, isLoading, error } = useEvents();
  const user = useAuthStore((state) => state.user);
  
  // Используем моковые данные для тестирования, если нет данных с сервера
  const [useMockData] = useState(true); // Переключите на false для использования реальных данных
  const displayEvents = useMockData ? mockEvents : (events || []);

  const {
    search,
    theme,
    tags,
    setSearch,
    setTheme,
    setTags,
  } = useFiltersStore();

  // Фильтрация мероприятий
  const filteredEvents = displayEvents ? displayEvents.filter((event: Event) => {
    if (search) {
      const searchLower = search.toLowerCase();
      if (!event.title.toLowerCase().includes(searchLower) && 
          !event.description.toLowerCase().includes(searchLower)) {
        return false;
      }
    }
    if (theme && event.theme !== theme) return false;
    if (tags.length > 0 && !tags.some(tag => event.tags.includes(tag))) return false;
    return true;
  }) : [];

  // Проверка единомышленников для мероприятий
  const getIsLikeMinded = (event: Event) => {
    if (!user) return false;
    // Если есть единомышленники среди участников, подсвечиваем карточку
    return event.likeMindedCount > 0;
  };

  // Доступные теги для выбранной тематики
  const availableTags = theme ? getTagsForTheme(theme) : [];

  // Обработчик выбора тематики
  const handleThemeChange = (value: string) => {
    const newTheme = value === '' ? null : (value as ThemeType);
    setTheme(newTheme);
  };

  // Обработчик выбора тегов
  const handleTagToggle = (tag: string) => {
    if (tags.includes(tag)) {
      setTags(tags.filter(t => t !== tag));
    } else {
      setTags([...tags, tag]);
    }
  };

  // Обработчик очистки фильтров
  const handleClearFilters = () => {
    setSearch('');
    setTheme(null);
    setTags([]);
  };

  const hasActiveFilters = search || theme || tags.length > 0;

  return (
    <MainLayout>
      <div className="mb-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Мероприятия</h1>
          <p className="text-gray-600">Найдите интересные мероприятия и единомышленников</p>
        </div>

        {/* Фильтры */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          {/* Поиск */}
          <div className="mb-6">
            <input
              type="text"
              placeholder="Поиск по названию и описанию..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
            {/* Тематика */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Тематика
              </label>
              <select
                value={theme || ''}
                onChange={(e) => handleThemeChange(e.target.value)}
                className="w-full px-4 pr-6 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white"
              >
                <option value="">Все тематики</option>
                {THEMES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            {/* Теги */}
            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Теги
              </label>
              {theme && availableTags.length > 0 ? (
                <div className="border border-gray-300 rounded-lg p-3 bg-white max-h-48 overflow-y-auto">
                  <div className="flex flex-wrap gap-2">
                    {availableTags.map((tag) => {
                      const isSelected = tags.includes(tag);
                      return (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => handleTagToggle(tag)}
                          className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                            isSelected
                              ? 'bg-orange-500 text-white hover:bg-orange-600'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {tag}
                          {isSelected && ' ✓'}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-400 text-sm flex items-center min-h-[42px]">
                  {theme ? 'Теги для этой тематики отсутствуют' : 'Выберите тематику'}
                </div>
              )}
            </div>
          </div>

          {/* Кнопка очистки фильтров */}
          {hasActiveFilters && (
            <div className="mt-4">
              <button
                onClick={handleClearFilters}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700"
              >
                Сбросить все фильтры
              </button>
            </div>
          )}

          {/* Показать выбранные теги */}
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              <span className="text-sm text-gray-600">Выбранные теги:</span>
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm flex items-center gap-2"
                >
                  {tag}
                  <button
                    onClick={() => handleTagToggle(tag)}
                    className="hover:text-orange-900 font-bold"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Состояние загрузки */}
        {!useMockData && isLoading && (
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
          </div>
        )}

        {/* Ошибки загрузки */}
        {!useMockData && error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-800 text-sm">Ошибка загрузки мероприятий</p>
          </div>
        )}

        {/* Индикатор моковых данных */}
        {useMockData && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-6">
            <p className="text-yellow-800 text-sm">
              ⚠️ Используются тестовые данные для демонстрации функционала
            </p>
          </div>
        )}

        {/* Контент */}
        {(!isLoading || useMockData) && !error && (
          <>
            {filteredEvents.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredEvents.map((event: Event) => (
                  <EventCard 
                    key={`event-${event._id}`} 
                    event={event} 
                    isLikeMinded={getIsLikeMinded(event)}
                  />
                ))}
              </div>
            ) : (
              <EmptyState
                title="Мероприятий не найдено"
                description={
                  hasActiveFilters 
                    ? "Попробуйте изменить параметры фильтрации"
                    : "Пока нет доступных мероприятий"
                }
                buttonText={hasActiveFilters ? "Сбросить фильтры" : undefined}
                onClick={hasActiveFilters ? handleClearFilters : undefined}
              />
            )}
          </>
        )}
      </div>
    </MainLayout>
  );
}


