import hardhat from 'hardhat';

const { ethers, run } = hardhat;
import * as dotenv from "dotenv";
dotenv.config();

// Connect to Sepolia network via Infura
const provider = new ethers.providers.JsonRpcProvider(`https://sepolia.infura.io/v3/${process.env.INFURA_PROJECT_ID}`);

const wallet = new ethers.Wallet(process.env.WALLET_PRIVATE_KEY, provider);

// Aave Sepolia Data Provider address
const AAVE_DATA_PROVIDER_ADDRESS = "0x12373B5085e3b42D42C1D4ABF3B3Cf4Df0E0Fa01";
const AAVE_DATA_PROVIDER_ABI = [
    "function getReserveData(address asset) external view returns (uint256 availableLiquidity)"
];

const TOKEN_ADDRESS = "0x75faf114eafb1BDbe2F0316DF893fd58CE46AA4d"; // USDC Sepolia

async function checkTokenLiquidity() {
    const dataProvider = new ethers.Contract(AAVE_DATA_PROVIDER_ADDRESS, AAVE_DATA_PROVIDER_ABI, wallet);

    // Fetch the available liquidity for the token
    const reserveData = await dataProvider.getReserveData(TOKEN_ADDRESS);
    const availableLiquidity = ethers.utils.formatUnits(reserveData.availableLiquidity, 6); // Adjust decimals

    console.log(`Available liquidity for the token: ${availableLiquidity} USDC`);
}

checkTokenLiquidity().catch((error) => {
    console.error(error);
});
