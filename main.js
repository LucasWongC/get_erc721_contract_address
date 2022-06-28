import './config.js'

import { StreamERC721, getERC721CreationTxns } from './utils/transactions.js'

async function main() {
  const stream = new StreamERC721()

  // 'data' event is emitted when txns are found
  // so we can define our own handler
  stream.on('data', (item) => {
    console.log(item)
  })

  stream.start(13821429)
}

main()
