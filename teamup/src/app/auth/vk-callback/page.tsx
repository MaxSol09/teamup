'use client';

import { useEffect } from 'react';

/**
 * Callback страница для обработки результата VK OAuth
 * Эта страница открывается в popup окне после авторизации в VK
 * После получения данных отправляет их в основное окно через postMessage
 */
export default function VkCallbackPage() {
  useEffect(() => {
    // Проверяем, что мы находимся в popup окне
    if (window.opener) {
      const hash = window.location.hash.substring(1);
      const params = new URLSearchParams(hash);

      const vkId = params.get('user_id');
      const accessToken = params.get('access_token');
      const error = params.get('error');
      const errorDescription = params.get('error_description');

      if (error) {
        // Ошибка авторизации
        window.opener.postMessage(
          {
            type: 'VK_AUTH_ERROR',
            error: error,
            errorDescription: errorDescription,
          },
          window.location.origin
        );
        window.close();
        return;
      }

      if (vkId) {
        // Успешная авторизация - отправляем vkId в основное окно
        window.opener.postMessage(
          {
            type: 'VK_AUTH_SUCCESS',
            vkId: vkId,
            accessToken: accessToken, // На случай, если понадобится
          },
          window.location.origin
        );
        // Закрываем popup через небольшую задержку, чтобы сообщение успело отправиться
        setTimeout(() => {
          window.close();
        }, 100);
      } else {
        // Нет vkId - что-то пошло не так
        window.opener.postMessage(
          {
            type: 'VK_AUTH_ERROR',
            error: 'NO_USER_ID',
            errorDescription: 'Не удалось получить ID пользователя VK',
          },
          window.location.origin
        );
        window.close();
      }
    } else {
      // Если мы не в popup, просто редиректим (на случай прямого перехода)
      console.error('Эта страница должна открываться только в popup окне');
    }
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-white to-cyan-100">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-gray-600">Завершение авторизации...</p>
      </div>
    </div>
  );
}
