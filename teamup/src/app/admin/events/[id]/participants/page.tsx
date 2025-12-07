'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import MainLayout from '@/components/MainLayout';
import { eventService } from '@/services/eventService';
import { useAuthStore } from '@/store/authStore';
import { EmptyState } from '@/components/EmptyState';
import { User } from '@/types/user';
import { ArrowLeft, User as UserIcon } from 'lucide-react';

export default function EventParticipantsPage() {
  const params = useParams();
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const eventId = params.id as string;

  const [participants, setParticipants] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [eventTitle, setEventTitle] = useState('');

  useEffect(() => {
    if (user?.role !== 'admin') {
      router.push('/');
      return;
    }

    const loadParticipants = async () => {
      try {
        setLoading(true);
        const data = await eventService.getParticipants(eventId);
        setParticipants(data);
        
        // Загружаем информацию о мероприятии для заголовка
        const events = await eventService.getAll();
        const event = events.find((e) => e._id === eventId);
        if (event) {
          setEventTitle(event.title);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Ошибка загрузки участников');
      } finally {
        setLoading(false);
      }
    };

    if (eventId) {
      loadParticipants();
    }
  }, [eventId, user, router]);

  if (user?.role !== 'admin') {
    return null;
  }

  return (
    <MainLayout>
      <div className="mb-8">
        <button
          onClick={() => router.back()}
          className="mb-4 flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Назад
        </button>

        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Участники мероприятия
        </h1>
        {eventTitle && (
          <p className="text-gray-600 mb-6">{eventTitle}</p>
        )}

        {loading && (
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        )}

        {!loading && !error && (
          <>
            {participants.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {participants.map((participant) => (
                  <div
                    key={participant._id}
                    className="bg-white rounded-xl shadow-sm p-6 border border-gray-200"
                  >
                    <div className="flex items-center gap-4">
                      {participant.avatar ? (
                        <img
                          src={participant.avatar}
                          alt={participant.name}
                          className="w-16 h-16 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-16 h-16 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 text-xl font-semibold">
                          {participant.name?.charAt(0).toUpperCase() || <UserIcon className="w-8 h-8" />}
                        </div>
                      )}
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {participant.name || 'Без имени'}
                        </h3>
                        {participant.specialization && (
                          <p className="text-sm text-gray-600">{participant.specialization}</p>
                        )}
                      </div>
                    </div>
                    {participant.skills && participant.skills.length > 0 && (
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <p className="text-xs text-gray-500 mb-2">Навыки:</p>
                        <div className="flex flex-wrap gap-1">
                          {participant.skills.slice(0, 5).map((skill, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
                            >
                              {skill}
                            </span>
                          ))}
                          {participant.skills.length > 5 && (
                            <span className="px-2 py-1 text-gray-500 text-xs">
                              +{participant.skills.length - 5}
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState
                title="Нет участников"
                description="Пока никто не записался на это мероприятие"
              />
            )}
          </>
        )}
      </div>
    </MainLayout>
  );
}


