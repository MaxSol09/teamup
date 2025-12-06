import { CommunityCard } from '@/components/cards/CommunityCard';
import {PostCard} from '@/components/cards/PostCard';
import { ProjectCard } from '@/components/cards/ProjectCard';
import { useCommunitiesStore } from '@/store/content/communities';
import { usePostsStore } from '@/store/content/posts';
import { useProjectStore } from '@/store/content/projects';
import { useProfileStore } from '@/store/profileStore';
import { MyResponses } from './MyResponses';
import React from 'react'

export const ProfileContent = () => {

  const { activeTab } = useProfileStore();
  
  // Все хуки должны вызываться до условного return
  const userCommunities = useCommunitiesStore(el => el.communities);
  const userPosts = usePostsStore(el => el.posts)
  const userProjects = useProjectStore(el => el.projects)

  // Если выбрана вкладка "Мои отклики", показываем специальный компонент
  if (activeTab === 'my-responses') {
    return <MyResponses />;
  }

  const getCurrentItems = () => {
    if (activeTab === 'posts') return userPosts;
    if (activeTab === 'projects') return userProjects;
    return userCommunities;
  };

  const currentItems = getCurrentItems();
  const hasItems = currentItems.length > 0;

  console.log(hasItems)

  return (
    <div className="mt-6">
      {hasItems ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeTab === 'posts' &&
            userPosts.map((item) => (
              <PostCard key={item._id} post={item}/>
          ))}
          {activeTab === 'projects' &&
            userProjects.map((item) => (
              <ProjectCard key={item._id} project={item}/>
          ))}
          {activeTab === 'communities' &&
            userCommunities.map((item) => (
              <CommunityCard key={item._id} community={item} />
            ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm p-12 border border-gray-100">
          <div className="flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
              <svg
                className="w-8 h-8 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {activeTab === 'posts' && 'Пока нет объявлений'}
              {activeTab === 'projects' && 'Пока нет проектов'}
              {activeTab === 'communities' && 'Пока нет сообществ'}
            </h3>
            <p className="text-sm text-gray-500 max-w-sm">
              {activeTab === 'posts' && 'Создайте первое объявление, чтобы начать привлекать участников'}
              {activeTab === 'projects' && 'Создайте первый проект, чтобы начать сотрудничество'}
              {activeTab === 'communities' && 'Присоединитесь к сообществам или создайте свое'}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
