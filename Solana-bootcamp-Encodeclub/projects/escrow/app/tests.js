const anchor = require("@anchor-lang/core");
const { PublicKey, Keypair, SystemProgram } = require("@solana/web3.js");
const {
  TOKEN_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID,
  createMint,
  getOrCreateAssociatedTokenAccount,
  getAssociatedTokenAddressSync,
  mintTo,
  getAccount,
  getMint,
} = require("@solana/spl-token");
const fs = require("fs");
const os = require("os");
const path = require("path");

const DECIMALS = 6;
const UNIT = 10 ** DECIMALS;

function loadKeypair(file) {
  return Keypair.fromSecretKey(
    Uint8Array.from(JSON.parse(fs.readFileSync(file, "utf8")))
  );
}

async function main() {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  const conn = provider.connection;

  const idl = JSON.parse(
    fs.readFileSync(path.join(__dirname, "../target/idl/escrow.json"), "utf8")
  );
  const program = new anchor.Program(idl, provider);

  const maker = loadKeypair(process.env.ANCHOR_WALLET);
  const taker = loadKeypair(path.join(os.homedir(), "second-wallet.json"));

  console.log("Program ID:", program.programId.toBase58());
  console.log("Maker:     ", maker.publicKey.toBase58());
  console.log("Taker:     ", taker.publicKey.toBase58());

  const results = [];
  const check = (label, ok, detail = "") => {
    results.push(ok);
    console.log(`${ok ? "PASS" : "FAIL"}  ${label}${detail ? " -> " + detail : ""}`);
  };

  const expectFail = async (label, fn) => {
    try {
      await fn();
      check(label, false, "it succeeded but should have failed");
    } catch (e) {
      const code = e.error?.errorCode?.code;
      const first = (e.message || "").split("\n")[0];
      check(label, true, code ?? first);
    }
  };

  const escrowPda = (seed) =>
    PublicKey.findProgramAddressSync(
      [
        Buffer.from("escrow"),
        maker.publicKey.toBuffer(),
        new anchor.BN(seed).toArrayLike(Buffer, "le", 8),
      ],
      program.programId
    )[0];
  const ata = (mint, owner, offCurve = false) =>
    getAssociatedTokenAddressSync(mint, owner, offCurve);
  const amountOf = async (account) => {
    try {
      return Number((await getAccount(conn, account)).amount) / UNIT;
    } catch {
      return null;
    }
  };
  const exists = async (key) => (await conn.getAccountInfo(key)) !== null;

  // ---------- setup: three mints, funded accounts ----------
  const mintA = await createMint(conn, maker, maker.publicKey, null, DECIMALS);
  const mintB = await createMint(conn, maker, maker.publicKey, null, DECIMALS);
  const mintC = await createMint(conn, maker, maker.publicKey, null, DECIMALS);

  const makerAtaA = (await getOrCreateAssociatedTokenAccount(conn, maker, mintA, maker.publicKey)).address;
  const takerAtaB = (await getOrCreateAssociatedTokenAccount(conn, maker, mintB, taker.publicKey)).address;
  const takerAtaC = (await getOrCreateAssociatedTokenAccount(conn, maker, mintC, taker.publicKey)).address;
  const takerAtaA = (await getOrCreateAssociatedTokenAccount(conn, maker, mintA, taker.publicKey)).address;

  await mintTo(conn, maker, mintA, makerAtaA, maker, 1000 * UNIT);
  await mintTo(conn, maker, mintB, takerAtaB, maker, 1000 * UNIT);
  await mintTo(conn, maker, mintC, takerAtaC, maker, 1000 * UNIT);

  const supplies = async () =>
    [mintA, mintB, mintC].map(async (m) => (await getMint(conn, m)).supply.toString());
  const supplyBefore = await Promise.all(await supplies());
  console.log("Mint A:", mintA.toBase58());
  console.log("Mint B:", mintB.toBase58());
  console.log("Mint C (wrong mint):", mintC.toBase58());

  const makerAtaB = ata(mintB, maker.publicKey);
  const snap = async (label) => {
    console.log(
      `  [${label}] maker A=${await amountOf(makerAtaA)} B=${await amountOf(makerAtaB)} | taker A=${await amountOf(takerAtaA)} B=${await amountOf(takerAtaB)}`
    );
  };

  // ---------- builders ----------
  const make = (seed, deposit, receive) => {
    const escrow = escrowPda(seed);
    return program.methods
      .make(new anchor.BN(seed), new anchor.BN(deposit), new anchor.BN(receive))
      .accounts({
        maker: maker.publicKey,
        mintA,
        mintB,
        makerAtaA,
        escrow,
        vault: ata(mintA, escrow, true),
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        tokenProgram: TOKEN_PROGRAM_ID,
        systemProgram: SystemProgram.programId,
      })
      .rpc();
  };

  const take = (seed, mintBUsed = mintB, takerAtaBUsed = takerAtaB) => {
    const escrow = escrowPda(seed);
    return program.methods
      .take()
      .accounts({
        taker: taker.publicKey,
        maker: maker.publicKey,
        mintA,
        mintB: mintBUsed,
        takerAtaA: ata(mintA, taker.publicKey),
        takerAtaB: takerAtaBUsed,
        makerAtaB: ata(mintBUsed, maker.publicKey),
        escrow,
        vault: ata(mintA, escrow, true),
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        tokenProgram: TOKEN_PROGRAM_ID,
        systemProgram: SystemProgram.programId,
      })
      .signers([taker])
      .rpc();
  };

  const cancel = (seed, asKeypair = maker) => {
    const escrow = escrowPda(seed);
    const builder = program.methods.cancel().accounts({
      maker: asKeypair.publicKey,
      mintA,
      makerAtaA: ata(mintA, asKeypair.publicKey),
      escrow,
      vault: ata(mintA, escrow, true),
      tokenProgram: TOKEN_PROGRAM_ID,
    });
    return asKeypair === maker ? builder.rpc() : builder.signers([asKeypair]).rpc();
  };

  const base = Date.now();
  const S1 = base + 1, S2 = base + 2, S3 = base + 3, S4 = base + 4;
  const DEPOSIT = 100 * UNIT;
  const RECEIVE = 50 * UNIT;

  // ---------- 1) Make -> Take ----------
  console.log("\n1) Make -> Take");
  await snap("start");
  await make(S1, DEPOSIT, RECEIVE);
  await snap("after make");
  check("vault holds Token A after make", (await amountOf(ata(mintA, escrowPda(S1), true))) === 100);
  await take(S1);
  await snap("after take");
  check("maker received 50 Token B", (await amountOf(makerAtaB)) === 50);
  check("taker received 100 Token A", (await amountOf(takerAtaA)) === 100);
  check("vault closed", !(await exists(ata(mintA, escrowPda(S1), true))));
  check("escrow closed", !(await exists(escrowPda(S1))));

  // ---------- 2) Make -> Cancel ----------
  console.log("\n2) Make -> Cancel");
  const beforeCancel = await amountOf(makerAtaA);
  await make(S2, DEPOSIT, RECEIVE);
  await cancel(S2);
  await snap("after cancel");
  check("maker balance restored", (await amountOf(makerAtaA)) === beforeCancel);
  check("escrow closed", !(await exists(escrowPda(S2))));

  // ---------- 3) Double take ----------
  console.log("\n3) Double take");
  await expectFail("second take fails (escrow closed)", () => take(S1));

  // ---------- 4) Take after cancel ----------
  console.log("\n4) Take after cancel");
  await expectFail("take after cancel fails", () => take(S2));

  // ---------- 5) Wrong mint ----------
  console.log("\n5) Wrong mint");
  await make(S3, DEPOSIT, RECEIVE);
  await expectFail("taker pays with the wrong mint", () => take(S3, mintC, takerAtaC));
  check("vault still holds Token A", (await amountOf(ata(mintA, escrowPda(S3), true))) === 100);
  await cancel(S3);

  // ---------- 6) Wrong authority ----------
  console.log("\n6) Wrong authority");
  await make(S4, DEPOSIT, RECEIVE);
  await expectFail("non-maker cancel fails", () => cancel(S4, taker));
  check("escrow still exists", await exists(escrowPda(S4)));
  await cancel(S4);

  // ---------- 7) Balance reconciliation ----------
  console.log("\n7) Balance reconciliation");
  const supplyAfter = await Promise.all(await supplies());
  check("total supply of A, B, C unchanged", JSON.stringify(supplyBefore) === JSON.stringify(supplyAfter));
  const totalA = (await amountOf(makerAtaA)) + (await amountOf(takerAtaA));
  const totalB = (await amountOf(makerAtaB)) + (await amountOf(takerAtaB));
  check("Token A held by maker + taker = 1000", totalA === 1000, String(totalA));
  check("Token B held by maker + taker = 1000", totalB === 1000, String(totalB));

  const passed = results.filter(Boolean).length;
  console.log(`\n${passed}/${results.length} checks passed`);
  if (passed !== results.length) process.exitCode = 1;
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});