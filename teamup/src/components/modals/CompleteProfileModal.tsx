'use client';

import { useState, useEffect } from 'react';
import { useCompleteProfile } from '@/hooks/useCompleteProfile';
import { useAuthStore } from '@/store/authStore';
import { UserStatus } from '@/types/user';

const STATUS_OPTIONS: UserStatus[] = [
  'Открыт к предложениям',
  'Ищу команду',
  'Ищу проект',
];

export default function CompleteProfileModal() {
  const showProfileModal = useAuthStore((state) => state.showProfileModal);
  const { mutate: completeProfile, isPending } = useCompleteProfile();

  const [specialization, setSpecialization] = useState('');
  const [about, setAbout] = useState('');
  const [skills, setSkills] = useState<string[]>([]);
  const [interests, setInterests] = useState<string[]>([]);
  const [status, setStatus] = useState<UserStatus>('Открыт к предложениям');

  const [skillInput, setSkillInput] = useState('');
  const [interestInput, setInterestInput] = useState('');

  const [errors, setErrors] = useState({
    specialization: '',
    about: '',
    skills: '',
    interests: '',
  });

  // Валидация формы
  const validateForm = (): boolean => {
    const newErrors = {
      specialization: '',
      about: '',
      skills: '',
      interests: '',
    };

    let isValid = true;

    if (specialization.trim().length < 3) {
      newErrors.specialization = 'Минимум 3 символа';
      isValid = false;
    }

    if (about.trim().length < 10) {
      newErrors.about = 'Минимум 10 символов';
      isValid = false;
    }

    if (skills.length === 0) {
      newErrors.skills = 'Добавьте хотя бы один навык';
      isValid = false;
    }

    if (interests.length === 0) {
      newErrors.interests = 'Добавьте хотя бы один интерес';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  // Проверка можно ли активировать кнопку
  const isFormValid =
    specialization.trim().length >= 3 &&
    about.trim().length >= 10 &&
    skills.length > 0 &&
    interests.length > 0;

  // Добавление навыка
  const handleAddSkill = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && skillInput.trim()) {
      e.preventDefault();
      if (!skills.includes(skillInput.trim())) {
        setSkills([...skills, skillInput.trim()]);
        setSkillInput('');
        setErrors({ ...errors, skills: '' });
      }
    }
  };

  // Удаление навыка
  const handleRemoveSkill = (skill: string) => {
    setSkills(skills.filter((s) => s !== skill));
  };

  // Добавление интереса
  const handleAddInterest = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && interestInput.trim()) {
      e.preventDefault();
      if (!interests.includes(interestInput.trim())) {
        setInterests([...interests, interestInput.trim()]);
        setInterestInput('');
        setErrors({ ...errors, interests: '' });
      }
    }
  };

  // Удаление интереса
  const handleRemoveInterest = (interest: string) => {
    setInterests(interests.filter((i) => i !== interest));
  };

  // Отправка формы
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      completeProfile({
        specialization: specialization.trim(),
        about: about.trim(),
        skills,
        interests,
        status,
      });
    }
  };

  // Если модалка не должна отображаться
  if (!showProfileModal) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fadeIn">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Modal */}
      <div className="relative w-full max-w-2xl max-h-[90vh] bg-white rounded-2xl shadow-2xl overflow-hidden animate-slideUp">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-6">
          <h2 className="text-2xl font-bold text-white">
            Заполните профиль
          </h2>
          <p className="text-blue-100 mt-1">
            Это поможет другим найти вас для совместных проектов
          </p>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-8 overflow-y-auto max-h-[calc(90vh-120px)]">
          {/* Specialization */}
          <div className="mb-6">
            <label htmlFor="specialization" className="block text-sm font-semibold text-gray-700 mb-2">
              Специализация <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="specialization"
              value={specialization}
              onChange={(e) => {
                setSpecialization(e.target.value);
                setErrors({ ...errors, specialization: '' });
              }}
              placeholder="Например: Frontend-разработчик"
              className={`w-full px-4 py-3 border ${
                errors.specialization ? 'border-red-500' : 'border-gray-300'
              } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition`}
            />
            {errors.specialization && (
              <p className="text-red-500 text-sm mt-1">{errors.specialization}</p>
            )}
          </div>

          {/* About */}
          <div className="mb-6">
            <label htmlFor="about" className="block text-sm font-semibold text-gray-700 mb-2">
              О себе <span className="text-red-500">*</span>
            </label>
            <textarea
              id="about"
              value={about}
              onChange={(e) => {
                setAbout(e.target.value);
                setErrors({ ...errors, about: '' });
              }}
              placeholder="Расскажите о себе, опыте, увлечениях..."
              rows={4}
              className={`w-full px-4 py-3 border ${
                errors.about ? 'border-red-500' : 'border-gray-300'
              } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition resize-none`}
            />
            <div className="flex justify-between items-center mt-1">
              {errors.about && (
                <p className="text-red-500 text-sm">{errors.about}</p>
              )}
              <p className={`text-sm ml-auto ${about.length >= 10 ? 'text-green-600' : 'text-gray-500'}`}>
                {about.length} / минимум 10
              </p>
            </div>
          </div>

          {/* Skills */}
          <div className="mb-6">
            <label htmlFor="skills" className="block text-sm font-semibold text-gray-700 mb-2">
              Навыки <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="skills"
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyDown={handleAddSkill}
              placeholder="Введите навык и нажмите Enter"
              className={`w-full px-4 py-3 border ${
                errors.skills ? 'border-red-500' : 'border-gray-300'
              } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition`}
            />
            {errors.skills && (
              <p className="text-red-500 text-sm mt-1">{errors.skills}</p>
            )}
            
            {/* Skills Tags */}
            {skills.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {skills.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium"
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(skill)}
                      className="hover:bg-blue-200 rounded-full p-0.5 transition"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Interests */}
          <div className="mb-6">
            <label htmlFor="interests" className="block text-sm font-semibold text-gray-700 mb-2">
              Интересы <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="interests"
              value={interestInput}
              onChange={(e) => setInterestInput(e.target.value)}
              onKeyDown={handleAddInterest}
              placeholder="Введите интерес и нажмите Enter"
              className={`w-full px-4 py-3 border ${
                errors.interests ? 'border-red-500' : 'border-gray-300'
              } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition`}
            />
            {errors.interests && (
              <p className="text-red-500 text-sm mt-1">{errors.interests}</p>
            )}
            
            {/* Interests Tags */}
            {interests.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {interests.map((interest) => (
                  <span
                    key={interest}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium"
                  >
                    {interest}
                    <button
                      type="button"
                      onClick={() => handleRemoveInterest(interest)}
                      className="hover:bg-purple-200 rounded-full p-0.5 transition"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Status */}
          <div className="mb-8">
            <label htmlFor="status" className="block text-sm font-semibold text-gray-700 mb-2">
              Статус
            </label>
            <select
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value as UserStatus)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition bg-white"
            >
              {STATUS_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!isFormValid || isPending}
            className={`w-full py-4 rounded-lg font-semibold text-white text-lg transition-all duration-200 ${
              isFormValid && !isPending
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl'
                : 'bg-gray-300 cursor-not-allowed'
            }`}
          >
            {isPending ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Сохранение...
              </span>
            ) : (
              'Сохранить профиль'
            )}
          </button>
        </form>
      </div>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }

        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}

