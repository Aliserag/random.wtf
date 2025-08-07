'use client';

import React, { useState, useEffect } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useDisconnect } from 'wagmi';

interface VerifiableModeProps {
  onModeChange: (isVerifiable: boolean, walletAddress: string | null) => void;
}

export default function VerifiableMode({ onModeChange }: VerifiableModeProps) {
  const [isVerifiableMode, setIsVerifiableMode] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();

  const toggleVerifiableMode = (openConnectModal?: () => void) => {
    if (!isVerifiableMode) {
      // Enable verifiable mode
      setIsVerifiableMode(true);
      if (isConnected && address) {
        onModeChange(true, address);
      } else if (openConnectModal) {
        // Directly open wallet selection modal
        openConnectModal();
      }
    } else {
      // Disable verifiable mode
      setIsVerifiableMode(false);
      onModeChange(false, null);
      if (isConnected) {
        disconnect();
      }
    }
  };

  // Auto-enable verifiable mode when wallet connects
  useEffect(() => {
    if (isConnected && address && isVerifiableMode) {
      onModeChange(true, address);
    }
  }, [isConnected, address, isVerifiableMode, onModeChange]);

  return (
    <div className="relative">
      {/* Tooltip */}
      {showTooltip && (
        <div className="absolute right-0 top-full mt-2 w-64 p-3 bg-black/90 border border-neon-purple/50 rounded-lg text-xs text-white z-50">
          <div className="flex items-start gap-2">
            <svg className="w-4 h-4 text-neon-green mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <div>
              <div className="font-press-start text-neon-blue mb-2">Verifiable Mode</div>
              <div className="text-neon-green mb-2">
                Creates blockchain transactions that anyone can verify on Flowscan. Perfect for proving fairness in contests, giveaways, or important decisions.
              </div>
              <div className="text-neon-pink text-xs">
                💡 Note: You need FLOW tokens in your wallet to pay for transaction fees.
              </div>
            </div>
          </div>
          <div className="absolute top-0 right-4 transform -translate-y-full">
            <div className="w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent border-b-neon-purple/50"></div>
          </div>
        </div>
      )}

      <ConnectButton.Custom>
        {({ openConnectModal, openAccountModal, account, chain, mounted }) => {
          if (!isVerifiableMode) {
            // Non-verifiable mode button
            return (
              <button
                onClick={() => toggleVerifiableMode(openConnectModal)}
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
                className="relative group"
              >
                <div className="absolute -inset-0.5 bg-gradient-to-r from-neon-purple to-neon-pink rounded-xl blur opacity-50 group-hover:opacity-75 transition duration-1000"></div>
                <div className="relative px-4 py-2 bg-black rounded-xl flex items-center gap-2 font-press-start text-xs text-white border border-neon-purple/20 group-hover:text-neon-blue transition-all duration-300">
                  <svg className="w-4 h-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  <span>Verifiable Mode</span>
                </div>
              </button>
            );
          }

          // Verifiable mode enabled
          if (!isConnected || !mounted || !account || !chain) {
            // Connecting or not connected - button shows connecting state
            return (
              <button
                onClick={openConnectModal}
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
                className="relative group"
              >
                <div className="absolute -inset-0.5 bg-gradient-to-r from-neon-green to-neon-blue rounded-xl blur opacity-50 group-hover:opacity-75 transition duration-1000 animate-pulse"></div>
                <div className="relative px-4 py-2 bg-black rounded-xl flex items-center gap-2 font-press-start text-xs text-neon-green border border-neon-green/50 transition-all duration-300">
                  <svg className="w-4 h-4 text-neon-green" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Verifiable Mode</span>
                </div>
              </button>
            );
          }

          // Connected state - restore original styling with address
          return (
            <div className="relative group">
              <button
                onClick={() => toggleVerifiableMode()}
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
                className="relative group flex items-center gap-2"
              >
                <div className="absolute -inset-0.5 bg-gradient-to-r from-neon-green to-neon-blue rounded-xl blur opacity-50 group-hover:opacity-75 transition duration-1000"></div>
                <div className="relative px-4 py-2 bg-black rounded-xl flex items-center gap-2 font-press-start text-xs text-neon-green transition-all duration-300">
                  <svg className="w-4 h-4 text-neon-green" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Verifiable</span>
                  <span className="text-neon-blue">
                    ({account.displayName || `${address?.slice(0, 6)}...${address?.slice(-4)}`})
                  </span>
                </div>
              </button>
            </div>
          );
        }}
      </ConnectButton.Custom>
    </div>
  );
}