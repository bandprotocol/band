import IPFS from 'nano-ipfs-store'
import bs58 from 'bs58'

export default class IPFSStorage {
  static ipfs = IPFS.at('https://ipfs.bandprotocol.com')

  static async get(dataHash) {
    const bytes = Buffer.from('01551220' + dataHash.slice(2), 'hex')
    const cid = 'z' + bs58.encode(bytes)
    let result = null
    while (true) {
      try {
        result = JSON.parse(await IPFSStorage.ipfs.cat(cid))
        break
      } catch {}
    }
    return result
  }

  static async save(data) {
    const cid = await IPFSStorage.ipfs.add(data)
    if (cid.slice(0, 1) !== 'z') throw new Error('First character should be z.')
    const dataHash = bs58.decode(cid.slice(1)).toString('hex')
    if (dataHash.slice(0, 8) !== '01551220')
      throw new Error('It should be IPFS prefix format.')
    return '0x' + dataHash.slice(8)
  }
}

window.ipfs = IPFSStorage
