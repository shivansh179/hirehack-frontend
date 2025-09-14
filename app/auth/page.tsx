"use client";

import { useState } from 'react';
import LoginForm from '../components/LoginForm';
import SignUpForm from '../components/SignUpForm';
import { motion } from 'framer-motion';

export default function AuthPage() {
  const [isLoginView, setIsLoginView] = useState(true);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-dark-bg p-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="glass-pane shadow-2xl rounded-xl p-8 space-y-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-white">Welcome</h1>
            <p className="text-gray-400">
              {isLoginView ? 'Sign in to continue your journey' : 'Create an account to get started'}
            </p>
          </div>
          
          {isLoginView ? <LoginForm /> : <SignUpForm />}

          <div className="text-center text-sm text-gray-400">
            {isLoginView ? "Don't have an account?" : "Already have an account?"}
            <button
              onClick={() => setIsLoginView(!isLoginView)}
              className="ml-1 font-semibold text-primary hover:text-indigo-400"
            >
              {isLoginView ? 'Sign Up' : 'Sign In'}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}