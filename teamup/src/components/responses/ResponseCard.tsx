import React from 'react';
import { Response } from '@/types/responses';
import { useResponsesStore } from '@/store/responsesStore';

interface ResponseCardProps {
  response: Response;
  itemTheme: string;
}

export const ResponseCard = ({ response, itemTheme }: ResponseCardProps) => {
  const { acceptResponse, rejectResponse } = useResponsesStore();
  
  const isThemeMatch = response.user.specialization && itemTheme;
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };
  
  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'В ожидании';
      case 'accepted':
        return 'Принят';
      case 'rejected':
        return 'Отклонён';
      default:
        return status;
    }
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'accepted':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  const handleAccept = async () => {
    await acceptResponse(response._id);
  };
  
  const handleReject = async () => {
    await rejectResponse(response._id);
  };
  
  return (
    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:border-gray-300 transition-colors">
      <div className="flex items-start gap-3">
        {/* Аватар */}
        <div className="flex-shrink-0">
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold">
            {response.user.name.charAt(0).toUpperCase()}
          </div>
        </div>
        
        {/* Контент */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className="flex-1">
              <h4 className="font-semibold text-gray-900 text-sm">
                {response.user.name}
              </h4>
              <p className="text-xs text-gray-500 mt-0.5">
                {formatDate(response.createdAt)}
              </p>
            </div>
            
            {/* Рекомендация бейдж */}
            {isThemeMatch && (
              <div className="flex-shrink-0">
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full hover:bg-yellow-200 transition-colors">
                  <span>⭐</span>
                  <span>Подходит</span>
                </span>
              </div>
            )}
          </div>
          
          {/* Комментарий */}
          {response.message && (
            <p className="text-sm text-gray-700 mb-3 leading-relaxed">
              {response.message}
            </p>
          )}
          
          {/* Статус и кнопки */}
          <div className="flex items-center justify-between gap-2">
            <span className={`text-xs font-medium px-2 py-1 rounded ${getStatusColor(response.status)}`}>
              {getStatusText(response.status)}
            </span>
            
            {response.status === 'pending' && (
              <div className="flex gap-2">
                <button
                  onClick={handleAccept}
                  className="px-3 py-1.5 bg-green-600 text-white text-xs font-medium rounded-lg hover:bg-green-700 transition-colors"
                >
                  Принять
                </button>
                <button
                  onClick={handleReject}
                  className="px-3 py-1.5 bg-red-600 text-white text-xs font-medium rounded-lg hover:bg-red-700 transition-colors"
                >
                  Отклонить
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
