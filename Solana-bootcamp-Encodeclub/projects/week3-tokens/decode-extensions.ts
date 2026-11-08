import { clusterApiUrl, Connection, PublicKey } from "@solana/web3.js";
import {
  ExtensionType,
  TOKEN_2022_PROGRAM_ID,
  getExtensionTypes,
  getMetadataPointerState,
  getMint,
  getTokenMetadata,
} from "@solana/spl-token";

const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
const mintAddress = new PublicKey("DzwcvQyVNRtpqXKbaK2BoZU1NmJHaDjtxs4bHeST2bz9");

async function main() {
  // 1) Which program owns the mint?
  const info = await connection.getAccountInfo(mintAddress);
  console.log("Owner program:", info?.owner.toBase58());
  console.log("Is Token-2022:", info?.owner.equals(TOKEN_2022_PROGRAM_ID));

  // 2) Base mint fields (decimals come from the mint, never hardcoded)
  const mint = await getMint(connection, mintAddress, "confirmed", TOKEN_2022_PROGRAM_ID);
  console.log("Decimals:", mint.decimals);
  console.log("Supply (raw):", mint.supply.toString());
  console.log("Supply:", Number(mint.supply) / 10 ** mint.decimals);
  console.log("Mint authority:", mint.mintAuthority?.toBase58());

  // 3) Which extensions are enabled?
  const types = getExtensionTypes(mint.tlvData);
  console.log("Extensions:", types.map((t) => ExtensionType[t]));
  console.log("Non-transferable:", types.includes(ExtensionType.NonTransferable));

  // 4) Decode the metadata pointer
  const pointer = getMetadataPointerState(mint);
  console.log("Pointer authority:", pointer?.authority?.toBase58());
  console.log("Pointer metadata address:", pointer?.metadataAddress?.toBase58());

  // 5) Decode the metadata stored on the mint
  const metadata = await getTokenMetadata(connection, mintAddress);
  console.log("Name:  ", metadata?.name);
  console.log("Symbol:", metadata?.symbol);
  console.log("URI:   ", metadata?.uri);
}

main().catch(console.error);