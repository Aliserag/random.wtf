'use client';

import React, { useRef, useState, useEffect } from 'react';
import { captureScreenshot } from '../utils/screenshot';
import html2canvas from 'html2canvas';

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
  const [isIOS, setIsIOS] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  
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
    
    // Check device type
    const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
    const isMobileDevice = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent.toLowerCase());
    setIsMobile(isMobileDevice);
    
    // Specifically detect iOS
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    setIsIOS(isIOSDevice);
  }, []);

  const generateImage = async (): Promise<string | null> => {
    if (!cardRef.current) return null;
    
    try {
      // Add screenshot effect
      cardRef.current.classList.add('screenshot-flash');
      
      // Capture the element as canvas
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: null,
        scale: 2, // Higher quality
        logging: false,
      });
      
      // Get data URL
      const dataUrl = canvas.toDataURL('image/png');
      
      // Remove screenshot effect after a delay
      setTimeout(() => {
        cardRef.current?.classList.remove('screenshot-flash');
      }, 300);
      
      return dataUrl;
    } catch (error) {
      console.error('Error generating image:', error);
      return null;
    }
  };
  
  const handleCopy = async () => {
    if (!cardRef.current || isCopying) return;
    
    try {
      setIsCopying(true);
      setCopyFeedback('');
      
      await captureScreenshot(cardRef.current);
      
      // Show appropriate feedback based on device
      if (isIOS) {
        setCopyFeedback('Downloading...');
      } else if (isMobile) {
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
      setCopyFeedback('Failed');
      setIsCopying(false);
    }
  };

  const handleViewImage = async () => {
    if (isCopying) return;
    
    setIsCopying(true);
    setCopyFeedback('Loading...');
    
    const dataUrl = await generateImage();
    if (dataUrl) {
      setImageUrl(dataUrl);
      setShowImageModal(true);
    } else {
      setCopyFeedback('Failed');
    }
    
    setIsCopying(false);
    setCopyFeedback('');
  };
  
  const closeModal = () => {
    setShowImageModal(false);
    setImageUrl(null);
  };
  
  return (
    <>
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
            
            <div className="flex items-center space-x-3">
              {isIOS && (
                <button 
                  onClick={handleViewImage} 
                  disabled={isCopying}
                  className="group relative flex items-center justify-center"
                  aria-label="View image"
                  title="View image (long-press to copy)"
                >
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
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" 
                    />
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" 
                    />
                  </svg>
                </button>
              )}
              
              <button 
                onClick={handleCopy} 
                disabled={isCopying}
                className="group relative flex items-center justify-center"
                aria-label={isIOS ? "Download image" : isMobile ? "Save result as image" : "Copy result"}
                title={isIOS ? "Download image" : isMobile ? "Save as image" : "Copy to clipboard"}
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
      </div>

      {/* Image View Modal */}
      {showImageModal && imageUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={closeModal}>
          <div className="max-w-full max-h-full overflow-auto" onClick={(e) => e.stopPropagation()}>
            <div className="relative">
              <img 
                src={imageUrl} 
                alt="Result" 
                className="max-w-full shadow-lg border-2 border-neon-purple rounded"
              />
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-black/70 text-center backdrop-blur-sm">
                <p className="text-neon-green text-sm font-press-start">Long-press to save or copy image</p>
              </div>
            </div>
            
            <button 
              onClick={closeModal}
              className="absolute top-4 right-4 p-2 rounded-full bg-black/70 text-white hover:bg-neon-purple/70 transition-colors"
              aria-label="Close modal"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </>
  );
} 