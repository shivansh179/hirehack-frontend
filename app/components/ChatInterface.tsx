"use client";

import { useState, useEffect, FormEvent, useRef } from 'react';
import { useSpeech } from '../hooks/useSpeech';
import { postChatMessage, generateFeedback, endInterview } from '../services/apiService';
import { PaperAirplaneIcon, MicrophoneIcon, StopCircleIcon, XCircleIcon } from '@heroicons/react/24/solid';

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
  const [isAiTyping, setIsAiTyping] = useState(false);
  const { transcript, isListening, startListening, stopListening, speakText, setTranscript, cancelSpeech } = useSpeech();
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setUserInput(transcript);
  }, [transcript]);

  useEffect(() => {
    if (messages.length > 0 && messages[messages.length - 1].sender === 'AI') {
      speakText(messages[messages.length - 1].text);
    }
  }, [messages, speakText]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages, isAiTyping]);

  const handleSubmit = async (e?: FormEvent) => {
    e?.preventDefault();
    if (!userInput.trim() || isAiTyping) return;

    cancelSpeech();
    stopListening();
    const newUserMessage: Message = { sender: 'USER', text: userInput };
    setMessages(prev => [...prev, newUserMessage]);
    setUserInput('');
    setTranscript('');
    setIsAiTyping(true);

    try {
      const response = await postChatMessage(interviewId, userInput);
      const aiReply = response.data.reply;

      if (aiReply.startsWith('INTERVIEW_ENDED:')) {
        const finalMessage = aiReply.replace('INTERVIEW_ENDED:', '').trim();
        setMessages(prev => [...prev, { sender: 'AI', text: finalMessage }]);
        
        const feedbackResponse = await generateFeedback(interviewId);
        onInterviewComplete(feedbackResponse.data.feedback);
      } else {
        setMessages(prev => [...prev, { sender: 'AI', text: aiReply }]);
      }
    } catch (error) {
      console.error("Failed to post message:", error);
      setMessages(prev => [...prev, { sender: 'AI', text: "I'm sorry, I encountered an issue. Let's try to continue." }]);
    } finally {
      setIsAiTyping(false);
    }
  };

  const handleMicClick = () => {
    if (isListening) {
      stopListening();
      handleSubmit();
    } else {
      startListening();
    }
  };

  const handleEndInterview = async () => {
    if (!confirm('Are you sure you want to end this interview? This action cannot be undone.')) {
      return;
    }

    cancelSpeech();
    stopListening();
    setIsAiTyping(true);

    try {
      await endInterview(interviewId);
      
      const finalMessage = "Thank you for your time. The interview has been manually ended.";
      setMessages(prev => [...prev, { sender: 'AI', text: finalMessage }]);
      
      const feedbackResponse = await generateFeedback(interviewId);
      onInterviewComplete(feedbackResponse.data.feedback);
    } catch (error) {
      console.error("Failed to end interview:", error);
      alert("Failed to end interview. Please try again.");
    } finally {
      setIsAiTyping(false);
    }
  };

  return (
    <div className="flex flex-col h-full glass-pane border-2 border-purple-500/30 rounded-3xl shadow-2xl overflow-hidden backdrop-blur-xl">
      {/* Header with gradient */}
      <div className="relative p-6 border-b border-purple-500/30 bg-gradient-to-r from-purple-900/50 to-pink-900/50">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10"></div>
        <div className="relative z-10 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold gradient-text mb-1">Interview in Progress</h2>
            <p className="text-gray-400 text-sm flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              AI Interviewer: Alex
            </p>
          </div>
          <button
            onClick={handleEndInterview}
            disabled={isAiTyping}
            className="flex items-center gap-2 px-5 py-2.5 bg-red-500/20 border-2 border-red-500/30 hover:bg-red-500/30 text-red-400 hover:text-red-300 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed font-semibold transform hover:scale-105"
          >
            <XCircleIcon className="h-5 w-5" />
            End Interview
          </button>
        </div>
      </div>
      
      {/* Chat messages area with gradient background */}
      <div ref={chatContainerRef} className="flex-1 p-6 space-y-4 overflow-y-auto bg-gradient-to-b from-slate-900/50 to-slate-800/50">
        {messages.map((msg, index) => (
          <div key={index} className={`flex ${msg.sender === 'USER' ? 'justify-end' : 'justify-start'} animate-slide-up`}>
            <div className={`max-w-xl px-5 py-3.5 rounded-2xl shadow-lg backdrop-blur-sm ${
              msg.sender === 'USER' 
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white border border-purple-400/30' 
                : 'bg-slate-700/80 text-gray-100 border border-slate-600/50'
            }`}>
              {msg.sender === 'AI' && (
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-sm">
                    AI
                  </div>
                  <span className="text-xs text-purple-300 font-semibold">Alex</span>
                </div>
              )}
              <p className="text-base leading-relaxed">{msg.text}</p>
            </div>
          </div>
        ))}
        {isAiTyping && (
          <div className="flex justify-start animate-slide-up">
            <div className="px-5 py-3.5 rounded-2xl bg-slate-700/80 border border-slate-600/50 backdrop-blur-sm">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                </div>
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></span>
                  <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></span>
                  <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Input area with gradient border */}
      <div className="p-6 border-t border-purple-500/30 bg-gradient-to-r from-slate-900/80 to-slate-800/80 backdrop-blur-sm">
        <form onSubmit={handleSubmit} className="flex items-center gap-3">
          <div className="flex-1 relative">
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="Type your answer or use the microphone..."
              className="w-full bg-slate-700/50 border-2 border-purple-500/30 focus:border-purple-500/60 rounded-xl px-5 py-3.5 focus:ring-2 focus:ring-purple-500/20 text-white placeholder-gray-400 disabled:opacity-50 transition-all outline-none"
              disabled={isAiTyping}
            />
          </div>
          
          <button
            type="button"
            onClick={handleMicClick}
            className={`p-4 rounded-xl transition-all transform hover:scale-105 ${
              isListening 
                ? 'bg-gradient-to-r from-red-600 to-red-500 animate-pulse shadow-lg shadow-red-500/50' 
                : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg shadow-purple-500/30'
            }`}
          >
            {isListening ? <StopCircleIcon className="h-6 w-6 text-white" /> : <MicrophoneIcon className="h-6 w-6 text-white" />}
          </button>
          
          <button 
            type="submit" 
            className="p-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105 shadow-lg shadow-indigo-500/30" 
            disabled={isAiTyping || !userInput.trim()}
          >
            <PaperAirplaneIcon className="h-6 w-6" />
          </button>
        </form>
        
        {/* Status indicator */}
        <div className="mt-3 flex items-center justify-center gap-2 text-xs text-gray-400">
          {isListening ? (
            <>
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              <span>Recording your response...</span>
            </>
          ) : isAiTyping ? (
            <>
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
              <span>AI is thinking...</span>
            </>
          ) : (
            <>
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Ready to respond</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}