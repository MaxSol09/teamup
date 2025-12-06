/**
 * Карточка отклика пользователя
 * Отображается во вкладке "Отклики" на странице деталей
 */

import { Response } from '@/types/responses';
import { useResponsesStore } from '@/store/responsesStore';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface ApplicantCardProps {
  applicant: Response;
  itemTheme: string;
}

export const ApplicantCard = ({ applicant, itemTheme }: ApplicantCardProps) => {
  const { acceptResponse, rejectResponse } = useResponsesStore();
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);

  const isThemeMatch = applicant.user.specialization && itemTheme;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 1) return 'только что';
    if (diffInHours < 24) return `${diffInHours} ч. назад`;
    if (diffInHours < 48) return 'вчера';

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays} дн. назад`;

    return date.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'short',
    });
  };

  const getStatusBadge = () => {
    switch (applicant.status) {
      case 'pending':
        return (
          <span className="px-2 py-0.5 bg-yellow-50 text-yellow-700 border border-yellow-200 rounded text-xs font-medium">
            В ожидании
          </span>
        );
      case 'accepted':
        return (
          <span className="px-2 py-0.5 bg-green-50 text-green-700 border border-green-200 rounded text-xs font-medium">
            Принят
          </span>
        );
      case 'rejected':
        return (
          <span className="px-2 py-0.5 bg-red-50 text-red-700 border border-red-200 rounded text-xs font-medium">
            Отклонён
          </span>
        );
      default:
        return null;
    }
  };

  const handleAccept = async () => {
    if (isProcessing) return;
    setIsProcessing(true);
    try {
      await acceptResponse(applicant._id);
    } catch (error) {
      console.error('Ошибка при принятии отклика:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = async () => {
    if (isProcessing) return;
    setIsProcessing(true);
    try {
      await rejectResponse(applicant._id);
    } catch (error) {
      console.error('Ошибка при отклонении отклика:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleMessage = () => {
    if (applicant.chatId) {
      router.push(`/chats/${applicant.chatId}`);
    }
  };

  const isPending = applicant.status === 'pending';
  const isAccepted = applicant.status === 'accepted';

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-5 hover:border-gray-300 transition-colors">
      <div className="flex items-start gap-4">
        {/* Аватар */}
        <div className="flex-shrink-0">
          <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold text-lg">
            {applicant.user.name.charAt(0).toUpperCase()}
          </div>
        </div>

        {/* Контент */}
        <div className="flex-1 min-w-0">
          {/* Имя и статус */}
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className="flex-1">
              <h4 className="font-semibold text-gray-900 mb-1">{applicant.user.name}</h4>
              {applicant.user.specialization && (
                <p className="text-sm text-gray-600 mb-2">{applicant.user.specialization}</p>
              )}
            </div>
            <div className="flex items-center gap-2">
              {/* Рекомендация бейдж */}
              {isThemeMatch && (
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">
                  <span>⭐</span>
                  <span>Подходит</span>
                </span>
              )}
              {getStatusBadge()}
            </div>
          </div>

          {/* Дата */}
          <div className="text-xs text-gray-500 mb-3">
            {formatDate(applicant.createdAt)}
          </div>

          {/* Комментарий */}
          {applicant.message && (
            <p className="text-sm text-gray-700 mb-4 whitespace-pre-wrap bg-gray-50 rounded p-3">
              {applicant.message}
            </p>
          )}

          {/* Кнопки управления */}
          <div className="flex items-center gap-2">
            {isPending && (
              <>
                <button
                  onClick={handleAccept}
                  disabled={isProcessing}
                  className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5"
                >
                  <span>✅</span>
                  <span>Принять</span>
                </button>
                <button
                  onClick={handleReject}
                  disabled={isProcessing}
                  className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5"
                >
                  <span>❌</span>
                  <span>Отклонить</span>
                </button>
              </>
            )}

            {isAccepted && applicant.chatId && (
              <button
                onClick={handleMessage}
                className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-1.5"
              >
                <span>💬</span>
                <span>Написать</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
