'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { SocialButton } from '@/components/auth/SocialButton';
import { useVkAuth } from '@/hooks/useVkLogin';
import { openVkAuthPopup } from '@/utils/vkAuth';
import { getBaseUrl } from '@/utils/getBaseUrl';

export default function LoginPage() {
  const [mounted, setMounted] = useState(false);
  const [isLoading, setIsLoading] = useState<'vk' | 'max' | null>(null);

  const { mutate: vkAuth } = useVkAuth();

  const appId = '53108749';
  const redirectUri = `${getBaseUrl()}/auth/vk-callback`;

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleVkLogin = async () => {
    setIsLoading('vk');
    try {
      // Открываем popup для авторизации VK
      const result = await openVkAuthPopup({
        appId,
        redirectUri,
        scope: 'email,offline',
      });

      // Получаем vkId из результата (все еще в контексте основного окна!)
      // Теперь отправляем на сервер для получения токена
      vkAuth(result.vkId, {
        onSuccess: () => {
          setIsLoading(null);
        },
        onError: () => {
          setIsLoading(null);
        },
      });
    } catch (error: any) {
      console.error('Ошибка авторизации VK:', error);
      setIsLoading(null);
      
      // Можно показать уведомление пользователю
      if (error?.error) {
        alert(`Ошибка авторизации: ${error.errorDescription || error.error}`);
      }
    }
  };

  const handleMaxLogin = async () => {
    setIsLoading('max');
    try {
      // Implement Max messenger OAuth here
    } catch (error) {
      setIsLoading(null);
    }
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-cyan-100 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-[420px]">
        <div
          className={`bg-white rounded-2xl shadow-xl p-8 md:p-10 transition-all duration-[600ms] ease-out ${
            mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <div className="text-center mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
              Вход в 
                <span className='text-blue-500'> Team</span>
                <span className="text-indigo-600">Up</span>
            </h1>
            <p className="text-gray-600 text-base">
              Выберите удобный способ входа
            </p>
          </div>

          <div className="space-y-3 mb-6">
            <SocialButton
              provider="vk"
              label="Войти через VK"
              onClick={handleVkLogin}
              isLoading={isLoading === 'vk'}
              disabled={isLoading !== null}
            />

            <SocialButton
              provider="max"
              label="Войти через Max"
              onClick={handleMaxLogin}
              isLoading={isLoading === 'max'}
              disabled={isLoading !== null}
            />
          </div>

          <div className="text-center">
            <p className="text-gray-600 text-sm">
              Нет аккаунта?{' '}
              <Link
                href="/auth/register"
                className="text-indigo-600 hover:text-indigo-700 font-medium transition-colors duration-200 underline underline-offset-2"
              >
                Зарегистрироваться
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
