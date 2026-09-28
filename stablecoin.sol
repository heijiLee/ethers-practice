// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@chainlink/contracts/src/v0.8/shared/interfaces/AggregatorV3Interface.sol";

/**
 * @title SimpleStablecoin
 * @notice A CDP (Collateralized Debt Position) system for minting stablecoins backed by ETH
 * @dev Key Concepts:
 * - Collateral Ratio: 150% - collateral value must be at least 1.5x the borrowed amount
 * - Liquidation Threshold: 130% - positions can be liquidated if ratio falls below 130%
 * - Uses Chainlink Price Feed for real-time ETH/USD pricing
 */
contract SimpleStablecoin is ERC20, ReentrancyGuard {
    AggregatorV3Interface public priceFeed;
    
    uint256 public constant COLLATERAL_RATIO = 15000; // 150%
    uint256 public constant RATIO_PRECISION = 10000;  // 100%
    uint256 public constant MIN_COLLATERAL = 0.1 ether;
    uint256 public constant LIQUIDATION_THRESHOLD = 13000; // 130%
    
    struct Vault {
        uint256 collateralAmount;
        uint256 debtAmount;
    }
    
    mapping(address => Vault) public vaults;
    
    event VaultUpdated(address indexed user, uint256 collateral, uint256 debt);
    event Liquidated(address indexed user, address indexed liquidator, uint256 debt, uint256 collateralSeized);

    constructor(address _priceFeed) ERC20("Simple USD", "sUSD") {
        priceFeed = AggregatorV3Interface(_priceFeed);
    }

    /**
     * @notice Gets the current ETH/USD price from Chainlink Price Feed
     * @return Current ETH price (8 decimals)
     * 
     * TODO: Call latestRoundData() from Chainlink to get the price
     * Hint: (, int256 price, , , ) = priceFeed.________();
     */
    function getEthPrice() public view returns (uint256) {
        (, int256 price, , , ) = /* TODO: Write your code here */;
        require(price > 0, "Invalid price");
        return uint256(price);
    }

    /**
     * @notice Mint stablecoins by depositing ETH as collateral
     * 
     * TODO: Complete 3 key logic points in this function
     * 1. Calculate collateral value in USD
     * 2. Calculate maximum safe debt (with 150% collateral ratio)
     * 3. Calculate additional mintable amount
     */
    function mint() external payable nonReentrant {
        require(msg.value >= MIN_COLLATERAL, "Below min collateral");
        
        Vault storage vault = vaults[msg.sender];
        uint256 ethPrice = getEthPrice();
        
        uint256 newCollateral = vault.collateralAmount + msg.value;
        
        // TODO 1: Calculate the collateral value in USD
        // Hint: (newCollateral * ethPrice) / ________
        // Chainlink prices use 8 decimals
        uint256 collateralValue = /* TODO: Write your code here */;
        
        // TODO 2: Calculate the maximum safe debt with 150% collateral ratio
        // Hint: (collateralValue * RATIO_PRECISION) / ________
        uint256 maxSafeDebt = /* TODO: Write your code here */;
        
        // TODO 3: Calculate the additional mintable amount
        uint256 additionalDebt = maxSafeDebt;
        if (vault.debtAmount > 0) {
            require(maxSafeDebt > vault.debtAmount, "No additional debt available");
            additionalDebt = /* TODO: Write your code here */;
        }
        
        vault.collateralAmount = newCollateral;
        vault.debtAmount += additionalDebt;
        
        _mint(msg.sender, additionalDebt);
        
        emit VaultUpdated(msg.sender, newCollateral, vault.debtAmount);
    }

    /**
     * @notice Repay stablecoins and withdraw collateral
     * @param amount Amount of stablecoins to repay
     * 
     * TODO: Complete the logic to return collateral when all debt is repaid
     */
    function repay(uint256 amount) external nonReentrant {
        Vault storage vault = vaults[msg.sender];
        require(vault.debtAmount >= amount, "Repaying too much");
        require(balanceOf(msg.sender) >= amount, "Insufficient balance");
        
        _burn(msg.sender, amount);
        vault.debtAmount -= amount;
        
        // TODO: If debt becomes 0, return all collateral to the user
        if (/* TODO: Write your condition */) {
            uint256 collateralToReturn = vault.collateralAmount;
            vault.collateralAmount = 0;
            (bool success, ) = msg.sender.call{value: collateralToReturn}("");
            require(success, "ETH transfer failed");
        }
        
        emit VaultUpdated(msg.sender, vault.collateralAmount, vault.debtAmount);
    }

    /**
     * @notice Calculate the current collateralization ratio for a user
     * @param user Address of the user to check
     * @return Collateralization ratio (10000 = 100%)
     * 
     * TODO: Complete the formula to calculate collateralization ratio
     * Formula: (collateral value * precision) / debt amount
     */
    function getCurrentRatio(address user) public view returns (uint256) {
        Vault storage vault = vaults[user];
        if (vault.debtAmount == 0) return type(uint256).max;
        
        uint256 ethPrice = getEthPrice();
        uint256 collateralValue = (vault.collateralAmount * ethPrice) / 1e8;
        
        // TODO: Calculate and return the collateralization ratio
        // Hint: (collateralValue * ________) / ________
        return /* TODO: Write your code here */;
    }

    /**
     * @notice Liquidate a user whose collateral ratio is below the threshold
     * @param user Address of the user to liquidate
     * 
     * TODO: Complete 2 key logic points in this function
     * 1. Check if the position is liquidatable (ratio below 130%)
     * 2. Calculate collateral to seize (convert debt to ETH)
     */
    function liquidate(address user) external nonReentrant {
        Vault storage vault = vaults[user];
        require(vault.debtAmount > 0, "No debt to liquidate");
        
        // TODO 1: Check if the collateral ratio is below the liquidation threshold
        require(/* TODO: Write your condition */, "Position not liquidatable");
        
        uint256 debtToRepay = vault.debtAmount;
        require(balanceOf(msg.sender) >= debtToRepay, "Insufficient balance to liquidate");
        
        uint256 ethPrice = getEthPrice();
        
        // TODO 2: Calculate the amount of collateral to seize (convert debt to ETH)
        // Hint: (debtToRepay * 1e8) / ________
        uint256 collateralToSeize = /* TODO: Write your code here */;
        
        require(collateralToSeize <= vault.collateralAmount, "Not enough collateral");
        
        vault.collateralAmount = 0;
        vault.debtAmount = 0;
        
        _burn(msg.sender, debtToRepay);
        
        (bool success, ) = msg.sender.call{value: collateralToSeize}("");
        require(success, "ETH transfer failed");
        
        emit Liquidated(user, msg.sender, debtToRepay, collateralToSeize);
        emit VaultUpdated(user, 0, 0);
    }

    receive() external payable {}
}

