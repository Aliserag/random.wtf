'use client';

import React, { useState } from 'react';
import RandomNumber from './components/RandomNumber';
import RandomList from './components/RandomList';
import YoloRoll from './components/YoloRoll';

export default function Home() {
  const [activeTab, setActiveTab] = useState('number');
  const [showYolo, setShowYolo] = useState(false);

  return (
    <main className="min-h-screen bg-black overflow-x-hidden relative">
      {/* Animated background */}
      <div className="fixed inset-0 bg-black">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-neon-purple/20 via-transparent to-transparent animate-pulse"></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-2 md:px-4 py-8 md:py-12">
        <div className="max-w-4xl mx-auto space-y-6 md:space-y-8">
          {/* Title */}
          <div className="text-center space-y-4">
            <h1 className="font-press-start text-2xl md:text-4xl bg-gradient-to-r from-neon-purple via-neon-pink to-neon-blue bg-clip-text text-transparent px-2">
              Randoms.WTF
            </h1>
            <p className="font-press-start text-neon-blue text-xs md:text-sm px-2">
              True Random Generator powered by Flow VRF
            </p>
          </div>

          {/* Tabs */}
          <div className="flex flex-wrap justify-center gap-2 md:gap-4">
            <button
              onClick={() => setActiveTab('number')}
              className={`relative group ${activeTab === 'number' ? 'scale-105' : ''}`}
            >
              <div className={`absolute -inset-0.5 bg-gradient-to-r from-neon-purple to-neon-blue rounded-xl blur opacity-50 group-hover:opacity-75 transition duration-1000 ${activeTab === 'number' ? 'opacity-100' : ''}`}></div>
              <div className={`relative px-3 py-2 md:px-6 bg-black rounded-xl font-press-start text-xs md:text-sm ${activeTab === 'number' ? 'text-neon-blue' : 'text-white'} group-hover:text-neon-blue transition-all duration-300`}>
                Random Number
              </div>
            </button>
            <button
              onClick={() => setActiveTab('list')}
              className={`relative group ${activeTab === 'list' ? 'scale-105' : ''}`}
            >
              <div className={`absolute -inset-0.5 bg-gradient-to-r from-neon-purple to-neon-blue rounded-xl blur opacity-50 group-hover:opacity-75 transition duration-1000 ${activeTab === 'list' ? 'opacity-100' : ''}`}></div>
              <div className={`relative px-3 py-2 md:px-6 bg-black rounded-xl font-press-start text-xs md:text-sm ${activeTab === 'list' ? 'text-neon-blue' : 'text-white'} group-hover:text-neon-blue transition-all duration-300`}>
                Random List
              </div>
            </button>
            <button
              onClick={() => setShowYolo(true)}
              className="relative group"
            >
              <div className="absolute -inset-0.5 bg-gradient-to-r from-neon-pink to-neon-purple rounded-xl blur opacity-50 group-hover:opacity-75 transition duration-1000"></div>
              <div className="relative px-3 py-2 md:px-6 bg-black rounded-xl font-press-start text-xs md:text-sm text-white group-hover:text-neon-pink transition-all duration-300">
                YOLO
              </div>
            </button>
          </div>

          {/* Content */}
          <div className="bg-black/50 backdrop-blur-sm rounded-xl border border-white/10 p-4 md:p-6">
            {activeTab === 'number' && <RandomNumber />}
            {activeTab === 'list' && <RandomList />}
          </div>
        </div>
      </div>

      {/* YOLO Modal */}
      {showYolo && <YoloRoll onClose={() => setShowYolo(false)} />}
    </main>
  );
} 