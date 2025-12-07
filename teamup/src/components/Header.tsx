'use client';

import { usePathname } from 'next/navigation';
import { Logo } from '../../public/Logo';
import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';

const navItems = [
  { label: 'Главная', path: '/' },
  { label: 'Отклики', path: '/responses' },
  { label: 'Чаты', path: '/chats' },
  { label: 'События', path: '/events' },
  { label: 'Профиль', path: '/profile' },
];

export default function Header () {
  const pathname = usePathname();
  const user = useAuthStore((state) => state.user);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <Link href={'/'}>
              <Logo size='2xl'/> 
            </Link>
            <nav className="hidden md:flex items-center gap-6">
              {navItems.map((item) => {
                const isActive = pathname === item.path;
                return (
                  <a
                    key={item.path}
                    href={item.path}
                    className={`px-3 py-2 text-sm font-medium transition-colors rounded-md ${
                      isActive
                        ? 'bg-blue-50 text-blue-600'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    {item.label}
                  </a>
                );
              })}
              {user?.role === 'admin' && (
                <a
                  href="/admin/events"
                  className={`px-3 py-2 text-sm font-medium transition-colors rounded-md ${
                    pathname === '/admin/events'
                      ? 'bg-orange-50 text-orange-600'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  Админ-панель
                </a>
              )}
            </nav>
          </div>
          <div className="flex items-center">
            {user ? (
              <Link href="/profile">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-semibold text-sm cursor-pointer hover:opacity-90 transition-opacity overflow-hidden">
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name || 'User'}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <span>
                      {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                    </span>
                  )}
                </div>
              </Link>
            ) : (
              <Link href="/auth/login">
                <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors">
                  Войти
                </button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}



