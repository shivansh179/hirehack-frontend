"use client";

import { useState } from 'react';
import LoginForm from '../components/LoginForm';
import SignUpForm from '../components/SignUpForm';
import { motion } from 'framer-motion';
import { User, UserPlus } from 'lucide-react';

export default function AuthPage() {
  const [isLoginView, setIsLoginView] = useState(true);

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center p-4 overflow-hidden bg-white">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-black mb-4 shadow-lg"
          >
            {isLoginView ? (
              <User className="w-10 h-10 text-white" />
            ) : (
              <UserPlus className="w-10 h-10 text-white" />
            )}
          </motion.div>
          <h1 className="text-5xl font-black text-black mb-2">HireHack</h1>
          <p className="text-gray-600 text-sm">AI-Powered Interview Platform</p>
        </div>

        <div className="bg-white shadow-2xl rounded-2xl p-8 space-y-6 border-2 border-gray-200">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-black mb-2">
              {isLoginView ? 'Welcome Back!' : 'Join Us Today'}
            </h2>
            <p className="text-gray-600">
              {isLoginView ? 'Sign in to continue your journey' : 'Create an account to get started'}
            </p>
          </div>
          
          <motion.div
            key={isLoginView ? 'login' : 'signup'}
            initial={{ opacity: 0, x: isLoginView ? -20 : 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            {isLoginView ? <LoginForm /> : <SignUpForm />}
          </motion.div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-600">
                {isLoginView ? "Don't have an account?" : "Already have an account?"}
              </span>
            </div>
          </div>

          <button
            onClick={() => setIsLoginView(!isLoginView)}
            className="w-full py-3 px-4 rounded-lg font-semibold text-white bg-black hover:bg-gray-800 transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            {isLoginView ? 'Create New Account' : 'Sign In Instead'}
          </button>
        </div>

        <p className="text-center text-gray-500 text-xs mt-6">
          Powered by AI • Secure • Professional
        </p>
      </motion.div>
    </div>
  );
}