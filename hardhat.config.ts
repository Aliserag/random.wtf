import { HardhatUserConfig } from 'hardhat/config';
import '@nomicfoundation/hardhat-toolbox';
import '@nomicfoundation/hardhat-verify';
import * as dotenv from 'dotenv';

dotenv.config();

const PRIVATE_KEY = process.env.PRIVATE_KEY || '';

const config: HardhatUserConfig = {
  solidity: '0.8.19',
  networks: {
    flow_testnet: {
      url: 'https://testnet.evm.nodes.onflow.org',
      accounts: PRIVATE_KEY ? [PRIVATE_KEY] : [],
      gas: 500000,
      chainId: 545
    },
    flow_mainnet: {
      url: 'https://mainnet.evm.nodes.onflow.org',
      accounts: PRIVATE_KEY ? [PRIVATE_KEY] : [],
      gas: 500000,
      chainId: 747
    },
    hardhat: {
      allowUnlimitedContractSize: true,
    },
  },
  etherscan: {
    apiKey: {
      flowTestnet: "abc",
      flowMainnet: "abc"
    },
    customChains: [
      {
        network: "flowTestnet",
        chainId: 545,
        urls: {
          apiURL: "https://evm-testnet.flowscan.io/api",
          browserURL: "https://evm-testnet.flowscan.io",
        }
      },
      {
        network: "flowMainnet",
        chainId: 747,
        urls: {
          apiURL: "https://evm.flowscan.io/api",
          browserURL: "https://evm.flowscan.io",
        }
      }
    ]
  },
  sourcify: {
    enabled: false
  }
};

export default config; 