/**
 * Получает базовый URL приложения
 * Работает как на клиенте, так и на сервере
 * 
 * ВАЖНО: На клиенте всегда использует window.location.origin,
 * что гарантирует правильный origin для localStorage
 */
export function getBaseUrl(): string {
  // На клиенте используем window.location.origin
  // Это гарантирует, что мы получим правильный origin текущего домена
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }

  // На сервере (SSR) проверяем переменные окружения
  // Эти значения используются только для SSR, на клиенте всё равно используется window.location
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL;
  }

  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  // Fallback для локальной разработки (только для SSR)
  return 'http://localhost:3000';
}
