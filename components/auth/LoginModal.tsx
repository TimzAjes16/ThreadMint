'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { useAccount } from 'wagmi';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToSignup: () => void;
}

export function LoginModal({ isOpen, onClose, onSwitchToSignup }: LoginModalProps) {
  const { isConnected } = useAccount();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogin = async () => {
    setError('');
    setLoading(true);
    
    try {
      const { supabase } = await import('@/lib/supabase');
      if (!supabase) {
        setError('Authentication not configured');
        setLoading(false);
        return;
      }

      const { error } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) {
        setError(error.message);
      } else {
        onClose();
        setEmail('');
        setPassword('');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to sign in');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !mounted) return null;

  const modalContent = (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-2 sm:p-4 overflow-y-auto">
      <Card className="w-full max-w-md bg-panel border-2 border-line shadow-2xl mx-auto">
        <div className="p-4 sm:p-6 md:p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-text">Sign In</h2>
            <button
              onClick={onClose}
              className="text-muted hover:text-text transition-colors text-xl leading-none"
              aria-label="Close"
            >
              ✕
            </button>
          </div>

          <div className="space-y-4">
          {error && (
            <div className="bg-anger/20 text-anger px-4 py-2 rounded-lg text-sm">
              {error}
            </div>
          )}
          
          <div>
            <label htmlFor="login-email" className="block text-sm font-medium text-text mb-2">
              Email
            </label>
            <input
              id="login-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-panel2 border border-line rounded-lg px-4 py-2.5 text-text focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500/50"
              placeholder="you@example.com"
              disabled={loading}
            />
          </div>

          <div>
            <label htmlFor="login-password" className="block text-sm font-medium text-text mb-2">
              Password
            </label>
            <input
              id="login-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-panel2 border border-line rounded-lg px-4 py-2.5 text-text focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500/50"
              placeholder="••••••••"
              disabled={loading}
            />
          </div>

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 text-muted">
              <input type="checkbox" className="rounded" />
              <span>Remember me</span>
            </label>
            <button className="text-brand-400 hover:text-brand-300">
              Forgot password?
            </button>
          </div>

          <Button
            className="w-full"
            variant="primary"
            onClick={handleLogin}
            disabled={loading || !email || !password}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </Button>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-line" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-panel text-muted">Or continue with</span>
            </div>
          </div>

          {!isConnected && (
            <Button
              className="w-full"
              variant="secondary"
              onClick={() => {
                // Wallet connection handled by RainbowKit
                onClose();
              }}
            >
              Connect Wallet
            </Button>
          )}

          <div className="text-center text-sm text-muted">
            Don't have an account?{' '}
            <button
              onClick={onSwitchToSignup}
              className="text-brand-400 hover:text-brand-300 font-medium"
            >
              Sign up
            </button>
          </div>
        </div>
        </div>
      </Card>
    </div>
  );

  return createPortal(modalContent, document.body);
}

