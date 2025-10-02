import { Interview } from '../types';
import { Calendar, CheckCircle2, Clock, XCircle, PlayCircle, BrainCircuit, Timer } from 'lucide-react';
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
                    icon: <CheckCircle2 className="h-4 w-4" />,
                    text: 'Completed',
                    className: 'text-green-700 bg-green-100',
                };
            case 'STARTED':
            case 'IN_PROGRESS':
                return {
                    icon: <PlayCircle className="h-4 w-4" />,
                    text: 'In Progress',
                    className: 'text-blue-700 bg-blue-100',
                };
            case 'PENDING':
                return {
                    icon: <Clock className="h-4 w-4" />,
                    text: 'Pending',
                    className: 'text-yellow-800 bg-yellow-100',
                };
            case 'TERMINATED':
            case 'CANCELLED':
                return {
                    icon: <XCircle className="h-4 w-4" />,
                    text: 'Terminated',
                    className: 'text-red-700 bg-red-100',
                };
            default:
                return {
                    icon: <Clock className="h-4 w-4" />,
                    text: 'Unknown',
                    className: 'text-gray-700 bg-gray-100',
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
                delay: index * 0.05, // A subtle stagger animation
                duration: 0.3
            }
        }
    }

    return (
        <motion.div 
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            className="bg-white p-6 rounded-xl shadow-md border border-gray-200 hover:shadow-lg hover:border-gray-300 transition-all group"
        >
            <div className="flex items-start justify-between mb-2">
                <h3 className="text-xl font-bold text-black">
                    {interview.role}
                </h3>
                <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${statusDisplay.className}`}>
                    {statusDisplay.icon}
                    <span>{statusDisplay.text}</span>
                </div>
            </div>
            <p className="text-gray-600 font-semibold mb-4">
                {interview.interviewType} Interview
            </p>

            <div className="space-y-3 text-sm text-gray-600 border-t border-gray-200 pt-4">
                <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span>{formattedDate}</span>
                </div>
                <div className="flex items-center gap-2">
                    <Timer className="h-4 w-4 text-gray-400" />
                    <span>{interview.interviewDurationMinutes} minutes</span>
                </div>
                
                {interview.skills && (
                    <div className="flex items-start gap-2 pt-1">
                        <BrainCircuit className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                        <div className="flex flex-wrap gap-1.5">
                            {interview.skills.split(',').slice(0, 4).map((skill, idx) => (
                                <span key={idx} className="px-2 py-0.5 text-xs bg-gray-100 text-gray-800 rounded-md font-medium">
                                    {skill.trim()}
                                </span>
                            ))}
                        </div>
                    </div>
                )}
            </div>
            
            {interview.feedback && (
                <button className="mt-5 w-full py-2.5 px-4 bg-black text-white font-semibold rounded-lg hover:bg-gray-800 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black">
                    View Feedback
                </button>
            )}
        </motion.div>
    );
}