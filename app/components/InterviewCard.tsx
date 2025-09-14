import { Interview } from '../../app/dashboard/page';
import { CalendarIcon, CheckCircleIcon, ClockIcon } from '@heroicons/react/24/solid';
import { motion } from 'framer-motion';

export default function InterviewCard({ interview, index }: { interview: Interview, index: number }) {
    const formattedDate = new Date(interview.createdAt).toLocaleDateString('en-US', {
        year: 'numeric', month: 'long', day: 'numeric'
    });

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
            className="glass-pane p-6 rounded-xl shadow-lg hover:border-primary transition-all transform hover:-translate-y-1"
        >
            <h3 className="text-xl font-bold text-white">{interview.role}</h3>
            <p className="text-primary font-medium">{interview.interviewType} Interview</p>
            <div className="mt-4 flex flex-col gap-2 text-gray-400 text-sm">
                <div className="flex items-center gap-2">
                    <CalendarIcon className="h-5 w-5" />
                    <span>{formattedDate}</span>
                </div>
                <div className="flex items-center gap-2">
                    {interview.status === 'COMPLETED' ? (
                        <CheckCircleIcon className="h-5 w-5 text-green-500" />
                    ) : (
                        <ClockIcon className="h-5 w-5 text-yellow-500" />
                    )}
                    <span className={`font-semibold ${interview.status === 'COMPLETED' ? 'text-green-500' : 'text-yellow-500'}`}>
                        {interview.status}
                    </span>
                </div>
            </div>
            {interview.feedback && (
                <button className="mt-4 w-full text-sm font-semibold text-primary hover:text-indigo-400 transition-colors text-left">View Feedback</button>
            )}
        </motion.div>
    );
}