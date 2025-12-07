'use client';

import { useCreateEvent, useUpdateEvent } from '@/hooks/useEvents';
import { useState, useEffect } from 'react';
import { THEMES, ThemeType, getTagsForTheme } from '@/config/themes';
import { Event, CreateEventData } from '@/types/events';
import { X } from 'lucide-react';

interface CreateEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  event?: Event | null; // Если передан, то режим редактирования
}

export default function CreateEventModal({ isOpen, onClose, event }: CreateEventModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [theme, setTheme] = useState<ThemeType | ''>('');
  const [tags, setTags] = useState<string[]>([]);
  const [date, setDate] = useState('');
  const [tagInput, setTagInput] = useState('');

  const createMutation = useCreateEvent();
  const updateMutation = useUpdateEvent();

  const [errors, setErrors] = useState({
    title: '',
    description: '',
    theme: '',
    date: '',
  });

  const isLoading = createMutation.isPending || updateMutation.isPending;

  // Заполнение формы при редактировании
  useEffect(() => {
    if (event && isOpen) {
      setTitle(event.title);
      setDescription(event.description);
      setTheme(event.theme as ThemeType);
      setTags(event.tags || []);
      setDate(event.date);
    } else if (!event && isOpen) {
      resetForm();
    }
  }, [event, isOpen]);

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
    setDate('');
    setTagInput('');
    setErrors({ title: '', description: '', theme: '', date: '' });
  };

  const validateForm = (): boolean => {
    const newErrors = { title: '', description: '', theme: '', date: '' };
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
      newErrors.theme = 'Выберите тематику';
      isValid = false;
    }

    if (!date) {
      newErrors.date = 'Укажите дату мероприятия';
      isValid = false;
    } else {
      const selectedDate = new Date(date);
      if (selectedDate < new Date()) {
        newErrors.date = 'Дата не может быть в прошлом';
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const data: CreateEventData = {
        title: title.trim(),
        description: description.trim(),
        theme: theme as string,
        tags,
        date,
      };

      if (event) {
        await updateMutation.mutateAsync({ id: event._id, data });
      } else {
        await createMutation.mutateAsync(data);
      }

      resetForm();
      onClose();
    } catch (error) {
      console.error('Ошибка при создании/обновлении мероприятия:', error);
    }
  };

  const availableTags = theme ? getTagsForTheme(theme) : [];

  const handleTagToggle = (tag: string) => {
    if (tags.includes(tag)) {
      setTags(tags.filter((t) => t !== tag));
    } else {
      setTags([...tags, tag]);
    }
  };

  const handleAddCustomTag = () => {
    const trimmed = tagInput.trim();
    if (trimmed && !tags.includes(trimmed)) {
      setTags([...tags, trimmed]);
      setTagInput('');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">
            {event ? 'Редактировать мероприятие' : 'Создать мероприятие'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Название */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Название мероприятия *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                errors.title ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Например: Встреча разработчиков"
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-600">{errors.title}</p>
            )}
          </div>

          {/* Описание */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Описание *
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                errors.description ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Опишите мероприятие..."
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description}</p>
            )}
          </div>

          {/* Тематика */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Тематика *
            </label>
            <select
              value={theme}
              onChange={(e) => {
                setTheme(e.target.value as ThemeType);
                setTags([]); // Сбрасываем теги при смене тематики
              }}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                errors.theme ? 'border-red-500' : 'border-gray-300'
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
              <p className="mt-1 text-sm text-red-600">{errors.theme}</p>
            )}
          </div>

          {/* Теги */}
          {theme && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Теги
              </label>
              {availableTags.length > 0 && (
                <div className="border border-gray-300 rounded-lg p-3 bg-white mb-2 max-h-32 overflow-y-auto">
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
              )}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddCustomTag();
                    }
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Добавить свой тег..."
                />
                <button
                  type="button"
                  onClick={handleAddCustomTag}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Добавить
                </button>
              </div>
              {tags.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 px-2 py-1 bg-orange-100 text-orange-800 rounded text-sm"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => setTags(tags.filter((t) => t !== tag))}
                        className="hover:text-orange-900"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Дата */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Дата и время мероприятия *
            </label>
            <input
              type="datetime-local"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                errors.date ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.date && (
              <p className="mt-1 text-sm text-red-600">{errors.date}</p>
            )}
          </div>

          {/* Ошибки */}
          {(createMutation.error || updateMutation.error) && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800 text-sm">
                {createMutation.error instanceof Error
                  ? createMutation.error.message
                  : updateMutation.error instanceof Error
                  ? updateMutation.error.message
                  : 'Ошибка при сохранении мероприятия'}
              </p>
            </div>
          )}

          {/* Кнопки */}
          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              disabled={isLoading}
            >
              Отмена
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              {isLoading
                ? 'Сохранение...'
                : event
                ? 'Сохранить изменения'
                : 'Создать мероприятие'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}


