// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "forge-std/Script.sol";
import "../src/UGPTToken.sol";
import "../src/RevenueVault.sol";
import "../src/MockRevenueOracle.sol";

/**
 * @title DeployUGPT
 * @author Neo Maredi
 * @notice Deployment script for UGPT Protocol
 */
contract DeployUGPT is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        console.log("Deploying UGPT Protocol...");
        console.log("Deployer:", vm.addr(deployerPrivateKey));

        // 1. Deploy UGPT Token (100M supply)
        UGPTToken token = new UGPTToken();
        console.log("UGPTToken:", address(token));

        // 2. Deploy Revenue Vault
        RevenueVault vault = new RevenueVault(address(token));
        console.log("RevenueVault:", address(vault));

        // 3. Deploy Mock Oracle (simulating $1M daily revenue as 1 ETH)
        MockRevenueOracle oracle = new MockRevenueOracle(1 ether);
        console.log("MockRevenueOracle:", address(oracle));

        // 4. Transfer some tokens to vault for initial liquidity (optional)
        token.transfer(address(vault), 1_000_000 * 10**18); // 1M tokens
        console.log("Transferred 1M UGPT to vault");

        vm.stopBroadcast();

        console.log("\n=== DEPLOYMENT COMPLETE ===");
        console.log("UGPTToken:", address(token));
        console.log("RevenueVault:", address(vault));
        console.log("MockRevenueOracle:", address(oracle));
    }
}