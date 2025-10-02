"use client";

import { useState, useEffect, FormEvent, useRef } from 'react';
import { useSpeech } from '../hooks/useSpeech';
import { postChatMessage, endInterview, generateFeedback } from '../services/apiService';
import { Send, Mic, Square, Flag, Bot, User, Loader2 } from 'lucide-react';

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
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages, isAiTyping]);

  const handleSubmit = async (e?: FormEvent) => {
    e?.preventDefault();
    if (!userInput.trim() || isAiTyping) return;

    cancelSpeech();
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
        speakText(aiReply);
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
    } else {
      startListening();
    }
  };
  
  const handleEndInterview = async () => {
    if (!confirm('Are you sure you want to end this interview?')) return;

    cancelSpeech();
    stopListening();
    setIsAiTyping(true);
    try {
      await endInterview(interviewId);
      const feedbackResponse = await generateFeedback(interviewId);
      onInterviewComplete(feedbackResponse.data.feedback);
    } catch (error) {
      console.error("Failed to end interview:", error);
      onInterviewComplete("An error occurred while generating your feedback. Please check the dashboard later.");
    } finally {
      setIsAiTyping(false);
    }
  };

  return (
    <div className="flex flex-col w-full max-w-4xl h-full max-h-[95vh] bg-white rounded-xl shadow-2xl border border-gray-200">
      <header className="flex items-center justify-between p-4 border-b border-gray-200">
        <h2 className="text-xl font-bold text-black">AI Interview Session</h2>
        <button
          onClick={handleEndInterview}
          disabled={isAiTyping}
          className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-red-600 bg-red-100 rounded-lg hover:bg-red-200 transition-colors disabled:opacity-50"
        >
          <Flag className="h-4 w-4" />
          End Interview
        </button>
      </header>
      
      <main ref={chatContainerRef} className="flex-1 p-6 space-y-5 overflow-y-auto">
        {messages.map((msg, index) => (
          <div key={index} className={`flex items-start gap-3 max-w-[85%] ${msg.sender === 'USER' ? 'self-end flex-row-reverse' : 'self-start'}`}>
            <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${msg.sender === 'USER' ? 'bg-black text-white' : 'bg-gray-200 text-black'}`}>
              {msg.sender === 'USER' ? <User size={16} /> : <Bot size={16} />}
            </div>
            <div className={`px-4 py-3 rounded-xl ${msg.sender === 'USER' ? 'bg-black text-white' : 'bg-gray-100 text-gray-800'}`}>
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>
            </div>
          </div>
        ))}
        {isAiTyping && (
          <div className="flex items-start gap-3 self-start">
             <div className="w-8 h-8 rounded-full flex items-center justify-center bg-gray-200 text-black"><Bot size={16} /></div>
             <div className="px-4 py-3 rounded-xl bg-gray-100 text-gray-800 flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce"></span>
                <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></span>
                <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></span>
             </div>
          </div>
        )}
      </main>
      
      <footer className="p-4 border-t border-gray-200">
        <form onSubmit={handleSubmit} className="flex items-center gap-3">
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder={isListening ? "Listening..." : "Type your response here..."}
            className="w-full px-4 py-3 text-black bg-gray-100 border border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-black disabled:opacity-70"
            disabled={isAiTyping}
          />
          <button
            type="button"
            onClick={handleMicClick}
            className={`p-3 rounded-lg transition-colors ${isListening ? 'bg-red-600 hover:bg-red-700 text-white' : 'bg-gray-200 hover:bg-gray-300 text-black'}`}
          >
            {isListening ? <Square className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
          </button>
          <button 
            type="submit" 
            className="p-3 bg-black text-white rounded-lg hover:bg-gray-800 disabled:bg-gray-300 transition-colors" 
            disabled={isAiTyping || !userInput.trim()}
          >
            <Send className="h-6 w-6" />
          </button>
        </form>
      </footer>
    </div>
  );
}