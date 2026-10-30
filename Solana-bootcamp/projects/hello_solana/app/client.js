const anchor = require("@anchor-lang/core");
const { PublicKey } = require("@solana/web3.js");
const fs = require("fs");
const path = require("path");

async function main() {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const idl = JSON.parse(
    fs.readFileSync(path.join(__dirname, "../target/idl/hello_solana.json"), "utf8")
  );
  const program = new anchor.Program(idl, provider);
  const user = provider.wallet.publicKey;

  const [pda, bump] = PublicKey.findProgramAddressSync(
    [Buffer.from("counter"), user.toBuffer()],
    program.programId
  );
  console.log("Program ID:", program.programId.toBase58());
  console.log("User:      ", user.toBase58());
  console.log("PDA:       ", pda.toBase58(), "(bump", bump + ")");

  const existing = await provider.connection.getAccountInfo(pda);
  if (!existing) {
    const sig = await program.methods
      .initialize()
      .accounts({ payer: user, counter: pda })
      .rpc();
    console.log("initialize tx:", sig);
  } else {
    console.log("Counter already exists, skipping initialize");
  }

  const sig2 = await program.methods
    .increment()
    .accounts({ counter: pda, authority: user })
    .rpc();
  console.log("increment tx:", sig2);

  const state = await program.account.counter.fetch(pda);
  console.log("count:     ", state.count.toString());
  console.log("authority: ", state.authority.toBase58());
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});