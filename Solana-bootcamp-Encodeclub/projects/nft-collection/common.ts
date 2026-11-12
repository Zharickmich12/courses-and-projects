import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { mplTokenMetadata } from '@metaplex-foundation/mpl-token-metadata'
import { keypairIdentity } from '@metaplex-foundation/umi'
import { readFileSync } from 'fs'
import { homedir } from 'os'

export function getUmi() {
  const umi = createUmi('https://api.devnet.solana.com').use(mplTokenMetadata())
  const secret = JSON.parse(readFileSync(homedir() + '/.config/solana/id.json', 'utf8'))
  const keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(secret))
  umi.use(keypairIdentity(keypair))
  return umi
}

export const BASE = 'https://raw.githubusercontent.com/Zharickmich12/courses-and-projects/main/Solana-bootcamp-Encodeclub/projects/nft-collection/assets/'
