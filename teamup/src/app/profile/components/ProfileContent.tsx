'use client';

import { CommunityCard } from '@/components/cards/CommunityCard';
import { PostCard } from '@/components/cards/PostCard';
import { ProjectCard } from '@/components/cards/ProjectCard';
import { useProfileStore } from '@/store/profileStore';
import { useMyAds } from '@/hooks/useMyAds';
import { useMyProjects } from '@/hooks/useMyProjects';
import { useMyCommunities } from '@/hooks/useMyCommunities';
import { MyResponses } from './MyResponses';
import {
  FileText,
  FolderKanban,
  Users,
  Plus,
  MessageSquare,
  Loader2,
} from 'lucide-react';
import Link from 'next/link';
import React from 'react';

export const ProfileContent = () => {
  const { activeTab } = useProfileStore();

  const { data: myAds, isLoading: isLoadingAds, error: adsError } = useMyAds();
  const { data: myProjects, isLoading: isLoadingProjects, error: projectsError } = useMyProjects();
  const { data: myCommunities, isLoading: isLoadingCommunities, error: communitiesError } = useMyCommunities();

  if (activeTab === 'my-responses') {
    return <MyResponses />;
  }

  const isLoading = 
    (activeTab === 'posts' && isLoadingAds) ||
    (activeTab === 'projects' && isLoadingProjects) ||
    (activeTab === 'communities' && isLoadingCommunities);

  const error = 
    (activeTab === 'posts' && adsError) ||
    (activeTab === 'projects' && projectsError) ||
    (activeTab === 'communities' && communitiesError);

  const getCurrentItems = () => {
    if (activeTab === 'posts') return myAds || [];
    if (activeTab === 'projects') return myProjects || [];
    return myCommunities || [];
  };

  const currentItems = getCurrentItems();
  const hasItems = currentItems.length > 0;

  const getEmptyStateConfig = () => {
    switch (activeTab) {
      case 'posts':
        return {
          icon: <FileText className="w-10 h-10 text-gray-400" />,
          title: 'Пока нет объявлений',
          description:
            'Создайте первое объявление, чтобы начать привлекать участников',
          buttonText: 'Создать объявление',
          buttonLink: '/create/post',
        };
      case 'projects':
        return {
          icon: <FolderKanban className="w-10 h-10 text-gray-400" />,
          title: 'Пока нет проектов',
          description:
            'Создайте первый проект, чтобы начать сотрудничество',
          buttonText: 'Создать проект',
          buttonLink: '/create/project',
        };
      case 'communities':
        return {
          icon: <Users className="w-10 h-10 text-gray-400" />,
          title: 'Пока нет сообществ',
          description:
            'Присоединитесь к сообществам или создайте свое',
          buttonText: 'Создать сообщество',
          buttonLink: '/create/community',
        };
      default:
        return {
          icon: <MessageSquare className="w-10 h-10 text-gray-400" />,
          title: 'Нет данных',
          description: 'Здесь пока ничего нет',
          buttonText: '',
          buttonLink: '',
        };
    }
  };

  const emptyState = getEmptyStateConfig();

  if (isLoading) {
    return (
      <div className="mt-4 flex items-center justify-center min-h-[200px]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
          <p className="text-sm text-gray-500">Загрузка...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="text-center">
          <p className="text-sm text-red-700">
            Ошибка при загрузке данных. Попробуйте обновить страницу.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-4 animate-in fade-in duration-200">
      {hasItems ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeTab === 'posts' &&
            myAds?.map((item) => (
              <div
                key={item._id}
                className="transition-all duration-200 hover:scale-105"
              >
                <PostCard post={item} />
              </div>
            ))}
          {activeTab === 'projects' &&
            myProjects?.map((item) => (
              <div
                key={item._id}
                className="transition-all duration-200 hover:scale-105"
              >
                <ProjectCard project={item} />
              </div>
            ))}
          {activeTab === 'communities' &&
            myCommunities?.map((item) => (
              <div
                key={item._id}
                className="transition-all duration-200 hover:scale-105"
              >
                <CommunityCard community={item} />
              </div>
            ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-8 transition-all duration-200 hover:shadow-md">
          <div className="flex flex-col items-center justify-center text-center max-w-md mx-auto">
            <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center mb-4 transition-all duration-200 hover:scale-110">
              {emptyState.icon}
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {emptyState.title}
            </h3>
            <p className="text-sm text-gray-500 mb-5 leading-relaxed">
              {emptyState.description}
            </p>
            {emptyState.buttonLink && (
              <Link
                href={emptyState.buttonLink}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-medium shadow-sm hover:shadow-md hover:scale-105 active:scale-95 text-sm"
              >
                <Plus className="w-4 h-4" />
                {emptyState.buttonText}
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
