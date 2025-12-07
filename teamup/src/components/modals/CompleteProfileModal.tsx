'use client';

import { useState } from 'react';
import { useCompleteProfile } from '@/hooks/useCompleteProfile';
import { useAuthStore } from '@/store/authStore';
import { UserStatus } from '@/types/user';

const STATUS_OPTIONS: UserStatus[] = [
  'Открыт к предложениям',
  'Ищу команду',
  'Ищу проект',
  'Ищу исполнителей',
  'Не ищу сотрудничество',
];

export default function CompleteProfileModal() {
  const showProfileModal = useAuthStore((state) => state.showProfileModal);
  const setObserverMode = useAuthStore((state) => state.setObserverMode);
  const logout = useAuthStore((state) => state.logout);
  const { mutate: completeProfile, isPending } = useCompleteProfile();

  // Form state
  const [specialization, setSpecialization] = useState('');
  const [about, setAbout] = useState('');
  const [skills, setSkills] = useState<string[]>([]);
  const [interests, setInterests] = useState<string[]>([]);
  const [status, setStatus] = useState<UserStatus>('Открыт к предложениям');
  const [isOpenForInvites, setIsOpenForInvites] = useState(true);
  const [github, setGithub] = useState('');
  const [telegram, setTelegram] = useState('');

  const [skillInput, setSkillInput] = useState('');
  const [interestInput, setInterestInput] = useState('');

  const [errors, setErrors] = useState({
    about: '',
    skills: '',
    interests: '',
  });

  // Валидация формы (specialization теперь необязательна!)
  const validateForm = (): boolean => {
    const newErrors = {
      about: '',
      skills: '',
      interests: '',
    };

    let isValid = true;

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

  // Проверка можно ли активировать кнопку (specialization больше не требуется!)
  const isFormValid =
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

  const handleRemoveSkill = (skill: string) => {
    setSkills(skills.filter((s) => s !== skill));
  };

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

  const handleRemoveInterest = (interest: string) => {
    setInterests(interests.filter((i) => i !== interest));
  };

  // Отправка формы
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      const socials = github || telegram ? { github, telegram } : undefined;

      completeProfile({
        specialization: specialization.trim() || undefined,
        about: about.trim(),
        skills,
        interests,
        status,
        isOpenForInvites,
        socials,
      });
    }
  };

  // Продолжить без регистрации
  const handleContinueAsObserver = () => {
    setObserverMode();
    logout();
  };

  if (!showProfileModal) {
    return null;
  }

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/60 to-black/70 backdrop-blur-md animate-fadeIn" />

        {/* Modal */}
        <div className="relative w-full max-w-3xl max-h-[90vh] bg-white rounded-3xl shadow-2xl overflow-hidden animate-scaleIn">
          {/* Header - более компактный */}
          <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 px-8 py-6">
            <h2 className="text-2xl font-bold text-white mb-1">
              Расскажите о себе
            </h2>
            <p className="text-sm text-indigo-100">
              Это поможет другим найти вас для совместных проектов
            </p>
          </div>

          {/* Content */}
          <form onSubmit={handleSubmit} className="p-8 overflow-y-auto max-h-[calc(90vh-180px)]">
            {/* Progress indicator */}
            <div className="flex items-center justify-center gap-2 mb-8">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center text-sm font-bold">1</div>
                <span className="text-sm font-medium text-gray-700">Личность</span>
              </div>
              <div className="w-8 h-0.5 bg-gray-300"></div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center text-sm font-bold">2</div>
                <span className="text-sm font-medium text-gray-700">Навыки</span>
              </div>
              <div className="w-8 h-0.5 bg-gray-300"></div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center text-sm font-bold">3</div>
                <span className="text-sm font-medium text-gray-700">Цели</span>
              </div>
            </div>

            {/* Секция 1: Личность */}
            <div className="mb-8">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs font-bold">1</span>
                Личность
              </h3>

              {/* Specialization - НЕОБЯЗАТЕЛЬНА */}
              <div className="mb-5">
                <label htmlFor="specialization" className="block text-sm font-semibold text-gray-700 mb-2">
                  Ваша специализация
                </label>
                <input
                  type="text"
                  id="specialization"
                  value={specialization}
                  onChange={(e) => setSpecialization(e.target.value)}
                  placeholder="Frontend-разработчик, Backend, UX-дизайнер..."
                  className="w-full px-4 py-3 border-2 border-gray-200 focus:border-indigo-500 rounded-xl focus:ring-4 focus:ring-indigo-100 outline-none transition-all"
                />
                <p className="text-xs text-gray-500 mt-1.5 flex items-center gap-1">
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  Можно пропустить, если вы ещё учитесь или не определились
                </p>
              </div>

              {/* About - ОБЯЗАТЕЛЬНО */}
              <div className="mb-5">
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
                  placeholder="Расскажите кратко о себе, опыте, целях, чем можете быть полезны проектам..."
                  rows={4}
                  className={`w-full px-4 py-3 border-2 ${
                    errors.about ? 'border-red-400 focus:border-red-500' : 'border-gray-200 focus:border-indigo-500'
                  } rounded-xl focus:ring-4 focus:ring-indigo-100 outline-none transition-all resize-none`}
                />
                <div className="flex justify-between items-center mt-1.5">
                  {errors.about ? (
                    <p className="text-red-500 text-sm flex items-center gap-1">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {errors.about}
                    </p>
                  ) : (
                    <span className="text-sm text-gray-400">Минимум 10 символов</span>
                  )}
                  <p className={`text-sm font-medium ml-auto ${about.length >= 10 ? 'text-green-600' : 'text-gray-400'}`}>
                    {about.length}
                  </p>
                </div>
              </div>
            </div>

            {/* Секция 2: Навыки */}
            <div className="mb-8">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs font-bold">2</span>
                Навыки и интересы
              </h3>

              {/* Skills */}
              <div className="mb-5">
                <label htmlFor="skills" className="block text-sm font-semibold text-gray-700 mb-2">
                  Навыки <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="skills"
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyDown={handleAddSkill}
                    placeholder="Введите навык и нажмите Enter"
                    className={`w-full px-4 py-3 pr-12 border-2 ${
                      errors.skills ? 'border-red-400 focus:border-red-500' : 'border-gray-200 focus:border-indigo-500'
                    } rounded-xl focus:ring-4 focus:ring-indigo-100 outline-none transition-all`}
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2">
                    <kbd className="px-2 py-1 text-xs font-semibold text-gray-500 bg-gray-100 border border-gray-300 rounded-lg">
                      Enter
                    </kbd>
                  </div>
                </div>
                {errors.skills && (
                  <p className="text-red-500 text-sm mt-1.5 flex items-center gap-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {errors.skills}
                  </p>
                )}
                
                {skills.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {skills.map((skill) => (
                      <span
                        key={skill}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 text-blue-700 rounded-full text-sm font-medium hover:from-blue-100 hover:to-indigo-100 transition-all"
                      >
                        {skill}
                        <button
                          type="button"
                          onClick={() => handleRemoveSkill(skill)}
                          className="hover:bg-blue-200 rounded-full p-1 transition-colors"
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

              {/* Interests */}
              <div className="mb-5">
                <label htmlFor="interests" className="block text-sm font-semibold text-gray-700 mb-2">
                  Интересы <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="interests"
                    value={interestInput}
                    onChange={(e) => setInterestInput(e.target.value)}
                    onKeyDown={handleAddInterest}
                    placeholder="Введите интерес и нажмите Enter"
                    className={`w-full px-4 py-3 pr-12 border-2 ${
                      errors.interests ? 'border-red-400 focus:border-red-500' : 'border-gray-200 focus:border-indigo-500'
                    } rounded-xl focus:ring-4 focus:ring-indigo-100 outline-none transition-all`}
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2">
                    <kbd className="px-2 py-1 text-xs font-semibold text-gray-500 bg-gray-100 border border-gray-300 rounded-lg">
                      Enter
                    </kbd>
                  </div>
                </div>
                {errors.interests && (
                  <p className="text-red-500 text-sm mt-1.5 flex items-center gap-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {errors.interests}
                  </p>
                )}
                
                {interests.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {interests.map((interest) => (
                      <span
                        key={interest}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200 text-purple-700 rounded-full text-sm font-medium hover:from-purple-100 hover:to-pink-100 transition-all"
                      >
                        {interest}
                        <button
                          type="button"
                          onClick={() => handleRemoveInterest(interest)}
                          className="hover:bg-purple-200 rounded-full p-1 transition-colors"
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

            {/* Секция 3: Цели и контакты */}
            <div className="mb-8">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs font-bold">3</span>
                Цели и контакты
              </h3>

              {/* Status */}
              <div className="mb-5">
                <label htmlFor="status" className="block text-sm font-semibold text-gray-700 mb-2">
                  Ваш статус
                </label>
                <select
                  id="status"
                  value={status}
                  onChange={(e) => setStatus(e.target.value as UserStatus)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all bg-white cursor-pointer"
                >
                  {STATUS_OPTIONS.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              {/* isOpenForInvites Toggle */}
              <div className="mb-5 bg-gradient-to-r from-indigo-50 to-purple-50 border-2 border-indigo-200 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <label htmlFor="isOpenForInvites" className="block text-sm font-semibold text-gray-900 mb-1 cursor-pointer">
                      Показывать мой профиль в поиске
                    </label>
                    <p className="text-xs text-gray-600">
                      Другие пользователи смогут писать вам по вопросам сотрудничества
                    </p>
                  </div>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={isOpenForInvites}
                    onClick={() => setIsOpenForInvites(!isOpenForInvites)}
                    className={`relative inline-flex h-7 w-14 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-4 focus:ring-indigo-200 ${
                      isOpenForInvites ? 'bg-indigo-600' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                        isOpenForInvites ? 'translate-x-7' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* Socials */}
              <div className="space-y-4">
                <p className="text-sm font-semibold text-gray-700 mb-3">Соцсети (необязательно)</p>
                
                {/* GitHub */}
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path fillRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    id="github"
                    value={github}
                    onChange={(e) => setGithub(e.target.value)}
                    placeholder="username или ссылка на профиль"
                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all"
                  />
                </div>

                {/* Telegram */}
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"/>
                    </svg>
                  </div>
                  <input
                    type="text"
                    id="telegram"
                    value={telegram}
                    onChange={(e) => setTelegram(e.target.value)}
                    placeholder="@username или ссылка"
                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Buttons - более компактные */}
            <div className="space-y-3">
              {/* Primary button - меньше по высоте */}
              <button
                type="submit"
                disabled={!isFormValid || isPending}
                className={`w-full py-3 rounded-xl font-semibold text-white transition-all duration-300 ${
                  isFormValid && !isPending
                    ? 'bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 shadow-md hover:shadow-lg hover:scale-[1.01] active:scale-[0.99]'
                    : 'bg-gray-300 cursor-not-allowed opacity-60'
                }`}
              >
                {isPending ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Сохранение...
                  </span>
                ) : (
                  'Завершить регистрацию'
                )}
              </button>

              {/* Secondary button - продолжить без регистрации */}
              <button
                type="button"
                onClick={handleContinueAsObserver}
                disabled={isPending}
                className="w-full py-3 rounded-xl font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 hover:text-gray-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Продолжить без регистрации
              </button>
              
              <p className="text-xs text-center text-gray-500 mt-2">
                Вы сможете смотреть контент, но не публиковать и не общаться
              </p>
            </div>
          </form>
        </div>
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
          animation: fadeIn 0.3s ease-out;
        }

        .animate-scaleIn {
          animation: scaleIn 0.3s ease-out;
        }
      `}</style>
    </>
  );
}
