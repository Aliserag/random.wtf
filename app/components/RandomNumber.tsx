'use client';

import { useState } from 'react';
import { getRandomNumber } from '../utils/contracts';
import { RANDOMNESS_CONTRACT_ADDRESS } from '../config/contracts';
import ResultCard from './ResultCard';

export default function RandomNumber() {
  const [min, setMin] = useState<number>(1);
  const [max, setMax] = useState<number>(100);
  const [result, setResult] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showInfo, setShowInfo] = useState(false);

  const generateRandom = async () => {
    if (min >= max) {
      setError('Maximum must be greater than minimum');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const randomNumber = await getRandomNumber(min, max);
      setResult(randomNumber);
    } catch (error) {
      console.error('Error generating random number:', error);
      setError(error instanceof Error ? error.message : 'Failed to generate random number');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-3">
          <label className="block font-press-start text-xs text-neon-blue">
            Minimum
          </label>
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-neon-pink to-neon-blue rounded-xl blur opacity-30 group-hover:opacity-50 transition duration-1000"></div>
            <div className="relative">
              <input
                type="number"
                value={min}
                onChange={(e) => setMin(Number(e.target.value))}
                className="w-full px-4 py-4 bg-black/50 rounded-xl border border-neon-purple/20 focus:border-neon-blue focus:ring-2 focus:ring-neon-blue/50 focus:outline-none text-neon-green font-press-start text-sm transition-all duration-300"
                placeholder="1"
              />
            </div>
          </div>
        </div>
        <div className="space-y-3">
          <label className="block font-press-start text-xs text-neon-blue">
            Maximum
          </label>
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-neon-blue to-neon-pink rounded-xl blur opacity-30 group-hover:opacity-50 transition duration-1000"></div>
            <div className="relative">
              <input
                type="number"
                value={max}
                onChange={(e) => setMax(Number(e.target.value))}
                className="w-full px-4 py-4 bg-black/50 rounded-xl border border-neon-purple/20 focus:border-neon-blue focus:ring-2 focus:ring-neon-blue/50 focus:outline-none text-neon-green font-press-start text-sm transition-all duration-300"
                placeholder="100"
              />
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={generateRandom}
        disabled={loading}
        className="relative w-full group"
      >
        <div className="absolute -inset-0.5 bg-gradient-to-r from-neon-purple via-neon-pink to-neon-blue rounded-xl blur opacity-50 group-hover:opacity-75 transition duration-1000 group-disabled:opacity-25 animate-gradient"></div>
        <div className="relative px-6 py-4 bg-black rounded-xl flex items-center justify-center gap-3 font-press-start text-sm text-white group-hover:text-neon-blue transition-all duration-300 group-disabled:cursor-not-allowed">
          {loading ? (
            <>
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <span>Waiting for next block...</span>
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
              <span>Roll Random Number</span>
            </>
          )}
        </div>
      </button>

      {error && (
        <div className="bg-red-500/10 border-2 border-red-500/50 rounded-xl p-6 text-red-400 text-center font-press-start text-sm animate-pulse">
          {error}
        </div>
      )}

      {result !== null && !error && (
        <ResultCard type="number">
          <div className="font-press-start text-5xl md:text-6xl text-neon-green animate-glow">
            {result}
          </div>
        </ResultCard>
      )}

      <div className="relative group cursor-pointer" onClick={() => setShowInfo(!showInfo)}>
        <div className="absolute -inset-0.5 bg-gradient-to-r from-neon-purple to-neon-blue rounded-xl blur opacity-30 group-hover:opacity-50 transition duration-1000"></div>
        <div className="relative bg-black/50 rounded-xl p-6 border border-neon-purple/20">
          <div className="flex items-center justify-between">
            <h3 className="font-press-start text-sm text-neon-blue">How it works</h3>
            <svg className={`w-5 h-5 text-neon-pink transform transition-transform duration-300 ${showInfo ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
          
          {showInfo && (
            <div className="mt-4 space-y-4 text-sm">
              <p className="text-neon-green">
                This random number generator uses Flow's Verifiable Random Function (VRF) to produce true random numbers that are:
              </p>
              <ul className="list-disc list-inside space-y-2 text-white">
                <li>Verifiably random and tamper-proof</li>
                <li>Generated on-chain for maximum transparency</li>
                <li>Secured by Flow's consensus mechanism</li>
              </ul>
              <div className="pt-4 space-y-2">
                <p className="text-neon-pink">Contract Address:</p>
                <a 
                  href={`https://evm-testnet.flowscan.io/address/${RANDOMNESS_CONTRACT_ADDRESS}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-neon-blue break-all hover:text-neon-green transition-colors duration-300"
                >
                  {RANDOMNESS_CONTRACT_ADDRESS}
                </a>
              </div>
              <div className="pt-4">
                <a 
                  href="https://developers.flow.com/evm/guides/vrf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-neon-purple hover:text-neon-pink transition-colors duration-300"
                >
                  Learn more about Flow VRF →
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 