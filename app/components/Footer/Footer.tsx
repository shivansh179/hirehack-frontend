"use client";

import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

function Footer() {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <footer className={`border-t transition-colors duration-300 ${
      isDarkMode
        ? 'bg-black border-gray-800'
        : 'bg-white border-gray-200'
    }`}>
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-2">
            <h3 className={`text-2xl font-bold mb-4 ${
              isDarkMode ? 'text-white' : 'text-black'
            }`}>
              HireHack
            </h3>
            <p className={`mb-4 ${
              isDarkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Practice your interviews with a personalized AI interviewer. Get real-time feedback and improve your skills.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className={`font-semibold mb-4 ${
              isDarkMode ? 'text-white' : 'text-black'
            }`}>
              Quick Links
            </h4>
            <ul className="space-y-2">
              <li>
                <a href="#features" className={`transition-colors ${
                  isDarkMode
                    ? 'text-gray-400 hover:text-white'
                    : 'text-gray-600 hover:text-black'
                }`}>
                  Features
                </a>
              </li>
              <li>
                <a href="#process" className={`transition-colors ${
                  isDarkMode
                    ? 'text-gray-400 hover:text-white'
                    : 'text-gray-600 hover:text-black'
                }`}>
                  Process
                </a>
              </li>
              <li>
                <a href="#benefits" className={`transition-colors ${
                  isDarkMode
                    ? 'text-gray-400 hover:text-white'
                    : 'text-gray-600 hover:text-black'
                }`}>
                  Benefits
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className={`font-semibold mb-4 ${
              isDarkMode ? 'text-white' : 'text-black'
            }`}>
              Contact
            </h4>
            <ul className="space-y-2">
              <li>
                <a href="mailto:support@hirehack.com" className={`transition-colors ${
                  isDarkMode
                    ? 'text-gray-400 hover:text-white'
                    : 'text-gray-600 hover:text-black'
                }`}>
                  support@hirehack.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section with Theme Toggle */}
        <div className={`pt-8 border-t flex flex-col md:flex-row justify-between items-center gap-4 ${
          isDarkMode ? 'border-gray-800' : 'border-gray-200'
        }`}>
          <p className={`text-sm ${
            isDarkMode ? 'text-gray-400' : 'text-gray-600'
          }`}>
            © {new Date().getFullYear()} HireHack. All rights reserved.
          </p>

          <div className="flex items-center gap-4">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                isDarkMode
                  ? 'bg-gray-900 hover:bg-gray-800 text-gray-300'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
              title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {isDarkMode ? (
                <>
                  <Sun className="h-4 w-4" />
                  <span className="text-sm font-medium">Light</span>
                </>
              ) : (
                <>
                  <Moon className="h-4 w-4" />
                  <span className="text-sm font-medium">Dark</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;