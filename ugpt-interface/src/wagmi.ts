
import { http, createConfig } from 'wagmi'
import { sepolia } from 'wagmi/chains'
import { getDefaultConfig } from '@rainbow-me/rainbowkit'

export const config = getDefaultConfig({
  appName: 'UGPT Protocol',
  projectId: 'YOUR_WALLETCONNECT_PROJECT_ID', // Get from cloud.walletconnect.com
  chains: [sepolia],
  transports: {
    [sepolia.id]: http('https://eth-sepolia.g.alchemy.com/v2/dEsaXci3hjaxTdOQMlCl6'),
  },
})

// Your deployed contract addresses
export const CONTRACTS = {
  UGPTToken: '0xeFE87510E38EC4A46897821fc0f18a11f4DBD02D' as `0x${string}`,
  RevenueVault: '0x568BE97b33380a6628a32716205385aDa9F1275b' as `0x${string}`,
  MockRevenueOracle: '0x980944d3EFA7BD11A43b286fB2b594949bCa240E' as `0x${string}`,
}

// Simplified ABIs (just the functions we need)
export const UGPT_ABI = [
  {
    inputs: [{ name: 'spender', type: 'address' }, { name: 'amount', type: 'uint256' }],
    name: 'approve',
    outputs: [{ name: '', type: 'bool' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ name: 'account', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
] as const

export const VAULT_ABI = [
  {
    inputs: [{ name: 'amount', type: 'uint256' }],
    name: 'stake',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'claimRevenue',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ name: 'user', type: 'address' }],
    name: 'getStaker',
    outputs: [
      { name: 'staked', type: 'uint256' },
      { name: 'pending', type: 'uint256' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
] 