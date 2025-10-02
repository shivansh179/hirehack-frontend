import React, { useState, useEffect } from 'react';
import { ArrowRight, Zap, Users, BarChart3, CheckCircle2, Shield, Clock } from 'lucide-react';

// Navbar Component
function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white/95 backdrop-blur-sm shadow-sm' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="text-2xl font-semibold text-slate-900">
            HireHack
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-slate-600 hover:text-slate-900 transition-colors font-medium">Features</a>
            <a href="#process" className="text-slate-600 hover:text-slate-900 transition-colors font-medium">Process</a>
            <a href="#benefits" className="text-slate-600 hover:text-slate-900 transition-colors font-medium">Benefits</a>
            <a 
              href="http://localhost:3000/dashboard" 
              className="px-6 py-2.5 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800 transition-all duration-200"
            >
              Get Started
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;