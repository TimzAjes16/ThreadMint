'use client';

import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useAccount } from 'wagmi';

export default function SettingsPage() {
  const { address } = useAccount();

  return (
    <div className="ml-64 mr-80 min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-text mb-6">Settings</h1>

        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-text mb-4">Profile</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text mb-2">
                  Display Name
                </label>
                <input
                  type="text"
                  className="w-full bg-panel2 border border-line rounded-md px-4 py-2 text-text"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text mb-2">
                  Bio
                </label>
                <textarea
                  className="w-full bg-panel2 border border-line rounded-md px-4 py-2 text-text"
                  rows={4}
                  placeholder="Tell us about yourself"
                />
              </div>
              <Button variant="primary">Save Changes</Button>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-semibold text-text mb-4">Wallet</h2>
            <div className="text-sm text-subtle mb-4">
              Connected: {address || 'Not connected'}
            </div>
            <Button variant="secondary">Disconnect</Button>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-semibold text-text mb-4">
              Notifications
            </h2>
            <div className="space-y-3">
              <label className="flex items-center gap-3">
                <input type="checkbox" className="rounded" />
                <span className="text-text">New collections</span>
              </label>
              <label className="flex items-center gap-3">
                <input type="checkbox" className="rounded" />
                <span className="text-text">Mentions</span>
              </label>
              <label className="flex items-center gap-3">
                <input type="checkbox" className="rounded" />
                <span className="text-text">Marketplace updates</span>
              </label>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

