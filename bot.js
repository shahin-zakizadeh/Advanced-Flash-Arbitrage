require('dotenv').config();
const { ethers } = require('ethers');
const { FlashbotsBundleProvider } = require('@flashbots/ethers-provider-bundle');
const { executeFlashLoan } = require('./flashloan');
const { checkCrossDexArbitrage, checkInnerArbitrageOnDex } = require('./arbitrage');

const INFURA_API_KEY = process.env.INFURA_API_KEY;
const WALLET_PRIVATE_KEY = process.env.WALLET_PRIVATE_KEY;

// Connect to Arbitrum Sepolia Testnet using Infura
const provider = new ethers.providers.JsonRpcProvider(`https://sepolia.infura.io/v3/${INFURA_API_KEY}`);


// Create wallet instance using private key
const wallet = new ethers.Wallet(WALLET_PRIVATE_KEY, provider);

// Connect to Flashbots provider
async function connectFlashbots() {
    const flashbotsProvider = await FlashbotsBundleProvider.create(provider, wallet);
    return flashbotsProvider;
}

// Start the bot and continuously check for arbitrage opportunities
async function startBot() {
    const flashbotsProvider = await connectFlashbots();
    console.log(`Connected to Flashbots with wallet: ${wallet.address}`);

    // Continuously check for both cross-DEX and inner arbitrage opportunities
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
