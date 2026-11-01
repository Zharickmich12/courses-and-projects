import { clusterApiUrl, Connection, PublicKey } from "@solana/web3.js";
import {
  getAccount,
  getAssociatedTokenAddress,
  getMint,
} from "@solana/spl-token";

// 1) Connect to devnet
const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

// 2) Public addresses (hardcoded is fine for this exercise)
const mint = new PublicKey("ErHT2A31PyTmLdo3TsyxsEJWrsYGfUXdMgUHEMz37ovo");
const wallets = {
  main: new PublicKey("CcLraYoRebmuQPgNJF4pujRuJtznxBZKCCxg1KuTwyKq"),
  second: new PublicKey("7cWEBVtyCGmwrJMaH2bemMofyKRpxFQid7Mqtcfote1j"),
};

async function main() {
  // 3) Read decimals from the mint (never hardcode 9)
  const mintInfo = await getMint(connection, mint);
  const decimals = mintInfo.decimals;
  console.log("Mint:    ", mint.toBase58());
  console.log("Decimals:", decimals);
  console.log("Supply:  ", Number(mintInfo.supply) / 10 ** decimals);
  console.log("");

  for (const [name, wallet] of Object.entries(wallets)) {
    // 4) Derive the ATA from wallet + mint
    const ata = await getAssociatedTokenAddress(mint, wallet);

    // 5) Fetch the token account data
    const account = await getAccount(connection, ata);

    // 6) Raw amount is in base units: divide by 10^decimals
    const readable = Number(account.amount) / 10 ** decimals;

    console.log(`${name} wallet:`, wallet.toBase58());
    console.log(`${name} ATA:   `, ata.toBase58());
    console.log(`${name} raw:   `, account.amount.toString());
    console.log(`${name} balance:`, readable);
    console.log("");
  }
}

main().catch(console.error);