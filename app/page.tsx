"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from './hooks/useAuth';

export default function HomePage() {
  const { phoneNumber, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (phoneNumber) {
        router.replace('/dashboard');
      } else {
        router.replace('/auth');
      }
    }
  }, [phoneNumber, isLoading, router]);

  return (
    <div className="flex h-screen w-full items-center justify-center bg-dark-bg">
      <div className="text-2xl font-semibold text-gray-400">Loading...</div>
    </div>
  );
}