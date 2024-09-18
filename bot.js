require('dotenv').config(); // Load environment variables
const { ethers } = require('ethers');
const { FlashbotsBundleProvider } = require('@flashbots/ethers-provider-bundle');

// Load keys from .env and validate them
const INFURA_API_KEY = process.env.INFURA_API_KEY;
const WALLET_PRIVATE_KEY = process.env.WALLET_PRIVATE_KEY;

if (!INFURA_API_KEY || !WALLET_PRIVATE_KEY) {
    console.error("Please set your INFURA_API_KEY and WALLET_PRIVATE_KEY in the .env file.");
    process.exit(1); // Exit if environment variables are not set
}

// Connect to Arbitrum Sepolia Testnet using Infura
const provider = new ethers.providers.JsonRpcProvider(`https://sepolia.infura.io/v3/${INFURA_API_KEY}`);


// Create wallet instance using private key
const wallet = new ethers.Wallet(WALLET_PRIVATE_KEY, provider);

// Connect to Flashbots provider
async function connectFlashbots() {
  const flashbotsProvider = await FlashbotsBundleProvider.create(
    provider, // A standard ethers.js provider
    wallet // Authenticated wallet
  );
  
  return flashbotsProvider;
}

// Basic bot operation
async function startBot() {
  const flashbotsProvider = await connectFlashbots();
  console.log(`Connected to Flashbots with wallet: ${wallet.address}`);
}

startBot();
