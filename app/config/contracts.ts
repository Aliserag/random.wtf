import { ethers } from 'ethers';

export const RANDOMNESS_CONTRACT_ADDRESS = '0x4Fc101E7ecCD7DA2BF88Aa5BAe67b234388aF6FC'; // v2 Enhanced Contract

// Legacy v1 contract address (archived)
export const LEGACY_RANDOMNESS_CONTRACT_ADDRESS = '0x91502a85Ad74ba94499145477dccA19b3E1D6124';


export const RANDOMNESS_CONTRACT_ABI = [
  {
    "inputs": [],
    "name": "EmptyItemArray",
    "type": "error"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "string",
        "name": "item",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "index",
        "type": "uint256"
      }
    ],
    "name": "RandomItemSelected",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint64",
        "name": "randomNumber",
        "type": "uint64"
      },
      {
        "indexed": false,
        "internalType": "uint64",
        "name": "min",
        "type": "uint64"
      },
      {
        "indexed": false,
        "internalType": "uint64",
        "name": "max",
        "type": "uint64"
      }
    ],
    "name": "RandomNumberGenerated",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "bytes32",
        "name": "selectionId",
        "type": "bytes32"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "requester",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "selectedItem",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "string[]",
        "name": "items",
        "type": "string[]"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "index",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "blockNumber",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "timestamp",
        "type": "uint256"
      }
    ],
    "name": "VerifiableRandomItemSelected",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "bytes32",
        "name": "generationId",
        "type": "bytes32"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "requester",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint64",
        "name": "randomNumber",
        "type": "uint64"
      },
      {
        "indexed": false,
        "internalType": "uint64",
        "name": "min",
        "type": "uint64"
      },
      {
        "indexed": false,
        "internalType": "uint64",
        "name": "max",
        "type": "uint64"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "blockNumber",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "timestamp",
        "type": "uint256"
      }
    ],
    "name": "VerifiableRandomNumberGenerated",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "string[]",
        "name": "items",
        "type": "string[]"
      }
    ],
    "name": "generateVerifiableRandomItem",
    "outputs": [
      {
        "internalType": "bytes32",
        "name": "selectionId",
        "type": "bytes32"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
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
    "name": "generateVerifiableRandomNumber",
    "outputs": [
      {
        "internalType": "bytes32",
        "name": "generationId",
        "type": "bytes32"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "generationId",
        "type": "bytes32"
      }
    ],
    "name": "getGenerationDetails",
    "outputs": [
      {
        "components": [
          {
            "internalType": "uint64",
            "name": "result",
            "type": "uint64"
          },
          {
            "internalType": "uint64",
            "name": "min",
            "type": "uint64"
          },
          {
            "internalType": "uint64",
            "name": "max",
            "type": "uint64"
          },
          {
            "internalType": "address",
            "name": "requester",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "timestamp",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "blockNumber",
            "type": "uint256"
          }
        ],
        "internalType": "struct RandomnessWTF.RandomGeneration",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
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
        "internalType": "bytes32",
        "name": "selectionId",
        "type": "bytes32"
      }
    ],
    "name": "getSelectionDetails",
    "outputs": [
      {
        "components": [
          {
            "internalType": "string",
            "name": "result",
            "type": "string"
          },
          {
            "internalType": "string[]",
            "name": "items",
            "type": "string[]"
          },
          {
            "internalType": "uint256",
            "name": "index",
            "type": "uint256"
          },
          {
            "internalType": "address",
            "name": "requester",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "timestamp",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "blockNumber",
            "type": "uint256"
          }
        ],
        "internalType": "struct RandomnessWTF.RandomSelection",
        "name": "",
        "type": "tuple"
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