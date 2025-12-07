'use client';

import { useState } from 'react';
import MainLayout from '@/components/MainLayout';
import { useEvents } from '@/hooks/useEvents';
import { useDeleteEvent } from '@/hooks/useEvents';
import { EventCard } from '@/components/cards/EventCard';
import { EmptyState } from '@/components/EmptyState';
import CreateEventModal from '@/components/modals/CreateEventModal';
import { useAuthStore } from '@/store/authStore';
import { Event } from '@/types/events';
import { Pencil, Trash2, Plus, Users } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function AdminEventsPage() {
  const { data: events, isLoading, error } = useEvents();
  const deleteMutation = useDeleteEvent();
  const user = useAuthStore((state) => state.user);
  const router = useRouter();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);

  // Проверка прав администратора
  if (user?.role !== 'admin') {
    return (
      <MainLayout>
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <p className="text-red-800">Доступ запрещен. Требуется роль администратора.</p>
        </div>
      </MainLayout>
    );
  }

  const handleEdit = (event: Event) => {
    setEditingEvent(event);
    setIsCreateModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Вы уверены, что хотите удалить это мероприятие?')) {
      return;
    }

    try {
      await deleteMutation.mutateAsync(id);
    } catch (error) {
      console.error('Ошибка при удалении мероприятия:', error);
      alert('Ошибка при удалении мероприятия');
    }
  };

  const handleCloseModal = () => {
    setIsCreateModalOpen(false);
    setEditingEvent(null);
  };

  const handleViewParticipants = (eventId: string) => {
    router.push(`/admin/events/${eventId}/participants`);
  };

  return (
    <MainLayout>
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Управление мероприятиями</h1>
            <p className="text-gray-600">Создавайте и управляйте мероприятиями</p>
          </div>
          <button
            onClick={() => {
              setEditingEvent(null);
              setIsCreateModalOpen(true);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Создать мероприятие
          </button>
        </div>

        {isLoading && (
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-800 text-sm">Ошибка загрузки мероприятий</p>
          </div>
        )}

        {!isLoading && !error && (
          <>
            {events && events.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {events.map((event: Event) => (
                  <div key={event._id} className="relative">
                    <EventCard event={event} />
                    <div className="absolute top-4 right-4 flex gap-2">
                      <button
                        onClick={() => handleEdit(event)}
                        className="p-2 bg-white rounded-lg shadow-md hover:bg-gray-50 transition-colors"
                        title="Редактировать"
                      >
                        <Pencil className="w-4 h-4 text-blue-600" />
                      </button>
                      <button
                        onClick={() => handleDelete(event._id)}
                        className="p-2 bg-white rounded-lg shadow-md hover:bg-gray-50 transition-colors"
                        title="Удалить"
                        disabled={deleteMutation.isPending}
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </button>
                    </div>
                    <button
                      onClick={() => handleViewParticipants(event._id)}
                      className="mt-2 w-full flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                    >
                      <Users className="w-4 h-4" />
                      Участники ({event.participantsCount})
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState
                title="Мероприятий пока нет"
                description="Создайте первое мероприятие, чтобы начать"
                buttonText="Создать мероприятие"
                onClick={() => setIsCreateModalOpen(true)}
              />
            )}
          </>
        )}
      </div>

      <CreateEventModal
        isOpen={isCreateModalOpen}
        onClose={handleCloseModal}
        event={editingEvent}
      />
    </MainLayout>
  );
}


