"use client";

import { useEffect, useState, useMemo } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useRouter, useParams } from 'next/navigation';
import ChatInterface, { Message } from '../../components/ChatInterface';
import FeedbackModal from '../../components/FeedbackModal';
import { Loader2 } from 'lucide-react';

// Helper to safely access localStorage only on the client-side
const getInitialQuestion = (interviewId: string): string | null => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(`interview_${interviewId}_question`);
};

export default function InterviewPage() {
    const router = useRouter();
    const params = useParams();
    const { phoneNumber, isLoading: isAuthLoading } = useAuth();
    
    const interviewId = Array.isArray(params.interviewId) ? params.interviewId[0] : params.interviewId;

    const [feedback, setFeedback] = useState<string | null>(null);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const initialQuestion = useMemo(() => {
        if (!isMounted || !interviewId) return null;
        return getInitialQuestion(interviewId);
    }, [interviewId, isMounted]);

    // Authentication and session validation logic
    useEffect(() => {
        if (!isAuthLoading && !phoneNumber) {
            router.replace('/auth');
        }
        if (isMounted && !isAuthLoading && phoneNumber && !initialQuestion) {
            // If the session is invalid (no initial question), redirect to dashboard
            router.replace('/dashboard');
        }
    }, [isAuthLoading, phoneNumber, router, isMounted, initialQuestion]);

    const initialMessages = useMemo((): Message[] => {
        const question = initialQuestion || "Welcome! Let's begin the interview.";
        return [{ sender: 'AI', text: question }];
    }, [initialQuestion]);

    const handleInterviewComplete = (generatedFeedback: string) => {
        setFeedback(generatedFeedback);
        if (isMounted && interviewId) {
            localStorage.removeItem(`interview_${interviewId}_question`);
        }
    };

    // Clean and professional loading state
    if (!isMounted || isAuthLoading || !initialQuestion) {
        return (
            <div className="flex h-screen w-full flex-col items-center justify-center bg-gray-50 text-center">
                <Loader2 className="h-10 w-10 animate-spin text-gray-500" />
                <p className="mt-4 text-lg font-semibold text-gray-800">Preparing Your Interview...</p>
                <p className="text-sm text-gray-500">Please wait a moment while we set up the session.</p>
            </div>
        );
    }

    return (
        <div className="flex h-screen w-full items-center justify-center bg-gray-100 p-4">
            <ChatInterface
                interviewId={parseInt(interviewId ?? '0')}
                initialMessages={initialMessages}
                onInterviewComplete={handleInterviewComplete}
            />
            {feedback && (
                <FeedbackModal feedback={feedback} onClose={() => router.push('/dashboard')} />
            )}
        </div>
    );
}