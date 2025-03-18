'use client';

import { useState } from 'react';
import RandomNumber from './components/RandomNumber';
import RandomList from './components/RandomList';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'number' | 'list'>('number');

  return (
    <main className="min-h-screen bg-black text-white overflow-x-hidden">
      {/* Animated background */}
      <div className="fixed inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#9d00ff_0%,rgba(0,0,0,0)_50%)] opacity-30"></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ff00ff,#00ffff)] opacity-10"></div>
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
      </div>

      <div className="relative min-h-screen flex flex-col justify-center items-center px-4 py-16">
        <div className="w-full max-w-4xl mx-auto">
          <div className="text-center mb-16 animate-float">
            <h1 className="font-press-start text-5xl md:text-6xl mb-8 animate-glow text-neon-blue">
              Randoms.WTF
            </h1>
            <p className="font-press-start text-sm md:text-base text-neon-green max-w-2xl mx-auto leading-relaxed">
              True Random Generator
            </p>
          </div>

          <div className="backdrop-blur-xl bg-black/30 rounded-3xl p-8 md:p-12 shadow-[0_0_50px_0_rgba(157,0,255,0.3)] border border-neon-purple/20">
            <div className="flex justify-center mb-12">
              <div className="inline-flex rounded-2xl bg-black/50 p-2 backdrop-blur-lg border border-neon-purple/20">
                <button
                  className={`px-6 py-4 rounded-xl transition-all duration-300 font-press-start text-sm ${
                    activeTab === 'number'
                      ? 'bg-neon-purple text-white shadow-[0_0_20px_0_rgba(157,0,255,0.5)]'
                      : 'text-neon-blue hover:text-neon-pink hover:bg-black/30'
                  }`}
                  onClick={() => setActiveTab('number')}
                >
                  <span className="flex items-center gap-3">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                    Number
                  </span>
                </button>
                <button
                  className={`px-6 py-4 rounded-xl transition-all duration-300 font-press-start text-sm ${
                    activeTab === 'list'
                      ? 'bg-neon-purple text-white shadow-[0_0_20px_0_rgba(157,0,255,0.5)]'
                      : 'text-neon-blue hover:text-neon-pink hover:bg-black/30'
                  }`}
                  onClick={() => setActiveTab('list')}
                >
                  <span className="flex items-center gap-3">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                    </svg>
                    List
                  </span>
                </button>
              </div>
            </div>

            <div className="transition-all duration-500">
              {activeTab === 'number' ? <RandomNumber /> : <RandomList />}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
} 