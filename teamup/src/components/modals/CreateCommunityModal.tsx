'use client';

import { useCreateCommunity } from '@/hooks/useCreateCommunity';
import { useState, useEffect } from 'react';
import { THEMES, ThemeType } from '@/config/themes';

interface CreateCommunityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CommunityFormData) => Promise<void>;
}

interface CommunityFormData {
  name: string;
  description: string;
  theme: string;
  isPublic: boolean;
}

export default function CreateCommunityModal({ isOpen, onClose, onSubmit }: CreateCommunityModalProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [theme, setTheme] = useState<ThemeType | ''>('');
  const [isPublic, setIsPublic] = useState(true);

  const { createCommunity } = useCreateCommunity();
  
  const [errors, setErrors] = useState({
    name: '',
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
    setName('');
    setDescription('');
    setTheme('');
    setIsPublic(true);
    setErrors({ name: '', description: '', theme: '' });
  };

  const validateForm = (): boolean => {
    const newErrors = { name: '', description: '', theme: '' };
    let isValid = true;

    if (name.trim().length < 3) {
      newErrors.name = 'Минимум 3 символа';
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

  const isFormValid = name.trim().length >= 3 && description.trim().length >= 10 && theme;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      await createCommunity({
        title: name.trim(),
        description: description.trim(),
        theme: theme as ThemeType,
        isPublic,
      });
      resetForm();
      onClose();
      // Вызываем onSubmit callback если он передан
      if (onSubmit) {
        await onSubmit({
          name: name.trim(),
          description: description.trim(),
          theme: theme as ThemeType,
          isPublic,
        });
      }
    } catch (error) {
      console.error('Error submitting community:', error);
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
          <div className="bg-gradient-to-r from-emerald-500 to-teal-500 px-6 py-5">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Создать сообщество</h2>
                  <p className="text-sm text-emerald-100 mt-0.5">Объедините людей с общими интересами</p>
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
              {/* Name */}
              <div>
                <label htmlFor="community-name" className="block text-sm font-semibold text-gray-700 mb-2">
                  Название сообщества <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="community-name"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (errors.name) setErrors({ ...errors, name: '' });
                  }}
                  placeholder="Например: JavaScript Developers Russia"
                  className={`w-full px-4 py-3 border-2 ${
                    errors.name ? 'border-red-400 focus:border-red-500' : 'border-gray-200 focus:border-emerald-500'
                  } rounded-xl focus:ring-4 focus:ring-emerald-100 outline-none transition-all`}
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1.5 flex items-center gap-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {errors.name}
                  </p>
                )}
              </div>

              {/* Description */}
              <div>
                <label htmlFor="community-description" className="block text-sm font-semibold text-gray-700 mb-2">
                  Описание <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="community-description"
                  value={description}
                  onChange={(e) => {
                    setDescription(e.target.value);
                    if (errors.description) setErrors({ ...errors, description: '' });
                  }}
                  placeholder="Расскажите, чем занимается ваше сообщество и кого вы ждёте..."
                  rows={4}
                  className={`w-full px-4 py-3 border-2 ${
                    errors.description ? 'border-red-400 focus:border-red-500' : 'border-gray-200 focus:border-emerald-500'
                  } rounded-xl focus:ring-4 focus:ring-emerald-100 outline-none transition-all resize-none`}
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
                <label htmlFor="community-theme" className="block text-sm font-semibold text-gray-700 mb-2">
                  Категория <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    id="community-theme"
                    value={theme}
                    onChange={(e) => {
                      setTheme(e.target.value as ThemeType | '');
                      if (errors.theme) setErrors({ ...errors, theme: '' });
                    }}
                    className={`w-full px-4 py-3 pr-10 border-2 ${
                      errors.theme ? 'border-red-400 focus:border-red-500' : 'border-gray-200 focus:border-emerald-500'
                    } rounded-xl focus:ring-4 focus:ring-emerald-100 outline-none transition-all bg-white appearance-none cursor-pointer`}
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

              {/* isPublic Toggle */}
              <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border-2 border-emerald-200 rounded-xl p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <label htmlFor="community-public" className="block text-sm font-semibold text-gray-900 cursor-pointer">
                        Публичное сообщество
                      </label>
                    </div>
                    <p className="text-sm text-gray-600">
                      {isPublic 
                        ? 'Сообщество видно всем, любой может присоединиться'
                        : 'Вступление по приглашению или запросу'
                      }
                    </p>
                  </div>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={isPublic}
                    onClick={() => setIsPublic(!isPublic)}
                    className={`relative inline-flex h-7 w-14 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-4 focus:ring-emerald-200 ${
                      isPublic ? 'bg-emerald-600' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                        isPublic ? 'translate-x-7' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
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
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]'
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
                    'Создать сообщество'
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
