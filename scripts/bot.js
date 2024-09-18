import dotenv from 'dotenv';
import { JsonRpcProvider, Wallet } from 'ethers';
import { FlashbotsBundleProvider } from '@flashbots/ethers-provider-bundle';
import { executeFlashLoan } from './flashloan.js';
import { checkCrossDexArbitrage, checkInnerArbitrageOnDex } from './arbitrage.js';  // Importing the correct named exports

dotenv.config();

const INFURA_API_KEY = process.env.INFURA_API_KEY;
const WALLET_PRIVATE_KEY = process.env.WALLET_PRIVATE_KEY;

if (!INFURA_API_KEY || !WALLET_PRIVATE_KEY) {
    throw new Error('Missing INFURA_API_KEY or WALLET_PRIVATE_KEY');
}

// Connect to Sepolia testnet
const provider = new JsonRpcProvider(`https://sepolia.infura.io/v3/${INFURA_API_KEY}`);
const wallet = new Wallet(WALLET_PRIVATE_KEY, provider);

// Connect to Flashbots provider
async function connectFlashbots() {
    const flashbotsProvider = await FlashbotsBundleProvider.create(provider, wallet);
    return flashbotsProvider;
}

// Start the bot and continuously check for arbitrage opportunities
async function startBot() {
    const flashbotsProvider = await connectFlashbots();
    console.log(`Connected to Flashbots with wallet: ${wallet.address}`);

    // Continuously check for arbitrage opportunities
    setInterval(async () => {
        const tokenAddress = "0x...";  // Replace with actual token address
        const loanAmount = 1000;  // Example loan amount

        // Check cross-DEX arbitrage
        const crossDexOpportunity = await checkCrossDexArbitrage(tokenAddress);
        if (crossDexOpportunity) {
            await executeFlashLoan(tokenAddress, loanAmount, checkCrossDexArbitrage);
        }

        // Check inner arbitrage on Uniswap
        const innerArbitrageOpportunity = await checkInnerArbitrageOnDex("Uniswap");
        if (innerArbitrageOpportunity) {
            await executeFlashLoan(tokenAddress, loanAmount, () => checkInnerArbitrageOnDex("Uniswap"));
        }
    }, 10000); // Check every 10 seconds
}

startBot();
