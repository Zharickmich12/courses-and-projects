import { createNft, verifyCollectionV1, findMetadataPda } from '@metaplex-foundation/mpl-token-metadata'
import { generateSigner, percentAmount } from '@metaplex-foundation/umi'
import { writeFileSync } from 'fs'
import { getUmi, BASE } from './common'

const opts = { send: { preflightCommitment: 'confirmed' as const }, confirm: { commitment: 'confirmed' as const } }
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

async function main() {
  const umi = getUmi()

  const collectionMint = generateSigner(umi)
  await createNft(umi, {
    mint: collectionMint,
    name: 'Bootcamp Collection',
    uri: BASE + 'collection.json',
    sellerFeeBasisPoints: percentAmount(0),
    isCollection: true,
  }).sendAndConfirm(umi, opts)
  console.log('Collection:', collectionMint.publicKey)

  const members: string[] = []
  for (let i = 1; i <= 3; i++) {
    const mint = generateSigner(umi)
    await createNft(umi, {
      mint,
      name: 'Bootcamp #' + i,
      uri: BASE + 'nft' + i + '.json',
      sellerFeeBasisPoints: percentAmount(0),
      collection: { key: collectionMint.publicKey, verified: false },
    }).sendAndConfirm(umi, opts)
    console.log('NFT ' + i + ':', mint.publicKey)

    let done = false
    for (let attempt = 1; attempt <= 6 && !done; attempt++) {
      await sleep(3000)
      try {
        await verifyCollectionV1(umi, {
          metadata: findMetadataPda(umi, { mint: mint.publicKey }),
          collectionMint: collectionMint.publicKey,
          authority: umi.identity,
        }).sendAndConfirm(umi, opts)
        done = true
        console.log('NFT ' + i + ' verified (attempt ' + attempt + ')')
      } catch (e: any) {
        console.log('NFT ' + i + ' verify attempt ' + attempt + ' failed: ' + (e.message || e).toString().split('\n')[0])
        if (attempt === 6) throw e
      }
    }
    members.push(mint.publicKey.toString())
  }

  writeFileSync('addresses.json', JSON.stringify({ collection: collectionMint.publicKey.toString(), members }, null, 2))
  console.log('Saved addresses.json')
}

main()
