"use client";

import React, { useState, useEffect } from 'react';
import { ArrowRight, Zap, Users, BarChart3, CheckCircle2, Shield, Clock } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import Link from 'next/link';

// Navbar Component
function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const { isDarkMode } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${
      scrolled
        ? isDarkMode
          ? 'bg-black/80 backdrop-blur-sm border-b border-gray-800'
          : 'bg-white/80 backdrop-blur-sm border-b border-gray-200'
        : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className={`text-2xl font-semibold ${isDarkMode ? 'text-white' : 'text-black'}`}>
            HireHack
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className={`transition-colors font-medium ${
              isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-black'
            }`}>Features</a>
            <a href="#process" className={`transition-colors font-medium ${
              isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-black'
            }`}>Process</a>
            <a href="#benefits" className={`transition-colors font-medium ${
              isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-black'
            }`}>Benefits</a>
            <Link
              href="/dashboard"
              className={`px-6 py-2.5 rounded-lg font-medium transition-all duration-200 ${
                isDarkMode
                  ? 'bg-white text-black hover:bg-gray-200'
                  : 'bg-black text-white hover:bg-gray-800'
              }`}
            >
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;