"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useRouter } from 'next/navigation';
import { getInterviewHistory } from '../services/apiService';
import InterviewSetupModal from '../components/InterviewSetupModal';
import InterviewCard from '../components/InterviewCard';
import Footer from '../components/Footer/Footer';
import { Plus, LogOut, Loader2, ClipboardList } from 'lucide-react';
import { Interview } from '../types';
import { useTheme } from '../contexts/ThemeContext';

export default function DashboardPage() {
  const { phoneNumber, logout, isLoading: isAuthLoading } = useAuth();
  const { isDarkMode } = useTheme();
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
        .then(response => setHistory(response.data))
        .catch(err => console.error("Failed to fetch interview history:", err))
        .finally(() => setIsHistoryLoading(false));
    }
  }, [phoneNumber, isAuthLoading, router]);

  const handleLogout = () => {
    logout();
    router.replace('/auth');
  };

  if (isAuthLoading || !phoneNumber) {
    return (
      <div className={`flex h-screen w-full items-center justify-center ${isDarkMode ? 'bg-black' : 'bg-white'}`}>
        <Loader2 className={`h-8 w-8 animate-spin ${isDarkMode ? 'text-white' : 'text-black'}`} />
      </div>
    );
  };

  return (
    <div className={`min-h-screen p-8 ${isDarkMode ? 'bg-black' : 'bg-white'}`}>
      <header className="flex justify-between items-center mb-10 max-w-7xl mx-auto">
        <div>
          <h1 className={`text-4xl font-bold mb-1 ${isDarkMode ? 'text-white' : 'text-black'}`}>Your Dashboard</h1>
          <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Track your progress and start new interviews.</p>
        </div>
        <button
          onClick={handleLogout}
          className={`flex items-center gap-2 px-4 py-2 border rounded-lg font-semibold text-sm transition-all ${
            isDarkMode
              ? 'bg-black border-gray-800 text-white hover:bg-gray-900'
              : 'bg-white border-gray-300 text-black hover:bg-gray-100'
          }`}
        >
          <LogOut className="h-4 w-4" />
          <span>Logout</span>
        </button>
      </header>

      <main className="max-w-7xl mx-auto">
        <div className="mb-12">
          <button
            onClick={() => setIsModalOpen(true)}
            className={`flex items-center gap-3 px-6 py-3 font-semibold rounded-lg shadow-sm transition-all duration-300 transform hover:scale-105 ${
              isDarkMode
                ? 'bg-white text-black hover:bg-gray-200'
                : 'bg-black text-white hover:bg-gray-800'
            }`}
          >
            <Plus className="h-5 w-5" />
            <span className="text-md">Start New Interview</span>
          </button>
        </div>

        <div>
          <div className="flex items-center gap-4 mb-6">
            <h2 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-black'}`}>Interview History</h2>
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
              isDarkMode
                ? 'bg-gray-800 text-gray-300'
                : 'bg-gray-200 text-gray-700'
            }`}>
              {history.length} Total
            </span>
          </div>

          {isHistoryLoading ? (
            <div className="text-center py-20 flex justify-center items-center gap-3">
              <Loader2 className={`h-6 w-6 animate-spin ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
              <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Loading your interviews...</p>
            </div>
          ) : history.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {history.map((interview, index) => (
                <InterviewCard key={interview.id} interview={interview} index={index} />
              ))}
            </div>
          ) : (
            <div className={`text-center py-16 border-2 border-dashed rounded-lg ${
              isDarkMode
                ? 'border-gray-800 bg-gray-900'
                : 'border-gray-300 bg-white'
            }`}>
              <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
                isDarkMode ? 'bg-gray-800' : 'bg-gray-100'
              }`}>
                <ClipboardList className={`w-8 h-8 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
              </div>
              <p className={`text-lg font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-black'}`}>No interviews yet</p>
              <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'} text-sm`}>Start your first interview to see your progress here!</p>
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

      <Footer />
    </div>
  );
}