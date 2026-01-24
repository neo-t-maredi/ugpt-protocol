# UGPT Protocol

> Uthmaniyah Gas Processing Token - Tokenized revenue sharing from industrial gas facility operations

**Built for ETH Riyadh 2026** | [View on Sepolia Etherscan](https://sepolia.etherscan.io/address/0x568BE97b33380a6628a32716205385aDa9F1275b)

---

## Overview

UGPT Protocol enables tokenized ownership and revenue distribution from the Uthmaniyah gas processing facility. Token holders stake UGPT to receive proportional ETH dividends from facility operations.

**Key Innovation:** Bridges traditional energy infrastructure revenue with DeFi mechanics, providing instant liquidity and transparent distribution.

---

## How It Works
```
1. Facility generates revenue from gas processing operations
2. Revenue is converted to ETH and distributed to the vault
3. UGPT holders stake tokens in the vault
4. Revenue is distributed proportionally to all stakers
5. Stakers claim their ETH dividends anytime
```

**Example:**
- Total Staked: 100,000 UGPT
- Alice stakes: 60,000 UGPT (60%)
- Bob stakes: 40,000 UGPT (40%)
- Facility distributes: 1 ETH
- Alice receives: 0.6 ETH
- Bob receives: 0.4 ETH

---

## Deployed Contracts (Sepolia Testnet)

| Contract | Address | Etherscan |
|----------|---------|-----------|
| **UGPTToken** | `0xeFE87510E38EC4A46897821fc0f18a11f4DBD02D` | [View](https://sepolia.etherscan.io/address/0xeFE87510E38EC4A46897821fc0f18a11f4DBD02D) |
| **RevenueVault** | `0x568BE97b33380a6628a32716205385aDa9F1275b` | [View](https://sepolia.etherscan.io/address/0x568BE97b33380a6628a32716205385aDa9F1275b) |
| **MockRevenueOracle** | `0x980944d3EFA7BD11A43b286fB2b594949bCa240E` | [View](https://sepolia.etherscan.io/address/0x980944d3EFA7BD11A43b286fB2b594949bCa240E) |

**Deployment Block:** 10113307  
**Gas Used:** 2,971,365  
**Cost:** 0.00333 ETH

---

## Architecture

**UGPTToken.sol**
- ERC20 token representing facility ownership shares
- Total Supply: 100,000,000 UGPT
- Fully transferable and tradeable

**RevenueVault.sol**
- Core staking and revenue distribution contract
- Users stake UGPT to earn ETH dividends
- Proportional distribution based on stake percentage
- Claim rewards anytime without unstaking

**MockRevenueOracle.sol**
- Simulates facility revenue data feed
- Production version would use Chainlink oracle
- Updates daily revenue figures

---

## Usage

**Stake UGPT tokens:**
```solidity
// Approve vault to spend your UGPT
ugptToken.approve(vaultAddress, amount);

// Stake tokens
revenueVault.stake(amount);
```

**Claim ETH dividends:**
```solidity
revenueVault.claimRevenue();
```

**Withdraw staked tokens:**
```solidity
revenueVault.withdraw(amount);
```

**Check pending rewards:**
```solidity
uint256 pending = revenueVault.pendingRevenue(userAddress);
```

---

## Testing
```bash
# Install dependencies
forge install

# Run test suite
forge test -vvv
```

**Test Coverage:**
- Stake UGPT tokens
- Distribute revenue
- Claim ETH dividends
- Withdraw staked tokens
- Proportional distribution accuracy

**Result:** All tests passing

---

## Local Deployment
```bash
# Setup environment
cp .env.example .env
# Add your PRIVATE_KEY and SEPOLIA_RPC_URL

# Deploy to Sepolia
forge script script/Deploy.s.sol:DeployUGPT \
  --rpc-url $SEPOLIA_RPC_URL \
  --private-key $PRIVATE_KEY \
  --broadcast \
  -vvvv
```

---

## Real-World Application

**For Uthmaniyah Facility:**
- Tokenize revenue streams without selling infrastructure
- Provide liquidity to operational capital
- Transparent revenue distribution to investors

**For Token Holders:**
- Exposure to industrial energy revenue
- Passive income from facility operations
- Liquid, tradeable asset representing real-world cash flows

**For Energy Sector:**
- Demonstrates tokenization of industrial assets
- Reduces capital requirements for expansion
- Opens institutional-grade infrastructure to DeFi

---

## Technical Stack

- **Solidity 0.8.20** - Smart contract language
- **Foundry** - Development framework
- **OpenZeppelin** - Security-audited contract libraries
- **Chainlink** - Oracle integration (production)
- **zkSync** - Multi-chain deployment ready

---

## Regulatory Considerations

**Securities Classification:**
UGPT likely qualifies as a security under the Howey Test (investment of money, common enterprise, expectation of profits from others' efforts). Proper securities registration or exemption required before public offering.

**Compliance Requirements:**
- KYC/AML for token holders
- Accredited investor verification (US)
- Saudi CMA registration (GCC deployment)
- Revenue reporting and transparency

**Risk Disclosures:**
- Facility operational risk
- Commodity price volatility
- Smart contract risk
- Regulatory changes

---

## Development Roadmap

- [x] Core contract implementation
- [x] Full test suite
- [x] Sepolia testnet deployment
- [ ] Chainlink oracle integration
- [ ] Multi-chain deployment (zkSync, Arbitrum)
- [ ] Security audit
- [ ] Legal structure and compliance
- [ ] Mainnet deployment

---

## Disclaimer

**This is a hackathon prototype for educational and demonstration purposes.**

NOT FOR PRODUCTION USE. No audit completed. Securities laws apply. Consult legal and financial advisors before any real-world implementation.

For production deployment, requirements include:
- Professional security audit
- Legal opinion on securities classification
- Regulatory compliance framework
- Real Chainlink price feeds
- Multi-sig governance
- Insurance and risk management

---

## Author

**Neo Maredi**  
Industrial Software Engineer | Blockchain Developer  
Uthmaniyah Gas Processing, Saudi Arabia

**Contact:**
- GitHub: [@neo-t-maredi](https://github.com/neo-t-maredi)
- ETH Riyadh 2026

---

## License

MIT License - See LICENSE file for details

---

**Built in one afternoon for ETH Riyadh 2026**