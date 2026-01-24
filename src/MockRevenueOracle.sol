// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title MockRevenueOracle
 * @author Neo Maredi
 * @notice Simulates Uthmaniyah gas processing facility revenue data
 * @dev In production, this would be replaced with Chainlink oracle reading real facility data
 */
contract MockRevenueOracle is Ownable {
    uint256 public dailyRevenue; // Revenue in wei (simulating USD converted to ETH)
    uint256 public lastUpdateTime;
    
    event RevenueUpdated(uint256 newRevenue, uint256 timestamp);

    constructor(uint256 _initialRevenue) Ownable(msg.sender) {
        dailyRevenue = _initialRevenue;
        lastUpdateTime = block.timestamp;
    }

    /**
     * @notice Update daily revenue (simulates real facility data feed)
     * @param _newRevenue New daily revenue in wei
     */
    function updateRevenue(uint256 _newRevenue) external onlyOwner {
        dailyRevenue = _newRevenue;
        lastUpdateTime = block.timestamp;
        emit RevenueUpdated(_newRevenue, block.timestamp);
    }

    /**
     * @notice Get current daily revenue
     * @return Current revenue and last update time
     */
    function getRevenue() external view returns (uint256, uint256) {
        return (dailyRevenue, lastUpdateTime);
    }
}