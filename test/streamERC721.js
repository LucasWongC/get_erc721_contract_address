import { expect } from 'chai'

import { getERC721CreationTxns } from '../utils/transactions.js'

describe('Check getERC721CreationTxns', function () {
  this.timeout(0)

  it('Test', async function () {
    const txns = await getERC721CreationTxns(13821429)

    expect(txns.addrList?.length).to.equal(1)

    expect(txns.addrList?.[0]).to.equal(
      '0xD16bdCCAe06DFD701a59103446A17e22e9ca0eF0',
    )
  })
})
