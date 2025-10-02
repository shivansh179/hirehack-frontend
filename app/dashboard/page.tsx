"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useRouter } from 'next/navigation';
import { getInterviewHistory } from '../services/apiService';
import InterviewSetupModal from '../components/InterviewSetupModal';
import InterviewCard from '../components/InterviewCard';
import { Plus, LogOut, Loader2, ClipboardList } from 'lucide-react';
import { Interview } from '../types';

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
      return (
        <div className="flex h-screen w-full items-center justify-center bg-white">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        </div>
      );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <header className="flex justify-between items-center mb-10 max-w-7xl mx-auto">
        <div>
          <h1 className="text-4xl font-bold text-black mb-1">Your Dashboard</h1>
          <p className="text-gray-600">Track your progress and start new interviews.</p>
        </div>
        <button 
          onClick={handleLogout} 
          className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 hover:bg-gray-100 transition-all rounded-lg font-semibold text-sm"
        >
          <LogOut className="h-4 w-4" />
          <span>Logout</span>
        </button>
      </header>

      <main className="max-w-7xl mx-auto">
        {/* Start Interview Button */}
        <div className="mb-12">
          <button 
            onClick={() => setIsModalOpen(true)} 
            className="flex items-center gap-3 px-6 py-3 bg-black text-white font-semibold rounded-lg shadow-sm hover:bg-gray-800 transition-all duration-300 transform hover:scale-105"
          >
            <Plus className="h-5 w-5" />
            <span className="text-md">Start New Interview</span>
          </button>
        </div>

        {/* Interview History Section */}
        <div>
          <div className="flex items-center gap-4 mb-6">
            <h2 className="text-3xl font-bold text-black">Interview History</h2>
            <span className="px-3 py-1 bg-gray-200 text-gray-700 rounded-full text-xs font-semibold">
              {history.length} Total
            </span>
          </div>
          
          {isHistoryLoading ? (
            <div className="text-center py-20 flex justify-center items-center gap-3">
              <Loader2 className="h-6 w-6 animate-spin text-gray-500" />
              <p className="text-gray-500">Loading your interviews...</p>
            </div>
          ) : history.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {history.map((interview) => (
                <InterviewCard key={interview.id} interview={interview} index={0} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 border-2 border-dashed border-gray-300 rounded-lg bg-white">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <ClipboardList className="w-8 h-8 text-gray-500" />
              </div>
              <p className="text-gray-800 text-lg font-semibold mb-2">No interviews yet</p>
              <p className="text-gray-500 text-sm">Start your first interview to see your progress here!</p>
            </div>
          )}
        </div>
      </main>

      {isModalOpen && (
        <InterviewSetupModal
          onClose={() => setIsModalOpen(false)}
          phoneNumber={phoneNumber}
        />
      )}
    </div>
  );
}