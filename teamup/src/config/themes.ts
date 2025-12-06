// Конфигурация тематик и связанных с ними тегов

export type ThemeType = 'Айти' | 'Учёба' | 'Наука' | 'Творчество' | 'Бизнес';

export const THEMES: ThemeType[] = [
  'Айти',
  'Учёба',
  'Наука',
  'Творчество',
  'Бизнес',
];

// Маппинг тематик к доступным тегам
export const THEME_TAGS: Record<ThemeType, string[]> = {
  'Айти': [
    'React',
    'Next.js',
    'Backend',
    'UI/UX',
    'TypeScript',
    'Node.js',
    'Frontend',
    'Fullstack',
    'Python',
    'JavaScript',
    'React Native',
    'Firebase',
    'Мобильная разработка',
  ],
  'Учёба': [
    'Математика',
    'Физика',
    'Программирование',
    'Обучение',
    'Студенты',
    'IT',
    'Образование',
    'Курсы',
  ],
  'Наука': [
    'Исследования',
    'Академия',
    'Наука',
    'Лаборатория',
  ],
  'Творчество': [
    'Дизайн',
    'Музыка',
    'Видео',
    'Фотография',
    'Искусство',
  ],
  'Бизнес': [
    'CRM',
    'Автоматизация',
    'Стартап',
    'MVP',
    'Маркетплейс',
  ],
};

/**
 * Получить доступные теги для выбранной тематики
 */
export function getTagsForTheme(theme: ThemeType | null): string[] {
  if (!theme) {
    return [];
  }
  return THEME_TAGS[theme] || [];
}

