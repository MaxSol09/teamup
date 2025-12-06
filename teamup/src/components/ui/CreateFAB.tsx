'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';

export function CreateFAB() {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useAuthStore();

  // Закрытие меню по клику вне компонента
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        buttonRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Скрытие кнопки на страницах создания
  const isCreatePage = pathname?.startsWith('/create');

  // Не показывать кнопку если пользователь не авторизован или на странице создания
  if (!user || isCreatePage) {
    return null;
  }

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleNavigate = (path: string) => {
    router.push(path);
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Выпадающее меню */}
      {isOpen && (
        <div
          ref={menuRef}
          className="absolute bottom-16 right-0 flex flex-col gap-2 bg-white rounded-xl shadow-xl p-3 animate-fade-in min-w-[200px]"
        >
          <button
            onClick={() => handleNavigate('/create/post')}
            className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 transition text-left w-full"
          >
            <span className="text-lg">➕</span>
            <span className="text-sm font-medium text-gray-700">Создать объявление</span>
          </button>
          <button
            onClick={() => handleNavigate('/create/project')}
            className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 transition text-left w-full"
          >
            <span className="text-lg">🚀</span>
            <span className="text-sm font-medium text-gray-700">Создать проект</span>
          </button>
          <button
            onClick={() => handleNavigate('/create/community')}
            className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 transition text-left w-full"
          >
            <span className="text-lg">👥</span>
            <span className="text-sm font-medium text-gray-700">Создать сообщество</span>
          </button>
        </div>
      )}

      {/* Основная кнопка */}
      <button
        ref={buttonRef}
        onClick={handleToggle}
        aria-label="Создать новый элемент"
        className="w-14 h-14 rounded-full bg-blue-600 text-white shadow-lg hover:bg-blue-700 active:scale-95 transition flex items-center justify-center"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2.5}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
        </svg>
      </button>
    </div>
  );
}
