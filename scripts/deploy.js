import hardhat from 'hardhat';

const { ethers, run } = hardhat;

async function main() {
    // The Aave Pool contract address on Sepolia testnet
    const AAVE_POOL_ADDRESS = "0xBfC91D59fdAA134A4ED45f7B584cAf96D7792Eff"; // Add the correct Aave Sepolia Pool address here

    const FlashLoanArbitrage = await ethers.getContractFactory("FlashLoanArbitrage");
    const flashLoanContract = await FlashLoanArbitrage.deploy(AAVE_POOL_ADDRESS);

    await flashLoanContract.deployed();

    console.log("Flash Loan Contract deployed to:", flashLoanContract.address);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
