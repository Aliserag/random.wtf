'use client';

import { useState } from 'react';
import FileUpload from './FileUpload';
import { initializeWalletProvider } from '../utils/contracts';

export default function RandomFile() {
  const [items, setItems] = useState<string[]>([]);
  const [randomItem, setRandomItem] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [itemCount, setItemCount] = useState(0);

  const handleParsedData = (rows: string[]) => {
    const filteredRows = rows.filter(row => row.trim() !== '');
    setItems(filteredRows);
    setItemCount(filteredRows.length);
    setRandomItem(null);
    setError(null);
  };

  const generateRandom = async () => {
    if (items.length === 0) {
      setError('Please upload a file with items first');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Using local randomization for simplicity
      // Could use blockchain randomness with the contract by uncommenting below
      
      /*
      const provider = await initializeWalletProvider();
      if (!provider) {
        throw new Error('Provider not initialized. Please connect your wallet.');
      }
      
      const contract = provider.contract;
      const index = await contract.selectRandomItem(items.length);
      setRandomItem(items[index.toNumber()]);
      */
      
      // Local randomization as fallback
      const randomIndex = Math.floor(Math.random() * items.length);
      setRandomItem(items[randomIndex]);
    } catch (err) {
      console.error('Error generating random item:', err);
      setError(err instanceof Error ? err.message : 'Failed to generate random item');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full flex flex-col items-center p-4">
      <h2 className="text-2xl font-bold mb-6 text-gradient">Random From File</h2>
      
      <FileUpload onParsedData={handleParsedData} />
      
      {itemCount > 0 && (
        <div className="w-full text-center mb-6">
          <p className="text-cyan-400 text-lg">
            <span className="text-white">{itemCount}</span> items loaded from file
          </p>
        </div>
      )}
      
      <button
        onClick={generateRandom}
        disabled={isLoading || items.length === 0}
        className={`
          relative overflow-hidden px-8 py-3 rounded-lg font-bold text-lg
          transition-all duration-300 transform
          ${isLoading || items.length === 0 
            ? 'bg-gray-700 text-gray-500 cursor-not-allowed' 
            : 'bg-gradient-to-r from-purple-500 to-cyan-500 text-white hover:from-purple-600 hover:to-cyan-600 hover:shadow-glow hover:scale-105'}
        `}
      >
        {isLoading ? (
          <span className="flex items-center">
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Selecting...
          </span>
        ) : (
          'Select Random Item'
        )}
      </button>
      
      {error && (
        <div className="mt-6 w-full text-red-400 text-center bg-red-400/10 p-4 rounded-lg border border-red-400/20">
          {error}
        </div>
      )}
      
      {randomItem && !error && (
        <div className="mt-8 w-full">
          <div className="bg-gray-800 border border-purple-500/30 rounded-lg p-6 shadow-glow-sm">
            <h3 className="text-xl font-bold mb-2 text-gradient">Selected Item</h3>
            <div className="bg-black/50 p-4 rounded-md border border-cyan-500/20 text-white font-mono break-all">
              {randomItem}
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 