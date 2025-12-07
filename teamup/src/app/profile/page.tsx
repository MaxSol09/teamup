'use client';

import MainLayout from '@/components/MainLayout';
import { ProfileTabs } from './components/ProfileTabs';
import { ProfileHeader } from './components/ProfileHeader';
import { ProfileContent } from './components/ProfileContent';
import { useMe } from '@/hooks/useMe';
import { useAuthStore } from '@/store/authStore';
import { AlertCircle, Eye, User as UserIcon } from 'lucide-react';

export default function ProfilePage() {
  const { data: user, isLoading } = useMe();
  const { isObserver } = useAuthStore();

  if (isLoading) {
    return (
      <MainLayout>
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
            <div className="animate-pulse space-y-4">
              <div className="h-24 w-24 rounded-full bg-gray-200"></div>
              <div className="h-8 w-48 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (!user) {
    return (
      <MainLayout>
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
            <div className="text-center text-gray-500">
              Пользователь не найден
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  const isObserverMode = isObserver() || user.role === 'observer';
  const isProfileIncomplete = !user.isProfileCompleted;

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto space-y-4">
        {isObserverMode && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start gap-3 transition-all duration-200 hover:shadow-sm">
            <Eye className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-yellow-900 mb-1">
                Режим наблюдателя
              </h3>
              <p className="text-sm text-yellow-700">
                Зарегистрируйтесь, чтобы пользоваться возможностями TeamUp
              </p>
            </div>
          </div>
        )}

        {isProfileIncomplete && (
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 transition-all duration-200 hover:shadow-sm">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h3 className="text-base font-semibold text-orange-900 mb-1">
                  Профиль не заполнен
                </h3>
                <p className="text-sm text-orange-700">
                  Завершите заполнение профиля, чтобы получить доступ ко всем
                  возможностям платформы
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden transition-all duration-200 hover:shadow-md">
          <div className="px-6 py-3 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
            <div className="flex items-center gap-2">
              {user.role === 'observer' ? (
                <>
                  <Eye className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600 font-medium">Наблюдатель</span>
                </>
              ) : (
                <>
                  <UserIcon className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600 font-medium">Пользователь</span>
                </>
              )}
            </div>
            {isProfileIncomplete && (
              <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-medium">
                Профиль не заполнен
              </span>
            )}
          </div>
          <ProfileHeader />
          {!isObserverMode && <ProfileTabs />}
        </div>
        {!isObserverMode && <ProfileContent />}
      </div>
    </MainLayout>
  );
}
