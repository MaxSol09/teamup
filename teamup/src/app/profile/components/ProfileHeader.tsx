import { useProfileStore } from '@/store/profileStore';
import React, { useState } from 'react'

export const ProfileHeader = () => {

    const { user, isEditing, toggleEdit, updateUser, addSkill, removeSkill } = useProfileStore();

    const [skillInput, setSkillInput] = useState('');

    const handleAddSkill = () => {
        if (skillInput.trim() && !user.skills.includes(skillInput.trim())) {
        addSkill(skillInput.trim());
        setSkillInput('');
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
        handleAddSkill();
        }
    };


    return (
        <div className="p-6 md:p-8">
            <div className="flex flex-col md:flex-row gap-6 md:gap-8">
            {/* Left: Avatar */}
                <div className="flex-shrink-0 flex justify-center md:justify-start">
                    <div className="relative w-24 h-24 group">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-semibold text-2xl shadow-md">
                        {user.avatar ? (
                        <img src={user.avatar} alt={user.name} className="w-full h-full rounded-full object-cover" />
                        ) : (
                        user.name.charAt(0).toUpperCase()
                        )}
                    </div>
                    <div className="absolute inset-0 rounded-full bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 flex items-center justify-center cursor-pointer">
                        <svg
                            className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                            />
                            <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                        </svg>
                    </div>
                    </div>
                </div>
                {/* Right: Profile Info */}
                <div className="flex-1 flex flex-col gap-4">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    <div className="flex-1">
                        {isEditing ? (
                        <div className="space-y-3">
                            <input
                            type="text"
                            value={user.name}
                            onChange={(e) => updateUser({ name: e.target.value })}
                            className="text-2xl md:text-3xl font-bold text-gray-900 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Имя"
                            />
                            <input
                            type="text"
                            value={user.role}
                            onChange={(e) => updateUser({ role: e.target.value })}
                            className="text-base text-gray-500 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Роль / специализация"
                            />
                        </div>
                        ) : (
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1 items-center">{user.name}</h1>
                            <p className="text-base text-gray-500">{user.role || 'Роль не указана'}</p>
                        </div>
                        )}

                        {/* About Section */}
                        <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">О себе</label>
                        {isEditing ? (
                            <textarea
                            value={user.about}
                            onChange={(e) => updateUser({ about: e.target.value })}
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none text-sm"
                            placeholder="Расскажите о себе"
                            />
                        ) : (
                            <p className="text-sm text-gray-600 mt-1">{user.about || 'Описание отсутствует'}</p>
                        )}
                        </div>

                        {/* Skills Section */}
                        <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Навыки</label>
                        {isEditing ? (
                            <div className="space-y-2">
                            <div className="flex gap-2">
                                <input
                                type="text"
                                value={skillInput}
                                onChange={(e) => setSkillInput(e.target.value)}
                                onKeyPress={handleKeyPress}
                                placeholder="Добавить навык"
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                />
                                <button
                                onClick={handleAddSkill}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                                >
                                Добавить
                                </button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {user.skills.map((skill) => (
                                <span
                                    key={skill}
                                    className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm"
                                >
                                    {skill}
                                    <button
                                    onClick={() => removeSkill(skill)}
                                    className="text-blue-600 hover:text-blue-800 font-semibold"
                                    >
                                    ×
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
                                    className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm font-medium"
                                >
                                    {skill}
                                </span>
                                ))
                            ) : (
                                <span className="text-gray-500 text-sm">Навыки отсутствуют</span>
                            )}
                            </div>
                        )}
                        </div>

                        {/* Social Links */}
                        <div className="flex gap-3 mt-4">
                        {isEditing ? (
                            <>
                            <input
                                type="text"
                                value={user.github}
                                onChange={(e) => updateUser({ github: e.target.value })}
                                placeholder="GitHub URL"
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                            />
                            <input
                                type="text"
                                value={user.telegram}
                                onChange={(e) => updateUser({ telegram: e.target.value })}
                                placeholder="Telegram URL"
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                            />
                            </>
                        ) : (
                            <>
                            {user.github && (
                                <a
                                href={user.github}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors group"
                                title="GitHub"
                                >
                                <svg
                                    className="w-5 h-5 text-gray-600 group-hover:text-gray-900"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                                </svg>
                                </a>
                            )}
                            {user.telegram && (
                                <a
                                href={user.telegram}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors group"
                                title="Telegram"
                                >
                                <svg
                                    className="w-5 h-5 text-gray-600 group-hover:text-gray-900"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.559z" />
                                </svg>
                                </a>
                            )}
                            </>
                        )}
                        </div>
                    </div>
                    {/* Edit Button */}
                    <div className="flex justify-end">
                        <button onClick={toggleEdit} className="px-5 py-2 rounded-xl border border-blue-500 text-blue-600 hover:bg-blue-50 transition">
                            {isEditing ? 'Сохранить' : 'Редактировать профиль'}
                        </button>
                    </div>
                    </div>
                </div>
            </div>
        </div>
  )
}
