'use client';

import { useMe } from '@/hooks/useMe';
import { useUpdateProfile } from '@/hooks/useUpdateProfile';
import { useAuthStore } from '@/store/authStore';
import { UserStatus } from '@/types/user';
import {
  Edit2,
  Save,
  X,
  Github,
  Send,
  Plus,
  X as XIcon,
  User,
  Briefcase,
  Heart,
  Globe,
  CheckCircle2,
  Circle,
} from 'lucide-react';
import React, { useState, useEffect } from 'react';

const STATUS_OPTIONS: UserStatus[] = [
  'Ищу проект',
  'Ищу команду',
  'Ищу исполнителей',
  'Открыт к предложениям',
  'Не ищу сотрудничество',
];

const STATUS_COLORS: Record<UserStatus, string> = {
  'Ищу проект': 'bg-blue-100 text-blue-700 border-blue-200',
  'Ищу команду': 'bg-purple-100 text-purple-700 border-purple-200',
  'Ищу исполнителей': 'bg-green-100 text-green-700 border-green-200',
  'Открыт к предложениям': 'bg-emerald-100 text-emerald-700 border-emerald-200',
  'Не ищу сотрудничество': 'bg-gray-100 text-gray-700 border-gray-200',
};

export const ProfileHeader = () => {
  const { data: user, isLoading } = useMe();
  const { mutate: updateProfile, isPending } = useUpdateProfile();
  const { setUser } = useAuthStore();

  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState<typeof user | null>(null);
  const [skillInput, setSkillInput] = useState('');
  const [interestInput, setInterestInput] = useState('');
  const [isEditingStatus, setIsEditingStatus] = useState(false);

  useEffect(() => {
    if (user) {
      setEditedUser({ ...user });
      setUser(user);
    }
  }, [user, setUser]);

  const handleSave = () => {
    if (!editedUser) return;

    const payload = {
      name: editedUser.name,
      specialization: editedUser.specialization,
      about: editedUser.about,
      skills: editedUser.skills,
      interests: editedUser.interests,
      status: editedUser.status,
      isOpenForInvites: editedUser.isOpenForInvites,
      socials: {
        github: editedUser.socials?.github,
        telegram: editedUser.socials?.telegram,
      },
    };

    updateProfile(payload, {
      onSuccess: (updatedUser) => {
        setUser(updatedUser);
        setIsEditing(false);
      },
    });
  };

  const handleCancel = () => {
    if (user) {
      setEditedUser({ ...user });
    }
    setIsEditing(false);
  };

  const handleAddSkill = () => {
    if (!editedUser || !skillInput.trim()) return;
    if (editedUser.skills.includes(skillInput.trim())) return;

    setEditedUser({
      ...editedUser,
      skills: [...editedUser.skills, skillInput.trim()],
    });
    setSkillInput('');
  };

  const handleRemoveSkill = (skill: string) => {
    if (!editedUser) return;
    setEditedUser({
      ...editedUser,
      skills: editedUser.skills.filter((s) => s !== skill),
    });
  };

  const handleAddInterest = () => {
    if (!editedUser || !interestInput.trim()) return;
    if (editedUser.interests.includes(interestInput.trim())) return;

    setEditedUser({
      ...editedUser,
      interests: [...editedUser.interests, interestInput.trim()],
    });
    setInterestInput('');
  };

  const handleRemoveInterest = (interest: string) => {
    if (!editedUser) return;
    setEditedUser({
      ...editedUser,
      interests: editedUser.interests.filter((i) => i !== interest),
    });
  };

  const handleStatusChange = (newStatus: UserStatus) => {
    if (!user) return;
    
    const payload = {
      name: user.name,
      specialization: user.specialization,
      about: user.about,
      skills: user.skills,
      interests: user.interests,
      status: newStatus,
      isOpenForInvites: user.isOpenForInvites,
      socials: {
        github: user.socials?.github,
        telegram: user.socials?.telegram,
      },
    };

    updateProfile(payload, {
      onSuccess: (updatedUser) => {
        setUser(updatedUser);
        setIsEditingStatus(false);
      },
    });
  };

  if (isLoading || !user || !editedUser) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-24 w-24 rounded-full bg-gray-200 mb-4"></div>
          <div className="h-8 w-48 bg-gray-200 rounded mb-2"></div>
          <div className="h-4 w-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Верхняя строка: Аватар, имя, статус, кнопка */}
      <div className="flex items-start gap-4 mb-6">
        {/* Аватар */}
        <div className="flex-shrink-0">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 p-0.5 shadow-md">
            <div className="w-full h-full rounded-full bg-white p-0.5">
              <div className="w-full h-full rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold text-3xl">
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name || 'User'}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  (user.name || '?').charAt(0).toUpperCase()
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Имя, специализация, статус */}
        <div className="flex-1 min-w-0">
          {isEditing ? (
            <div className="space-y-2 mb-3">
              <input
                type="text"
                value={editedUser.name || ''}
                onChange={(e) =>
                  setEditedUser({ ...editedUser, name: e.target.value })
                }
                className="text-2xl font-bold text-gray-900 w-full px-3 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                placeholder="Имя"
              />
              <input
                type="text"
                value={editedUser.specialization || ''}
                onChange={(e) =>
                  setEditedUser({
                    ...editedUser,
                    specialization: e.target.value,
                  })
                }
                className="text-base text-gray-500 w-full px-3 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                placeholder="Роль / специализация"
              />
            </div>
          ) : (
            <div className="mb-3">
              <h1 className="text-2xl font-bold text-gray-900 mb-1">
                {user.name || 'Без имени'}
              </h1>
              <p className="text-base text-gray-500 mb-2">
                {user.specialization || 'Роль не указана'}
              </p>
              <div className="flex items-center gap-3 flex-wrap">
                {isEditing ? (
                  <select
                    value={editedUser.status}
                    onChange={(e) =>
                      setEditedUser({
                        ...editedUser,
                        status: e.target.value as UserStatus,
                      })
                    }
                    className={`px-3 py-1 rounded-full border text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 ${STATUS_COLORS[editedUser.status]}`}
                  >
                    {STATUS_OPTIONS.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                ) : isEditingStatus ? (
                  <select
                    value={user.status}
                    onChange={(e) => {
                      handleStatusChange(e.target.value as UserStatus);
                    }}
                    onBlur={() => setIsEditingStatus(false)}
                    autoFocus
                    className={`px-3 py-1 rounded-full border text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 ${STATUS_COLORS[user.status]}`}
                  >
                    {STATUS_OPTIONS.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                ) : (
                  <button
                    onClick={() => setIsEditingStatus(true)}
                    className={`px-3 py-1 rounded-full border text-sm font-medium transition-all duration-200 hover:shadow-md hover:scale-105 cursor-pointer ${STATUS_COLORS[user.status]}`}
                    title="Нажмите, чтобы изменить статус"
                  >
                    {user.status}
                  </button>
                )}
                
                {/* Toggle для isOpenForInvites */}
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isEditing ? editedUser.isOpenForInvites : user.isOpenForInvites}
                    onChange={(e) =>
                      isEditing
                        ? setEditedUser({
                            ...editedUser,
                            isOpenForInvites: e.target.checked,
                          })
                        : undefined
                    }
                    disabled={!isEditing}
                    className="sr-only"
                  />
                  <div className="relative">
                    <div
                      className={`w-10 h-5 rounded-full transition-colors duration-200 ${
                        (isEditing ? editedUser.isOpenForInvites : user.isOpenForInvites)
                          ? 'bg-green-500'
                          : 'bg-gray-300'
                      }`}
                    >
                      <div
                        className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow-sm transform transition-transform duration-200 ${
                          (isEditing ? editedUser.isOpenForInvites : user.isOpenForInvites)
                            ? 'translate-x-5'
                            : 'translate-x-0'
                        }`}
                      />
                    </div>
                  </div>
                  <span className="text-sm text-gray-700 font-medium">
                    Открыт для приглашений
                  </span>
                </label>
              </div>
            </div>
          )}
        </div>

        {/* Кнопка редактирования */}
        <div className="flex-shrink-0">
          {isEditing ? (
            <div className="flex gap-2">
              <button
                onClick={handleCancel}
                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-all duration-200 flex items-center gap-2 text-sm font-medium hover:scale-105 active:scale-95"
              >
                <X className="w-4 h-4" />
                Отменить
              </button>
              <button
                onClick={handleSave}
                disabled={isPending}
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 transition-all duration-200 flex items-center gap-2 text-sm font-medium shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 active:scale-95"
              >
                <Save className="w-4 h-4" />
                {isPending ? 'Сохранение...' : 'Сохранить'}
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 transition-all duration-200 flex items-center gap-2 text-sm font-medium shadow-sm hover:shadow-md hover:scale-105 active:scale-95"
            >
              <Edit2 className="w-4 h-4" />
              Редактировать
            </button>
          )}
        </div>
      </div>

      {/* Блоки информации - компактные карточки */}
      <div className="space-y-4">
        {/* Блок "О себе" */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 transition-all duration-200 hover:shadow-md">
          <div className="flex items-center gap-2 mb-3">
            <User className="w-4 h-4 text-gray-500" />
            <h3 className="text-base font-semibold text-gray-900">О себе</h3>
          </div>
          {isEditing ? (
            <textarea
              value={editedUser.about || ''}
              onChange={(e) =>
                setEditedUser({ ...editedUser, about: e.target.value })
              }
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none text-sm transition-all duration-200"
              placeholder="Расскажите о себе"
            />
          ) : (
            <p className="text-sm text-gray-600 leading-relaxed">
              {user.about || 'Описание отсутствует'}
            </p>
          )}
        </div>

        {/* Блок "Навыки" */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 transition-all duration-200 hover:shadow-md">
          <div className="flex items-center gap-2 mb-3">
            <Briefcase className="w-4 h-4 text-blue-500" />
            <h3 className="text-base font-semibold text-gray-900">Навыки</h3>
          </div>
          {isEditing ? (
            <div className="space-y-2">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddSkill();
                    }
                  }}
                  placeholder="Добавить навык"
                  className="flex-1 px-3 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm transition-all duration-200"
                />
                <button
                  onClick={handleAddSkill}
                  className="px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 text-sm font-medium flex items-center gap-1.5 hover:scale-105 active:scale-95"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Добавить
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {editedUser.skills.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium border border-blue-200 transition-all duration-200 hover:bg-blue-100 hover:scale-105"
                  >
                    {skill}
                    <button
                      onClick={() => handleRemoveSkill(skill)}
                      className="text-blue-700 hover:text-blue-900 transition-colors"
                    >
                      <XIcon className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {user.skills.length > 0 ? (
                user.skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium border border-blue-200 transition-all duration-200 hover:bg-blue-100 hover:scale-105 cursor-default"
                  >
                    {skill}
                  </span>
                ))
              ) : (
                <span className="text-gray-500 text-sm">
                  Навыки отсутствуют
                </span>
              )}
            </div>
          )}
        </div>

        {/* Блок "Интересы" */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 transition-all duration-200 hover:shadow-md">
          <div className="flex items-center gap-2 mb-3">
            <Heart className="w-4 h-4 text-purple-500" />
            <h3 className="text-base font-semibold text-gray-900">Интересы</h3>
          </div>
          {isEditing ? (
            <div className="space-y-2">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={interestInput}
                  onChange={(e) => setInterestInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddInterest();
                    }
                  }}
                  placeholder="Добавить интерес"
                  className="flex-1 px-3 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm transition-all duration-200"
                />
                <button
                  onClick={handleAddInterest}
                  className="px-3 py-1.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all duration-200 text-sm font-medium flex items-center gap-1.5 hover:scale-105 active:scale-95"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Добавить
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {editedUser.interests.map((interest) => (
                  <span
                    key={interest}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-sm font-medium border border-purple-200 transition-all duration-200 hover:bg-purple-100 hover:scale-105"
                  >
                    {interest}
                    <button
                      onClick={() => handleRemoveInterest(interest)}
                      className="text-purple-700 hover:text-purple-900 transition-colors"
                    >
                      <XIcon className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {user.interests.length > 0 ? (
                user.interests.map((interest) => (
                  <span
                    key={interest}
                    className="px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-sm font-medium border border-purple-200 transition-all duration-200 hover:bg-purple-100 hover:scale-105 cursor-default"
                  >
                    {interest}
                  </span>
                ))
              ) : (
                <span className="text-gray-500 text-sm">
                  Интересы отсутствуют
                </span>
              )}
            </div>
          )}
        </div>

        {/* Блок "Социальные сети" */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 transition-all duration-200 hover:shadow-md">
          <div className="flex items-center gap-2 mb-3">
            <Globe className="w-4 h-4 text-gray-500" />
            <h3 className="text-base font-semibold text-gray-900">
              Социальные сети
            </h3>
          </div>
          {isEditing ? (
            <div className="space-y-2">
              <input
                type="text"
                value={editedUser.socials?.github || ''}
                onChange={(e) =>
                  setEditedUser({
                    ...editedUser,
                    socials: {
                      ...editedUser.socials,
                      github: e.target.value,
                    },
                  })
                }
                placeholder="GitHub URL"
                className="w-full px-3 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm transition-all duration-200"
              />
              <input
                type="text"
                value={editedUser.socials?.telegram || ''}
                onChange={(e) =>
                  setEditedUser({
                    ...editedUser,
                    socials: {
                      ...editedUser.socials,
                      telegram: e.target.value,
                    },
                  })
                }
                placeholder="Telegram URL"
                className="w-full px-3 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm transition-all duration-200"
              />
            </div>
          ) : (
            <div className="flex gap-2">
              {user.socials?.github && (
                <a
                  href={user.socials.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-all duration-200 group hover:scale-110"
                  title="GitHub"
                >
                  <Github className="w-5 h-5 text-gray-600 group-hover:text-gray-900 transition-colors" />
                </a>
              )}
              {user.socials?.telegram && (
                <a
                  href={user.socials.telegram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-all duration-200 group hover:scale-110"
                  title="Telegram"
                >
                  <Send className="w-5 h-5 text-gray-600 group-hover:text-gray-900 transition-colors" />
                </a>
              )}
              {!user.socials?.github && !user.socials?.telegram && (
                <span className="text-gray-500 text-sm">
                  Социальные сети не указаны
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
