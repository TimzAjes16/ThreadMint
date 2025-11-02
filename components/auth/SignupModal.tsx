'use client';

import { useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { useAccount } from 'wagmi';

interface SignupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToLogin: () => void;
}

export function SignupModal({ isOpen, onClose, onSwitchToLogin }: SignupModalProps) {
  const { isConnected } = useAccount();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-2 sm:p-4 overflow-y-auto">
      <Card className="w-full max-w-md my-auto bg-panel border-2 border-line shadow-2xl mx-2 sm:mx-0 max-h-[95vh] overflow-y-auto">
        <div className="p-4 sm:p-6 md:p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-text">Create Account</h2>
            <button
              onClick={onClose}
              className="text-muted hover:text-text transition-colors text-xl leading-none"
              aria-label="Close"
            >
              ✕
            </button>
          </div>

          <div className="space-y-4">
          <div>
            <label htmlFor="signup-username" className="block text-sm font-medium text-text mb-2">
              Username
            </label>
            <input
              id="signup-username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-panel2 border border-line rounded-lg px-4 py-2.5 text-text focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500/50"
              placeholder="Choose a username"
            />
          </div>

          <div>
            <label htmlFor="signup-email" className="block text-sm font-medium text-text mb-2">
              Email
            </label>
            <input
              id="signup-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-panel2 border border-line rounded-lg px-4 py-2.5 text-text focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500/50"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label htmlFor="signup-password" className="block text-sm font-medium text-text mb-2">
              Password
            </label>
            <input
              id="signup-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-panel2 border border-line rounded-lg px-4 py-2.5 text-text focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500/50"
              placeholder="••••••••"
            />
          </div>

          <div>
            <label htmlFor="signup-confirm-password" className="block text-sm font-medium text-text mb-2">
              Confirm Password
            </label>
            <input
              id="signup-confirm-password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full bg-panel2 border border-line rounded-lg px-4 py-2.5 text-text focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500/50"
              placeholder="••••••••"
            />
          </div>

          <div className="flex items-center gap-2 text-sm text-muted">
            <input type="checkbox" className="rounded" />
            <span>
              I agree to the Terms of Service and Privacy Policy
            </span>
          </div>

          <Button
            className="w-full"
            variant="primary"
            onClick={() => {
              // TODO: Implement signup
              console.log('Signup:', { username, email, password });
            }}
          >
            Create Account
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
            Already have an account?{' '}
            <button
              onClick={onSwitchToLogin}
              className="text-brand-400 hover:text-brand-300 font-medium"
            >
              Sign in
            </button>
          </div>
        </div>
        </div>
      </Card>
    </div>
  );
}

