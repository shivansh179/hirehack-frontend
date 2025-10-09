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

// Helper to get interview data including currentQuestionId
const getInterviewData = (interviewId: string): { question: string | null; currentQuestionId: number | null } => {
    if (typeof window === 'undefined') return { question: null, currentQuestionId: null };
    
    const question = localStorage.getItem(`interview_${interviewId}_question`);
    const interviewDataStr = localStorage.getItem(`interview_${interviewId}_data`);
    
    let currentQuestionId = null;
    if (interviewDataStr) {
        try {
            const interviewData = JSON.parse(interviewDataStr);
            currentQuestionId = interviewData.currentQuestionId || null;
        } catch (error) {
            console.error('Failed to parse interview data:', error);
        }
    }
    
    return { question, currentQuestionId };
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

    const interviewData = useMemo(() => {
        if (!isMounted || !interviewId) return { question: null, currentQuestionId: null };
        return getInterviewData(interviewId);
    }, [interviewId, isMounted]);

    // Authentication and session validation logic
    useEffect(() => {
        if (!isAuthLoading && !phoneNumber) {
            router.replace('/auth');
        }
        if (isMounted && !isAuthLoading && phoneNumber && !interviewData.question) {
            // If the session is invalid (no initial question), redirect to dashboard
            router.replace('/dashboard');
        }
    }, [isAuthLoading, phoneNumber, router, isMounted, interviewData.question]);

    const initialMessages = useMemo((): Message[] => {
        const question = interviewData.question || "Welcome! Let's begin the interview.";
        return [{ sender: 'AI', text: question }];
    }, [interviewData.question]);

    const handleInterviewComplete = (generatedFeedback: string) => {
        setFeedback(generatedFeedback);
        if (isMounted && interviewId) {
            localStorage.removeItem(`interview_${interviewId}_question`);
            localStorage.removeItem(`interview_${interviewId}_data`);
        }
    };

    // Clean and professional loading state
    if (!isMounted || isAuthLoading || !interviewData.question) {
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
                currentQuestionId={interviewData.currentQuestionId || undefined}
            />
            {feedback && (
                <FeedbackModal feedback={feedback} onClose={() => router.push('/dashboard')} />
            )}
        </div>
    );
}