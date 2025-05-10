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
  const [copyFeedback, setCopyFeedback] = useState('');
  const [isMobile, setIsMobile] = useState(false);
  
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
    
    // Check if user is on mobile
    const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
    const isMobileDevice = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent.toLowerCase());
    setIsMobile(isMobileDevice);
  }, []);
  
  const handleCopy = async () => {
    if (!cardRef.current || isCopying) return;
    
    try {
      setIsCopying(true);
      setCopyFeedback('');
      
      await captureScreenshot(cardRef.current);
      
      // Show appropriate feedback based on device
      if (isMobile) {
        setCopyFeedback('Image saved!');
      } else {
        setCopyFeedback('Copied!');
      }
      
      // Reset state after delay
      setTimeout(() => {
        setIsCopying(false);
        setTimeout(() => setCopyFeedback(''), 500);
      }, 1500);
    } catch (error) {
      console.error('Failed to copy:', error);
      setCopyFeedback('Failed to copy');
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
            aria-label={isMobile ? "Save result as image" : "Copy result"}
            title={isMobile ? "Save as image" : "Copy to clipboard"}
          >
            {copyFeedback ? (
              <span className="text-neon-green text-xs font-press-start animate-pulse">{copyFeedback}</span>
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
                  d={isMobile 
                    ? "M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" // Download icon for mobile
                    : "M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" // Copy icon for desktop
                  } 
                />
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>
  );
} 