"use client";

import { useState, useRef, useEffect, FormEvent } from 'react';
import { postChatMessage, generateFeedback } from '../services/apiService';
import { useSpeech } from '../hooks/useSpeech';
import { MicrophoneIcon, StopCircleIcon, PaperAirplaneIcon } from '@heroicons/react/24/solid';
import { motion, AnimatePresence } from 'framer-motion';

export interface Message {
  sender: 'USER' | 'AI';
  text: string;
}

interface Props {
  interviewId: number;
  initialMessages: Message[];
  onInterviewComplete: (feedback: string) => void; 
}

export default function ChatInterface({ interviewId, initialMessages, onInterviewComplete }: Props) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isInterviewOver, setIsInterviewOver] = useState(false);
  const [isFetchingFeedback, setIsFetchingFeedback] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  
  const { 
    transcript, 
    isListening, 
    startListening, 
    stopListening, 
    speakText, 
    cancelSpeech,
    setTranscript 
  } = useSpeech();

  useEffect(() => {
    if (initialMessages.length > 0 && initialMessages[0].sender === 'AI') {
      speakText(initialMessages[0].text);
    }
  }, [initialMessages, speakText]);

  useEffect(() => {
    setUserInput(transcript);
  }, [transcript]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!userInput.trim() || isLoading) return;
    if (isListening) stopListening();

    const userMessage: Message = { sender: 'USER', text: userInput };
    setMessages((prev) => [...prev, userMessage]);
    setUserInput('');
    setTranscript('');
    setIsLoading(true);

    try {
      const response = await postChatMessage(interviewId, userInput);
      let aiReply = response.data.reply;
      if (aiReply.startsWith('INTERVIEW_ENDED: ')) {
        aiReply = aiReply.replace('INTERVIEW_ENDED: ', '');
        setIsInterviewOver(true);
      }
      
      const aiMessage: Message = { sender: 'AI', text: aiReply };
      setMessages((prev) => [...prev, aiMessage]);
      speakText(aiReply);

    } catch (error) {
       const errorMessage: Message = { sender: 'AI', text: 'Sorry, I encountered a technical error. Please try again.' };
       setMessages((prev) => [...prev, errorMessage]);
       speakText(errorMessage.text);
    } finally {
       setIsLoading(false);
    }
  };

  const handleViewFeedback = async () => {
    setIsFetchingFeedback(true);
    try {
        const response = await generateFeedback(interviewId);
        onInterviewComplete(response.data.feedback);
    } catch (error) {
        console.error("Failed to fetch feedback", error);
    } finally {
        setIsFetchingFeedback(false);
    }
  };

  const handleUserInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    cancelSpeech();
    setUserInput(e.target.value);
  };

  return (
    <div className="flex flex-col h-full bg-light-bg rounded-2xl shadow-2xl overflow-hidden border border-gray-700">
      <div className="p-4 border-b border-gray-700 text-center bg-light-bg/80 backdrop-blur-sm">
        <h2 className="text-xl font-bold text-white">Interview in Progress</h2>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        <AnimatePresence>
          {messages.map((msg, index) => (
            <motion.div
              key={index}
              layout
              initial={{ opacity: 0, scale: 0.8, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className={`flex items-end gap-3 ${msg.sender === 'USER' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.sender === 'AI' && (
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex-shrink-0 shadow-lg"></div>
              )}
              <div className={`max-w-md lg:max-w-lg px-5 py-3 rounded-2xl shadow-md ${
                  msg.sender === 'USER' 
                      ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-br-none' 
                      : 'bg-gray-700 text-gray-200 rounded-bl-none'
                }`}
              >
                <p className="leading-relaxed" style={{ whiteSpace: 'pre-wrap' }}>{msg.text}</p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {isLoading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-end gap-3 justify-start">
             <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex-shrink-0 shadow-lg"></div>
             <div className="bg-gray-700 text-gray-200 rounded-2xl rounded-bl-none px-5 py-3 shadow-md">
               <div className="flex items-center gap-2">
                 <span className="block w-2 h-2 bg-indigo-400 rounded-full animate-pulse delay-75"></span>
                 <span className="block w-2 h-2 bg-indigo-400 rounded-full animate-pulse delay-150"></span>
                 <span className="block w-2 h-2 bg-indigo-400 rounded-full animate-pulse delay-300"></span>
               </div>
             </div>
          </motion.div>
        )}
        <div ref={chatEndRef} />
      </div>

      <div className="p-4 border-t border-gray-700 bg-light-bg">
        {isInterviewOver ? (
          <div className="text-center p-2">
            <h3 className="text-xl font-semibold text-green-400 mb-4">Interview Complete!</h3>
            <button 
                onClick={handleViewFeedback} 
                disabled={isFetchingFeedback}
                className="w-full max-w-xs mx-auto px-6 py-3 bg-green-600 text-white font-bold rounded-lg shadow-lg hover:bg-green-700 transition-transform transform hover:scale-105 disabled:bg-green-800 disabled:cursor-not-allowed"
            >
              {isFetchingFeedback ? 'Generating Feedback...' : 'View Your Feedback'}
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex items-center space-x-3">
            <textarea
              rows={1}
              value={userInput}
              onChange={handleUserInputChange}
              placeholder={isListening ? "Listening..." : "Type your answer or use the mic"}
              disabled={isLoading || isListening}
              onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSubmit(e as any); }}}
              className="flex-1 block w-full px-4 py-3 bg-gray-700 text-gray-200 border border-gray-600 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none transition"
            />
            <button
                type="button"
                onClick={isListening ? stopListening : startListening}
                className={`p-3 rounded-full text-white transition-all duration-300 transform hover:scale-110 shadow-lg ${isListening ? 'bg-red-500 animate-pulse' : 'bg-primary'}`}
            >
                {isListening ? <StopCircleIcon className="h-6 w-6" /> : <MicrophoneIcon className="h-6 w-6" />}
            </button>
            <button type="submit" disabled={isLoading || !userInput.trim()} className="p-3 bg-primary text-white rounded-full shadow-lg transition-transform transform hover:scale-110 disabled:bg-indigo-800 disabled:cursor-not-allowed">
              <PaperAirplaneIcon className="h-6 w-6" />
            </button>
          </form>
        )}
      </div>
    </div>
  );
}