import { ethers } from 'ethers';
import { 
  RANDOMNESS_CONTRACT_ABI, 
  RANDOMNESS_CONTRACT_ADDRESS 
} from '../config/contracts';

// Wagmi-compatible contract functions
export const generateVerifiableRandomNumberWagmi = async (
  walletClient: any,
  min: number,
  max: number
): Promise<{
  result: number;
  txHash: string;
  blockNumber: number;
  generationId: string;
}> => {
  try {
    // Create ethers contract with wagmi wallet client
    const provider = new ethers.BrowserProvider(walletClient);
    const signer = await provider.getSigner();
    
    const contract = new ethers.Contract(
      RANDOMNESS_CONTRACT_ADDRESS,
      RANDOMNESS_CONTRACT_ABI,
      signer
    );

    const minBigInt = BigInt(Math.floor(min));
    const maxBigInt = BigInt(Math.floor(max));
    
    console.log('Using Wagmi wallet for verifiable random number');
    const tx = await contract.generateVerifiableRandomNumber(minBigInt, maxBigInt);
    const receipt = await tx.wait();
    
    // Parse the event to get the result
    const event = receipt.logs.find((log: any) => {
      try {
        const parsed = contract.interface.parseLog(log);
        return parsed?.name === 'VerifiableRandomNumberGenerated';
      } catch {
        return false;
      }
    });

    if (!event) {
      throw new Error('Could not find VerifiableRandomNumberGenerated event');
    }

    const parsedEvent = contract.interface.parseLog(event);
    
    return {
      result: Number(parsedEvent?.args.randomNumber),
      txHash: tx.hash,
      blockNumber: receipt.blockNumber,
      generationId: parsedEvent?.args.generationId
    };
  } catch (error: any) {
    console.error('Error in generateVerifiableRandomNumberWagmi:', error);
    throw new Error(error.message || 'Failed to generate verifiable random number');
  }
};

export const generateVerifiableRandomItemWagmi = async (
  walletClient: any,
  items: string[]
): Promise<{
  result: string;
  txHash: string;
  blockNumber: number;
  selectionId: string;
}> => {
  try {
    // Create ethers contract with wagmi wallet client
    const provider = new ethers.BrowserProvider(walletClient);
    const signer = await provider.getSigner();
    
    const contract = new ethers.Contract(
      RANDOMNESS_CONTRACT_ADDRESS,
      RANDOMNESS_CONTRACT_ABI,
      signer
    );

    console.log('Using Wagmi wallet for verifiable random item');
    const tx = await contract.generateVerifiableRandomItem(items);
    const receipt = await tx.wait();
    
    // Parse the event to get the result
    const event = receipt.logs.find((log: any) => {
      try {
        const parsed = contract.interface.parseLog(log);
        return parsed?.name === 'VerifiableRandomItemSelected';
      } catch {
        return false;
      }
    });

    if (!event) {
      throw new Error('Could not find VerifiableRandomItemSelected event');
    }

    const parsedEvent = contract.interface.parseLog(event);
    
    return {
      result: parsedEvent?.args.selectedItem,
      txHash: tx.hash,
      blockNumber: receipt.blockNumber,
      selectionId: parsedEvent?.args.selectionId
    };
  } catch (error: any) {
    console.error('Error in generateVerifiableRandomItemWagmi:', error);
    throw new Error(error.message || 'Failed to generate verifiable random item');
  }
};

export const makeYoloDecisionWagmi = async (
  walletClient: any
): Promise<{
  decision: string;
  advice: string;
  txHash: string;
  blockNumber: number;
  decisionId: string;
}> => {
  try {
    // Create ethers contract with wagmi wallet client
    const provider = new ethers.BrowserProvider(walletClient);
    const signer = await provider.getSigner();
    
    const contract = new ethers.Contract(
      RANDOMNESS_CONTRACT_ADDRESS,
      RANDOMNESS_CONTRACT_ABI,
      signer
    );

    console.log('Using Wagmi wallet for Yolo decision');
    const tx = await contract.makeYoloDecision();
    const receipt = await tx.wait();
    
    // Parse the event to get the result
    const event = receipt.logs.find((log: any) => {
      try {
        const parsed = contract.interface.parseLog(log);
        return parsed?.name === 'YoloDecisionMade';
      } catch {
        return false;
      }
    });

    if (!event) {
      throw new Error('Could not find YoloDecisionMade event');
    }

    const parsedEvent = contract.interface.parseLog(event);
    
    return {
      decision: parsedEvent?.args.decision,
      advice: parsedEvent?.args.advice,
      txHash: tx.hash,
      blockNumber: receipt.blockNumber,
      decisionId: parsedEvent?.args.decisionId
    };
  } catch (error: any) {
    console.error('Error in makeYoloDecisionWagmi:', error);
    throw new Error(error.message || 'Failed to make Yolo decision');
  }
};