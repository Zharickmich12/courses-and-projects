const anchor = require("@anchor-lang/core");
const { PublicKey, Keypair } = require("@solana/web3.js");
const fs = require("fs");
const os = require("os");
const path = require("path");

function loadKeypair(file) {
  return Keypair.fromSecretKey(
    Uint8Array.from(JSON.parse(fs.readFileSync(file, "utf8")))
  );
}

async function attempt(label, fn) {
  try {
    await fn();
    console.log(`SUCCEEDED  ${label}`);
    return true;
  } catch (e) {
    const code = e.error?.errorCode?.code;
    const first = (e.message || "").split("\n")[0];
    console.log(`FAILED     ${label} -> ${code ?? first}`);
    return false;
  }
}

async function main() {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const idl = JSON.parse(
    fs.readFileSync(path.join(__dirname, "../target/idl/tip_jar.json"), "utf8")
  );
  const program = new anchor.Program(idl, provider);
  const owner = provider.wallet.publicKey;
  const second = loadKeypair(path.join(os.homedir(), "second-wallet.json"));
  const conn = provider.connection;

  const [vault] = PublicKey.findProgramAddressSync(
    [Buffer.from("vault"), owner.toBuffer()],
    program.programId
  );
  const vaultBalance = () => conn.getBalance(vault);

  console.log("Program ID:", program.programId.toBase58());
  console.log("Owner:     ", owner.toBase58());
  console.log("Vault:     ", vault.toBase58());
  console.log("Start balance:", await vaultBalance());

  await program.methods
    .deposit(new anchor.BN(20_000_000))
    .accounts({ owner, vault })
    .rpc();
  console.log("OK    deposit 20000000 -> vault:", await vaultBalance());

  await program.methods
    .withdraw(new anchor.BN(5_000_000))
    .accounts({ owner, vault })
    .rpc();
  console.log("OK    withdraw 5000000 -> vault:", await vaultBalance());

  await attempt("other wallet withdraws from my vault", () =>
    program.methods
      .withdraw(new anchor.BN(1_000_000))
      .accounts({ owner: second.publicKey, vault })
      .signers([second])
      .rpc()
  );

  await attempt("withdraw more than the balance", () =>
    program.methods
      .withdraw(new anchor.BN(10_000_000_000))
      .accounts({ owner, vault })
      .rpc()
  );

  await attempt("deposit zero", () =>
    program.methods.deposit(new anchor.BN(0)).accounts({ owner, vault }).rpc()
  );

  const before = await vaultBalance();
  await attempt("withdraw leaving 1 lamport in the vault", () =>
    program.methods
      .withdraw(new anchor.BN(before - 1))
      .accounts({ owner, vault })
      .rpc()
  );
  console.log("vault after that attempt:", await vaultBalance());

  const rest = await vaultBalance();
  if (rest > 0) {
    await program.methods
      .withdraw(new anchor.BN(rest))
      .accounts({ owner, vault })
      .rpc();
  }
  console.log("OK    withdrew everything -> vault:", await vaultBalance());
  console.log("Vault account exists:", (await conn.getAccountInfo(vault)) !== null);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});