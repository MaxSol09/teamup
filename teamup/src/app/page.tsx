'use client';

import { useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useMainStore } from '@/store/mainStore';
import MainLayout from '@/components/MainLayout';
import { usePostsStore } from '@/store/content/posts';
import { useProjectStore } from '@/store/content/projects';
import { useCommunitiesStore } from '@/store/content/communities';
import { PostCard } from '@/components/cards/PostCard';
import { ProjectCard } from '@/components/cards/ProjectCard';
import { CommunityCard } from '@/components/cards/CommunityCard';
import { EmptyState } from '@/components/EmptyState';
import { useFiltersStore, ThemeType, RoleType } from '@/store/filtersStore';
import { THEMES, getTagsForTheme } from '@/config/themes';
import { filterPosts, filterProjects, filterCommunities } from '@/utils/filterItems';
import { useAuthStore } from '@/store/authStore';
import { usePosts } from '@/hooks/usePosts';
import { useProjects } from '@/hooks/useProjects';
import { useCommunities } from '@/hooks/useCommunities';
import { Loader2 } from 'lucide-react';

type TabType = 'posts' | 'projects' | 'communities';

function HomeContent() {
  const { activeTab, setActiveTab } = useMainStore();
  const { posts, setPosts } = usePostsStore();
  const { projects, setProjects } = useProjectStore();
  const { communities, setCommunities } = useCommunitiesStore();
  const user = useAuthStore(u => u.user)
  const router = useRouter();

  // React Query хуки для загрузки данных
  const { data: postsData, isLoading: isLoadingPosts, error: postsError } = usePosts();
  const { data: projectsData, isLoading: isLoadingProjects, error: projectsError } = useProjects();
  const { data: communitiesData, isLoading: isLoadingCommunities, error: communitiesError } = useCommunities();

  // Сохраняем данные в Zustand при успешной загрузке
  useEffect(() => {
    if (postsData) {
      setPosts(postsData);
    }
  }, [postsData, setPosts]);

  useEffect(() => {
    if (projectsData) {
      setProjects(projectsData);
    }
  }, [projectsData, setProjects]);

  useEffect(() => {
    if (communitiesData) {
      setCommunities(communitiesData);
    }
  }, [communitiesData, setCommunities]);

  const isLoading = isLoadingPosts || isLoadingProjects || isLoadingCommunities;
  
  const {
    search,
    theme,
    tags,
    role,
    isActive,
    setSearch,
    setTheme,
    setTags,
    setRole
  } = useFiltersStore();
  
  const searchParams = useSearchParams();
  
  // Синхронизация с URL при загрузке (только один раз)
  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    const urlSearch = params.get('search') || '';
    const urlTheme = params.get('theme') as ThemeType || null;
    const urlTags = params.get('tags') ? params.get('tags')!.split(',') : [];
    const urlRole = params.get('role') as RoleType || null;
    
    // Устанавливаем только если есть значения в URL и они отличаются от текущих
    if (urlSearch && urlSearch !== search) setSearch(urlSearch);
    if (urlTheme && urlTheme !== theme) setTheme(urlTheme);
    if (urlTags.length > 0 && JSON.stringify(urlTags) !== JSON.stringify(tags)) setTags(urlTags);
    if (urlRole && urlRole !== role) setRole(urlRole);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Только при монтировании
  
  // Синхронизация с URL при изменении фильтров
  useEffect(() => {
    const params = new URLSearchParams();
    
    if (search) params.set('search', search);
    if (theme) params.set('theme', theme);
    if (tags.length > 0) params.set('tags', tags.join(','));
    if (role) params.set('role', role);
    
    const queryString = params.toString();
    const newUrl = queryString ? `/?${queryString}` : '/';
    
    // Проверяем, чтобы не обновлять URL если он уже такой же
    if (window.location.search !== (queryString ? `?${queryString}` : '')) {
      router.replace(newUrl, { scroll: false });
    }
  }, [search, theme, tags, role, router]);
  
  // Доступные теги для выбранной тематики
  const availableTags = theme ? getTagsForTheme(theme) : [];
  
  // Применяем фильтры
  const filteredPosts = filterPosts(posts, { search, theme, tags, role, isActive });
  const filteredProjects = filterProjects(projects, { search, theme, tags, role });
  const filteredCommunities = filterCommunities(communities, { search, theme, tags, role });
  
  // Получаем текущий список карточек в зависимости от активной вкладки
  const getCurrentItems = () => {
    switch (activeTab) {
      case 'posts':
        return filteredPosts;
      case 'projects':
        return filteredProjects;
      case 'communities':
        return filteredCommunities;
      default:
        return [];
    }
  };
  
  const currentItems = getCurrentItems();
  
  // Обработчик выбора тематики
  const handleThemeChange = (value: string) => {
    const newTheme = value === '' ? null : (value as ThemeType);
    setTheme(newTheme);
    // Теги автоматически сбрасываются в store
  };
  
  // Обработчик выбора тегов (мультиселект через чекбоксы)
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
    setRole(null);
  };
  
  const hasActiveFilters = search || theme || tags.length > 0 || role;

  const showProfileModal = useAuthStore((s) => s.showProfileModal);

  useEffect(() => {
  const shouldShow = localStorage.getItem("showProfileModal");

  if (shouldShow === "true") {
    useAuthStore.getState().openProfileModal();
    localStorage.removeItem("showProfileModal");
  }
}, []);

  return (
    <MainLayout>
      <div className="mb-8">
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          {/* 1. Поиск по тексту */}
          <div className="mb-6">
            <input
              type="text"
              placeholder="Поиск по заголовку и описанию..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
            {/* 2. Тематика (главный фильтр) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Тематика *
              </label>
              <select
                value={theme || ''}
                onChange={(e) => handleThemeChange(e.target.value)}
                className="w-full px-4 pr-6 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
              >
                <option value="">Выберите тематику</option>
                {THEMES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
            
            {/* 3. Навыки / Теги (зависимый фильтр) */}
            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Навыки / Теги
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
                              ? 'bg-blue-500 text-white hover:bg-blue-600'
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
            
            {/* 4. Роль (опционально) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Роль
              </label>
              <select
                value={role || ''}
                onChange={(e) => setRole(e.target.value === '' ? null : (e.target.value as RoleType))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
              >
                <option value="">Любая роль</option>
                <option value="Разработчик">Разработчик</option>
                <option value="Дизайнер">Дизайнер</option>
                <option value="Менеджер">Менеджер</option>
              </select>
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
                  className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm flex items-center gap-2"
                >
                  {tag}
                  <button
                    onClick={() => handleTagToggle(tag)}
                    className="hover:text-blue-900 font-bold"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="flex gap-2 mb-6 border-b border-gray-200">
          {(['posts', 'projects', 'communities'] as TabType[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 text-sm font-medium transition-colors border-b-2 ${
                activeTab === tab
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
              }`}
            >
              {tab === 'posts' && 'Объявления'}
              {tab === 'projects' && 'Проекты'}
              {tab === 'communities' && 'Сообщества'}
            </button>
          ))}
        </div>

        {/* Состояние загрузки */}
        {isLoading && (
          <div className="mt-4 flex items-center justify-center min-h-[200px]">
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
              <p className="text-sm text-gray-500">Загрузка...</p>
            </div>
          </div>
        )}

        {/* Ошибки загрузки */}
        {(postsError || projectsError || communitiesError) && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-800 text-sm">
              {activeTab === 'posts' && postsError && 'Ошибка загрузки объявлений'}
              {activeTab === 'projects' && projectsError && 'Ошибка загрузки проектов'}
              {activeTab === 'communities' && communitiesError && 'Ошибка загрузки сообществ'}
            </p>
          </div>
        )}

        {/* Контент */}
        {!isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* POSTS */}
            {activeTab === 'posts' && (
              filteredPosts.length > 0 ? (
                filteredPosts.map((item) => (
                  <PostCard key={`post-${item._id}`} post={item} />
                ))
              ) : (
                <div className="col-span-full">
                  <EmptyState
                    title="Объявлений не найдено"
                    description={
                      hasActiveFilters 
                        ? "Попробуйте изменить параметры фильтрации"
                        : "Будь первым, кто создаст объявление"
                    }
                    buttonText={hasActiveFilters ? "Сбросить фильтры" : "Создать объявление"}
                    onClick={hasActiveFilters ? handleClearFilters : () => useMainStore.getState().openAdModal()}
                  />
                </div>
              )
            )}

            {/* PROJECTS */}
            {activeTab === 'projects' && (
              filteredProjects.length > 0 ? (
                filteredProjects.map((item) => (
                  <ProjectCard key={`project-${item._id}`} project={item} />
                ))
              ) : (
                <div className="col-span-full">
                  <EmptyState
                    title="Проектов не найдено"
                    description={
                      hasActiveFilters 
                        ? "Попробуйте изменить параметры фильтрации"
                        : "Создай первый проект и собери команду"
                    }
                    buttonText={hasActiveFilters ? "Сбросить фильтры" : "Создать проект"}
                    onClick={hasActiveFilters ? handleClearFilters : () => useMainStore.getState().openProjectModal()}
                  />
                </div>
              )
            )}

            {/* COMMUNITIES */}
            {activeTab === 'communities' && (
              filteredCommunities.length > 0 ? (
                filteredCommunities.map((item) => (
                  <CommunityCard key={`community-${item._id}`} community={item} />
                ))
              ) : (
                <div className="col-span-full">
                  <EmptyState
                    title="Сообществ не найдено"
                    description={
                      hasActiveFilters 
                        ? "Попробуйте изменить параметры фильтрации"
                        : "Создай первое сообщество по интересам"
                    }
                    buttonText={hasActiveFilters ? "Сбросить фильтры" : "Создать сообщество"}
                    onClick={hasActiveFilters ? handleClearFilters : () => useMainStore.getState().openCommunityModal()}
                  />
                </div>
              )
            )}

          </div>
        )}
      </div>
    </MainLayout>
    
  );
}

export default function Home() {
  return (
    <Suspense fallback={
      <MainLayout>
        <div className="mt-4 flex items-center justify-center min-h-[200px]">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
            <p className="text-sm text-gray-500">Загрузка...</p>
          </div>
        </div>
      </MainLayout>
    }>
      <HomeContent />
    </Suspense>
  );
}


// {showProfileModal && <FinishProfileModal />}