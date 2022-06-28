import dotenv from 'dotenv'

import ethers from 'ethers'

dotenv.config()

export const RPC_URL = process.env.RPC_URL || ''

export const rpcProvider = new ethers.providers.JsonRpcProvider(RPC_URL)
