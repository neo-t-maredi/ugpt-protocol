// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title RevenueVault
 * @author Neo Maredi
 * @notice Stake UGPT tokens to earn ETH dividends from Uthmaniyah facility operations
 * @dev Revenue is distributed proportionally to all stakers based on their stake
 * 
 * HOW IT WORKS:
 * 1. Users stake UGPT tokens
 * 2. Facility owner distributes ETH revenue to vault
 * 3. Revenue is split proportionally among all stakers
 * 4. Users can claim their ETH dividends anytime
 * 5. Users can withdraw their staked UGPT tokens
 */
contract RevenueVault is Ownable, ReentrancyGuard {
    using SafeERC20 for IERC20;

    IERC20 public immutable UGPT_TOKEN;
    
    uint256 public totalStaked;         // Total UGPT tokens staked in vault
    uint256 public revenuePerToken;     // Accumulated revenue per token (scaled by 1e18 for precision)
    
    struct Staker {
        uint256 amount;                 // Amount of UGPT staked
        uint256 revenueDebt;            // Revenue already accounted for (prevents double-claiming)
    }
    
    mapping(address => Staker) public stakers;
    
    event Staked(address indexed user, uint256 amount);
    event Withdrawn(address indexed user, uint256 amount);
    event RevenueClaimed(address indexed user, uint256 amount);
    event RevenueDistributed(uint256 amount);

    /**
     * @notice Initialize the vault with UGPT token address
     * @param _ugptToken Address of the UGPT ERC20 token
     */
    constructor(address _ugptToken) Ownable(msg.sender) {
        UGPT_TOKEN = IERC20(_ugptToken);
    }

    /**
     * @notice Stake UGPT tokens to start earning revenue share
     * @param amount Number of UGPT tokens to stake (must approve vault first)
     * @dev Claims any pending revenue before updating stake
     * 
     * Example: Alice stakes 10,000 UGPT
     * - Facility distributes 1 ETH
     * - Alice can claim 1 ETH (if she's the only staker)
     */
    function stake(uint256 amount) external nonReentrant {
        require(amount > 0, "Cannot stake 0");
        
        // If user already has stake, claim their pending rewards first
        if (stakers[msg.sender].amount > 0) {
            _claimRevenue(msg.sender);
        }
        
        // Transfer UGPT from user to vault
        UGPT_TOKEN.safeTransferFrom(msg.sender, address(this), amount);
        
        // Update user's stake
        stakers[msg.sender].amount += amount;
        stakers[msg.sender].revenueDebt = (stakers[msg.sender].amount * revenuePerToken) / 1e18;
        totalStaked += amount;
        
        emit Staked(msg.sender, amount);
    }

    /**
     * @notice Withdraw staked UGPT tokens (claims pending revenue first)
     * @param amount Number of UGPT tokens to withdraw
     * @dev User must have sufficient stake
     * 
     * Example: Alice has 10,000 UGPT staked, withdraws 5,000
     * - Claims any pending ETH dividends first
     * - Receives 5,000 UGPT back
     * - Still earning on remaining 5,000 UGPT
     */
    function withdraw(uint256 amount) external nonReentrant {
        require(amount > 0, "Cannot withdraw 0");
        require(stakers[msg.sender].amount >= amount, "Insufficient stake");
        
        // Claim pending revenue before withdrawing
        _claimRevenue(msg.sender);
        
        // Update user's stake
        stakers[msg.sender].amount -= amount;
        stakers[msg.sender].revenueDebt = (stakers[msg.sender].amount * revenuePerToken) / 1e18;
        totalStaked -= amount;
        
        // Return UGPT to user
        UGPT_TOKEN.safeTransfer(msg.sender, amount);
        
        emit Withdrawn(msg.sender, amount);
    }

    /**
     * @notice Claim accumulated ETH revenue without withdrawing stake
     * @dev User continues earning on their staked UGPT after claiming
     * 
     * Example: Alice has 0.5 ETH pending
     * - Calls claimRevenue()
     * - Receives 0.5 ETH
     * - Still has UGPT staked and earning
     */
    function claimRevenue() external nonReentrant {
        _claimRevenue(msg.sender);
    }

    /**
     * @notice Internal function to process revenue claims
     * @param user Address claiming revenue
     * @dev Calculates pending amount and sends ETH
     */
    function _claimRevenue(address user) internal {
        uint256 pending = pendingRevenue(user);
        if (pending > 0) {
            // Update debt to prevent re-claiming
            stakers[user].revenueDebt = (stakers[user].amount * revenuePerToken) / 1e18;
            
            // Send ETH to user
            (bool success, ) = payable(user).call{value: pending}("");
            require(success, "ETH transfer failed");
            
            emit RevenueClaimed(user, pending);
        }
    }

    /**
     * @notice Facility owner distributes ETH revenue to all stakers (OWNER ONLY)
     * @dev Revenue is split proportionally based on stake percentage
     * 
     * Example: Total staked = 100,000 UGPT
     * - Alice has 60,000 (60%)
     * - Bob has 40,000 (40%)
     * - Owner sends 1 ETH
     * - Alice gets 0.6 ETH, Bob gets 0.4 ETH
     */
    function distributeRevenue() external payable onlyOwner {
        require(msg.value > 0, "No revenue to distribute");
        require(totalStaked > 0, "No stakers");
        
        // Calculate revenue per token (scaled by 1e18 for precision)
        revenuePerToken += (msg.value * 1e18) / totalStaked;
        
        emit RevenueDistributed(msg.value);
    }

    /**
     * @notice Calculate how much ETH a user can claim right now
     * @param user Address to check
     * @return Amount of ETH pending (in wei)
     * 
     * Example: Alice staked 10,000 UGPT
     * - Returns: 500000000000000000 (0.5 ETH)
     */
    function pendingRevenue(address user) public view returns (uint256) {
        Staker memory staker = stakers[user];
        if (staker.amount == 0) return 0;
        
        // Calculate: (staked amount * revenue per token) - already claimed
        uint256 accumulatedRevenue = (staker.amount * revenuePerToken) / 1e18;
        return accumulatedRevenue - staker.revenueDebt;
    }

    /**
     * @notice Get staker information (stake amount + pending revenue)
     * @param user Address to query
     * @return staked Amount of UGPT tokens staked
     * @return pending Amount of ETH ready to claim
     */
    function getStaker(address user) external view returns (uint256 staked, uint256 pending) {
        return (stakers[user].amount, pendingRevenue(user));
    }
}