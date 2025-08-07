'use client';

import { useState, useEffect } from 'react';
import { initializeWalletProvider } from '../utils/contracts';

interface VerifiableModeProps {
  onModeChange: (isVerifiable: boolean, walletAddress: string | null) => void;
}

export default function VerifiableMode({ onModeChange }: VerifiableModeProps) {
  const [isVerifiableMode, setIsVerifiableMode] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    // Check if already connected
    checkConnection();

    // Listen for account changes
    if (typeof window !== 'undefined' && window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);
    }

    return () => {
      if (typeof window !== 'undefined' && window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      }
    };
  }, []);

  const checkConnection = async () => {
    if (typeof window === 'undefined' || !window.ethereum) return;

    try {
      const accounts = await window.ethereum.request({ method: 'eth_accounts' }) as string[];
      if (accounts.length > 0) {
        const chainId = await window.ethereum.request({ method: 'eth_chainId' }) as string;
        if (chainId === '0x221') { // Flow Testnet
          setWalletAddress(accounts[0]);
          // Don't auto-enable verifiable mode - let user choose
        }
      }
    } catch (error) {
      console.error('Error checking connection:', error);
    }
  };

  const handleAccountsChanged = (accounts: unknown) => {
    const accountsArray = accounts as string[];
    if (accountsArray.length === 0) {
      setWalletAddress(null);
      setIsVerifiableMode(false);
      onModeChange(false, null);
    } else {
      setWalletAddress(accountsArray[0]);
      if (isVerifiableMode) {
        onModeChange(true, accountsArray[0]);
      }
    }
  };

  const handleChainChanged = (chainId: unknown) => {
    const chainIdStr = chainId as string;
    if (chainIdStr !== '0x221') {
      setWalletAddress(null);
      setIsVerifiableMode(false);
      onModeChange(false, null);
    } else {
      checkConnection();
    }
  };

  const toggleVerifiableMode = async () => {
    if (!isVerifiableMode) {
      // Turning ON verifiable mode - need wallet connection
      if (walletAddress) {
        // Already connected, just enable
        setIsVerifiableMode(true);
        onModeChange(true, walletAddress);
      } else {
        // Need to connect wallet
        await connectWallet();
      }
    } else {
      // Turning OFF verifiable mode
      setIsVerifiableMode(false);
      onModeChange(false, null);
    }
  };

  const connectWallet = async () => {
    setIsConnecting(true);
    setError(null);

    try {
      const { provider } = await initializeWalletProvider();
      const walletProvider = provider as any;
      const signer = await walletProvider.getSigner();
      const userAddress = await signer.getAddress();
      
      setWalletAddress(userAddress);
      setIsVerifiableMode(true);
      onModeChange(true, userAddress);
    } catch (error: any) {
      console.error('Failed to connect wallet:', error);
      setError(error.message || 'Failed to connect wallet');
      setTimeout(() => setError(null), 3000);
    } finally {
      setIsConnecting(false);
    }
  };

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  return (
    <div className="relative">
      <div 
        className="relative"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        <button
          onClick={toggleVerifiableMode}
          disabled={isConnecting}
          className="relative group flex items-center gap-2"
        >
          <div className={`absolute -inset-0.5 rounded-xl blur opacity-50 group-hover:opacity-75 transition duration-1000 group-disabled:opacity-25 ${
            isVerifiableMode 
              ? 'bg-gradient-to-r from-neon-green to-neon-blue' 
              : 'bg-gradient-to-r from-neon-purple to-neon-blue'
          }`}></div>
          <div className={`relative px-4 py-2 bg-black rounded-xl flex items-center gap-2 font-press-start text-xs transition-all duration-300 group-disabled:cursor-not-allowed ${
            isVerifiableMode ? 'text-neon-green' : 'text-white group-hover:text-neon-blue'
          }`}>
            {/* Checkmark icon when in verifiable mode */}
            <svg className={`w-4 h-4 transition-opacity duration-300 ${isVerifiableMode ? 'opacity-100' : 'opacity-50'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            
            {isConnecting ? (
              <>
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span>Connecting...</span>
              </>
            ) : (
              <span>
                {isVerifiableMode ? (walletAddress ? formatAddress(walletAddress) : 'Verifiable') : 'Verifiable Mode'}
              </span>
            )}
          </div>
        </button>

        {/* Tooltip */}
        {showTooltip && (
          <div className="absolute top-full right-0 mt-2 w-64 p-3 bg-black/90 border border-neon-purple/20 rounded-lg text-xs font-press-start text-neon-blue z-50">
            <div className="space-y-2">
              <div className="text-neon-green">Verifiable Mode</div>
              <div className="text-white">
                {isVerifiableMode 
                  ? 'ON: Random values create blockchain transactions with verifiable proof you can share'
                  : 'OFF: Random values are generated instantly without blockchain transactions'
                }
              </div>
            </div>
            {/* Arrow */}
            <div className="absolute -top-2 right-4 w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent border-b-neon-purple/20"></div>
          </div>
        )}
      </div>

      {/* Error display */}
      {error && (
        <div className="absolute top-full right-0 mt-2 p-2 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400 text-xs font-press-start whitespace-nowrap z-40">
          {error}
        </div>
      )}
    </div>
  );
}