# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Randomness.WTF is a decentralized random number generator web application built on Flow blockchain's EVM. The project combines a Next.js frontend with Solidity smart contracts to provide verifiable random number generation and list selection using Flow's VRF (Verifiable Random Function).

## Development Commands

### Frontend
- `npm run dev` - Start Next.js development server
- `npm run build` - Build production Next.js application  
- `npm run start` - Start production Next.js server
- `npm run lint` - Run Next.js ESLint

### Smart Contracts
- `npx hardhat compile` - Compile Solidity contracts and generate TypeScript bindings
- `npx hardhat test` - Run all contract tests
- `npx hardhat test test/RandomnessWTF.test.ts` - Run specific test file
- `npx hardhat run scripts/deploy.ts --network flow_mainnet` - Deploy main contract to Flow Mainnet
- `npx hardhat run scripts/deploy.ts --network flow_testnet` - Deploy main contract to Flow Testnet
- `npx hardhat run scripts/deploy.js --network hardhat` - Deploy to local Hardhat network

## Architecture

### Smart Contract Layer
The `RandomnessWTF.sol` contract inherits from Flow's `CadenceRandomConsumer` to access on-chain VRF functionality. It provides two main view functions:
- `getRandomNumber(uint64 min, uint64 max)` - Returns random number in range
- `selectRandomItem(string[] items)` - Returns random item from array

The enhanced contract v3 is deployed at `0x26E9f28c7c3eB5425003959AC4F4279eF373A1c2` on Flow Mainnet.
Legacy testnet contracts: `0x0911C1844AD219c941c0D5597460E730A2DF02Ee` (v3), `0x4Fc101E7ecCD7DA2BF88Aa5BAe67b234388aF6FC` (v2), `0x91502a85Ad74ba94499145477dccA19b3E1D6124` (v1)

### Frontend Architecture
The application uses Next.js App Router with three main UI modes that support both regular and verifiable modes:
1. **RandomNumber** - Range-based number generation
2. **RandomList** - Item selection from user input or file upload  
3. **YoloRoll** - Simple dice roll modal ("YOLO!" vs "NO WAY!")

### Verifiable Mode System
- **VerifiableMode toggle** in top-right replaces wallet connection
- **Tooltip explanation** on hover explains the difference between modes
- When OFF: Uses view functions for instant randomness (no wallet needed)
- When ON: Uses transaction functions for verifiable on-chain proof (requires wallet)
- **VerificationDetails component** shows below results when in verifiable mode

### Contract Integration
The `app/utils/contracts.ts` file handles blockchain interaction using ethers.js:
- Uses read-only JsonRpcProvider for view function calls (no wallet required)
- Includes MetaMask integration for verifiable randomness transactions
- Automatically connects to Flow Mainnet RPC at `https://mainnet.evm.nodes.onflow.org`

### Enhanced Contract (v2) Features
The enhanced contract includes both view and transaction functions:
- **View functions** (v1 compatible): `getRandomNumber()`, `selectRandomItem()` - instant, no wallet needed
- **Transaction functions** (v2): `generateVerifiableRandomNumber()`, `generateVerifiableRandomItem()` - create verifiable proof
- Rich events with full metadata (generationId, requester, result, timestamp, block number)
- On-chain storage for verification details accessible via `getGenerationDetails()` and `getSelectionDetails()`
- Users get clean Flowscan links showing actual random values in transaction events
- **VerifiableMode** component handles MetaMask integration and mode switching

### File Processing
The `app/utils/fileParser.ts` handles CSV and Excel file uploads using PapaParse and xlsx libraries. The RandomList component supports drag-and-drop file processing.

### Mobile Features
The `app/utils/screenshot.ts` provides mobile-optimized screenshot functionality with iOS-specific clipboard handling and download fallbacks.

### Testing Strategy
Tests use Hardhat with a mock precompile pattern to simulate Flow's VRF functionality locally. The `MockCadencePrecompile.sol` contract allows deterministic testing of random number generation logic.

### Styling
Uses Tailwind CSS with custom cyberpunk/neon theme defined in `tailwind.config.ts`. Features:
- Custom neon color palette (pink, blue, green, yellow, purple)
- Retro "Press Start 2P" pixel font
- Gradient animations and glow effects
- Mobile-responsive design

## Network Configuration

The project targets Flow EVM Mainnet (Chain ID: 747). Hardhat configuration includes:
- RPC URL: `https://mainnet.evm.nodes.onflow.org`
- Block explorer: `https://evm.flowscan.io`
- Gas limit: 500,000

Testnet configuration (Chain ID: 545) is also available for development.

## Key Dependencies

- **@onflow/flow-sol-utils** - Flow blockchain utilities for VRF access
- **ethers** - Ethereum/EVM interaction library
- **html2canvas** - Screenshot generation
- **papaparse** & **xlsx** - File parsing for CSV/Excel support
- **hardhat** - Smart contract development environment