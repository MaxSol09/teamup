/**
 * Утилита для работы с VK OAuth через popup
 */

export interface VkAuthConfig {
  appId: string;
  redirectUri: string;
  scope?: string;
}

export interface VkAuthResult {
  vkId: string;
  accessToken?: string;
}

export interface VkAuthError {
  error: string;
  errorDescription?: string;
}

/**
 * Открывает popup окно для авторизации через VK
 * Возвращает Promise с результатом авторизации
 */
export function openVkAuthPopup(config: VkAuthConfig): Promise<VkAuthResult> {
  const { appId, redirectUri, scope = 'email,offline' } = config;

  return new Promise((resolve, reject) => {
    // Формируем URL для авторизации VK
    const authUrl = new URL('https://oauth.vk.com/authorize');
    authUrl.searchParams.set('client_id', appId);
    authUrl.searchParams.set('display', 'popup');
    authUrl.searchParams.set('redirect_uri', redirectUri);
    authUrl.searchParams.set('scope', scope);
    authUrl.searchParams.set('response_type', 'token');
    authUrl.searchParams.set('v', '5.199');

    // Размеры popup окна
    const width = 650;
    const height = 550;
    const left = window.screen.width / 2 - width / 2;
    const top = window.screen.height / 2 - height / 2;

    // Открываем popup
    const popup = window.open(
      authUrl.toString(),
      'VK Auth',
      `width=${width},height=${height},left=${left},top=${top},toolbar=no,menubar=no,scrollbars=yes,resizable=yes`
    );

    if (!popup) {
      reject(new Error('Не удалось открыть popup окно. Проверьте настройки блокировщика всплывающих окон.'));
      return;
    }

    // Слушаем сообщения от popup
    const messageHandler = (event: MessageEvent) => {
      // Проверяем origin для безопасности
      if (event.origin !== window.location.origin) {
        return;
      }

      if (event.data.type === 'VK_AUTH_SUCCESS') {
        window.removeEventListener('message', messageHandler);
        popup.close();
        resolve({
          vkId: event.data.vkId,
          accessToken: event.data.accessToken,
        });
      } else if (event.data.type === 'VK_AUTH_ERROR') {
        window.removeEventListener('message', messageHandler);
        popup.close();
        reject({
          error: event.data.error,
          errorDescription: event.data.errorDescription,
        });
      }
    };

    window.addEventListener('message', messageHandler);

    // Проверяем, не закрыл ли пользователь popup вручную
    const checkClosed = setInterval(() => {
      if (popup.closed) {
        clearInterval(checkClosed);
        window.removeEventListener('message', messageHandler);
        reject(new Error('Авторизация была отменена'));
      }
    }, 500);
  });
}
