import { Response } from '@/types/responses';
import { useResponsesStore } from '@/store/responsesStore';

interface ResponseCardProps {
  response: Response;
  itemTheme: string; // Тематика объявления/проекта/сообщества
}

export const ResponseCard = ({ response, itemTheme }: ResponseCardProps) => {
  const { acceptResponse, rejectResponse } = useResponsesStore();
  
  const isThemeMatch = response.user.specialization && itemTheme;
  const isPending = response.status === 'pending';
  
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
  
  const getStatusText = () => {
    switch (response.status) {
      case 'pending':
        return 'В ожидании';
      case 'accepted':
        return 'Принят';
      case 'rejected':
        return 'Отклонён';
      default:
        return '';
    }
  };
  
  const getStatusColor = () => {
    switch (response.status) {
      case 'pending':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'accepted':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'rejected':
        return 'bg-red-50 text-red-700 border-red-200';
      default:
        return '';
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
              <div className="flex items-center gap-2 mb-1">
                <h4 className="font-semibold text-gray-900">{response.user.name}</h4>
                {isThemeMatch && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-yellow-100 text-yellow-700 text-xs font-medium rounded-full border border-yellow-200 hover:bg-yellow-200 transition-colors">
                    <span>⭐</span>
                    <span>Подходит по тематике</span>
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <span>{formatDate(response.createdAt)}</span>
                <span>•</span>
                <span className={`px-2 py-0.5 rounded border ${getStatusColor()}`}>
                  {getStatusText()}
                </span>
              </div>
            </div>
          </div>
          
          {/* Комментарий */}
          {response.message && (
            <p className="text-sm text-gray-700 mb-3 whitespace-pre-wrap">
              {response.message}
            </p>
          )}
          
          {/* Кнопки управления */}
          {isPending && (
            <div className="flex gap-2 mt-3">
              <button
                onClick={handleAccept}
                className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
              >
                Принять
              </button>
              <button
                onClick={handleReject}
                className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              >
                Отклонить
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
