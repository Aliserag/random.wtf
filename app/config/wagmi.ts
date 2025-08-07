'use client';

import { getDefaultConfig } from '@rainbow-me/rainbowkit';

// Define Flow Testnet chain configuration
const flowTestnetChain = {
  id: 545,
  name: 'Flow EVM Testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'Flow Token',
    symbol: 'FLOW',
  },
  rpcUrls: {
    default: { http: ['https://testnet.evm.nodes.onflow.org'] },
  },
  blockExplorers: {
    default: { name: 'Flowscan', url: 'https://evm-testnet.flowscan.io' },
  },
  testnet: true,
} as const;

export const wagmiConfig = getDefaultConfig({
  appName: 'Random.wtf',
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'demo-project-id',
  chains: [flowTestnetChain],
  ssr: true,
});