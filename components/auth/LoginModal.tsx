'use client';

import { useState } from 'react';
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <Card className="w-full max-w-md p-8 bg-panel border-2 border-line">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-text">Sign In</h2>
          <button
            onClick={onClose}
            className="text-muted hover:text-text transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-panel2 border border-line rounded-lg px-4 py-2 text-text focus:outline-none focus:ring-2 focus:ring-brand-500/50"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-panel2 border border-line rounded-lg px-4 py-2 text-text focus:outline-none focus:ring-2 focus:ring-brand-500/50"
              placeholder="••••••••"
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
            onClick={() => {
              // TODO: Implement login
              console.log('Login:', { email, password });
            }}
          >
            Sign In
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
      </Card>
    </div>
  );
}

