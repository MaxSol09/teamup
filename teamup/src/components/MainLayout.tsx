'use client';

import Header from '@/components/Header';

interface MainLayoutProps {
  children: React.ReactNode;
}

/**
 * Универсальный layout-контейнер для всех страниц
 * - Включает фиксированный Header
 * - Обеспечивает правильный отступ от хедера (pt-20 для лучшего визуального разделения)
 * - Центрирует контент с max-w-7xl
 * - Адаптивные отступы для mobile/desktop
 */
export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>
    </div>
  );
}

