import React from 'react';
import { ArrowRight, Zap, Users, BarChart3, CheckCircle2, Shield, Clock } from 'lucide-react';

function MainPageContent() {
  return (
    <>
      {/* Hero Section */}
      <section className="pt-40 pb-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-full mb-8">
              <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
              <span className="text-sm text-slate-700 font-medium">Trusted by ambitious learners</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-semibold text-slate-900 mb-6 leading-tight">
              Prepare smarter, ace your interviews
            </h1>
            
            <p className="text-xl text-slate-600 mb-10 leading-relaxed">
              Practice effectively, track your progress, and improve your skills with guided exercises and AI-powered feedback.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <a 
                href="http://localhost:3000/dashboard"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800 transition-all duration-200"
              >
                Start practicing today
                <ArrowRight className="w-5 h-5" />
              </a>
              <button className="px-8 py-4 bg-white text-slate-900 border-2 border-slate-200 rounded-lg font-medium hover:border-slate-300 transition-all duration-200">
                View demo
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 mt-20 pt-12 border-t border-slate-200">
              <div>
                <div className="text-3xl font-semibold text-slate-900">90%</div>
                <div className="text-sm text-slate-600 mt-1">Skill improvement</div>
              </div>
              <div>
                <div className="text-3xl font-semibold text-slate-900">10K+</div>
                <div className="text-sm text-slate-600 mt-1">Users prepared</div>
              </div>
              <div>
                <div className="text-3xl font-semibold text-slate-900">500+</div>
                <div className="text-sm text-slate-600 mt-1">Mock interviews</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-6 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-2xl mb-16">
            <h2 className="text-4xl font-semibold text-slate-900 mb-4">
              Tools to boost your interview readiness
            </h2>
            <p className="text-lg text-slate-600">
              Everything you need to practice, analyze, and improve your performance
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl border border-slate-200">
              <div className="w-12 h-12 bg-slate-900 rounded-lg flex items-center justify-center mb-6">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">AI Practice</h3>
              <p className="text-slate-600 leading-relaxed">
                Get personalized questions and feedback to improve your skills efficiently.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl border border-slate-200">
              <div className="w-12 h-12 bg-slate-900 rounded-lg flex items-center justify-center mb-6">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">Peer Collaboration</h3>
              <p className="text-slate-600 leading-relaxed">
                Practice with friends, share feedback, and learn together to enhance your preparation.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl border border-slate-200">
              <div className="w-12 h-12 bg-slate-900 rounded-lg flex items-center justify-center mb-6">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">Progress Tracking</h3>
              <p className="text-slate-600 leading-relaxed">
                Track your performance over time and identify areas for improvement with detailed analytics.
              </p>
            </div>
            <p className='text-black ml-10'  >View more <a href="#features" className='text-blue-500'>features </a></p>
          </div>
          
        </div>
        
      </section>

      {/* Process Section */}
      <section id="process" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-2xl mx-auto text-center mb-16">
            <h2 className="text-4xl font-semibold text-slate-900 mb-4">
              Simple, structured preparation
            </h2>
            <p className="text-lg text-slate-600">
              Follow a clear process and track your progress step by step
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              { num: '1', title: 'Set your goals', desc: 'Identify the skills you want to improve' },
              { num: '2', title: 'Practice questions', desc: 'Attempt AI-generated and curated questions' },
              { num: '3', title: 'Get feedback', desc: 'Analyze your answers and improve' },
              { num: '4', title: 'Track progress', desc: 'Measure improvement and stay on track' }
            ].map((item, i) => (
              <div key={i} className="relative">
                <div className="text-5xl font-semibold text-slate-200 mb-4">{item.num}</div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">{item.title}</h3>
                <p className="text-slate-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="py-24 px-6 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-semibold text-slate-900 mb-6">
                Why learners choose PrepMaster
              </h2>
              <p className="text-lg text-slate-600 mb-8">
                Join thousands of candidates who have improved their interview skills and confidence.
              </p>
              
              <div className="space-y-4">
                {[
                  { icon: Clock, text: 'Reduce preparation time with focused practice' },
                  { icon: Shield, text: 'Prepare consistently with guided exercises' },
                  { icon: CheckCircle2, text: 'Boost confidence and performance' }
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-slate-900 rounded flex items-center justify-center flex-shrink-0 mt-0.5">
                      <item.icon className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-slate-700 font-medium">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white p-8 rounded-xl border border-slate-200">
              <div className="space-y-6">
                <div className="border-b border-slate-200 pb-6">
                  <div className="text-sm text-slate-600 mb-2">Average time saved per skill</div>
                  <div className="text-4xl font-semibold text-slate-900">10 hours</div>
                </div>
                <div className="border-b border-slate-200 pb-6">
                  <div className="text-sm text-slate-600 mb-2">Learner satisfaction</div>
                  <div className="text-4xl font-semibold text-slate-900">4.9/5</div>
                </div>
                <div>
                  <div className="text-sm text-slate-600 mb-2">Mock interviews completed</div>
                  <div className="text-4xl font-semibold text-slate-900">5,000+</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-semibold text-slate-900 mb-4">
            Ready to ace your next interview?
          </h2>
          <p className="text-lg text-slate-600 mb-8">
            Start practicing today and boost your confidence. No credit card required.
          </p>
          <a 
            href="https://localhost:3000/dashboard"
            className="inline-flex items-center gap-2 px-8 py-4 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800 transition-all duration-200"
          >
            Get started free
            <ArrowRight className="w-5 h-5" />
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-xl font-semibold text-slate-900">PrepMaster</div>
            <div className="flex gap-8">
              <a href="#" className="text-slate-600 hover:text-slate-900 transition-colors text-sm">Privacy</a>
              <a href="#" className="text-slate-600 hover:text-slate-900 transition-colors text-sm">Terms</a>
              <a href="#" className="text-slate-600 hover:text-slate-900 transition-colors text-sm">Contact</a>
            </div>
            <div className="text-sm text-slate-600">© 2025 PrepMaster. All rights reserved.</div>
          </div>
        </div>
      </footer>
    </>
  );
}

export default MainPageContent;
