// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title UGPTToken
 * @author Neo Maredi
 * @notice Uthmaniyah Gas Processing Token - Revenue-share token for gas facility operations
 * @dev ERC20 token with fixed supply of 100M tokens
 */
contract UGPTToken is ERC20, Ownable {
    uint256 public constant TOTAL_SUPPLY = 100_000_000 * 10**18; // 100 million tokens

    constructor() ERC20("Uthmaniyah Gas Processing Token", "UGPT") Ownable(msg.sender) {
        _mint(msg.sender, TOTAL_SUPPLY);
    }

    /**
     * @notice Mint additional tokens (only owner)
     * @dev Reserved for future tokenization of additional facilities
     */
    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }
}