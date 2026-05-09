'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';

interface PaywallModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpgrade: () => void;
}

export function PaywallModal({ isOpen, onClose, onUpgrade }: PaywallModalProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleUpgrade = async () => {
    setIsLoading(true);
    try {
      await onUpgrade();
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 border border-gray-700 rounded-lg p-8 w-full max-w-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">Upgrade to Pro</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-2xl leading-none"
          >
            ×
          </button>
        </div>

        <div className="space-y-6">
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
            <p className="text-gray-300 text-lg mb-4">
              You've used your 2 free analyses. Unlock unlimited for <span className="text-green-500 font-bold">$19/month</span>
            </p>
            <ul className="space-y-2 text-gray-400 text-sm mb-6">
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                Unlimited analyses
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                Priority support
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                Cancel anytime
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <Button
              onClick={handleUpgrade}
              disabled={isLoading}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? 'Processing...' : 'Upgrade Now'}
            </Button>

            <Button
              onClick={onClose}
              disabled={isLoading}
              className="w-full bg-gray-800 hover:bg-gray-700 text-white font-semibold py-3 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Maybe Later
            </Button>
          </div>

          <p className="text-gray-500 text-xs text-center">
            Stripe payment processing. Your data is secure.
          </p>
        </div>
      </div>
    </div>
  );
}
