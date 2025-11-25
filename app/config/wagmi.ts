'use client';

import { getDefaultConfig } from '@rainbow-me/rainbowkit';

// Define Flow Mainnet chain configuration
const flowMainnetChain = {
  id: 747,
  name: 'Flow EVM',
  nativeCurrency: {
    decimals: 18,
    name: 'Flow Token',
    symbol: 'FLOW',
  },
  rpcUrls: {
    default: { http: ['https://mainnet.evm.nodes.onflow.org'] },
  },
  blockExplorers: {
    default: { name: 'Flowscan', url: 'https://evm.flowscan.io' },
  },
  testnet: false,
} as const;

export const wagmiConfig = getDefaultConfig({
  appName: 'Random.wtf',
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'demo-project-id',
  chains: [flowMainnetChain],
  ssr: true,
});