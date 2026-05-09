'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';

interface AnalyseInputProps {
  onSubmit: (text: string) => void;
  isLoading: boolean;
}

export function AnalyseInput({ onSubmit, isLoading }: AnalyseInputProps) {
  const [inputText, setInputText] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    // Clear previous error
    setError('');

    // Validate input
    if (!inputText.trim()) {
      setError('Please enter a URL or product description.');
      return;
    }

    // Call onSubmit
    onSubmit(inputText);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Allow Ctrl+Enter or Cmd+Enter to submit
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-4">
      <div className="space-y-4">
        <textarea
          value={inputText}
          onChange={(e) => {
            setInputText(e.target.value);
            setError('');
          }}
          onKeyDown={handleKeyDown}
          placeholder="Paste your landing page URL or describe your product in 2-3 sentences..."
          disabled={isLoading}
          className="w-full h-32 p-4 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed resize-none"
        />

        {error && (
          <div className="text-red-500 text-sm">
            {error}
          </div>
        )}

        <Button
          onClick={handleSubmit}
          disabled={isLoading}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? 'Analysing...' : 'Analyse'}
        </Button>

        <p className="text-gray-500 text-xs text-center">
          Tip: Press Ctrl+Enter to submit
        </p>
      </div>
    </div>
  );
}
