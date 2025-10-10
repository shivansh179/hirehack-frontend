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
import AnimatedBackground from '../components/AnimatedBackground/AnimatedBackground';
import Navbar from '../components/Navbar/Navbar';

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
    <>
  
    <AnimatedBackground />
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
    </>
  );
}


// "use client";

// import { useState, useEffect } from 'react';
// import { useAuth } from '../hooks/useAuth';
// import { useRouter } from 'next/navigation';
// import { getInterviewHistory } from '../services/apiService';
// import Footer from '../components/Footer/Footer';
// import InterviewCard from '../components/InterviewCard';
// import AnimatedBackground from '../components/AnimatedBackground/AnimatedBackground';
// import { Interview } from '../types';
// import { useTheme } from '../contexts/ThemeContext';
// import { motion, AnimatePresence } from 'framer-motion';
// import { LogOut, Loader2, ClipboardList, ArrowRight, User as UserIcon, Settings, PlusCircle, Briefcase, ArrowLeft } from 'lucide-react';

// // --- Professional Header Component ---
// const DashboardHeader = ({ onLogout }:{onLogout:()=>void}) => {
//   const [menuOpen, setMenuOpen] = useState(false);
//   const { isDarkMode } = useTheme();

//   return (
//     <header className="flex justify-between items-center mb-10 max-w-7xl mx-auto w-full">
//       <div>
//         <h1 className={`text-4xl font-bold mb-1 ${isDarkMode ? 'text-white' : 'text-black'}`}>Dashboard</h1>
//         <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Welcome to your command center.</p>
//       </div>
//       <div className="relative">
//         <motion.button
//           onClick={() => setMenuOpen(!menuOpen)}
//           whileHover={{ scale: 1.05 }}
//           whileTap={{ scale: 0.95 }}
//           className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-colors ${
//             isDarkMode ? 'bg-gray-800 border-gray-700 hover:border-white' : 'bg-gray-100 border-gray-200 hover:border-black'
//           }`}
//         >
//           <UserIcon className={`${isDarkMode ? 'text-white' : 'text-black'}`} />
//         </motion.button>
//         <AnimatePresence>
//           {menuOpen && (
//             <motion.div
//               initial={{ opacity: 0, y: -10, scale: 0.95 }}
//               animate={{ opacity: 1, y: 0, scale: 1 }}
//               exit={{ opacity: 0, y: -10, scale: 0.95 }}
//               transition={{ duration: 0.2 }}
//               className={`absolute top-14 right-0 w-48 rounded-lg shadow-xl border p-2 z-20 ${
//                 isDarkMode ? 'bg-black border-gray-800' : 'bg-white border-gray-200'
//               }`}
//             >
//               <button
//                 onClick={onLogout}
//                 className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-colors ${
//                   isDarkMode ? 'text-gray-300 hover:bg-gray-800 hover:text-white' : 'text-gray-700 hover:bg-gray-100'
//                 }`}
//               >
//                 <LogOut className="w-4 h-4" />
//                 <span>Logout</span>
//               </button>
//             </motion.div>
//           )}
//         </AnimatePresence>
//       </div>
//     </header>
//   );
// };

// // --- Main Dashboard View ---
// const DashboardView = ({ onStartSetup, history, isLoading }:{onStartSetup:()=>void, history:Interview[], isLoading:boolean}) => {
//   const { isDarkMode } = useTheme();

//   return (
//     <>
//       <motion.div
//         whileHover={{ y: -5 }}
//         onClick={onStartSetup}
//         className={`p-8 rounded-2xl border cursor-pointer mb-16 transition-colors ${
//           isDarkMode ? 'bg-gray-900/50 border-gray-800 hover:border-gray-700' : 'bg-white border-gray-200 hover:border-gray-300'
//         }`}
//       >
//         <div className="flex items-center gap-6">
//           <PlusCircle className={`w-12 h-12 flex-shrink-0 ${isDarkMode ? 'text-white' : 'text-black'}`} />
//           <div>
//             <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-black'}`}>Start New Mock Interview</h2>
//             <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Configure your role and experience to begin a tailored practice session.</p>
//           </div>
//         </div>
//       </motion.div>
      
//       <div>
//         <h3 className={`text-3xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-black'}`}>Practice History</h3>
//         {isLoading ? (
//           <div className="text-center py-20"><Loader2 className="h-8 w-8 animate-spin mx-auto text-gray-500" /></div>
//         ) : history.length > 0 ? (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {history.map((interview, index) => <InterviewCard key={interview.id} interview={interview} index={index} />)}
//           </div>
//         ) : (
//           <div className={`text-center py-16 border-2 border-dashed rounded-lg ${isDarkMode ? 'border-gray-800 bg-gray-900/50' : 'border-gray-200 bg-gray-50'}`}>
//             <ClipboardList className="w-10 h-10 mx-auto mb-4 text-gray-500" />
//             <p className={`text-lg font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-black'}`}>No interviews yet</p>
//             <p className="text-gray-500 text-sm">Your completed interviews will appear here.</p>
//           </div>
//         )}
//       </div>
//     </>
//   );
// };

// // --- Interview Setup View (Replaces Modal) ---
// const InterviewSetupView = ({ onCancel }:{onCancel:()=>void}) => {
//   const { isDarkMode } = useTheme();
//   // Add state logic for setup steps here if needed

//   return (
//     <div className={`p-8 rounded-2xl border ${isDarkMode ? 'bg-gray-900/50 border-gray-800' : 'bg-white border-gray-200'}`}>
//       <div className="flex justify-between items-center mb-8">
//         <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-black'}`}>Create Your Interview</h2>
//         <button onClick={onCancel} className="flex items-center gap-2 text-sm font-semibold hover:underline">
//           <ArrowLeft className="w-4 h-4" /> Back to Dashboard
//         </button>
//       </div>
//       {/* --- This is where your multi-step form from the previous redesign would go --- */}
//       <div className="space-y-6 max-w-md mx-auto text-center py-10">
//         <Briefcase className="w-12 h-12 mx-auto text-gray-500" />
//         <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-black'}`}>Interview Configuration</h3>
//         <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
//           This is where the seamless, step-by-step form to choose a role and experience level will live, providing a much better user experience than a modal.
//         </p>
//       </div>
//     </div>
//   );
// };

// // --- Main Page Component ---
// export default function DashboardPage() {
//   const { phoneNumber, logout, isLoading: isAuthLoading } = useAuth();
//   const router = useRouter();
//   const [history, setHistory] = useState<Interview[]>([]);
//   const [isHistoryLoading, setIsHistoryLoading] = useState(true);
//   const [viewState, setViewState] = useState('dashboard'); // 'dashboard' or 'setup'

//   // useEffect(() => {
//   //   if (!isAuthLoading && !phoneNumber) {
//   //     router.replace('/auth');
//   //   }
//   //   if (phoneNumber) {
//   //     setIsHistoryLoading(true);
//   //     getInterviewHistory()
//   //       .then(response => setHistory(response.data))
//   //       .catch(err => console.error("Failed to fetch interview history:", err))
//   //       .finally(() => setIsHistoryLoading(false));
//   //   }
//   // }, [phoneNumber, isAuthLoading, router]);

//   // const handleLogout = () => {
//   //   logout();
//   //   router.replace('/auth');
//   // };

//   if (isAuthLoading || !phoneNumber) {
//     return (
//       <div className="flex h-screen w-full items-center justify-center bg-black">
//         <AnimatedBackground />
//         <Loader2 className="h-8 w-8 animate-spin text-white z-10" />
//       </div>
//     );
//   };

//   return (
//     <div className={`min-h-screen ${useTheme().isDarkMode ? 'bg-black' : 'bg-white'}`}>
//       <AnimatedBackground />
//       <div className="relative z-10 p-8">
//         <DashboardHeader onLogout={()=>{}} />
//         <main className="max-w-7xl mx-auto">
//           <AnimatePresence mode="wait">
//             {viewState === 'dashboard' ? (
//               <motion.div
//                 key="dashboard"
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 exit={{ opacity: 0, y: -20 }}
//                 transition={{ duration: 0.4 }}
//               >
//                 <DashboardView onStartSetup={() => setViewState('setup')} history={history} isLoading={isHistoryLoading} />
//               </motion.div>
//             ) : (
//               <motion.div
//                 key="setup"
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 exit={{ opacity: 0, y: -20 }}
//                 transition={{ duration: 0.4 }}
//               >
//                 <InterviewSetupView onCancel={() => setViewState('dashboard')} />
//               </motion.div>
//             )}
//           </AnimatePresence>
//         </main>
//       </div>
//       <Footer />
//     </div>
//   );
// }