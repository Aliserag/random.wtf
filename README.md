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
git clone https://github.com/yourusername/random.wtf.git
cd random.wtf
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```
Edit `.env` and add your Flow private key.

4. Deploy the smart contract:
```bash
npx hardhat run scripts/deploy.ts --network flow
```

5. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Smart Contract

The `RandomnessWTF` contract is deployed on the Flow network and uses Flow's VRF capabilities to generate true random numbers. The contract provides two main functions:

- `getRandomNumber(uint256 min, uint256 max)`: Generates a random number within the specified range
- `selectRandomItem(string[] items)`: Selects a random item from an array of strings

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License

[MIT](https://choosealicense.com/licenses/mit/)