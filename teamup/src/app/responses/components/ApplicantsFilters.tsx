/**
 * Фильтры для откликов
 */

import { useResponsesStore } from '@/store/responsesStore';
import { ResponseStatus } from '@/types/responses';

export const ApplicantsFilters = () => {
  const { statusFilter, setStatusFilter } = useResponsesStore();

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
      <div className="flex flex-wrap items-center gap-4">
        {/* Фильтр по статусу */}
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-700">Статус:</label>
          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value as ResponseStatus | 'all')
            }
            className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">Все</option>
            <option value="pending">В ожидании</option>
            <option value="accepted">Принятые</option>
            <option value="rejected">Отклонённые</option>
          </select>
        </div>
      </div>
    </div>
  );
};
