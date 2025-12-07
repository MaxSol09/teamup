'use client';

import { useCreateProject } from '@/hooks/useCreateProject';
import { useState, useEffect } from 'react';
import { THEMES, ThemeType } from '@/config/themes';

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ProjectFormData) => Promise<void>;
}

interface ProjectFormData {
  title: string;
  description: string;
  tags: string[];
  theme: string;
}

export default function CreateProjectModal({ isOpen, onClose, onSubmit }: CreateProjectModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [theme, setTheme] = useState<ThemeType | ''>('');
  const [tags, setTags] = useState<string[]>([]);
  
  const [tagInput, setTagInput] = useState('');

  const { createProject, loading, error, success } = useCreateProject();
  
  const [errors, setErrors] = useState({
    title: '',
    description: '',
    theme: '',
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ESC to close
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  // Prevent scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setTheme('');
    setTags([]);
    setTagInput('');
    setErrors({ title: '', description: '', theme: '' });
  };

  const validateForm = (): boolean => {
    const newErrors = { title: '', description: '', theme: '' };
    let isValid = true;

    if (title.trim().length < 3) {
      newErrors.title = 'Минимум 3 символа';
      isValid = false;
    }

    if (description.trim().length < 10) {
      newErrors.description = 'Минимум 10 символов';
      isValid = false;
    }

    if (!theme) {
      newErrors.theme = 'Выберите категорию';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const isFormValid = title.trim().length >= 3 && description.trim().length >= 10 && theme;

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (!tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()]);
        setTagInput('');
      }
    }
  };

  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      await createProject({
        title: title.trim(),
        description: description.trim(),
        tags,
        theme: theme as ThemeType
      });
      resetForm();
      onClose();
      // Вызываем onSubmit callback если он передан
      if (onSubmit) {
        await onSubmit({
          title: title.trim(),
          description: description.trim(),
          tags,
          theme: theme as ThemeType
        });
      }
    } catch (error) {
      console.error('Error submitting project:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        onClick={handleBackdropClick}
      >
        {/* Backdrop */}
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fadeIn" />

        {/* Modal */}
        <div className="relative w-full max-w-2xl max-h-[90vh] bg-white rounded-2xl shadow-2xl overflow-hidden animate-scaleIn">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-500 to-cyan-500 px-6 py-5">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Создать проект</h2>
                  <p className="text-sm text-blue-100 mt-0.5">Найдите команду для своей идеи</p>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
                aria-label="Закрыть"
              >
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Content */}
          <form onSubmit={handleSubmit} className="flex flex-col max-h-[calc(90vh-140px)]">
            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
              {/* Title */}
              <div>
                <label htmlFor="project-title" className="block text-sm font-semibold text-gray-700 mb-2">
                  Название проекта <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="project-title"
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                    if (errors.title) setErrors({ ...errors, title: '' });
                  }}
                  placeholder="Например: SaaS платформа для управления проектами"
                  className={`w-full px-4 py-3 border-2 ${
                    errors.title ? 'border-red-400 focus:border-red-500' : 'border-gray-200 focus:border-blue-500'
                  } rounded-xl focus:ring-4 focus:ring-blue-100 outline-none transition-all`}
                />
                {errors.title && (
                  <p className="text-red-500 text-sm mt-1.5 flex items-center gap-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {errors.title}
                  </p>
                )}
              </div>

              {/* Description */}
              <div>
                <label htmlFor="project-description" className="block text-sm font-semibold text-gray-700 mb-2">
                  Описание проекта <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="project-description"
                  value={description}
                  onChange={(e) => {
                    setDescription(e.target.value);
                    if (errors.description) setErrors({ ...errors, description: '' });
                  }}
                  placeholder="Опишите ваш проект, его цели и основные возможности..."
                  rows={4}
                  className={`w-full px-4 py-3 border-2 ${
                    errors.description ? 'border-red-400 focus:border-red-500' : 'border-gray-200 focus:border-blue-500'
                  } rounded-xl focus:ring-4 focus:ring-blue-100 outline-none transition-all resize-none`}
                />
                {errors.description && (
                  <p className="text-red-500 text-sm mt-1.5 flex items-center gap-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {errors.description}
                  </p>
                )}
              </div>

              {/* Theme */}
              <div>
                <label htmlFor="project-theme" className="block text-sm font-semibold text-gray-700 mb-2">
                  Категория <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    id="project-theme"
                    value={theme}
                    onChange={(e) => {
                      setTheme(e.target.value as ThemeType | '');
                      if (errors.theme) setErrors({ ...errors, theme: '' });
                    }}
                    className={`w-full px-4 py-3 pr-10 border-2 ${
                      errors.theme ? 'border-red-400 focus:border-red-500' : 'border-gray-200 focus:border-blue-500'
                    } rounded-xl focus:ring-4 focus:ring-blue-100 outline-none transition-all bg-white appearance-none cursor-pointer`}
                  >
                    <option value="">Выберите категорию</option>
                    {THEMES.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
                {errors.theme && (
                  <p className="text-red-500 text-sm mt-1.5 flex items-center gap-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {errors.theme}
                  </p>
                )}
              </div>

              {/* Tags/Skills */}
              <div>
                <label htmlFor="project-tags" className="block text-sm font-semibold text-gray-700 mb-2">
                  Теги и технологии
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="project-tags"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={handleAddTag}
                    placeholder="Введите тег и нажмите Enter"
                    className="w-full px-4 py-3 pr-16 border-2 border-gray-200 focus:border-blue-500 rounded-xl focus:ring-4 focus:ring-blue-100 outline-none transition-all"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <kbd className="px-2 py-1 text-xs font-semibold text-gray-500 bg-gray-100 border border-gray-300 rounded-lg">
                      Enter
                    </kbd>
                  </div>
                </div>
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-cyan-50 border border-cyan-200 text-cyan-700 rounded-lg text-sm font-medium hover:bg-cyan-100 transition-colors"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(tag)}
                          className="hover:bg-cyan-200 rounded p-0.5 transition-colors"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Sticky Footer */}
            <div className="border-t border-gray-200 px-6 py-4 bg-gray-50">
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-3 rounded-xl font-semibold text-gray-700 bg-white border-2 border-gray-300 hover:bg-gray-50 hover:border-gray-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  disabled={!isFormValid || isSubmitting}
                  className={`flex-1 px-4 py-3 rounded-xl font-semibold text-white transition-all ${
                    isFormValid && !isSubmitting
                      ? 'bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]'
                      : 'bg-gray-300 cursor-not-allowed opacity-60'
                  }`}
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Создание...
                    </span>
                  ) : (
                    'Создать проект'
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }

        .animate-scaleIn {
          animation: scaleIn 0.2s ease-out;
        }
      `}</style>
    </>
  );
}

