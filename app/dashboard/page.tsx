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
  endedAt?: string;
  feedback?: string;
  interviewDurationMinutes: number;
  skills: string;
  user?: {
    id: number;
    fullName: string;
    phoneNumber: string;
  };
}

export default function DashboardPage() {
  const { phoneNumber, logout, isLoading: isAuthLoading } = useAuth();
  const router = useRouter();
  const [history, setHistory] = useState<Interview[]>([]);
  const [isHistoryLoading, setIsHistoryLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (!isAuthLoading && !phoneNumber) {
      router.replace('/auth');
    }
    if (phoneNumber) {
      setIsHistoryLoading(true);
      getInterviewHistory()
        .then(response => {
          setHistory(response.data);
        })
        .catch(err => {
          console.error("Failed to fetch interview history:", err);
          // Optionally, show an error message to the user
        })
        .finally(() => {
          setIsHistoryLoading(false);
        });
    }
  }, [phoneNumber, isAuthLoading, router]);
  
  const handleLogout = () => {
    logout();
    router.replace('/auth');
  };

  if (isAuthLoading || !phoneNumber) {
      return <div className="flex h-screen w-full items-center justify-center text-gray-400">Loading Dashboard...</div>
  };

  return (
    <div className="min-h-screen p-8 animate-fade-in relative">
      {/* Background gradient orbs */}
      <div className="fixed top-0 right-0 w-96 h-96 bg-purple-500/20 rounded-full filter blur-3xl -z-10"></div>
      <div className="fixed bottom-0 left-0 w-96 h-96 bg-pink-500/20 rounded-full filter blur-3xl -z-10"></div>
      
      <header className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-5xl font-black gradient-text mb-2">Your Dashboard</h1>
          <p className="text-gray-400">Track your progress and start new interviews</p>
        </div>
        <button 
          onClick={handleLogout} 
          className="flex items-center gap-2 px-5 py-2.5 bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 hover:text-red-300 transition-all rounded-lg font-medium"
        >
          <ArrowRightOnRectangleIcon className="h-5 w-5" />
          <span>Logout</span>
        </button>
      </header>

      {/* Start Interview Button */}
      <div className="mb-12">
        <button 
          onClick={() => setIsModalOpen(true)} 
          className="group relative flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white font-bold rounded-xl shadow-lg hover:shadow-purple-500/50 transition-all duration-300 transform hover:scale-105 overflow-hidden"
        >
          <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
          <PlusIcon className="h-6 w-6 relative z-10" />
          <span className="relative z-10 text-lg">Start New Interview</span>
        </button>
      </div>

      {/* Interview History Section */}
      <div>
        <div className="flex items-center gap-3 mb-6">
          <h2 className="text-3xl font-bold text-white">Interview History</h2>
          <span className="px-3 py-1 bg-purple-500/20 border border-purple-500/30 rounded-full text-purple-300 text-sm font-semibold">
            {history.length} Total
          </span>
        </div>
        
        {isHistoryLoading ? (
          <div className="text-center py-20">
            <div className="inline-block w-16 h-16 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin"></div>
            <p className="text-gray-400 mt-4">Loading your interviews...</p>
          </div>
        ) : history.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {history.map((interview, index) => (
              <InterviewCard key={interview.id} interview={interview} index={index} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 glass-pane card-glow rounded-2xl border-2 border-purple-500/20">
            <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
              <PlusIcon className="w-10 h-10 text-white" />
            </div>
            <p className="text-gray-300 text-lg font-semibold mb-2">No interviews yet</p>
            <p className="text-gray-500 text-sm">Start your first interview to see your progress here!</p>
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