"use client";

import { motion } from 'framer-motion';
import { XMarkIcon } from '@heroicons/react/24/solid';

interface Props {
    feedback: string;
    onClose: () => void;
}

const MarkdownRenderer = ({ text }: { text: string }) => {
    return (
        <div className="prose prose-invert prose-sm md:prose-base max-w-none">
            {text.split('\n').map((line, index) => {
                if (line.startsWith('# ')) {
                    return <h2 key={index} className="text-2xl font-bold text-white border-b border-gray-600 pb-2 mb-4">{line.substring(2)}</h2>;
                }
                 if (line.startsWith('## ')) {
                    return <h3 key={index} className="text-xl font-semibold text-primary mt-4 mb-2">{line.substring(3)}</h3>;
                }
                if (line.startsWith('**')) {
                    return <h3 key={index} className="font-bold text-lg mt-4 mb-2 text-primary">{line.replace(/\*\*/g, '')}</h3>;
                }
                if (line.startsWith('* ')) {
                    return <li key={index} className="ml-5 list-disc my-1">{line.substring(2)}</li>;
                }
                return <p key={index} className="my-2 text-gray-300">{line}</p>;
            })}
        </div>
    );
};

export default function FeedbackModal({ feedback, onClose }: Props) {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-pane p-8 rounded-2xl w-full max-w-2xl relative max-h-[80vh] overflow-y-auto"
            >
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white">
                    <XMarkIcon className="h-6 w-6" />
                </button>
                <h2 className="text-3xl font-bold text-white mb-6 text-center">Interview Feedback</h2>
                <MarkdownRenderer text={feedback} />
                 <div className="text-center mt-8">
                    <button onClick={onClose} className="px-8 py-2 bg-primary text-white font-semibold rounded-lg hover:bg-indigo-700 transition">
                        Back to Dashboard
                    </button>
                </div>
            </motion.div>
        </div>
    );
}