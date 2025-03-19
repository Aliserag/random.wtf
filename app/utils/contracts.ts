import { ethers } from 'ethers';
import { RANDOMNESS_CONTRACT_ABI, RANDOMNESS_CONTRACT_ADDRESS } from '../config/contracts';

let provider: ethers.Provider | null = null;
let contract: ethers.Contract | null = null;

const FLOW_TESTNET_RPC = 'https://testnet.evm.nodes.onflow.org';

// Initialize read-only provider for view functions
const initializeReadOnlyProvider = () => {
  if (!provider) {
    provider = new ethers.JsonRpcProvider(FLOW_TESTNET_RPC);
    contract = new ethers.Contract(
      RANDOMNESS_CONTRACT_ADDRESS,
      RANDOMNESS_CONTRACT_ABI,
      provider
    );
  }
  return { provider, contract };
};

// Initialize wallet provider for transactions (if needed in the future)
export const initializeWalletProvider = async () => {
  if (typeof window === 'undefined' || !window.ethereum) {
    throw new Error('Please install MetaMask to use this application');
  }

  try {
    // Request account access
    await window.ethereum.request({ method: 'eth_requestAccounts' });

    // Check if we're on the correct network
    const chainId = await window.ethereum.request({ method: 'eth_chainId' });
    if (chainId !== '0x221') { // 545 in decimal
      try {
        // Try to switch to Flow Testnet
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: '0x221' }],
        });
      } catch (switchError: any) {
        // This error code indicates that the chain has not been added to MetaMask
        if (switchError.code === 4902) {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [{
              chainId: '0x221',
              chainName: 'Flow Testnet',
              nativeCurrency: {
                name: 'Flow Token',
                symbol: 'FLOW',
                decimals: 18,
              },
              rpcUrls: [FLOW_TESTNET_RPC],
              blockExplorerUrls: ['https://evm-testnet.flowscan.io'],
            }],
          });
        } else {
          throw switchError;
        }
      }
    }

    const walletProvider = new ethers.BrowserProvider(window.ethereum);
    const signer = await walletProvider.getSigner();
    provider = walletProvider;
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
  // Use read-only provider for view functions
  if (!contract) {
    initializeReadOnlyProvider();
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
    throw new Error(error.message || 'Failed to generate random number');
  }
};

export const selectRandomItem = async (items: string[]): Promise<string> => {
  // Use read-only provider for view functions
  if (!contract) {
    initializeReadOnlyProvider();
  }
  if (!contract) throw new Error('Contract not initialized');

  try {
    return await contract.selectRandomItem(items);
  } catch (error: any) {
    console.error('Error in selectRandomItem:', error);
    throw new Error(error.message || 'Failed to select random item');
  }
}; 