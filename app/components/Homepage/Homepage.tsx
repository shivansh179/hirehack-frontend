"use client";

import React from 'react';
import { ArrowRight, Zap, Users, BarChart3, CheckCircle2, Shield, Clock } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import AnimatedBackground from '../AnimatedBackground/AnimatedBackground';

function MainPageContent() {
  const { isDarkMode } = useTheme();

  return (
    <div className={isDarkMode ? 'dark' : ''}>
      <div className={`relative overflow-hidden transition-colors duration-300 ${isDarkMode ? 'bg-black text-white' : 'bg-white text-black'}`}>
        <AnimatedBackground />
        
        <main className="relative z-10">
          <section className="pt-40 pb-24 px-6">
            <div className="max-w-7xl mx-auto">
              <div className="max-w-3xl">
                <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-8 ${isDarkMode ? 'bg-gray-800/70 backdrop-blur-sm' : 'bg-slate-100/70 backdrop-blur-sm'}`}>
                  <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                  <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-slate-700'}`}>Trusted by ambitious learners</span>
                </div>

                <h1 className="text-5xl md:text-6xl font-semibold mb-6 leading-tight">
                  Prepare smarter, ace your interviews
                </h1>

                <p className={`text-xl mb-10 leading-relaxed ${isDarkMode ? 'text-gray-400' : 'text-slate-600'}`}>
                  Practice effectively, track your progress, and improve your skills with guided exercises and AI-powered feedback.
                </p>

                <div className="flex flex-col sm:flex-row gap-4">
                  <a
                    href="http://localhost:3000/dashboard"
                    className={`inline-flex items-center justify-center gap-2 px-8 py-4 rounded-lg font-medium transition-all duration-200 ${
                      isDarkMode ? 'bg-white text-black hover:bg-gray-200' : 'bg-slate-900 text-white hover:bg-slate-800'
                    }`}
                  >
                    Start practicing today
                    <ArrowRight className="w-5 h-5" />
                  </a>
                  <button className={`px-8 py-4 rounded-lg font-medium border-2 transition-all duration-200 ${
                    isDarkMode ? 'bg-transparent text-white border-gray-700 hover:bg-white hover:text-black' : 'bg-white text-slate-900 border-slate-200 hover:border-slate-300'
                  }`}>
                    View demo
                  </button>
                </div>

                <div className={`grid grid-cols-3 gap-8 mt-20 pt-12 border-t ${isDarkMode ? 'border-gray-800' : 'border-slate-200'}`}>
                  <div>
                    <div className="text-3xl font-semibold">90%</div>
                    <div className={`text-sm mt-1 ${isDarkMode ? 'text-gray-400' : 'text-slate-600'}`}>Skill improvement</div>
                  </div>
                  <div>
                    <div className="text-3xl font-semibold">10K+</div>
                    <div className={`text-sm mt-1 ${isDarkMode ? 'text-gray-400' : 'text-slate-600'}`}>Users prepared</div>
                  </div>
                  <div>
                    <div className="text-3xl font-semibold">500+</div>
                    <div className={`text-sm mt-1 ${isDarkMode ? 'text-gray-400' : 'text-slate-600'}`}>Mock interviews</div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section id="features" className={`py-24 px-6 ${isDarkMode ? 'bg-black' : 'bg-slate-50'}`}>
            <div className="max-w-7xl mx-auto">
              <div className="max-w-2xl mb-16">
                <h2 className="text-4xl font-semibold mb-4">
                  Tools to boost your interview readiness
                </h2>
                <p className={`text-lg ${isDarkMode ? 'text-gray-400' : 'text-slate-600'}`}>
                  Everything you need to practice, analyze, and improve your performance
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                <div className={`p-8 rounded-xl border ${isDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-slate-200'}`}>
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-6 ${isDarkMode ? 'bg-white' : 'bg-slate-900'}`}>
                    <Zap className={`w-6 h-6 ${isDarkMode ? 'text-black' : 'text-white'}`} />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">AI Practice</h3>
                  <p className={`${isDarkMode ? 'text-gray-400' : 'text-slate-600'} leading-relaxed`}>
                    Get personalized questions and feedback to improve your skills efficiently.
                  </p>
                </div>

                <div className={`p-8 rounded-xl border ${isDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-slate-200'}`}>
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-6 ${isDarkMode ? 'bg-white' : 'bg-slate-900'}`}>
                    <Users className={`w-6 h-6 ${isDarkMode ? 'text-black' : 'text-white'}`} />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">Peer Collaboration</h3>
                  <p className={`${isDarkMode ? 'text-gray-400' : 'text-slate-600'} leading-relaxed`}>
                    Practice with friends, share feedback, and learn together to enhance your preparation.
                  </p>
                </div>

                <div className={`p-8 rounded-xl border ${isDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-slate-200'}`}>
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-6 ${isDarkMode ? 'bg-white' : 'bg-slate-900'}`}>
                    <BarChart3 className={`w-6 h-6 ${isDarkMode ? 'text-black' : 'text-white'}`} />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">Progress Tracking</h3>
                  <p className={`${isDarkMode ? 'text-gray-400' : 'text-slate-600'} leading-relaxed`}>
                    Track your performance over time and identify areas for improvement.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section id="process" className="py-24 px-6">
            <div className="max-w-7xl mx-auto">
              <div className="max-w-2xl mx-auto text-center mb-16">
                <h2 className="text-4xl font-semibold mb-4">
                  Simple, structured preparation
                </h2>
                <p className={`text-lg ${isDarkMode ? 'text-gray-400' : 'text-slate-600'}`}>
                  Follow a clear process and track your progress step by step
                </p>
              </div>

              <div className="grid md:grid-cols-4 gap-8">
                {[
                  { num: '1', title: 'Set your goals', desc: 'Identify the skills you want to improve' },
                  { num: '2', title: 'Practice questions', desc: 'Attempt AI-generated and curated questions' },
                  { num: '3', title: 'Get feedback', desc: 'Analyze your answers and improve' },
                  { num: '4', title: 'Track progress', desc: 'Measure improvement and stay on track' }
                ].map((item) => (
                  <div key={item.num} className="relative">
                    <div className={`text-5xl font-semibold mb-4 ${isDarkMode ? 'text-gray-200' : 'text-slate-800'}`}>{item.num}</div>
                    <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                    <p className={`${isDarkMode ? 'text-gray-400' : 'text-slate-600'}`}>{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section id="benefits" className={`py-24 px-6 ${isDarkMode ? 'bg-black' : 'bg-slate-50'}`}>
            <div className="max-w-7xl mx-auto">
              <div className="grid md:grid-cols-2 gap-16 items-center">
                <div>
                  <h2 className="text-4xl font-semibold mb-6">
                    Why learners choose PrepMaster
                  </h2>
                  <p className={`text-lg mb-8 ${isDarkMode ? 'text-gray-400' : 'text-slate-600'}`}>
                    Join thousands of candidates who have improved their interview skills.
                  </p>

                  <div className="space-y-4">
                    {[
                      { icon: Clock, text: 'Reduce preparation time with focused practice' },
                      { icon: Shield, text: 'Prepare consistently with guided exercises' },
                      { icon: CheckCircle2, text: 'Boost confidence and performance' }
                    ].map((item, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <div className={`w-6 h-6 rounded flex items-center justify-center flex-shrink-0 mt-0.5 ${isDarkMode ? 'bg-white' : 'bg-slate-900'}`}>
                          <item.icon className={`w-4 h-4 ${isDarkMode ? 'text-black' : 'text-white'}`} />
                        </div>
                        <span className={`font-medium ${isDarkMode ? 'text-gray-300' : 'text-slate-700'}`}>{item.text}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className={`p-8 rounded-xl border ${isDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-slate-200'}`}>
                  <div className="space-y-6">
                    <div className={`border-b pb-6 ${isDarkMode ? 'border-gray-800' : 'border-slate-200'}`}>
                      <div className={`text-sm mb-2 ${isDarkMode ? 'text-gray-400' : 'text-slate-600'}`}>Average time saved per skill</div>
                      <div className="text-4xl font-semibold">10 hours</div>
                    </div>
                    <div className={`border-b pb-6 ${isDarkMode ? 'border-gray-800' : 'border-slate-200'}`}>
                      <div className={`text-sm mb-2 ${isDarkMode ? 'text-gray-400' : 'text-slate-600'}`}>Learner satisfaction</div>
                      <div className="text-4xl font-semibold">4.9/5</div>
                    </div>
                    <div>
                      <div className={`text-sm mb-2 ${isDarkMode ? 'text-gray-400' : 'text-slate-600'}`}>Mock interviews completed</div>
                      <div className="text-4xl font-semibold">5,000+</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="py-24 px-6">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-4xl font-semibold mb-4">
                Ready to ace your next interview?
              </h2>
              <p className={`text-lg mb-8 ${isDarkMode ? 'text-gray-400' : 'text-slate-600'}`}>
                Start practicing today and boost your confidence. No credit card required.
              </p>
              <a
                href="https://localhost:3000/dashboard"
                className={`inline-flex items-center gap-2 px-8 py-4 rounded-lg font-medium transition-all duration-200 ${
                  isDarkMode ? 'bg-white text-black hover:bg-gray-200' : 'bg-slate-900 text-white hover:bg-slate-800'
                }`}
              >
                Get started free
                <ArrowRight className="w-5 h-5" />
              </a>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

export default MainPageContent;