'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import CreateProjectModal from '@/components/modals/CreateProjectModal';

interface ProjectFormData {
  title: string;
  description: string;
  tags: string[];
  theme: string;
}

export default function CreateProjectPage() {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(true);

  const handleClose = () => {
    setIsModalOpen(false);
    router.back();
  };

  const handleSubmit = async (data: ProjectFormData) => {
    // TODO: Implement API call
    console.log('Creating project:', data);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Navigate to home or project page
    router.push('/');
  };

  return (
    <CreateProjectModal
      isOpen={isModalOpen}
      onClose={handleClose}
      onSubmit={handleSubmit}
    />
  );
}

