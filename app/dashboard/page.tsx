"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useRouter } from 'next/navigation';
import { getInterviewHistory } from '../services/apiService';
import InterviewSetupModal from '../components/InterviewSetupModal';
import InterviewCard from '../components/InterviewCard';
import { PlusIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/solid';

export interface Interview {
  id: number;
  role: string;
  interviewType: string;
  status: string;
  createdAt: string;
  feedback?: string;
}

export default function DashboardPage() {
  const { phoneNumber, logout, isLoading } = useAuth();
  const router = useRouter();
  const [history, setHistory] = useState<Interview[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (!isLoading && !phoneNumber) {
      router.replace('/auth');
    }
    if (phoneNumber) {
      getInterviewHistory(phoneNumber).then(response => {
        setHistory(response.data);
      }).catch(err => console.error("Failed to fetch history", err));
    }
  }, [phoneNumber, isLoading, router]);
  
  const handleLogout = () => {
    logout();
    router.replace('/auth');
  };

  if (isLoading || !phoneNumber) {
      return <div className="flex h-screen w-full items-center justify-center text-gray-400">Loading Dashboard...</div>
  };

  return (
    <div className="min-h-screen bg-dark-bg p-8 animate-fade-in">
      <header className="flex justify-between items-center mb-10">
        <h1 className="text-4xl font-bold text-white">Your Dashboard</h1>
        <button onClick={handleLogout} className="flex items-center gap-2 text-gray-400 hover:text-white transition">
          <ArrowRightOnRectangleIcon className="h-6 w-6" />
          <span>Logout</span>
        </button>
      </header>

      <div className="mb-10">
        <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 px-6 py-3 bg-primary text-white font-semibold rounded-lg shadow-lg hover:bg-indigo-700 transition transform hover:scale-105">
          <PlusIcon className="h-6 w-6" />
          Start New Interview
        </button>
      </div>

      <div>
        <h2 className="text-2xl font-semibold text-white mb-4">Interview History</h2>
        {history.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {history.map((interview, index) => (
              <InterviewCard key={interview.id} interview={interview} index={index} />
            ))}
          </div>
        ) : (
          <div className="text-center py-10 glass-pane rounded-lg">
            <p className="text-gray-400">You haven't completed any interviews yet.</p>
            <p className="text-gray-500 text-sm mt-1">Click 'Start New Interview' to begin!</p>
          </div>
        )}
      </div>

      {isModalOpen && (
        <InterviewSetupModal
          onClose={() => setIsModalOpen(false)}
          phoneNumber={phoneNumber}
        />
      )}
    </div>
  );
}