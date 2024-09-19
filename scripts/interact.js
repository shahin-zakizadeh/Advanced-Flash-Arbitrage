import hardhat from 'hardhat';

const { ethers, run } = hardhat;
import * as dotenv from "dotenv";
dotenv.config();

async function main() {
    // Get the contract address and the signer (your wallet)
    const flashLoanContractAddress = "0xDdf26356A46678Ec193297507eF8A2c7518099C5"; // Your deployed FlashLoanArbitrage contract
    const [signer] = await ethers.getSigners();

    // Get the contract instance
    const flashLoanContract = await ethers.getContractAt("FlashLoanArbitrage", flashLoanContractAddress, signer);

    // Request a flash loan
    async function requestFlashLoan() {
        try {
            const tx = await flashLoanContract.requestFlashLoan(
                "0x75faf114eafb1BDbe2F0316DF893fd58CE46AA4d", // USDC on Sepolia
                ethers.utils.parseUnits("0.0001", 6), // Borrow 100 USDC
                { gasLimit: ethers.utils.hexlify(3000000) } // Increase gas limit to 3M
            );


            console.log("Transaction sent, waiting for confirmation...");
            const receipt = await tx.wait(); // Wait for the transaction to be mined
            console.log("Transaction successful:", receipt.transactionHash); // Log the transaction hash for confirmation
        } catch (error) {
            console.error("Transaction failed:", error); // Log any error during the transaction
        }
    }

    // Start the flash loan request
    await requestFlashLoan();
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
