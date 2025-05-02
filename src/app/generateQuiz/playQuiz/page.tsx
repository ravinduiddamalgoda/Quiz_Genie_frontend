'use client';

import React from 'react';
import QuizPlayAction from '@/component/QuizPlayAction';
import { useAuthStore } from '@/store/useStore';
import { useRouter } from 'next/navigation';

const PlayQuizPage: React.FC = () => {
  const token = useAuthStore((state) => state.token);
  const router = useRouter();

  // Check authentication
  React.useEffect(() => {
    if (!token) {
      router.push('/login');
    }
  }, [token, router]);

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  return <QuizPlayAction />;
};

export default PlayQuizPage;