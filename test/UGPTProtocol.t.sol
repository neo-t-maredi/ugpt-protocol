// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "forge-std/Test.sol";
import "../src/UGPTToken.sol";
import "../src/RevenueVault.sol";
import "../src/MockRevenueOracle.sol";

/**
 * @title UGPTProtocolTest
 * @author Neo Maredi
 * @notice Test suite for UGPT Protocol
 */
contract UGPTProtocolTest is Test {
    UGPTToken token;
    RevenueVault vault;
    MockRevenueOracle oracle;
    
    address alice = address(0x1);
    address bob = address(0x2);
    
    function setUp() public {
        // Deploy contracts
        token = new UGPTToken();
        vault = new RevenueVault(address(token));
        oracle = new MockRevenueOracle(1 ether); // $1M daily revenue simulated as 1 ETH
        
        // Give Alice and Bob some tokens
        token.transfer(alice, 10_000 * 10**18);
        token.transfer(bob, 5_000 * 10**18);
        
        // Approve vault
        vm.prank(alice);
        token.approve(address(vault), type(uint256).max);
        
        vm.prank(bob);
        token.approve(address(vault), type(uint256).max);
    }
    
    function testStake() public {
        vm.prank(alice);
        vault.stake(1000 * 10**18);
        
        (uint256 staked, ) = vault.getStaker(alice);
        assertEq(staked, 1000 * 10**18);
        assertEq(vault.totalStaked(), 1000 * 10**18);
    }
    
    function testRevenueDistribution() public {
        // Alice and Bob stake
        vm.prank(alice);
        vault.stake(10_000 * 10**18);
        
        vm.prank(bob);
        vault.stake(5_000 * 10**18);
        
        // Distribute 1.5 ETH revenue
        vm.deal(address(this), 1.5 ether);
        vault.distributeRevenue{value: 1.5 ether}();
        
        // Alice should get 2/3 (1 ETH), Bob gets 1/3 (0.5 ETH)
        (, uint256 alicePending) = vault.getStaker(alice);
        (, uint256 bobPending) = vault.getStaker(bob);
        
        assertEq(alicePending, 1 ether);
        assertEq(bobPending, 0.5 ether);
    }
    
    function testClaimRevenue() public {
        vm.prank(alice);
        vault.stake(10_000 * 10**18);
        
        // Distribute revenue
        vm.deal(address(this), 1 ether);
        vault.distributeRevenue{value: 1 ether}();
        
        // Alice claims
        uint256 balanceBefore = alice.balance;
        vm.prank(alice);
        vault.claimRevenue();
        
        assertEq(alice.balance - balanceBefore, 1 ether);
    }
    
    function testWithdraw() public {
        vm.prank(alice);
        vault.stake(10_000 * 10**18);
        
        vm.prank(alice);
        vault.withdraw(5_000 * 10**18);
        
        (uint256 staked, ) = vault.getStaker(alice);
        assertEq(staked, 5_000 * 10**18);
    }
}