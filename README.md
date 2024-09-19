# Advanced Flash Loan Arbitrage Bot

This project implements a Flash Loan Arbitrage bot using Aave's V3 protocol, Uniswap/SushiSwap for decentralized exchanges (DEXs), and Hardhat for smart contract development. The bot aims to detect arbitrage opportunities between decentralized exchanges and execute profitable trades using Aave flash loans without upfront capital.

## Features
- **Flash Loans**: Utilizes Aave V3's flash loans to borrow funds without collateral.
- **Cross-DEX Arbitrage**: Identifies arbitrage opportunities between multiple DEXs like Uniswap and SushiSwap.
- **Inner DEX Arbitrage**: Monitors price differences within a single DEX between token pairs.
- **Gas Optimization**: Focuses on minimizing gas costs and transaction fees.
- **Hardhat Integration**: Uses Hardhat for deploying, testing, and managing smart contracts.

## Project Structure
```
├── contracts
│   └── FlashLoanArbitrage.sol  // Main smart contract
├── scripts
│   └── deploy.js               // Script to deploy the contract on Sepolia testnet
├── test
│   └── FlashLoanArbitrageTest.js  // Unit tests (WIP)
├── node_modules/               // Dependencies
├── .env                        // Environment variables (WALLET_PRIVATE_KEY, INFURA_API_KEY, etc.)
├── hardhat.config.cjs           // Hardhat configuration file
├── package.json                // Project dependencies and scripts
├── README.md                   // This readme file
```

## Prerequisites

- Node.js and npm
- Hardhat
- A wallet private key
- Infura Project ID
- Aave Sepolia Pool contract address (Sepolia testnet)

### Setup Instructions

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/yourusername/flashloan-arbitrage-bot.git
   cd flashloan-arbitrage-bot
   ```

2. **Install Dependencies:**

   ```bash
   npm install --legacy-peer-deps
   ```

3. **Create a `.env` file in the root directory:**

   ```bash
   touch .env
   ```

   Add the following to `.env`:

   ```
   INFURA_API_KEY=your-infura-api-key
   WALLET_PRIVATE_KEY=your-wallet-private-key
   ```

4. **Compile the Contracts:**

   Compile the Solidity contracts with Hardhat:

   ```bash
   npx hardhat compile
   ```

5. **Deploy the Contract:**

   Deploy the contract on the Sepolia testnet:

   ```bash
   npx hardhat run scripts/deploy.js --network sepolia
   ```

6. **Run the Bot:**

   Run the bot by executing the `bot.js` script, which monitors for arbitrage opportunities:

   ```bash
   node scripts/bot.js
   ```

## Smart Contracts

### FlashLoanArbitrage.sol

This smart contract interacts with Aave V3 to request flash loans, detect arbitrage opportunities across DEXs, and execute the trades. It also ensures that the loan is repaid in the same transaction, including any premium charged by Aave.

### Deployment Example

```solidity
const AAVE_POOL_ADDRESS = "0xBfC91D59fdAA134A4ED45f7B584cAf96D7792Eff";
const FlashLoanArbitrage = await ethers.getContractFactory("FlashLoanArbitrage");
const flashLoanContract = await FlashLoanArbitrage.deploy(AAVE_POOL_ADDRESS);
```

## Usage

The bot continuously monitors token prices on Uniswap and SushiSwap using flash loans to borrow funds and execute trades. You can configure the parameters such as slippage tolerance and gas price optimization in the bot's JavaScript logic.

## Testing

Unit testing for the smart contract is in progress. You can run the test suite using Hardhat's test environment:

```bash
npx hardhat test
```

## License

This project is licensed under the MIT License.

