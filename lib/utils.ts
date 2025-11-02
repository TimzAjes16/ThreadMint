import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatEth(wei: bigint | string | number): string {
  const num = typeof wei === 'string' ? BigInt(wei) : BigInt(wei);
  const eth = Number(num) / 1e18;
  return eth.toFixed(4);
}

export function formatAddress(address: string): string {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function calculateAbsorptionWeight(
  editionType: string,
  editions?: number
): number {
  const base = 1.0;
  
  switch (editionType) {
    case '1of1':
      return base * 1.35;
    case 'limited':
      if (!editions) return base;
      return base * (1 / Math.log10(editions + 5));
    case 'open':
      return base;
    case 'allowlist':
      // Treat as limited
      if (!editions) return base;
      return base * (1 / Math.log10(editions + 5));
    default:
      return base;
  }
}

