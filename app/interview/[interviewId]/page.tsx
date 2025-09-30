"use client";

import { useEffect, useState, useMemo } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useRouter, useParams } from 'next/navigation';
import ChatInterface, { Message } from '../../components/ChatInterface';
import FeedbackModal from '../../components/FeedbackModal';

const getInitialQuestion = (interviewId: string): string | null => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(`interview_${interviewId}_question`);
};

export default function InterviewPage() {
    const router = useRouter();
    const params = useParams();
    const { phoneNumber, isLoading } = useAuth();
    
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

    useEffect(() => {
        if (!isLoading && !phoneNumber) {
            router.replace('/auth');
        }
        if (isMounted && !isLoading && phoneNumber && !initialQuestion) {
            router.replace('/dashboard');
        }
    }, [isLoading, phoneNumber, router, isMounted, initialQuestion]);

    const initialMessages = useMemo((): Message[] => {
        return initialQuestion ? [{ sender: 'AI', text: initialQuestion }] : [];
    }, [initialQuestion]);

    const handleInterviewComplete = (generatedFeedback: string) => {
        setFeedback(generatedFeedback);
        if (isMounted && interviewId) {
            localStorage.removeItem(`interview_${interviewId}_question`);
        }
    };

    if (!isMounted || isLoading || !initialQuestion) {
        return (
            <div className="flex h-screen items-center justify-center relative overflow-hidden">
                <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/30 rounded-full filter blur-3xl animate-float"></div>
                <div className="absolute bottom-20 right-10 w-72 h-72 bg-pink-500/30 rounded-full filter blur-3xl animate-float" style={{animationDelay: '1s'}}></div>
                <div className="text-center relative z-10">
                    <div className="inline-block w-16 h-16 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mb-4"></div>
                    <p className="text-xl font-semibold gradient-text">Preparing Your Interview...</p>
                    <p className="text-gray-400 text-sm mt-2">Setting up AI interviewer</p>
                </div>
            </div>
        );
    }

    return (
        <div className="relative flex h-screen items-center justify-center p-4 overflow-hidden animate-fade-in">
            {/* Animated background orbs */}
            <div className="absolute top-10 left-10 w-96 h-96 bg-purple-500/20 rounded-full filter blur-3xl animate-float"></div>
            <div className="absolute bottom-10 right-10 w-96 h-96 bg-pink-500/20 rounded-full filter blur-3xl animate-float" style={{animationDelay: '1.5s'}}></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-500/10 rounded-full filter blur-3xl animate-float" style={{animationDelay: '3s'}}></div>
            
            <div className="w-full max-w-5xl h-full max-h-[95vh] relative z-10">
                <ChatInterface
                    interviewId={parseInt(interviewId ?? '0')}
                    initialMessages={initialMessages}
                    onInterviewComplete={handleInterviewComplete}
                />
            </div>
            {feedback && (
                <FeedbackModal feedback={feedback} onClose={() => router.push('/dashboard')} />
            )}
        </div>
    );
}