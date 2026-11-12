import { Connection, PublicKey, clusterApiUrl } from "@solana/web3.js";

const PYTH_SOL_USD_ACCOUNT = new PublicKey("7UVimffxr9ow1uXYxsr4LHAcV58mLzhmwaeKvJ1pjLiE");
const SOL_USD_FEED_ID = "ef0d8b6fda2ceba41da15d4095d1da392a0d2f8ed0c6c7bc0f4cfac8c280b56d";

const SOL_MINT = "So11111111111111111111111111111111111111112";
const USDC_MINT = "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v";
const SOL_DECIMALS = 9;
const USDC_DECIMALS = 6;
const STALE_AFTER_SECONDS = 30;

type PythPrice = { price: number; confidence: number; publishTime: number };

function decodePriceUpdate(data: Buffer): PythPrice {
  for (const verificationBytes of [1, 2]) {
    const start = 8 + 32 + verificationBytes;
    if (data.length < start + 60) continue;
    if (data.subarray(start, start + 32).toString("hex") !== SOL_USD_FEED_ID) continue;

    let offset = start + 32;
    const rawPrice = data.readBigInt64LE(offset);
    offset += 8;
    const rawConfidence = data.readBigUInt64LE(offset);
    offset += 8;
    const exponent = data.readInt32LE(offset);
    offset += 4;
    const publishTime = Number(data.readBigInt64LE(offset));

    const scale = Math.pow(10, exponent);
    return {
      price: Number(rawPrice) * scale,
      confidence: Number(rawConfidence) * scale,
      publishTime,
    };
  }
  throw new Error(
    "SOL/USD feed id not found in the account data: wrong feed account, wrong network or unexpected layout"
  );
}

async function getPyth(): Promise<PythPrice> {
  const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
  const info = await connection.getAccountInfo(PYTH_SOL_USD_ACCOUNT);
  if (!info) {
    throw new Error("Pyth price account not found on devnet: check the feed id and the network");
  }
  return decodePriceUpdate(info.data);
}

async function getJupiter(): Promise<{ price: number }> {
  const apiKey = process.env.JUPITER_API_KEY;
  const base =
    process.env.JUPITER_QUOTE_URL ??
    (apiKey
      ? "https://api.jup.ag/swap/v1/quote"
      : "https://lite-api.jup.ag/swap/v1/quote");

  const params = new URLSearchParams({
    inputMint: SOL_MINT,
    outputMint: USDC_MINT,
    amount: String(Math.pow(10, SOL_DECIMALS)),
    slippageBps: "50",
  });

  const res = await fetch(`${base}?${params}`, {
    headers: apiKey ? { "x-api-key": apiKey } : {},
  });
  if (!res.ok) {
    throw new Error(`Jupiter quote failed: HTTP ${res.status} ${await res.text()}`);
  }
  const quote = (await res.json()) as { inAmount: string; outAmount: string };

  const solIn = Number(quote.inAmount) / Math.pow(10, SOL_DECIMALS);
  const usdcOut = Number(quote.outAmount) / Math.pow(10, USDC_DECIMALS);
  return { price: usdcOut / solIn };
}

async function main() {
  const pyth = await getPyth();
  const age = Math.max(0, Math.floor(Date.now() / 1000) - pyth.publishTime);

  console.log(
    `SOL/USD (Pyth):     $${pyth.price.toFixed(2)} +/- $${pyth.confidence.toFixed(4)}`
  );
  console.log(`Last updated:       ${age}s ago`);
  if (age > STALE_AFTER_SECONDS) {
    console.log(`WARNING: Pyth price is older than ${STALE_AFTER_SECONDS}s (stale)`);
  }

  const jupiter = await getJupiter();
  console.log(`SOL/USDC (Jupiter): $${jupiter.price.toFixed(2)} (for 1 SOL)`);

  const spread = (Math.abs(jupiter.price - pyth.price) / pyth.price) * 100;
  console.log(`Spread:             ${spread.toFixed(3)}%`);
}

main().catch((e) => {
  console.error(e.message ?? e);
  process.exit(1);
});
