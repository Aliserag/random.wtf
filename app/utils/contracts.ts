import { ethers } from 'ethers';
import { RANDOMNESS_CONTRACT_ABI, RANDOMNESS_CONTRACT_ADDRESS } from '../config/contracts';

let provider: ethers.BrowserProvider | null = null;
let contract: ethers.Contract | null = null;

const FLOW_TESTNET_CHAIN_ID = '0x221'; // 545 in decimal
const FLOW_TESTNET_PARAMS = {
  chainId: FLOW_TESTNET_CHAIN_ID,
  chainName: 'Flow Testnet',
  nativeCurrency: {
    name: 'Flow Token',
    symbol: 'FLOW',
    decimals: 18,
  },
  rpcUrls: ['https://testnet.evm.nodes.onflow.org'],
  blockExplorerUrls: ['https://evm-testnet.flowscan.io'],
};

export const initializeProvider = async () => {
  if (typeof window === 'undefined' || !window.ethereum) {
    throw new Error('Please install MetaMask to use this application');
  }

  try {
    // Request account access
    await window.ethereum.request({ method: 'eth_requestAccounts' });

    // Check if we're on the correct network
    const chainId = await window.ethereum.request({ method: 'eth_chainId' });
    if (chainId !== FLOW_TESTNET_CHAIN_ID) {
      try {
        // Try to switch to Flow Testnet
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: FLOW_TESTNET_CHAIN_ID }],
        });
      } catch (switchError: any) {
        // This error code indicates that the chain has not been added to MetaMask
        if (switchError.code === 4902) {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [FLOW_TESTNET_PARAMS],
          });
        } else {
          throw switchError;
        }
      }
    }

    provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    contract = new ethers.Contract(
      RANDOMNESS_CONTRACT_ADDRESS,
      RANDOMNESS_CONTRACT_ABI,
      signer
    );

    return { provider, contract };
  } catch (error: any) {
    console.error('Failed to initialize provider:', error);
    throw new Error(error.message || 'Failed to connect to wallet');
  }
};

export const getRandomNumber = async (min: number, max: number): Promise<number> => {
  if (!contract) {
    await initializeProvider();
  }
  if (!contract) throw new Error('Contract not initialized');

  try {
    // Convert numbers to BigInt for uint64
    const minBigInt = BigInt(Math.floor(min));
    const maxBigInt = BigInt(Math.floor(max));
    
    const result = await contract.getRandomNumber(minBigInt, maxBigInt);
    return Number(result);
  } catch (error: any) {
    console.error('Error in getRandomNumber:', error);
    if (error.message.includes('user rejected')) {
      throw new Error('Transaction rejected by user');
    }
    throw new Error(error.message || 'Failed to generate random number');
  }
};

export const selectRandomItem = async (items: string[]): Promise<string> => {
  if (!contract) {
    await initializeProvider();
  }
  if (!contract) throw new Error('Contract not initialized');

  try {
    return await contract.selectRandomItem(items);
  } catch (error: any) {
    console.error('Error in selectRandomItem:', error);
    if (error.message.includes('user rejected')) {
      throw new Error('Transaction rejected by user');
    }
    throw new Error(error.message || 'Failed to select random item');
  }
}; 