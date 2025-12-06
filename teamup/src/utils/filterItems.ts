import { Post } from '@/types/posts';
import { Project } from '@/types/project';
import { Community } from '@/types/communities';
import { ThemeType, RoleType } from '@/store/filtersStore';

interface FilterParams {
  search: string;
  theme: ThemeType;
  tags: string[];
  role: RoleType;
}

/**
 * Фильтрация по тексту (заголовок и описание)
 */
function matchesSearch(item: Post | Project | Community, search: string): boolean {
  if (!search.trim()) return true;
  
  const searchLower = search.toLowerCase();
  const title = item.title.toLowerCase();
  const description = item.description.toLowerCase();
  
  return title.includes(searchLower) || description.includes(searchLower);
}

/**
 * Фильтрация по тематике
 */
function matchesTheme(item: Post | Project | Community, theme: ThemeType): boolean {
  if (!theme) return true;
  return item.theme === theme;
}

/**
 * Фильтрация по тегам
 */
function matchesTags(item: Post | Project | Community, tags: string[]): boolean {
  if (tags.length === 0) return true;
  
  // Проверяем, что хотя бы один из выбранных тегов присутствует в item.tags
  return tags.some(tag => item.tags.includes(tag));
}

/**
 * Фильтрация по роли
 * Для роли пока используем простую проверку по содержимому (можно расширить)
 */
function matchesRole(item: Post | Project | Community, role: RoleType): boolean {
  if (!role) return true;
  
  // Простая проверка по ключевым словам в заголовке/описании
  // В будущем можно добавить поле role в типы
  const content = `${item.title} ${item.description}`.toLowerCase();
  
  switch (role) {
    case 'Разработчик':
      return content.includes('разработчик') || content.includes('developer') || 
             content.includes('программист') || content.includes('код');
    case 'Дизайнер':
      return content.includes('дизайнер') || content.includes('дизайн') || 
             content.includes('ui/ux') || content.includes('designer');
    case 'Менеджер':
      return content.includes('менеджер') || content.includes('управление') || 
             content.includes('manager') || content.includes('проект');
    default:
      return true;
  }
}

/**
 * Фильтрация карточек постов
 * Порядок фильтрации: theme → tags → role → search
 */
export function filterPosts(posts: Post[], filters: FilterParams): Post[] {
  return posts.filter(post => {
    // 1. Фильтр по тематике
    if (!matchesTheme(post, filters.theme)) return false;
    
    // 2. Фильтр по тегам
    if (!matchesTags(post, filters.tags)) return false;
    
    // 3. Фильтр по роли
    if (!matchesRole(post, filters.role)) return false;
    
    // 4. Поиск по тексту
    if (!matchesSearch(post, filters.search)) return false;
    
    return true;
  });
}

/**
 * Фильтрация проектов
 */
export function filterProjects(projects: Project[], filters: FilterParams): Project[] {
  return projects.filter(project => {
    if (!matchesTheme(project, filters.theme)) return false;
    if (!matchesTags(project, filters.tags)) return false;
    if (!matchesRole(project, filters.role)) return false;
    if (!matchesSearch(project, filters.search)) return false;
    return true;
  });
}

/**
 * Фильтрация сообществ
 */
export function filterCommunities(communities: Community[], filters: FilterParams): Community[] {
  return communities.filter(community => {
    if (!matchesTheme(community, filters.theme)) return false;
    if (!matchesTags(community, filters.tags)) return false;
    if (!matchesRole(community, filters.role)) return false;
    if (!matchesSearch(community, filters.search)) return false;
    return true;
  });
}
