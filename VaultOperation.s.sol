// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "forge-std/Script.sol";
import "forge-std/console.sol";
import "../src/Stablecoin.sol";

/**
 * @title VaultOperations
 * @notice Foundry script for vault operations: creation, repayment, and liquidation
 * @dev Script for interacting with a deployed stablecoin contract
 */
contract VaultOperations is Script {
    SimpleStablecoin stablecoin;
    address constant STABLECOIN_ADDRESS = REPLACE_WITH_YOUR_CONTRACT_ADDRESS;  // Replace with your deployed contract address

    function setUp() public {
        stablecoin = SimpleStablecoin(payable(STABLECOIN_ADDRESS));
    }

    /**
     * @notice Create a vault and mint stablecoins by depositing ETH as collateral
     * 
     * TODO: Call the mint function to deposit collateral and mint stablecoins
     */
    function createAndMint() public {
        vm.broadcast();
        
        uint256 collateralAmount = 0.01 ether;
        
        // TODO: Call the mint function (must send ETH along with the call)
        // Hint: stablecoin.mint{value: ________}();
        /* TODO: Write your code here */
        
        // Log results
        (uint256 collateral, uint256 debt) = stablecoin.vaults(msg.sender);
        console.log("Created vault with", collateralAmount, "ETH");
        console.log("Current collateral:", collateral);
        console.log("Current debt:", debt);
        console.log("Current ratio:", stablecoin.getCurrentRatio(msg.sender));
    }

    /**
     * @notice Repay stablecoins and withdraw collateral
     * @param amount Amount of stablecoins to repay
     * 
     * TODO: Call the repay function to pay back debt
     */
    function repayAndWithdraw(uint256 amount) public {
        (uint256 collateral, uint256 debt) = stablecoin.vaults(msg.sender);
        require(debt > 0, "No debt to repay");
        require(amount <= debt, "Amount exceeds debt");
        
        vm.broadcast();
        
        // TODO: Call the repay function
        /* TODO: Write your code here */
        
        // Log results
        (uint256 newCollateral, uint256 newDebt) = stablecoin.vaults(msg.sender);
        console.log("Repaid", amount, "tokens");
        console.log("Collateral returned:", collateral - newCollateral);
        console.log("Remaining debt:", newDebt);
    }

    /**
     * @notice Check if a user's position is eligible for liquidation
     * @param user Address of the user to check
     * 
     * TODO: Compare current collateral ratio with liquidation threshold to determine if liquidatable
     */
    function checkLiquidation(address user) public view {
        (uint256 collateral, uint256 debt) = stablecoin.vaults(user);
        if (debt == 0) {
            console.log("No active vault for user");
            return;
        }
        
        // TODO: Get the user's current collateralization ratio
        // Hint: stablecoin.getCurrentRatio(________);
        uint256 currentRatio = /* TODO: Write your code here */;
        
        uint256 liquidationThreshold = stablecoin.LIQUIDATION_THRESHOLD();
        
        console.log("Current collateral:", collateral);
        console.log("Current debt:", debt);
        console.log("Current ratio:", currentRatio);
        console.log("Liquidation threshold:", liquidationThreshold);
        
        // TODO: Calculate if the position is liquidatable (currentRatio < liquidationThreshold)
        console.log("Liquidatable:", /* TODO: Write your condition */);
    }

    /**
     * @notice Liquidate a position with collateral ratio below threshold
     * @param user Address of the user to liquidate
     * 
     * TODO: Call the liquidate function to execute liquidation
     */
    function liquidatePosition(address user) public {
        require(stablecoin.getCurrentRatio(user) < stablecoin.LIQUIDATION_THRESHOLD(), "Position not liquidatable");
        
        (uint256 collateral, uint256 debt) = stablecoin.vaults(user);
        console.log("Attempting to liquidate position with %d collateral and %d debt", collateral, debt);
             
        vm.broadcast();
        
        // TODO: Call the liquidate function
        /* TODO: Write your code here */
        
        console.log("Position liquidated successfully");
    }
}
