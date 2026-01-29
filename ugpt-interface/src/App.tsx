import { useState } from 'react'
import { ArrowRight, ExternalLink, Zap, Shield, TrendingUp } from 'lucide-react'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useAccount, useReadContract, useWriteContract } from 'wagmi'
import { parseEther, formatEther } from 'viem'
import { CONTRACTS, UGPT_ABI, VAULT_ABI } from './wagmi'

export default function App() {
  const [stakeAmount, setStakeAmount] = useState('0.00')
  const { address, isConnected } = useAccount()
  
  const { data: ugptBalance } = useReadContract({
    address: CONTRACTS.UGPTToken,
    abi: UGPT_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
  })

  const { data: stakerInfo } = useReadContract({
    address: CONTRACTS.RevenueVault,
    abi: VAULT_ABI,
    functionName: 'getStaker',
    args: address ? [address] : undefined,
  })

  const { writeContract: approveUGPT, isPending: isApproving } = useWriteContract()
  const { writeContract: stakeUGPT, isPending: isStaking } = useWriteContract()

  const userBalance = ugptBalance ? formatEther(ugptBalance) : '0.00'
  const stakedAmount = stakerInfo ? formatEther(stakerInfo[0]) : '0.00'
  const pendingRewards = stakerInfo ? formatEther(stakerInfo[1]) : '0.00'

  const handleApprove = () => {
    if (!stakeAmount || parseFloat(stakeAmount) <= 0) return
    approveUGPT({
      address: CONTRACTS.UGPTToken,
      abi: UGPT_ABI,
      functionName: 'approve',
      args: [CONTRACTS.RevenueVault, parseEther(stakeAmount)],
    })
  }

  const handleStake = () => {
    if (!stakeAmount || parseFloat(stakeAmount) <= 0) return
    stakeUGPT({
      address: CONTRACTS.RevenueVault,
      abi: VAULT_ABI,
      functionName: 'stake',
      args: [parseEther(stakeAmount)],
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a0f] via-[#0d1117] to-[#0a0a0f] text-white">
      <header className="border-b border-white/10 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="w-8 h-8 text-cyan-400" />
              <span className="text-xl font-bold">UGPT Protocol</span>
            </div>
            <nav className="hidden md:flex items-center gap-8">
              <a href="#dashboard" className="text-white/60 hover:text-white transition">Dashboard</a>
              <a href="#facility" className="text-white/60 hover:text-white transition">Facility Data</a>
              <a href="#staking" className="text-white/60 hover:text-white transition">Staking</a>
              <a href="#docs" className="text-white/60 hover:text-white transition">Docs</a>
            </nav>
            <ConnectButton />
          </div>
        </div>
      </header>

      <section className="container mx-auto px-6 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-cyan-500/10 border border-cyan-500/20 rounded-full text-cyan-400 text-sm mb-6">
              <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
              LIVE ON SEPOLIA
            </div>
            
            <h1 className="text-6xl font-bold mb-6">
              Tokenized Ownership of{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
                Uthmaniyah Gas
              </span>
            </h1>
            
            <p className="text-xl text-white/60 mb-8">
              Stake UGPT tokens. Earn real-yield ETH dividends generated directly
              from facility operations. Verified on-chain, distributed automatically.
            </p>

            <div className="flex items-center gap-4 mb-8">
              <button className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 rounded-lg font-medium flex items-center gap-2 transition">
                Start Staking
                <ArrowRight className="w-5 h-5" />
              </button>
              <a 
                href={`https://sepolia.etherscan.io/address/${CONTRACTS.RevenueVault}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 border border-white/20 hover:border-white/40 rounded-lg font-medium flex items-center gap-2 transition"
              >
                View Contract
                <ExternalLink className="w-5 h-5" />
              </a>
            </div>

            {isConnected && (
              <div className="grid grid-cols-3 gap-4 p-4 bg-white/5 border border-white/10 rounded-lg mb-6">
                <div>
                  <div className="text-sm text-white/60">UGPT Balance</div>
                  <div className="text-lg font-bold">{parseFloat(userBalance).toFixed(2)}</div>
                </div>
                <div>
                  <div className="text-sm text-white/60">Staked</div>
                  <div className="text-lg font-bold text-cyan-400">{parseFloat(stakedAmount).toFixed(2)}</div>
                </div>
                <div>
                  <div className="text-sm text-white/60">Pending Rewards</div>
                  <div className="text-lg font-bold text-green-400">{parseFloat(pendingRewards).toFixed(4)} ETH</div>
                </div>
              </div>
            )}

            <div className="flex items-center gap-6">
              <div className="flex -space-x-2">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 border-2 border-[#0a0a0f]" />
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-500 border-2 border-[#0a0a0f]" />
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-red-500 border-2 border-[#0a0a0f]" />
              </div>
              <span className="text-white/60">1,200+ Stakers</span>
            </div>
          </div>

          <div className="bg-gradient-to-br from-white/5 to-white/0 border border-white/10 rounded-2xl p-8 backdrop-blur-xl">
            <h3 className="text-2xl font-bold mb-6">Stake & Earn</h3>
            <p className="text-white/60 mb-6">
              Deposit UGPT to receive proportional ETH rewards
            </p>

            {!isConnected ? (
  <div className="text-center py-16">
    <div className="relative p-8 rounded-2xl bg-gradient-to-br from-white/5 to-white/0 border border-white/10 backdrop-blur-sm">
      <Zap className="w-16 h-16 text-cyan-400 mx-auto mb-4 opacity-50" />
      <p className="text-xl font-bold text-white mb-2">Wallet Not Connected</p>
      <p className="text-white/60">Use the Connect Wallet button above to get started</p>
    </div>
  </div>
) : (
              <>
                <div className="space-y-4 mb-6">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-white/60">Amount to Stake</span>
                      <span className="text-sm text-white/60">Balance: {parseFloat(userBalance).toFixed(2)} UGPT</span>
                    </div>
                    <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-lg p-4">
                      <input
                        type="number"
                        value={stakeAmount}
                        onChange={(e) => setStakeAmount(e.target.value)}
                        className="flex-1 bg-transparent text-2xl outline-none"
                        placeholder="0.00"
                      />
                      <button 
                        onClick={() => setStakeAmount(userBalance)}
                        className="px-4 py-2 bg-cyan-500/20 text-cyan-400 rounded-lg text-sm font-medium hover:bg-cyan-500/30 transition"
                      >
                        MAX
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                    <span className="text-sm text-white/60">Estimated APY</span>
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-green-400" />
                      <span className="text-green-400 font-bold">14.2%</span>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-white/60">Reward Rate</span>
                      <span>0.004 ETH / Day</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/60">Lock Period</span>
                      <span>14 Days</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <button 
                    onClick={handleApprove}
                    disabled={isApproving || !stakeAmount || parseFloat(stakeAmount) <= 0}
                    className="w-full py-4 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg font-bold text-lg transition"
                  >
                    {isApproving ? 'Approving...' : 'Approve UGPT'}
                  </button>
                  <button 
                    onClick={handleStake}
                    disabled={isStaking || !stakeAmount || parseFloat(stakeAmount) <= 0}
                    className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg font-bold text-lg transition"
                  >
                    {isStaking ? 'Staking...' : 'Stake UGPT'}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      <section className="container mx-auto px-6 py-12">
        <div className="grid md:grid-cols-4 gap-6">
          <div className="bg-gradient-to-br from-white/5 to-white/0 border border-white/10 rounded-xl p-6 backdrop-blur-xl">
            <div className="text-white/60 text-sm mb-2">Total Value Locked</div>
            <div className="text-3xl font-bold mb-1">$42,500,000</div>
            <div className="text-green-400 text-sm">+$8.5M (24h)</div>
          </div>
          
          <div className="bg-gradient-to-br from-white/5 to-white/0 border border-white/10 rounded-xl p-6 backdrop-blur-xl">
            <div className="text-white/60 text-sm mb-2">ETH Distributed</div>
            <div className="text-3xl font-bold text-yellow-400 mb-1">1,240 ETH</div>
            <div className="text-green-400 text-sm">+$3.8M USD</div>
          </div>
          
          <div className="bg-gradient-to-br from-white/5 to-white/0 border border-white/10 rounded-xl p-6 backdrop-blur-xl">
            <div className="text-white/60 text-sm mb-2">Gas Flow Rate</div>
            <div className="text-3xl font-bold mb-1">3.2 Bcf/d</div>
            <div className="text-green-400 text-sm">+8.2% (MoM)</div>
          </div>
          
          <div className="bg-gradient-to-br from-white/5 to-white/0 border border-white/10 rounded-xl p-6 backdrop-blur-xl">
            <div className="text-white/60 text-sm mb-2">UGPT Price</div>
            <div className="text-3xl font-bold text-cyan-400 mb-1">$12.40</div>
            <div className="text-green-400 text-sm">+2.4% (24h)</div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-6 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="relative rounded-2xl overflow-hidden">
            <img 
              src="https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?w=800&q=80"
              alt="Uthmaniyah Gas Processing Facility"
              className="w-full h-[500px] object-cover"
            />
            <div className="absolute bottom-6 left-6 bg-black/60 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/20">
              <div className="text-sm text-white/60">Daily Output</div>
              <div className="text-2xl font-bold">2.1M Barrels</div>
            </div>
          </div>

          <div>
            <h2 className="text-5xl font-bold mb-6">The Underlying Asset</h2>
            <p className="text-xl text-white/60 mb-8">
              The Uthmaniyah Gas Plant is one of the world's largest gas processing
              facilities. Through UGPT, we bridge revenue generated from this
              industrial giant directly to the Ethereum blockchain.
            </p>
            <p className="text-white/60 mb-8">
              Token holders receive a claim on a portion of the net revenue, distributed in
              ETH via smart contracts. This represents the first scalable
              implementation of industrial Real World Assets (RWA) in DeFi.
            </p>

            <div className="space-y-4">
              <div className="flex items-start gap-4 p-4 bg-white/5 border border-white/10 rounded-lg">
                <Shield className="w-6 h-6 text-cyan-400 flex-shrink-0 mt-1" />
                <div>
                  <div className="font-bold mb-1">Real-time Revenue Audit</div>
                  <div className="text-sm text-white/60">
                    Oracle verify flow rate data every 6 hours.
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-white/5 border border-white/10 rounded-lg">
                <Zap className="w-6 h-6 text-yellow-400 flex-shrink-0 mt-1" />
                <div>
                  <div className="font-bold mb-1">Automated ETH Buybacks</div>
                  <div className="text-sm text-white/60">
                    Revenue is automatically converted to ETH for yield.
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-white/5 border border-white/10 rounded-lg">
                <TrendingUp className="w-6 h-6 text-green-400 flex-shrink-0 mt-1" />
                <div>
                  <div className="font-bold mb-1">Transparent Operations</div>
                  <div className="text-sm text-white/60">
                    Full on-chain visibility of facility performance.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <h2 className="text-5xl font-bold mb-4">Revenue Flow</h2>
          <p className="text-xl text-white/60">
            How revenue travels from the Uthmaniyah facility to your wallet.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 relative">
          <div className="hidden md:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-cyan-500/0 via-cyan-500/50 to-cyan-500/0 -translate-y-1/2" />
          
          <div className="relative bg-gradient-to-br from-white/5 to-white/0 border border-white/10 rounded-xl p-8 backdrop-blur-xl text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <Zap className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold mb-2">Gas Facility</h3>
            <p className="text-white/60">
              Uthmaniyah generates revenue from gas processing operations
            </p>
          </div>

          <div className="relative bg-gradient-to-br from-white/5 to-white/0 border border-white/10 rounded-xl p-8 backdrop-blur-xl text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <Shield className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold mb-2">Smart Contract</h3>
            <p className="text-white/60">
              Oracle converts and distributes dividends in ETH
            </p>
          </div>

          <div className="relative bg-gradient-to-br from-white/5 to-white/0 border border-white/10 rounded-xl p-8 backdrop-blur-xl text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <TrendingUp className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold mb-2">UGPT Stakers</h3>
            <p className="text-white/60">
              Proportional rewards distributed to all token holders
            </p>
          </div>
        </div>

        <div className="mt-16 bg-gradient-to-br from-white/5 to-white/0 border border-white/10 rounded-xl p-8 backdrop-blur-xl">
          <h3 className="text-2xl font-bold mb-6">Distribution Split</h3>
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="relative h-64">
              <svg viewBox="0 0 200 200" className="w-full h-full">
                <circle cx="100" cy="100" r="80" fill="none" stroke="#1e293b" strokeWidth="40" />
                <circle 
                  cx="100" cy="100" r="80" 
                  fill="none" 
                  stroke="#06b6d4" 
                  strokeWidth="40"
                  strokeDasharray="377 503"
                  strokeDashoffset="0"
                  transform="rotate(-90 100 100)"
                />
                <circle 
                  cx="100" cy="100" r="80" 
                  fill="none" 
                  stroke="#eab308" 
                  strokeWidth="40"
                  strokeDasharray="126 503"
                  strokeDashoffset="-377"
                  transform="rotate(-90 100 100)"
                />
                <text x="100" y="100" textAnchor="middle" dy="0.3em" className="text-4xl font-bold fill-white">
                  100%
                </text>
              </svg>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-cyan-400 rounded" />
                  <span className="font-medium">Staking Rewards</span>
                </div>
                <span className="font-bold">75%</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-yellow-400 rounded" />
                  <span className="font-medium">Operational Costs</span>
                </div>
                <span className="font-bold">15%</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-white/20 rounded" />
                  <span className="font-medium">Liquidity</span>
                </div>
                <span className="font-bold">10%</span>
              </div>
            </div>
          </div>

          <div className="mt-8 p-4 bg-cyan-500/10 border border-cyan-500/20 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-cyan-400 font-medium">Next Distribution</span>
              <span className="text-white font-bold">04:12:33</span>
            </div>
            <div className="mt-2 h-1 bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-cyan-500 to-blue-500" style={{ width: '65%' }} />
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-white/10 mt-20">
        <div className="container mx-auto px-6 py-12">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Zap className="w-6 h-6 text-cyan-400" />
                <span className="text-lg font-bold">UGPT Protocol</span>
              </div>
              <p className="text-white/60 text-sm">
                Bringing decentralized revenue bridging industrial energy assets to Ethereum yield.
              </p>
            </div>

            <div>
              <h4 className="font-bold mb-4">Protocol</h4>
              <ul className="space-y-2 text-sm text-white/60">
                <li><a href="#" className="hover:text-white transition">Governance</a></li>
                <li><a href="#" className="hover:text-white transition">Tokenomics</a></li>
                <li><a href="#" className="hover:text-white transition">Audits</a></li>
                <li><a href="#" className="hover:text-white transition">Bug Bounty</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-white/60">
                <li><a href="#" className="hover:text-white transition">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white transition">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition">Risk Disclosure</a></li>
                <li><a href="#" className="hover:text-white transition">Asset Verification</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-white/60">
                <li><a href="#" className="hover:text-white transition">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition">Documentation</a></li>
                <li><a href="#" className="hover:text-white transition">API</a></li>
                <li><a href="#" className="hover:text-white transition">Contact Support</a></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-white/40 text-sm">
              © 2026 UGPT Protocol. All rights reserved.
            </p>
            <div className="flex items-center gap-2 text-green-400">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-sm">Live on Sepolia Testnet</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}