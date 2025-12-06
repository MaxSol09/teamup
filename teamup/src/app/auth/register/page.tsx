'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { SocialButton } from '@/components/auth/SocialButton';
import axios from 'axios';

export default function RegisterPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);
  const [isLoading, setIsLoading] = useState<'vk' | 'max' | null>(null);

  const handleVKRegister = async () => {
      const { data } = await axios.post(`http://localhost:4529/vk`, {
        vkId: 4782774
    });

    console.log('запрос выполнен', data)

    

    return data
  };

  const handleMaxRegister = async () => {
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
              Регистрация в <span className='text-blue-500'> Team</span>
                <span className="text-indigo-600">Up</span>
            </h1>
            <p className="text-gray-600 text-base">
              Создайте аккаунт за пару секунд
            </p>
          </div>

          <div className="space-y-3 mb-6">
            <SocialButton
              provider="vk"
              label="Зарегистрироваться через VK"
              onClick={handleVKRegister}
              isLoading={isLoading === 'vk'}
              disabled={isLoading !== null}
            />

            <SocialButton
              provider="max"
              label="Зарегистрироваться через Max"
              onClick={handleMaxRegister}
              isLoading={isLoading === 'max'}
              disabled={isLoading !== null}
            />
          </div>

          <div className="text-center">
            <p className="text-gray-600 text-sm">
              Уже есть аккаунт?{' '}
              <Link
                href="/auth/login"
                className="text-indigo-600 hover:text-indigo-700 font-medium transition-colors duration-200 underline underline-offset-2"
              >
                Войти
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
