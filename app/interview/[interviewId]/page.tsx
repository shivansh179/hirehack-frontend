"use client";

import { useEffect, useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useRouter, useParams } from 'next/navigation';
import ChatInterface, { Message } from '../../components/ChatInterface';
import FeedbackModal from '../../components/FeedbackModal';

const getInitialInterviewData = (interviewId: string): { initialMessages: Message[] } | null => {
    if (typeof window === 'undefined') return null;
    const initialQuestion = localStorage.getItem(`interview_${interviewId}_question`);
    if (initialQuestion) {
        return {
            initialMessages: [{ sender: 'AI', text: initialQuestion }]
        };
    }
    return null;
};

export default function InterviewPage() {
    const router = useRouter();
    const params = useParams();
    const { phoneNumber, isLoading } = useAuth();
    
    const interviewId = Array.isArray(params.interviewId) ? params.interviewId[0] : params.interviewId;

    const [initialData, setInitialData] = useState<{ initialMessages: Message[] } | null>(null);
    const [feedback, setFeedback] = useState<string | null>(null);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
        if (!isLoading && !phoneNumber) {
            router.replace('/auth');
        }
        if (interviewId) {
            const data = getInitialInterviewData(interviewId);
            if (data) {
                setInitialData(data);
            } else {
                router.replace('/dashboard');
            }
        }
    }, [interviewId, isLoading, phoneNumber, router]);

    const handleInterviewComplete = (generatedFeedback: string) => {
        setFeedback(generatedFeedback);
        if (isMounted) {
            localStorage.removeItem(`interview_${interviewId}_question`);
        }
    };

    if (!isMounted || isLoading || !initialData) {
        return <div className="flex h-screen items-center justify-center text-xl text-gray-400">Preparing Your Session...</div>;
    }

    return (
        <div className="flex h-screen items-center justify-center p-4 bg-dark-bg animate-fade-in">
            <div className="w-full max-w-4xl h-full max-h-[95vh]">
                <ChatInterface
                    interviewId={parseInt(interviewId ?? '0')}
                    initialMessages={initialData.initialMessages}
                    onInterviewComplete={handleInterviewComplete}
                />
            </div>
            {feedback && (
                <FeedbackModal feedback={feedback} onClose={() => router.push('/dashboard')} />
            )}
        </div>
    );
}