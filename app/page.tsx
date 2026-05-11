'use client';

import { useEffect, useState } from 'react';
import { getSupabaseBrowserClient } from '@/lib/supabase';
import { AnalyseInput } from '@/components/AnalyseInput';
import { OutputSection } from '@/components/OutputSection';
import { LoadingState } from '@/components/LoadingState';
import { AuthModal } from '@/components/AuthModal';
import { PaywallModal } from '@/components/PaywallModal';

interface User {
  id: string;
  email: string;
  created_at: string;
}

interface Outputs {
  conversions: string;
  reddit: string;
  emails: string;
}

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [inputText, setInputText] = useState('');
  const [outputs, setOutputs] = useState<Outputs | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showPaywallModal, setShowPaywallModal] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [initError, setInitError] = useState<string | null>(null);

  // Check if user is logged in on mount
  useEffect(() => {
    try {
      const supabaseClient = getSupabaseBrowserClient();

      // Get initial session immediately
      supabaseClient.auth.getSession().then(({ data: { session } }) => {
        if (session?.user) {
          setUser({
            id: session.user.id,
            email: session.user.email || '',
            created_at: session.user.created_at || new Date().toISOString(),
          });
        } else {
          setUser(null);
        }
        setIsCheckingAuth(false);
      });

      // Listen for ALL auth state changes (login, logout, token refresh)
      const { data: { subscription } } = supabaseClient.auth.onAuthStateChange(
        (event, session) => {
          if (session?.user) {
            setUser({
              id: session.user.id,
              email: session.user.email || '',
              created_at: session.user.created_at || new Date().toISOString(),
            });
          } else {
            setUser(null);
          }
          setIsCheckingAuth(false);
        }
      );

      // Cleanup subscription on unmount
      return () => subscription.unsubscribe();
    } catch (err: any) {
      console.error('Initialization error:', err);
      setInitError(err.message || 'Failed to initialize app');
      setIsCheckingAuth(false);
    }
  }, []);

  // Handle keyboard shortcut for logout (Ctrl+L)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'l') {
        e.preventDefault();
        handleLogout();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleAnalyse = async (text: string) => {
    // If not logged in, show auth modal
    if (!user) {
      setInputText(text);
      setShowAuthModal(true);
      return;
    }

    // Proceed with analysis
    await performAnalysis(text);
  };

  const performAnalysis = async (text: string) => {
    setIsLoading(true);
    setError(null);
    setOutputs(null);

    try {
      // Get the current session to extract the access token
      const supabaseClient = getSupabaseBrowserClient();
      const { data: { session } } = await supabaseClient.auth.getSession();

      if (!session?.access_token) {
        setError('Session expired. Please log in again.');
        setIsLoading(false);
        return;
      }

      const response = await fetch('/api/analyse', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ input_text: text }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 403 && data.error === 'paywall') {
          setShowPaywallModal(true);
          setIsLoading(false);
          return;
        }

        setError(data.error || 'Analysis failed. Please try again.');
        setIsLoading(false);
        return;
      }

      setOutputs({
        conversions: data.conversions,
        reddit: data.reddit,
        emails: data.emails,
      });
      setInputText('');
    } catch (err: any) {
      console.error('Analysis error:', err);
      setError('Network error. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAuthSuccess = async () => {
    // Get the current session to update user state
    const supabaseClient = getSupabaseBrowserClient();
    const { data: { session } } = await supabaseClient.auth.getSession();
    
    if (session?.user) {
      setUser({
        id: session.user.id,
        email: session.user.email || '',
        created_at: session.user.created_at || new Date().toISOString(),
      });
    }

    // If there was input text, proceed with analysis
    if (inputText) {
      await performAnalysis(inputText);
    }
  };

  const handleLogout = async () => {
    try {
      const supabaseClient = getSupabaseBrowserClient();
      const { error } = await supabaseClient.auth.signOut();
      if (error) {
        console.error('Logout error:', error);
      } else {
        setUser(null);
        setOutputs(null);
        setInputText('');
        setError(null);
      }
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const handleUpgrade = () => {
    // Placeholder for Stripe integration
    console.log('Upgrade clicked - Stripe integration to be added');
    setShowPaywallModal(false);
  };

  if (isCheckingAuth) {
    return (
      <div className="flex flex-col flex-1 items-center justify-center min-h-screen">
        <div className="text-gray-400">Loading...</div>
      </div>
    );
  }

  if (initError) {
    return (
      <div className="flex flex-col flex-1 items-center justify-center min-h-screen bg-[#0a0a0a] text-white">
        <div className="max-w-md text-center">
          <h1 className="text-2xl font-bold text-red-500 mb-4">Initialization Error</h1>
          <p className="text-gray-300 mb-4">{initError}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg"
          >
            Reload Page
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 min-h-screen bg-[#0a0a0a] text-white">
      {/* Header */}
      <header className="border-b border-gray-800 py-6">
        <div className="max-w-4xl mx-auto px-4 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white">FirstPaying</h1>
            <p className="text-gray-400 text-sm mt-1">Get your first paying user</p>
          </div>
          {user && (
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-400">{user.email}</span>
              <button
                onClick={handleLogout}
                className="text-sm text-gray-400 hover:text-white transition-colors"
                title="Ctrl+L to logout"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center py-12 px-4">
        <div className="w-full max-w-4xl space-y-8">
          {/* Input Section */}
          <div>
            <AnalyseInput onSubmit={handleAnalyse} isLoading={isLoading} />
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-900 border border-red-700 text-red-200 px-6 py-4 rounded-lg max-w-2xl mx-auto w-full">
              <p className="text-sm">{error}</p>
              <button
                onClick={() => setError(null)}
                className="text-xs text-red-300 hover:text-red-100 mt-2 underline"
              >
                Dismiss
              </button>
            </div>
          )}

          {/* Loading State */}
          {isLoading && <LoadingState />}

          {/* Outputs */}
          {!isLoading && outputs && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <OutputSection
                title="Landing Page Weaknesses"
                content={outputs.conversions}
                isLoading={false}
              />
              <OutputSection
                title="Reddit Launch Post"
                content={outputs.reddit}
                isLoading={false}
              />
              <OutputSection
                title="Cold Outreach Emails"
                content={outputs.emails}
                isLoading={false}
              />
            </div>
          )}

          {/* Empty State */}
          {!isLoading && !outputs && !error && (
            <div className="text-center text-gray-500 py-12">
              <p>Paste your landing page URL or describe your product to get started</p>
            </div>
          )}
        </div>
      </main>

      {/* Modals */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onAuthSuccess={handleAuthSuccess}
      />

      <PaywallModal
        isOpen={showPaywallModal}
        onClose={() => setShowPaywallModal(false)}
        onUpgrade={handleUpgrade}
      />
    </div>
  );
}
