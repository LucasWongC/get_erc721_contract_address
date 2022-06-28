import ethers from 'ethers'
import EventEmitter from 'events'
import { RPC_URL } from '../config.js'

const rpcProvider = new ethers.providers.JsonRpcProvider(RPC_URL)

/*

    "095ea7b3": "approve(address,uint256)",
    "70a08231": "balanceOf(address)",
    "081812fc": "getApproved(uint256)",
    "e985e9c5": "isApprovedForAll(address,address)",
    "06fdde03": "name()",
    "6352211e": "ownerOf(uint256)",
    "42842e0e": "safeTransferFrom(address,address,uint256)",
    "b88d4fde": "safeTransferFrom(address,address,uint256,bytes)",
    "a22cb465": "setApprovalForAll(address,bool)",
    "01ffc9a7": "supportsInterface(bytes4)",
    "95d89b41": "symbol()",
    "c87b56dd": "tokenURI(uint256)",
    "23b872dd": "transferFrom(address,address,uint256)"

*/

/**
 * @dev Check whether txn is ERC721 creation or not.
 * @param {object} txn - Ethereum transaction to check
 * @returns {boolean}
 */

export const isERC721CreationTxn = (txn) => {
  if (txn.to !== null) {
    return false
  }

  const bytecode = txn.data.toLowerCase()

  let isERC721 = true

  isERC721 &= bytecode.includes('095ea7b3')
  isERC721 &= bytecode.includes('70a08231')
  isERC721 &= bytecode.includes('6352211e')
  isERC721 &= bytecode.includes('c87b56dd')
  isERC721 &= bytecode.includes('23b872dd')

  return isERC721
}

/**
 * @dev Get ERC721 Contract Creation txns in the block.
 * @param {number} blockNumber - Block number to scan txns
 * @returns {object} blockNumber and array of created ERC721 contract addresses
 */

export const getERC721CreationTxns = async (blockNumber) => {
  const txns = await rpcProvider.getBlockWithTransactions(blockNumber)

  const creationTxns = txns.transactions.filter(isERC721CreationTxn)

  const erc721AddrList = creationTxns.map((item) => item.creates)

  return {
    blockNumber,
    addrList: erc721AddrList,
  }
}

export class StreamERC721 extends EventEmitter {
  constructor() {
    super()
    this.intervalId = null
    this.loading = false
    this.currentBlock = 0
  }

  /**
   * @dev Start streaming ERC721 contract creation txns from N-th block.
   * @param {number} blockNumber - Block number to start scan
   *
   * Emit an event when ERC721 Contract Creation Txns are found
   *
   */

  start = async (blockNumber) => {
    if (this.intervalId) {
      clearInterval(this.intervalId)
    }

    this.currentBlock = blockNumber

    setInterval(async () => {
      if (this.loading === true) {
        return
      }

      this.loading = true

      const txns = await getERC721CreationTxns(this.currentBlock)

      txns.addrList?.length && this.emit('data', txns)

      this.currentBlock++

      this.loading = false
    }, 500)
  }

  /**
   * @dev Stop streaming.
   */

  stop = () => {
    if (this.intervalId) {
      clearInterval(this.intervalId)
    }
    this.intervalId = undefined
  }
}
