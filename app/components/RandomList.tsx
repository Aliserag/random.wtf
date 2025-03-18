'use client';

import { useState } from 'react';
import { selectRandomItem } from '../utils/contracts';

export default function RandomList() {
  const [items, setItems] = useState<string>('');
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [inputHistory, setInputHistory] = useState<string[]>([]);

  const parseItems = (input: string): string[] => {
    // First, split by newlines
    const lines = input.split('\n').map(line => line.trim());
    
    // Process each line for comma-separated values
    const allItems = lines.flatMap(line => {
      // If the line contains commas, split by commas
      if (line.includes(',')) {
        return line.split(',').map(item => item.trim());
      }
      // Otherwise return the line as is
      return line;
    });

    // Filter out empty items
    return allItems.filter(item => item.length > 0);
  };

  const generateRandom = async () => {
    try {
      const itemList = parseItems(items);

      if (itemList.length === 0) {
        setError('Please enter at least one item');
        return;
      }

      setLoading(true);
      setError(null);
      const selectedItem = await selectRandomItem(itemList);
      setResult(selectedItem);
      
      // Add to history if not already present
      if (!inputHistory.includes(items)) {
        setInputHistory(prev => [items, ...prev].slice(0, 5));
      }
    } catch (error) {
      console.error('Error selecting random item:', error);
      setError(error instanceof Error ? error.message : 'Failed to select random item');
    } finally {
      setLoading(false);
    }
  };

  const loadFromHistory = (historicalInput: string) => {
    setItems(historicalInput);
  };

  return (
    <div className="space-y-10">
      <div className="space-y-3">
        <label className="block font-press-start text-xs text-neon-blue">
          Enter Items
        </label>
        <div className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-neon-pink to-neon-blue rounded-xl blur opacity-30 group-hover:opacity-50 transition duration-1000"></div>
          <div className="relative">
            <textarea
              value={items}
              onChange={(e) => setItems(e.target.value)}
              className="w-full px-4 py-4 bg-black/50 rounded-xl border border-neon-purple/20 focus:border-neon-blue focus:ring-2 focus:ring-neon-blue/50 focus:outline-none text-neon-green font-press-start text-sm transition-all duration-300 h-48"
              placeholder="Enter items like:&#10;dad, mom, son&#10;&#10;Or one per line:&#10;tree&#10;rock&#10;sun"
            />
            <div className="absolute top-3 right-3">
              <div className="font-press-start text-xs text-neon-pink">
                {parseItems(items).length} items
              </div>
            </div>
          </div>
        </div>
      </div>

      {inputHistory.length > 0 && (
        <div className="space-y-3">
          <label className="block font-press-start text-xs text-neon-blue">
            Recent Lists
          </label>
          <div className="flex flex-wrap gap-3">
            {inputHistory.map((hist, index) => (
              <button
                key={index}
                onClick={() => loadFromHistory(hist)}
                className="px-4 py-2 bg-black/50 rounded-lg border border-neon-purple/20 font-press-start text-xs text-neon-green hover:border-neon-blue hover:text-neon-blue transition-all duration-300"
              >
                List {inputHistory.length - index}
              </button>
            ))}
          </div>
        </div>
      )}

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
              <span>Choosing...</span>
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
              </svg>
              <span>Choose Random Item</span>
            </>
          )}
        </div>
      </button>

      {error && (
        <div className="bg-red-500/10 border-2 border-red-500/50 rounded-xl p-6 text-red-400 text-center font-press-start text-sm animate-pulse">
          {error}
        </div>
      )}

      {result && !error && (
        <div className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-neon-purple to-neon-blue rounded-xl blur opacity-75 animate-pulse"></div>
          <div className="relative text-center space-y-4 bg-black rounded-xl p-8 border border-neon-purple">
            <div className="font-press-start text-sm text-neon-blue">Selected Item</div>
            <div className="font-press-start text-3xl md:text-4xl text-neon-green animate-glow break-all">
              {result}
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 