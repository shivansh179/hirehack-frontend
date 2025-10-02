import { Interview } from '../types';
import { CalendarIcon, CheckCircleIcon, ClockIcon, XCircleIcon, PlayIcon } from '@heroicons/react/24/solid';
import { motion } from 'framer-motion';

export default function InterviewCard({ interview, index }: { interview: Interview, index: number }) {
    const formattedDate = new Date(interview.createdAt).toLocaleDateString('en-US', {
        year: 'numeric', month: 'long', day: 'numeric'
    });

    const getStatusDisplay = () => {
        const status = interview.status?.toUpperCase() || 'UNKNOWN';
        
        switch(status) {
            case 'COMPLETED':
                return {
                    icon: <CheckCircleIcon className="h-5 w-5" />,
                    text: 'Completed',
                    color: 'text-green-500',
                    bgColor: 'bg-green-500/10',
                    borderColor: 'border-green-500/20'
                };
            case 'STARTED':
            case 'IN_PROGRESS':
                return {
                    icon: <PlayIcon className="h-5 w-5" />,
                    text: 'In Progress',
                    color: 'text-blue-500',
                    bgColor: 'bg-blue-500/10',
                    borderColor: 'border-blue-500/20'
                };
            case 'PENDING':
                return {
                    icon: <ClockIcon className="h-5 w-5" />,
                    text: 'Pending',
                    color: 'text-yellow-500',
                    bgColor: 'bg-yellow-500/10',
                    borderColor: 'border-yellow-500/20'
                };
            case 'TERMINATED':
            case 'CANCELLED':
                return {
                    icon: <XCircleIcon className="h-5 w-5" />,
                    text: 'Terminated',
                    color: 'text-red-500',
                    bgColor: 'bg-red-500/10',
                    borderColor: 'border-red-500/20'
                };
            default:
                return {
                    icon: <ClockIcon className="h-5 w-5" />,
                    text: status,
                    color: 'text-gray-500',
                    bgColor: 'bg-gray-500/10',
                    borderColor: 'border-gray-500/20'
                };
        }
    };

    const statusDisplay = getStatusDisplay();

    const cardVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                delay: index * 0.1
            }
        }
    }

    return (
        <motion.div 
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            className="relative glass-pane card-glow p-6 rounded-2xl shadow-lg border-2 border-purple-500/20 hover:border-purple-500/50 transition-all transform hover:-translate-y-2 group overflow-hidden"
        >
            {/* Gradient overlay on hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
            
            <div className="relative z-10">
                <div className="flex items-start justify-between mb-3">
                    <h3 className="text-xl font-bold text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-pink-400 transition-all">
                        {interview.role}
                    </h3>
                </div>
                <p className="text-purple-400 font-semibold mb-4 flex items-center gap-2">
                    <span className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></span>
                    {interview.interviewType} Interview
                </p>
                <div className="flex flex-col gap-3 text-gray-400 text-sm">
                    <div className="flex items-center gap-2 text-gray-300">
                        <CalendarIcon className="h-5 w-5 text-purple-400" />
                        <span>{formattedDate}</span>
                    </div>
                    
                    {/* Enhanced Status Badge */}
                    <div className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border-2 ${statusDisplay.bgColor} ${statusDisplay.borderColor} shadow-md`}>
                        <div className={statusDisplay.color}>
                            {statusDisplay.icon}
                        </div>
                        <span className={`font-bold ${statusDisplay.color}`}>
                            {statusDisplay.text}
                        </span>
                    </div>

                    <div className="flex items-center justify-between mt-2 text-xs">
                        <span className="px-2 py-1 bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 rounded-md">
                            ⏱️ {interview.interviewDurationMinutes} min
                        </span>
                    </div>
                    
                    {interview.skills && (
                        <div className="mt-2">
                            <div className="flex flex-wrap gap-1">
                                {interview.skills.split(',').slice(0, 3).map((skill, idx) => (
                                    <span key={idx} className="px-2 py-1 text-xs bg-purple-500/10 border border-purple-500/30 text-purple-300 rounded-md">
                                        {skill.trim()}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
                
                {interview.feedback && (
                    <button className="mt-4 w-full py-2 px-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105 shadow-md">
                        📊 View Feedback
                    </button>
                )}
            </div>
        </motion.div>
    );
}