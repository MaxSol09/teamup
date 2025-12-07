'use client';

import { useCreateAd } from '@/hooks/useCreateAd';
import { useState, useEffect } from 'react';

interface CreateAdModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: AdFormData) => Promise<void>;
}

interface AdFormData {
  title: string;
  description: string;
  theme: string;
  requiredSkills: string[];
}

const THEMES = ['IT', 'Наука', 'Учёба', 'Бизнес', 'Творчество'];

export default function CreateAdModal({ isOpen, onClose, onSubmit }: CreateAdModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [theme, setTheme] = useState('');
  const [requiredSkills, setRequiredSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState('');
  
  const [errors, setErrors] = useState({
    title: '',
    description: '',
    theme: '',
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const { createAd, loading, error, success, clearError } = useCreateAd();

  // Очистка ошибок при открытии модалки
  useEffect(() => {
    if (isOpen) {
      setApiError(null);
      clearError();
    }
  }, [isOpen, clearError]);

  // Отслеживание ошибок из хука
  useEffect(() => {
    if (error) {
      setApiError(error);
      // Автоматически очищаем ошибку через 5 секунд
      const timer = setTimeout(() => {
        setApiError(null);
        clearError();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, clearError]);

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
    setRequiredSkills([]);
    setSkillInput('');
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

  const handleAddSkill = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && skillInput.trim()) {
      e.preventDefault();
      if (!requiredSkills.includes(skillInput.trim())) {
        setRequiredSkills([...requiredSkills, skillInput.trim()]);
        setSkillInput('');
      }
    }
  };

  const handleRemoveSkill = (skill: string) => {
    setRequiredSkills(requiredSkills.filter((s) => s !== skill));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    setApiError(null);
    
    try {
      const result = await createAd({
        title: title.trim(),
        description: description.trim(),
        theme,
        tags: requiredSkills
      });

      // Если создание успешно (result не null)
      if (result) {
        resetForm();
        onClose();
        // Вызываем onSubmit callback если он передан
        if (onSubmit) {
          await onSubmit({
            title: title.trim(),
            description: description.trim(),
            theme,
            requiredSkills
          });
        }
      }
      // Если result null, значит была ошибка, она уже обработана в хуке
    } catch (error: any) {
      // Дополнительная обработка на случай, если ошибка все же пробросилась
      const errorMessage = error?.response?.data?.message || 
                          error?.message || 
                          'Произошла непредвиденная ошибка. Попробуйте еще раз.';
      setApiError(errorMessage);
      console.error('Error submitting ad:', error);
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
          <div className="bg-gradient-to-r from-indigo-500 to-purple-500 px-6 py-5">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Создать объявление</h2>
                  <p className="text-sm text-indigo-100 mt-0.5">Найдите людей для вашего проекта</p>
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
                <label htmlFor="ad-title" className="block text-sm font-semibold text-gray-700 mb-2">
                  Заголовок <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="ad-title"
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                    if (errors.title) setErrors({ ...errors, title: '' });
                  }}
                  placeholder="Например: Ищу фронтенд-разработчика для стартапа"
                  className={`w-full px-4 py-3 border-2 ${
                    errors.title ? 'border-red-400 focus:border-red-500' : 'border-gray-200 focus:border-indigo-500'
                  } rounded-xl focus:ring-4 focus:ring-indigo-100 outline-none transition-all`}
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
                <label htmlFor="ad-description" className="block text-sm font-semibold text-gray-700 mb-2">
                  Описание <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="ad-description"
                  value={description}
                  onChange={(e) => {
                    setDescription(e.target.value);
                    if (errors.description) setErrors({ ...errors, description: '' });
                  }}
                  placeholder="Опишите, кого вы ищете и какие задачи предстоит решать..."
                  rows={4}
                  className={`w-full px-4 py-3 border-2 ${
                    errors.description ? 'border-red-400 focus:border-red-500' : 'border-gray-200 focus:border-indigo-500'
                  } rounded-xl focus:ring-4 focus:ring-indigo-100 outline-none transition-all resize-none`}
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
                <label htmlFor="ad-theme" className="block text-sm font-semibold text-gray-700 mb-2">
                  Категория <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    id="ad-theme"
                    value={theme}
                    onChange={(e) => {
                      setTheme(e.target.value);
                      if (errors.theme) setErrors({ ...errors, theme: '' });
                    }}
                    className={`w-full px-4 py-3 pr-10 border-2 ${
                      errors.theme ? 'border-red-400 focus:border-red-500' : 'border-gray-200 focus:border-indigo-500'
                    } rounded-xl focus:ring-4 focus:ring-indigo-100 outline-none transition-all bg-white appearance-none cursor-pointer`}
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

              {/* Required Skills */}
              <div>
                <label htmlFor="ad-skills" className="block text-sm font-semibold text-gray-700 mb-2">
                  Теги/Требуемые навыки
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="ad-skills"
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyDown={handleAddSkill}
                    placeholder="Введите навык и нажмите Enter"
                    className="w-full px-4 py-3 pr-16 border-2 border-gray-200 focus:border-indigo-500 rounded-xl focus:ring-4 focus:ring-indigo-100 outline-none transition-all"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <kbd className="px-2 py-1 text-xs font-semibold text-gray-500 bg-gray-100 border border-gray-300 rounded-lg">
                      Enter
                    </kbd>
                  </div>
                </div>
                {requiredSkills.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {requiredSkills.map((skill) => (
                      <span
                        key={skill}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 border border-indigo-200 text-indigo-700 rounded-lg text-sm font-medium hover:bg-indigo-100 transition-colors"
                      >
                        {skill}
                        <button
                          type="button"
                          onClick={() => handleRemoveSkill(skill)}
                          className="hover:bg-indigo-200 rounded p-0.5 transition-colors"
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

              {/* API Error Display */}
              {apiError && (
                <div className="mt-4 p-4 bg-red-50 border-2 border-red-200 rounded-xl">
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-red-800">Ошибка при создании объявления</p>
                      <p className="text-sm text-red-700 mt-1">{apiError}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setApiError(null);
                        clearError();
                      }}
                      className="text-red-600 hover:text-red-800 transition-colors"
                      aria-label="Закрыть ошибку"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
              )}
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
                      ? 'bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]'
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
                    'Создать объявление'
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
