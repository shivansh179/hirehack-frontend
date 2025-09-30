"use client";

import { useState } from 'react';
import LoginForm from '../components/LoginForm';
import SignUpForm from '../components/SignUpForm';
import { motion } from 'framer-motion';
import { SparklesIcon, RocketLaunchIcon } from '@heroicons/react/24/solid';

export default function AuthPage() {
  const [isLoginView, setIsLoginView] = useState(true);

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center p-4 overflow-hidden">
      {/* Animated background orbs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/30 rounded-full filter blur-3xl animate-float"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-pink-500/30 rounded-full filter blur-3xl animate-float" style={{animationDelay: '1s'}}></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-indigo-500/20 rounded-full filter blur-3xl animate-float" style={{animationDelay: '2s'}}></div>

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        {/* Logo/Brand Section */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="inline-flex items-center justify-center w-20 h-20 rounded-full gradient-bg mb-4 shadow-lg"
          >
            {isLoginView ? (
              <RocketLaunchIcon className="w-10 h-10 text-white" />
            ) : (
              <SparklesIcon className="w-10 h-10 text-white" />
            )}
          </motion.div>
          <h1 className="text-5xl font-black gradient-text mb-2">HireHack</h1>
          <p className="text-gray-400 text-sm">AI-Powered Interview Platform</p>
        </div>

        <div className="glass-pane card-glow shadow-2xl rounded-2xl p-8 space-y-6 border-2 border-purple-500/20">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white mb-2">
              {isLoginView ? 'Welcome Back!' : 'Join Us Today'}
            </h2>
            <p className="text-gray-400">
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
              <div className="w-full border-t border-gray-600"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-slate-800 text-gray-400">
                {isLoginView ? "Don't have an account?" : "Already have an account?"}
              </span>
            </div>
          </div>

          <button
            onClick={() => setIsLoginView(!isLoginView)}
            className="w-full py-3 px-4 rounded-lg font-semibold text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-purple-500/50"
          >
            {isLoginView ? '✨ Create New Account' : '🚀 Sign In Instead'}
          </button>
        </div>

        {/* Footer */}
        <p className="text-center text-gray-500 text-xs mt-6">
          Powered by AI • Secure • Professional
        </p>
      </motion.div>
    </div>
  );
}