'use client';

import React, { useState } from 'react';
import { getRandomNumber } from '../utils/contracts';

export default function YoloRoll({ onClose }: { onClose: () => void }) {
  const [rolling, setRolling] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const roll = async () => {
    try {
      setRolling(true);
      setError(null);
      // Get a random number between 1 and 100
      const randomNum = await getRandomNumber(1, 100);
      // Simulate dice rolling animation
      await new Promise(resolve => setTimeout(resolve, 2000));
      setResult(randomNum <= 50 ? 'NO WAY!' : 'YOLO!');
    } catch (error) {
      console.error('Error rolling dice:', error);
      setError(error instanceof Error ? error.message : 'Failed to roll');
    } finally {
      setRolling(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="relative">
        <div className="absolute -inset-1 bg-gradient-to-r from-neon-purple via-neon-pink to-neon-blue rounded-2xl blur opacity-75 animate-pulse"></div>
        <div className="relative bg-black rounded-xl p-8 max-w-sm w-full space-y-6">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="text-center space-y-4">
            <h3 className="font-press-start text-xl text-neon-blue">Should you do it?</h3>
            <div className="h-32 flex items-center justify-center">
              {rolling ? (
                <div className="animate-bounce">
                  <svg className="w-16 h-16 animate-spin text-neon-pink" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M4 2v20h16V2H4zm2 2h12v16H6V4zm2 2v12h8V6H8zm2 2h4v8h-4V8z"/>
                  </svg>
                </div>
              ) : result ? (
                <div className={`font-press-start text-2xl ${result === 'YOLO!' ? 'text-neon-green animate-bounce' : 'text-neon-pink animate-shake'}`}>
                  {result}
                </div>
              ) : (
                <div className="font-press-start text-sm text-neon-purple">
                  Roll the dice of destiny...
                </div>
              )}
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-3 text-red-400 text-xs font-press-start">
                {error}
              </div>
            )}

            <button
              onClick={roll}
              disabled={rolling}
              className="relative group w-full"
            >
              <div className="absolute -inset-0.5 bg-gradient-to-r from-neon-purple via-neon-pink to-neon-blue rounded-xl blur opacity-50 group-hover:opacity-75 transition duration-1000 group-disabled:opacity-25"></div>
              <div className="relative px-6 py-3 bg-black rounded-xl flex items-center justify-center gap-2 font-press-start text-sm text-white group-hover:text-neon-blue transition-all duration-300">
                {rolling ? 'Rolling...' : 'Roll'}
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 