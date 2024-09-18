// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

// Import Aave V3 Flash Loan interface and IERC20
import {IPool} from "@aave/core-v3/contracts/interfaces/IPool.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract FlashLoanArbitrage {
    IPool public pool;
    address public owner;

    constructor(address _pool) {
        pool = IPool(_pool); // Set the Aave V3 Pool contract address
        owner = msg.sender; // Set the contract deployer as the owner
    }

    // Step 1: Request Flash Loan from Aave V3
    function requestFlashLoan(address asset, uint256 amount) external {
        // Only the owner can request a flash loan
        require(msg.sender == owner, "Only owner can execute flash loans");

        // Flash loan parameters
        address receiverAddress = address(this); // This contract will receive the loan
        address[] memory assets = new address[](1); // Array of assets (tokens) to borrow
        assets[0] = asset; // Set the token to borrow (e.g., USDC, DAI, etc.)
        uint256[] memory amounts = new uint256[](1); // Array for loan amounts
        amounts[0] = amount; // Set the loan amount
        uint256[] memory modes = new uint256[](1); // Array of modes (0 for no debt/flash loan)
        modes[0] = 0; // 0 means flash loan, so no debt will be created

        // Optional parameters
        bytes memory params = ""; // Additional params to pass data (empty for now)
        uint16 referralCode = 0; // Optional referral code (use 0 if not needed)

        // Execute the flash loan
        pool.flashLoan(
            receiverAddress, // Address that will receive the loan (this contract)
            assets, // The array of assets (just one in this case)
            amounts, // The array of loan amounts (just one in this case)
            modes, // The array of modes (flash loan mode, 0 for no debt)
            address(this), // Initiator, which is this contract
            params, // Optional parameters to pass to executeOperation
            referralCode // Referral code for Aave (optional)
        );
    }

    // Step 2: Aave's callback - called once the loan is granted
    function executeOperation(
        address[] calldata assets, // Array of assets involved in the flash loan
        uint256[] calldata amounts, // Amounts of each asset borrowed
        uint256[] calldata premiums, // Fees/premiums owed to Aave on top of the borrowed amounts
        address initiator, // Address that initiated the loan (should be this contract)
        bytes calldata params // Extra data passed from flash loan (empty in our case)
    ) external returns (bool) {
        // Repay the loan along with the premium
        for (uint256 i = 0; i < assets.length; i++) {
            uint256 amountOwing = amounts[i] + premiums[i]; // Total amount to repay (loan + premium)
            IERC20(assets[i]).approve(address(pool), amountOwing); // Approve the pool to take the repayment
        }

        // Return true to indicate successful execution
        return true;
    }

    // Fallback function to receive Ether
    receive() external payable {}
}
