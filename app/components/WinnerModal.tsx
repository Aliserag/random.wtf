'use client';

import React, { useEffect, useState } from 'react';

const funnyPhrases = [
  "You just won 1000 $PEPE tokens! (Worth exactly nothing)",
  "Congrats! You're officially a degen hero!",
  "DAO proposal passed: You're awesome!",
  "Your NFT just got rugged, but in a good way!",
  "vitalik.eth just followed you on Twitter!",
  "Your bags are no longer rekt!",
  "Here's your imaginary lambo keys 🔑",
  "You're going to make it (WAGMI)!",
  "Diamond hands certified 💎👐",
  "You just minted a rare W!",
  "GM! You just won the crypto lottery!",
  "Someone actually bought your NFT art!",
  "You've been airdropped success!",
  "You're in the whitelist for life!",
  "APY: infinite% on your next move"
];

const emojis = ["🚀", "💎", "🔥", "🌙", "🦍", "🦄", "🧠", "🤑", "🎮", "👾", "🎰", "🎯", "🎁", "✨", "🔮"];

export default function WinnerModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [funnyPhrase, setFunnyPhrase] = useState('');
  const [emoji, setEmoji] = useState('');

  useEffect(() => {
    if (isOpen) {
      // Pick random funny phrase and emoji when modal opens
      setFunnyPhrase(funnyPhrases[Math.floor(Math.random() * funnyPhrases.length)]);
      setEmoji(emojis[Math.floor(Math.random() * emojis.length)]);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 opacity-50"
        style={{
          background: 'repeating-linear-gradient(45deg, #9d00ff20, #9d00ff20 10px, #ff00ff20 10px, #ff00ff20 20px)',
          animation: 'slide 20s linear infinite',
          backgroundSize: '200% 200%',
        }}
      />

      <div className="absolute inset-0" 
        style={{ 
          backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'100\' height=\'100\' viewBox=\'0 0 100 100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z\' fill=\'%23ffffff10\' fill-opacity=\'1\' fill-rule=\'evenodd\'/%3E%3C/svg%3E")',
          backgroundAttachment: 'fixed',
        }}
      />

      <div className="relative max-w-md w-full">
        <div className="absolute -inset-1 bg-gradient-to-r from-neon-purple via-neon-pink to-neon-blue rounded-2xl blur opacity-75 animate-pulse"></div>
        <div className="relative overflow-hidden border-2 border-neon-purple rounded-xl bg-black p-6">
          {/* 8-bit style header line */}
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-neon-purple via-neon-pink to-neon-blue"></div>
          
          {/* Close button */}
          <button 
            onClick={onClose}
            className="absolute top-3 right-3 text-white/70 hover:text-white z-10"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="py-8 px-4 text-center">
            <div className="animate-bounce text-7xl mb-4">
              {emoji}
            </div>
            
            <h3 className="font-press-start text-xl text-neon-green mb-4 animate-glow">
              YOU WIN FREE DEGEN SHIZZLE!
            </h3>
            
            <div className="relative my-6 py-4 px-4 bg-black/60 border border-neon-pink/40 rounded-lg">
              <div className="absolute -left-1 -top-1 w-2 h-2 bg-neon-pink rounded-full"></div>
              <div className="absolute -right-1 -top-1 w-2 h-2 bg-neon-pink rounded-full"></div>
              <div className="absolute -left-1 -bottom-1 w-2 h-2 bg-neon-pink rounded-full"></div>
              <div className="absolute -right-1 -bottom-1 w-2 h-2 bg-neon-pink rounded-full"></div>
              
              <p className="font-press-start text-neon-blue text-sm leading-relaxed">
                {funnyPhrase}
              </p>
            </div>
            
            <button
              onClick={onClose}
              className="relative group mt-4 w-full"
            >
              <div className="absolute -inset-0.5 bg-gradient-to-r from-neon-purple via-neon-pink to-neon-blue rounded-lg blur opacity-50 group-hover:opacity-100 transition duration-1000"></div>
              <div className="relative bg-black px-6 py-3 rounded-lg font-press-start text-sm text-white group-hover:text-neon-blue transition-colors duration-300">
                SICK BRO!
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 