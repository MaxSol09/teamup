'use client';

import { usePathname } from 'next/navigation';
import dynamic from 'next/dynamic';
import Header from '@/components/Header';
import { useMainStore } from '@/store/mainStore';

const CreateAdModal = dynamic(() => import('@/components/modals/CreateAdModal'), {
  ssr: false,
});

const CreateProjectModal = dynamic(() => import('@/components/modals/CreateProjectModal'), {
  ssr: false,
});

const CreateCommunityModal = dynamic(() => import('@/components/modals/CreateCommunityModal'), {
  ssr: false,
});

interface MainLayoutProps {
  children: React.ReactNode;
}

/**
 * Универсальный layout-контейнер для всех страниц
 * - Включает фиксированный Header
 * - Обеспечивает правильный отступ от хедера (pt-20 для лучшего визуального разделения)
 * - Центрирует контент с max-w-7xl
 * - Адаптивные отступы для mobile/desktop
 * - Включает модальные окна для создания объявлений, проектов и сообществ
 */
export default function MainLayout({ children }: MainLayoutProps) {
  const pathname = usePathname();
  const { openModal, closeModal } = useMainStore();
  
  // Не показывать модальные окна на страницах входа и регистрации
  const isAuthPage = pathname ? (pathname.startsWith('/auth/login') || pathname.startsWith('/auth/register')) : false;
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>
      
      {/* Creation Modals */}
      {!isAuthPage && (
        <>
          <CreateAdModal
            isOpen={openModal === 'ad'}
            onClose={closeModal}
            onSubmit={async (data) => {
              // TODO: Implement API call
              console.log('Creating ad:', data);
              await new Promise(resolve => setTimeout(resolve, 1000));
              closeModal();
            }}
          />
          <CreateProjectModal
            isOpen={openModal === 'project'}
            onClose={closeModal}
            onSubmit={async (data) => {
              // TODO: Implement API call
              console.log('Creating project:', data);
              await new Promise(resolve => setTimeout(resolve, 1000));
              closeModal();
            }}
          />
          <CreateCommunityModal
            isOpen={openModal === 'community'}
            onClose={closeModal}
            onSubmit={async (data) => {
              // TODO: Implement API call
              console.log('Creating community:', data);
              await new Promise(resolve => setTimeout(resolve, 1000));
              closeModal();
            }}
          />
        </>
      )}
    </div>
  );
}

