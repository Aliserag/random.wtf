'use client';

import React, { useRef, useState, useEffect } from 'react';
import { captureScreenshot } from '../utils/screenshot';

type ResultCardProps = {
  children: React.ReactNode;
  type: 'number' | 'list' | 'yolo';
};

export default function ResultCard({ children, type }: ResultCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [timestamp, setTimestamp] = useState<string>('');
  const [isCopying, setIsCopying] = useState(false);
  
  useEffect(() => {
    // Generate compact timestamp in UTC
    const now = new Date();
    
    // Format as YY/MM/DD HH:MM UTC
    const year = now.getUTCFullYear().toString().slice(2); // Get last 2 digits of year
    const month = (now.getUTCMonth() + 1).toString().padStart(2, '0'); // Months are 0-indexed
    const day = now.getUTCDate().toString().padStart(2, '0');
    
    const hours = now.getUTCHours().toString().padStart(2, '0');
    const minutes = now.getUTCMinutes().toString().padStart(2, '0');
    
    setTimestamp(`${year}/${month}/${day} ${hours}:${minutes} UTC`);
  }, []);
  
  const handleCopy = async () => {
    if (!cardRef.current || isCopying) return;
    
    try {
      setIsCopying(true);
      await captureScreenshot(cardRef.current);
      // Show success state briefly
      setTimeout(() => setIsCopying(false), 1000);
    } catch (error) {
      console.error('Failed to copy:', error);
      setIsCopying(false);
    }
  };
  
  return (
    <div className="relative group">
      <div className="absolute -inset-0.5 bg-gradient-to-r from-neon-purple to-neon-blue rounded-xl blur opacity-75 animate-pulse"></div>
      <div 
        ref={cardRef}
        className="relative text-center space-y-4 bg-black rounded-xl p-8 border border-neon-purple"
      >
        <div className="font-press-start text-sm text-neon-blue">
          {type === 'number' && 'Your Number'}
          {type === 'list' && 'Selected Item'}
          {type === 'yolo' && 'YOLO Result'}
        </div>
        
        {children}
        
        <div className="flex justify-between items-center mt-6 pt-4 border-t border-neon-purple/30">
          <div className="font-press-start text-xs text-neon-purple/70">
            {timestamp}
          </div>
          
          <button 
            onClick={handleCopy} 
            disabled={isCopying}
            className="group relative flex items-center justify-center"
            aria-label="Copy result"
          >
            {isCopying ? (
              <span className="text-neon-green text-xs font-press-start animate-pulse">Copied!</span>
            ) : (
              <svg 
                className="w-5 h-5 text-neon-purple/70 hover:text-neon-blue transition-colors duration-300" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" 
                />
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>
  );
} 