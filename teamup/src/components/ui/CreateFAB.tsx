'use client';

import { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { useMainStore } from '@/store/mainStore';

export function CreateFAB() {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();
  const { user } = useAuthStore();
  const { openAdModal, openProjectModal, openCommunityModal } = useMainStore();
  
  // Не показывать кнопку на страницах входа и регистрации
  const isAuthPage = pathname?.startsWith('/auth/login') || pathname?.startsWith('/auth/register');

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

  // Не показывать кнопку если пользователь не авторизован или на страницах входа/регистрации
  if (!user || isAuthPage) {
    return null;
  }

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleOpenAd = () => {
    openAdModal();
    setIsOpen(false);
  };

  const handleOpenProject = () => {
    openProjectModal();
    setIsOpen(false);
  };

  const handleOpenCommunity = () => {
    openCommunityModal();
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
            onClick={handleOpenAd}
            className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 transition text-left w-full"
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            <span className="text-sm font-medium text-gray-700">Создать объявление</span>
          </button>
          <button
            onClick={handleOpenProject}
            className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 transition text-left w-full"
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <span className="text-sm font-medium text-gray-700">Создать проект</span>
          </button>
          <button
            onClick={handleOpenCommunity}
            className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 transition text-left w-full"
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
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
