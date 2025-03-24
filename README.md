# Randomness.WTF

A decentralized random number generator using Flow's on-chain VRF (Verifiable Random Function).

## Features

- Generate random numbers within a specified range
- Select random items from a list
- True randomness powered by Flow's VRF

## Tech Stack

- Next.js 13+ with App Router
- TypeScript
- Tailwind CSS
- Solidity
- Hardhat
- Flow Network

## Getting Started

1. Clone the repository:
    ```bash
    git clone https://github.com/yourusername/random.wtf.git && cd random.wtf
    ```

1. Install dependencies:
    ```bash
    npm install
    ```

1. Compile the contracts and generate TypeScript bindings
    ```bash
    npm hardhat compile
    ```

1. Set up environment variables:
    ```bash
    cp .env.example .env
    ```
    Edit `.env` and add your Flow EVM private key.

1. Deploy the smart contract:
    ```bash
    npx hardhat run scripts/deploy.ts --network flow_testnet
    ```

1. Run the development server:
    ```bash
    npm run dev
    ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Running Tests

To run the Hardhat test suite, execute the command:

```bash
npx hardhat test test/*.test.ts
```

## Smart Contract

The `RandomnessWTF` contract is [deployed on Testnet](https://evm-testnet.flowscan.io/address/0x91502a85Ad74ba94499145477dccA19b3E1D6124)
and uses Flow's VRF capabilities to generate true random numbers. The contract provides two main functions:

- `getRandomNumber(uint256 min, uint256 max)`: Generates a random number within the specified range
- `selectRandomItem(string[] items)`: Selects a random item from an array of strings

## Resources

For more about using Flow's VRF in your contracts, check out the resources below:

- [VRF in Solidity](https://developers.flow.com/evm/guides/vrf)
- [VRF in Cadence](https://developers.flow.com/build/advanced-concepts/randomness)
- [Commit-Reveal Example Repo in Cadence & Solidity](https://github.com/onflow/random-coin-toss)

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License

[MIT](https://choosealicense.com/licenses/mit/)