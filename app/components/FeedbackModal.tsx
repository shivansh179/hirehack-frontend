"use client";

import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import ReactMarkdown from 'react-markdown'; // A more robust markdown solution

interface Props {
    feedback: string;
    onClose: () => void;
}

export default function FeedbackModal({ feedback, onClose }: Props) {
    return (
        <div className="fixed inset-0 text-black bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-xl shadow-2xl w-full max-w-3xl border border-gray-200 flex flex-col max-h-[90vh]"
            >
                <header className="flex items-center justify-between p-5 border-b border-gray-200 flex-shrink-0">
                    <h2 className="text-xl font-bold text-black">Interview Feedback Report</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-black transition-colors">
                        <X className="h-6 w-6" />
                    </button>
                </header>

                <main className="p-6 overflow-y-auto">
                    <article className="prose prose-base max-w-none">
                        {/* Using react-markdown for safe and accurate rendering */}
                        <ReactMarkdown>{feedback}</ReactMarkdown>
                    </article>
                </main>

                <footer className="p-5 border-t border-gray-200 flex justify-end flex-shrink-0">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 bg-black text-white font-semibold rounded-lg hover:bg-gray-800 transition-colors"
                    >
                        Return to Dashboard
                    </button>
                </footer>
            </motion.div>
        </div>
    );
}