"use client";

import React, { useState, useEffect } from 'react';
import { ArrowRight, Zap, Users, BarChart3, CheckCircle2, Shield, Clock } from 'lucide-react';
import Navbar from './components/Navbar/Navbar';
import { motion } from 'framer-motion';
import MainPageContent from './components/Homepage/Homepage';

export default function HireHackLanding() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <MainPageContent />
    </div>
  );
}