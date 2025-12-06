'use client';

import MainLayout from '@/components/MainLayout';
import { ProfileTabs } from './components/ProfileTabs';
import { ProfileHeader } from './components/ProfileHeader'

import { ProfileContent } from './components/ProfileContent';

export default function ProfilePage() {

  return (
    <MainLayout>
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <ProfileHeader />
        <ProfileTabs />
      </div>
      <ProfileContent />
    </MainLayout>
  );
}
