'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import MainLayout from '@/components/MainLayout';
import { THEMES, getTagsForTheme, ThemeType } from '@/config/themes';

interface FormErrors {
  title?: string;
  description?: string;
  theme?: string;
  tags?: string;
  role?: string;
}

export default function CreatePostPage() {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [theme, setTheme] = useState<ThemeType | ''>('');
  const [tags, setTags] = useState<string[]>([]);
  const [role, setRole] = useState('');
  const [contacts, setContacts] = useState({
    telegram: '',
    email: '',
    phone: '',
  });
  const [tagInput, setTagInput] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  // Available tags for selected theme
  const availableTags = theme ? getTagsForTheme(theme as ThemeType) : [];

  // Validation
  const isFormValid = 
    title.trim().length >= 3 &&
    description.trim().length >= 10 &&
    theme !== '' &&
    tags.length > 0;

  // Disabled reason for tooltip
  const getDisabledReason = (): string => {
    if (title.trim().length < 3) return 'Заголовок должен содержать минимум 3 символа';
    if (description.trim().length < 10) return 'Описание должно содержать минимум 10 символов';
    if (!theme) return 'Выберите тематику';
    if (tags.length === 0) return 'Добавьте хотя бы один тег';
    return '';
  };

  // Handle tag addition
  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      const trimmedTag = tagInput.trim();
      if (!tags.includes(trimmedTag) && trimmedTag.length > 0) {
        setTags([...tags, trimmedTag]);
        setTagInput('');
        if (errors.tags) {
          setErrors({ ...errors, tags: undefined });
        }
      }
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleSelectTag = (tag: string) => {
    if (!tags.includes(tag)) {
      setTags([...tags, tag]);
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate
    const newErrors: FormErrors = {};
    if (title.trim().length < 3) {
      newErrors.title = 'Минимум 3 символа';
    }
    if (description.trim().length < 10) {
      newErrors.description = 'Минимум 10 символов';
    }
    if (!theme) {
      newErrors.theme = 'Выберите тематику';
    }
    if (tags.length === 0) {
      newErrors.tags = 'Добавьте хотя бы один тег';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    
    // TODO: Implement API call
    try {
      // await createPost({ title, description, theme, tags, role, contacts });
      console.log('Creating post:', { title, description, theme, tags, role, contacts });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      router.push('/');
    } catch (error) {
      console.error('Error creating post:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle cancel
  const handleCancel = () => {
    router.back();
  };

  // Scroll to error on validation
  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      const firstErrorField = Object.keys(errors)[0];
      const element = document.getElementById(firstErrorField);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        element.focus();
      }
    }
  }, [errors]);

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={handleCancel}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-4 group"
          >
            <svg
              className="w-5 h-5 transition-transform group-hover:-translate-x-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="text-sm font-medium">Назад</span>
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Создать объявление</h1>
          <p className="text-gray-600 mt-2">Расскажите о том, кого вы ищете для своего проекта</p>
        </div>

        {/* Form */}
        <form ref={formRef} onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 md:p-8 space-y-8 pb-32">
            {/* Section: Title */}
            <section className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                  <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </div>
                <h2 className="text-lg font-semibold text-gray-900">Заголовок</h2>
              </div>
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                  Название объявления <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="title"
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                    if (errors.title) setErrors({ ...errors, title: undefined });
                  }}
                  placeholder="Например: Ищу фронтенд-разработчика для стартапа"
                  className={`w-full px-4 py-3 border-2 rounded-xl transition-all outline-none ${
                    errors.title
                      ? 'border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-100'
                      : 'border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100'
                  }`}
                />
                {errors.title && (
                  <p className="mt-2 text-sm text-red-600 flex items-center gap-1.5">
                    <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {errors.title}
                  </p>
                )}
                <p className="mt-1.5 text-xs text-gray-500">Минимум 3 символа</p>
              </div>
            </section>

            {/* Divider */}
            <div className="border-t border-gray-200"></div>

            {/* Section: Description */}
            <section className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
                  <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                  </svg>
                </div>
                <h2 className="text-lg font-semibold text-gray-900">Описание</h2>
              </div>
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                  Подробное описание <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => {
                    setDescription(e.target.value);
                    if (errors.description) setErrors({ ...errors, description: undefined });
                  }}
                  placeholder="Опишите детали проекта, требования к кандидату, условия работы..."
                  rows={6}
                  className={`w-full px-4 py-3 border-2 rounded-xl transition-all outline-none resize-none ${
                    errors.description
                      ? 'border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-100'
                      : 'border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100'
                  }`}
                />
                {errors.description && (
                  <p className="mt-2 text-sm text-red-600 flex items-center gap-1.5">
                    <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {errors.description}
                  </p>
                )}
                <p className="mt-1.5 text-xs text-gray-500">Минимум 10 символов</p>
              </div>
            </section>

            {/* Divider */}
            <div className="border-t border-gray-200"></div>

            {/* Section: Theme & Tags */}
            <section className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
                  <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                </div>
                <h2 className="text-lg font-semibold text-gray-900">Тематика и теги</h2>
              </div>

              {/* Theme Selection */}
              <div>
                <label htmlFor="theme" className="block text-sm font-medium text-gray-700 mb-2">
                  Тематика <span className="text-red-500">*</span>
                </label>
                <select
                  id="theme"
                  value={theme}
                  onChange={(e) => {
                    setTheme(e.target.value as ThemeType | '');
                    setTags([]); // Reset tags when theme changes
                    if (errors.theme) setErrors({ ...errors, theme: undefined });
                  }}
                  className={`w-full px-4 py-3 border-2 rounded-xl transition-all outline-none bg-white cursor-pointer ${
                    errors.theme
                      ? 'border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-100'
                      : 'border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100'
                  }`}
                >
                  <option value="">Выберите тематику</option>
                  {THEMES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
                {errors.theme && (
                  <p className="mt-2 text-sm text-red-600 flex items-center gap-1.5">
                    <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {errors.theme}
                  </p>
                )}
              </div>

              {/* Tags Input */}
              <div>
                <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-2">
                  Теги <span className="text-red-500">*</span>
                </label>
                <div className="space-y-3">
                  <div className="relative">
                    <input
                      type="text"
                      id="tags"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={handleAddTag}
                      placeholder="Введите тег и нажмите Enter"
                      className={`w-full px-4 py-3 pr-20 border-2 rounded-xl transition-all outline-none ${
                        errors.tags
                          ? 'border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-100'
                          : 'border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100'
                      }`}
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      <kbd className="px-2 py-1 text-xs font-semibold text-gray-500 bg-gray-100 border border-gray-300 rounded">
                        Enter
                      </kbd>
                    </div>
                  </div>

                  {/* Available tags from theme */}
                  {availableTags.length > 0 && (
                    <div>
                      <p className="text-xs text-gray-500 mb-2">Популярные теги для выбранной тематики:</p>
                      <div className="flex flex-wrap gap-2">
                        {availableTags
                          .filter(tag => !tags.includes(tag))
                          .slice(0, 8)
                          .map((tag) => (
                            <button
                              key={tag}
                              type="button"
                              onClick={() => handleSelectTag(tag)}
                              className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 hover:border-gray-300 transition-colors"
                            >
                              + {tag}
                            </button>
                          ))}
                      </div>
                    </div>
                  )}

                  {/* Selected tags */}
                  {tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {tags.map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 border border-blue-200 text-blue-700 rounded-lg text-sm font-medium"
                        >
                          {tag}
                          <button
                            type="button"
                            onClick={() => handleRemoveTag(tag)}
                            className="hover:bg-blue-200 rounded p-0.5 transition-colors"
                            aria-label={`Удалить тег ${tag}`}
                          >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </span>
                      ))}
                    </div>
                  )}

                  {errors.tags && (
                    <p className="text-sm text-red-600 flex items-center gap-1.5">
                      <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {errors.tags}
                    </p>
                  )}
                </div>
              </div>
            </section>

            {/* Divider */}
            <div className="border-t border-gray-200"></div>

            {/* Section: Role */}
            <section className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center">
                  <svg className="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h2 className="text-lg font-semibold text-gray-900">Роль</h2>
              </div>
              <div>
                <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">
                  Искомая роль
                </label>
                <select
                  id="role"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all bg-white cursor-pointer"
                >
                  <option value="">Не указано</option>
                  <option value="Разработчик">Разработчик</option>
                  <option value="Дизайнер">Дизайнер</option>
                  <option value="Менеджер">Менеджер</option>
                  <option value="Маркетолог">Маркетолог</option>
                  <option value="Аналитик">Аналитик</option>
                  <option value="Другое">Другое</option>
                </select>
                <p className="mt-1.5 text-xs text-gray-500">Необязательное поле</p>
              </div>
            </section>

            {/* Divider */}
            <div className="border-t border-gray-200"></div>

            {/* Section: Contacts */}
            <section className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center">
                  <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h2 className="text-lg font-semibold text-gray-900">Контакты</h2>
              </div>
              <div className="space-y-4">
                <div>
                  <label htmlFor="telegram" className="block text-sm font-medium text-gray-700 mb-2">
                    Telegram
                  </label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"/>
                      </svg>
                    </div>
                    <input
                      type="text"
                      id="telegram"
                      value={contacts.telegram}
                      onChange={(e) => setContacts({ ...contacts, telegram: e.target.value })}
                      placeholder="@username"
                      className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <input
                      type="email"
                      id="email"
                      value={contacts.email}
                      onChange={(e) => setContacts({ ...contacts, email: e.target.value })}
                      placeholder="example@mail.com"
                      className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                    Телефон
                  </label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <input
                      type="tel"
                      id="phone"
                      value={contacts.phone}
                      onChange={(e) => setContacts({ ...contacts, phone: e.target.value })}
                      placeholder="+7 (999) 123-45-67"
                      className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all"
                    />
                  </div>
                </div>

                <p className="text-xs text-gray-500">Укажите хотя бы один способ связи</p>
              </div>
            </section>
          </div>

          {/* Sticky Footer */}
          <div
            ref={footerRef}
            className="sticky bottom-0 bg-white border-t border-gray-200 px-6 md:px-8 py-4 shadow-lg"
          >
            <div className="flex items-center justify-between gap-4">
              <button
                type="button"
                onClick={handleCancel}
                disabled={isSubmitting}
                className="px-6 py-3 text-gray-700 font-medium bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Отмена
              </button>
              <div className="relative flex-1 max-w-md">
                <button
                  type="submit"
                  disabled={!isFormValid || isSubmitting}
                  onMouseEnter={() => !isFormValid && setShowTooltip(true)}
                  onMouseLeave={() => setShowTooltip(false)}
                  className={`w-full px-6 py-3 font-semibold rounded-xl transition-all ${
                    isFormValid && !isSubmitting
                      ? 'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 shadow-md hover:shadow-lg'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Публикация...
                    </span>
                  ) : (
                    'Опубликовать'
                  )}
                </button>
                {showTooltip && !isFormValid && (
                  <div className="absolute bottom-full right-0 mb-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg shadow-lg whitespace-nowrap">
                    {getDisabledReason()}
                    <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </form>
      </div>
    </MainLayout>
  );
}

