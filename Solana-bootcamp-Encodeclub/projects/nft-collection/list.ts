import { fetchDigitalAsset } from '@metaplex-foundation/mpl-token-metadata'
import { publicKey, unwrapOption } from '@metaplex-foundation/umi'
import { readFileSync } from 'fs'
import { getUmi } from './common'

async function main() {
  const umi = getUmi()
  const { collection, members } = JSON.parse(readFileSync('addresses.json', 'utf8'))

  for (const address of members) {
    const asset = await fetchDigitalAsset(umi, publicKey(address))
    const json = await (await fetch(asset.metadata.uri)).json()
    const col = unwrapOption(asset.metadata.collection)

    console.log('---')
    console.log('Mint:       ', address)
    console.log('Name:       ', json.name)
    console.log('Image:      ', json.image)
    console.log('Collection: ', col ? col.key.toString() : 'none', col && col.verified ? '(verified)' : '(NOT verified)')
    console.log('Expected:   ', collection)
    for (const a of json.attributes) console.log('  ' + a.trait_type + ': ' + a.value)
  }
}

main()
