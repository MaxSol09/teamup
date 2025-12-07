'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import CreateCommunityModal from '@/components/modals/CreateCommunityModal';

interface CommunityFormData {
  name: string;
  description: string;
  theme: string;
  isPublic: boolean;
}

export default function CreateCommunityPage() {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(true);

  const handleClose = () => {
    setIsModalOpen(false);
    router.back();
  };

  const handleSubmit = async (data: CommunityFormData) => {
    // TODO: Implement API call
    console.log('Creating community:', data);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Navigate to home or community page
    router.push('/');
  };

  return (
    <CreateCommunityModal
      isOpen={isModalOpen}
      onClose={handleClose}
      onSubmit={handleSubmit}
    />
  );
}
