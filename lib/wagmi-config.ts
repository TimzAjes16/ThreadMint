import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { base } from 'wagmi/chains';

export const config = getDefaultConfig({
  appName: 'ThreadMint',
  projectId: process.env.NEXT_PUBLIC_WC_PROJECT_ID || 'default',
  chains: [base],
  ssr: true,
});

