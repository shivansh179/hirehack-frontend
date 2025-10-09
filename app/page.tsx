"use client";

import React, { useState, useEffect } from 'react';
import { ArrowRight, Zap, Users, BarChart3, CheckCircle2, Shield, Clock } from 'lucide-react';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import { motion } from 'framer-motion';
import MainPageContent from './components/Homepage/Homepage';
import { useTheme } from './contexts/ThemeContext';

export default function HireHackLanding() {
  const { isDarkMode } = useTheme();
  
  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'bg-black' : 'bg-white'}`}>
      <Navbar />
      <MainPageContent />
      <Footer />
    </div>
  );
}