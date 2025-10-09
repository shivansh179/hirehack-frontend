"use client";

import { useState, useEffect, FormEvent, useRef } from 'react';
import { useSpeech } from '../hooks/useSpeech';
import { postChatMessage, endInterview, generateFeedback, submitCodingChallenge, submitCode } from '../services/apiService';
import { CodingChallenge, CodingSubmission } from '../types';
import CodingChallengeInterface from './CodingChallengeInterface';
import { Send, Mic, Square, Flag, Bot, User, Loader2, Code } from 'lucide-react';

export interface Message {
  sender: 'USER' | 'AI';
  text: string;
}

interface Props {
  interviewId: number;
  initialMessages: Message[];
  onInterviewComplete: (feedback: string) => void;
  currentQuestionId?: number;
}

export default function ChatInterface({ interviewId, initialMessages, onInterviewComplete, currentQuestionId: propCurrentQuestionId }: Props) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [userInput, setUserInput] = useState('');
  const [isAiTyping, setIsAiTyping] = useState(false);
  const [currentChallenge, setCurrentChallenge] = useState<CodingChallenge | null>(null);
  const [showCodingInterface, setShowCodingInterface] = useState(false);
  const [challengeId, setChallengeId] = useState<string>('');
  const [isSubmittingCode, setIsSubmittingCode] = useState(false);
  const [currentQuestionId, setCurrentQuestionId] = useState<number>(propCurrentQuestionId || 1); // Use prop or default
  const { transcript, isListening, startListening, stopListening, speakText, setTranscript, cancelSpeech } = useSpeech();
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setUserInput(transcript);
  }, [transcript]);

  // Update currentQuestionId when prop changes
  useEffect(() => {
    if (propCurrentQuestionId) {
      setCurrentQuestionId(propCurrentQuestionId);
    }
  }, [propCurrentQuestionId]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages, isAiTyping]);

  // Check for coding challenges in initial messages
  useEffect(() => {
    if (initialMessages.length > 0) {
      const lastMessage = initialMessages[initialMessages.length - 1];
      if (lastMessage.sender === 'AI') {
        const challengeData = detectCodingChallenge(lastMessage.text);
        if (challengeData) {
         console.log("Detected coding challenge in initial messages:", challengeData);
         
          setCurrentChallenge(challengeData.challenge);
          setChallengeId(challengeData.challengeId);
          // Set question ID if available in challenge (fallback to prop value)
          if (challengeData.challenge.question_id) {
            setCurrentQuestionId(challengeData.challenge.question_id);
          }
          // Don't auto-open, just prepare the challenge
        }
      }
    }
  }, [initialMessages]);

  // Function to detect and parse coding challenges
  const detectCodingChallenge = (message: string): { challenge: CodingChallenge; challengeId: string } | null => {
    const startMarker = '[START_CODING_CHALLENGE]';
    const endMarker = '[END_CODING_CHALLENGE]';
    
    // First, try to find the exact markers
    let startIndex = message.indexOf(startMarker);
    let endIndex = message.indexOf(endMarker);
    
    // If no end marker found, look for the start marker and try to extract JSON from code block
    if (startIndex !== -1 && endIndex === -1) {
      // Look for JSON in code block after the start marker
      const afterStart = message.substring(startIndex + startMarker.length);
      const codeBlockMatch = afterStart.match(/```json\s*(\{[\s\S]*?\})\s*```/);
      
      if (codeBlockMatch) {
        try {
          const challenge = JSON.parse(codeBlockMatch[1]);
          const challengeId = `challenge_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
          return { challenge, challengeId };
        } catch (error) {
          console.error('Failed to parse coding challenge from code block:', error);
          return null;
        }
      }
    }
    
    // Original logic for exact markers
    if (startIndex === -1 || endIndex === -1 || startIndex >= endIndex) {
      return null;
    }
    
    const jsonContent = message.substring(startIndex + startMarker.length, endIndex).trim();
    
    try {
      const challenge = JSON.parse(jsonContent);
      const challengeId = `challenge_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      return { challenge, challengeId };
    } catch (error) {
      console.error('Failed to parse coding challenge:', error);
      return null;
    }
  };

  // Function to clean message text for display
  const cleanMessageForDisplay = (text: string): string => {
    const startMarker = '[START_CODING_CHALLENGE]';
    const startIndex = text.indexOf(startMarker);
    
    if (startIndex !== -1) {
      // Return only the text before the coding challenge marker
      return text.substring(0, startIndex).trim();
    }
    
    return text;
  };

  // Function to handle starting coding challenge
  const handleStartCoding = () => {
    if (currentChallenge && challengeId) {
      setShowCodingInterface(true);
    }
  };

  // Function to handle coding challenge submission
  const handleCodingSubmission = async (submission: CodingSubmission) => {
    setIsSubmittingCode(true);
    
    try {
      const passedTests = submission.testResults.filter(r => r.passed).length;
      const failedTests = submission.testResults.length - passedTests;
      
      // Submit to the correct backend endpoint
      const codeData = {
        code: submission.code,
        language: submission.language,
        currentQuestionId: currentQuestionId
      };
      
      // Add checking message
      setMessages(prev => [...prev, { sender: 'USER', text: 'Checking question...' }]);
      
      try {
        const response = await submitCode(interviewId, codeData);
        const backendResponse = response.data;
        
        // Close coding interface
        setShowCodingInterface(false);
        setCurrentChallenge(null);
        setChallengeId('');
        
        // Show the backend response to user
        if (backendResponse.message || backendResponse.response) {
          const responseMessage = backendResponse.message || backendResponse.response;
          setMessages(prev => [...prev, { sender: 'AI', text: responseMessage }]);
          
          // If it's an interview end message, handle it
          if (responseMessage.includes('INTERVIEW_ENDED') || responseMessage.includes('interview ended')) {
            const feedbackResponse = await generateFeedback(interviewId);
            onInterviewComplete(feedbackResponse.data.feedback);
          } else {
            speakText(responseMessage);
          }
        } else {
          // Fallback response if no specific message
          const fallbackMessage = submission.overallPassed 
            ? "Excellent work! Your solution passed all test cases. Let's continue with the next part of the interview."
            : `Thanks for submitting your solution. You passed ${passedTests} out of ${submission.testResults.length} test cases. Let's continue with the interview.`;
          setMessages(prev => [...prev, { sender: 'AI', text: fallbackMessage }]);
          speakText(fallbackMessage);
        }
        
      } catch (backendError: any) {
        console.error('Backend submission failed:', backendError);
        
        // Handle backend error gracefully
        const errorMessage = backendError.response?.data?.message || 
                           backendError.message || 
                           "I've completed the coding challenge. Let's continue with the interview.";
        
        setMessages(prev => [...prev, { sender: 'AI', text: errorMessage }]);
        
        // Close coding interface
        setShowCodingInterface(false);
        setCurrentChallenge(null);
        setChallengeId('');
        
        // Try to continue the interview
        try {
          const chatResponse = await postChatMessage(interviewId, "I've completed the coding challenge. Let's continue.");
          const aiReply = chatResponse.data.reply;
          setMessages(prev => [...prev, { sender: 'AI', text: aiReply }]);
          speakText(aiReply);
        } catch (chatError) {
          // Final fallback
          const fallbackResponse = "Thank you for completing the coding challenge. Let's move on to the next part of our interview.";
          setMessages(prev => [...prev, { sender: 'AI', text: fallbackResponse }]);
          speakText(fallbackResponse);
        }
      }
      
    } catch (error) {
      console.error('Failed to submit coding challenge:', error);
      
      // Show error and continue
      setMessages(prev => [...prev, { sender: 'AI', text: "I encountered an issue submitting your solution. Let's continue with the interview." }]);
      
      // Close coding interface
      setShowCodingInterface(false);
      setCurrentChallenge(null);
      setChallengeId('');
      
    } finally {
      setIsSubmittingCode(false);
    }
  };

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
        
        // Check if the AI response contains a coding challenge
        const challengeData = detectCodingChallenge(aiReply);
        if (challengeData) {
          setCurrentChallenge(challengeData.challenge);
          setChallengeId(challengeData.challengeId);
          // Set question ID if available in challenge (fallback to prop value)
          if (challengeData.challenge.question_id) {
            setCurrentQuestionId(challengeData.challenge.question_id);
          }
          setShowCodingInterface(true);
        } else {
          speakText(aiReply);
        }
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
    <>
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
        {messages.map((msg, index) => {
          const isLastMessage = index === messages.length - 1;
          const hasCodingChallenge = msg.sender === 'AI' && currentChallenge && !showCodingInterface;
          
          return (
            <div key={index} className={`flex items-start gap-3 max-w-[85%] ${msg.sender === 'USER' ? 'self-end flex-row-reverse' : 'self-start'}`}>
              <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${msg.sender === 'USER' ? 'bg-black text-white' : 'bg-gray-200 text-black'}`}>
                {msg.sender === 'USER' ? <User size={16} /> : <Bot size={16} />}
              </div>
              <div className={`px-4 py-3 rounded-xl ${msg.sender === 'USER' ? 'bg-black text-white' : 'bg-gray-100 text-gray-800'}`}>
                <p className="text-sm leading-relaxed whitespace-pre-wrap">
                  {cleanMessageForDisplay(msg.text)}
                </p>
                {hasCodingChallenge && (
                  <div className="mt-4 pt-4 border-t border-gray-300">
                    <button
                      onClick={handleStartCoding}
                      className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors shadow-md hover:shadow-lg"
                    >
                      <Code className="h-5 w-5" />
                      Start Coding Challenge
                    </button>
                    <p className="text-xs text-gray-600 mt-2">
                      Click to open the coding environment
                    </p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
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

      {/* Coding Challenge Interface */}
      {showCodingInterface && currentChallenge && (
        <CodingChallengeInterface
          challenge={currentChallenge}
          challengeId={challengeId}
          onSubmit={handleCodingSubmission}
          onClose={() => {
            setShowCodingInterface(false);
            setCurrentChallenge(null);
            setChallengeId('');
          }}
          isSubmitting={isSubmittingCode}
        />
      )}
    </>
  );
}