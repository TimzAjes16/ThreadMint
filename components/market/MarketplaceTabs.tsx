'use client';

import { Button } from '../ui/Button';

interface MarketplaceTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const tabs = [
  { id: 'items', label: 'Items' },
  { id: 'tokens', label: 'Tokens' },
  { id: 'offers', label: 'Offers' },
  { id: 'holders', label: 'Holders' },
  { id: 'activity', label: 'Activity' },
  { id: 'about', label: 'About' },
];

export function MarketplaceTabs({
  activeTab,
  onTabChange,
}: MarketplaceTabsProps) {
  return (
    <div className="flex items-center gap-1 border-b border-line mb-6">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`
            px-4 py-3 text-sm font-medium transition-colors relative
            ${
              activeTab === tab.id
                ? 'text-text'
                : 'text-muted hover:text-text'
            }
          `}
        >
          {tab.label}
          {activeTab === tab.id && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-500" />
          )}
        </button>
      ))}
    </div>
  );
}

