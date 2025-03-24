import { ethers } from 'ethers';

export const RANDOMNESS_CONTRACT_ADDRESS = '0x91502a85Ad74ba94499145477dccA19b3E1D6124';

export const RANDOMNESS_CONTRACT_ABI = [
  {
    "inputs": [
      {
        "internalType": "uint64",
        "name": "min",
        "type": "uint64"
      },
      {
        "internalType": "uint64",
        "name": "max",
        "type": "uint64"
      }
    ],
    "name": "getRandomNumber",
    "outputs": [
      {
        "internalType": "uint64",
        "name": "",
        "type": "uint64"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string[]",
        "name": "items",
        "type": "string[]"
      }
    ],
    "name": "selectRandomItem",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
]; 