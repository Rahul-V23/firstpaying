'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';

interface OutputSectionProps {
  title: string;
  content: string | null;
  isLoading: boolean;
}

export function OutputSection({ title, content, isLoading }: OutputSectionProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!content) return;

    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-gray-900 border border-gray-700 rounded-lg p-6 h-64 animate-pulse">
        <div className="h-6 bg-gray-700 rounded mb-4 w-1/3"></div>
        <div className="space-y-3">
          <div className="h-4 bg-gray-700 rounded w-full"></div>
          <div className="h-4 bg-gray-700 rounded w-5/6"></div>
          <div className="h-4 bg-gray-700 rounded w-4/6"></div>
        </div>
      </div>
    );
  }

  if (!content) {
    return (
      <div className="bg-gray-900 border border-gray-700 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">{title}</h3>
        <p className="text-gray-400">No content available</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 border border-gray-700 rounded-lg p-6">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-semibold text-white">{title}</h3>
        <Button
          onClick={handleCopy}
          className="bg-green-600 hover:bg-green-700 text-white text-sm px-3 py-1 rounded transition-colors"
        >
          {copied ? 'Copied!' : 'Copy'}
        </Button>
      </div>
      <div className="text-gray-300 whitespace-pre-wrap text-sm leading-relaxed max-h-96 overflow-y-auto">
        {content}
      </div>
    </div>
  );
}
