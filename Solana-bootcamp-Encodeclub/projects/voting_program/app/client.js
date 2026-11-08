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

async function expectFail(label, expectedCode, fn) {
  try {
    await fn();
    console.log(`FAIL  ${label}: it succeeded but should have failed`);
  } catch (e) {
    const code = e.error?.errorCode?.code ?? "other";
    const ok = expectedCode === null ? true : code === expectedCode;
    const detail = code === "other" ? (e.message || "").split("\n")[0] : code;
    console.log(`${ok ? "OK  " : "FAIL"}  ${label} -> ${detail}`);
  }
}

async function main() {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const idl = JSON.parse(
    fs.readFileSync(path.join(__dirname, "../target/idl/voting_program.json"), "utf8")
  );
  const program = new anchor.Program(idl, provider);
  const creator = provider.wallet.publicKey;
  const second = loadKeypair(path.join(os.homedir(), "second-wallet.json"));

  const id = Date.now();
  const idBn = new anchor.BN(id);
  const [proposal] = PublicKey.findProgramAddressSync(
    [Buffer.from("proposal"), creator.toBuffer(), idBn.toArrayLike(Buffer, "le", 8)],
    program.programId
  );
  const voteFor = (voter) =>
    PublicKey.findProgramAddressSync(
      [Buffer.from("vote"), proposal.toBuffer(), voter.toBuffer()],
      program.programId
    )[0];

  console.log("Program ID:", program.programId.toBase58());
  console.log("Creator:   ", creator.toBase58());
  console.log("Proposal:  ", proposal.toBase58());

  await program.methods
    .createProposal(idBn, "Devnet demo")
    .accounts({ creator, proposal })
    .rpc();
  console.log("OK    create_proposal -> Draft");

  await expectFail("vote in Draft", "NotActive", () =>
    program.methods
      .vote(true)
      .accounts({ voter: creator, proposal, voteRecord: voteFor(creator) })
      .rpc()
  );

  await expectFail("activate by non-creator", "Unauthorized", () =>
    program.methods
      .activate()
      .accounts({ creator: second.publicKey, proposal })
      .signers([second])
      .rpc()
  );

  await program.methods.activate().accounts({ creator, proposal }).rpc();
  console.log("OK    activate -> Active");

  await expectFail("activate twice", "NotDraft", () =>
    program.methods.activate().accounts({ creator, proposal }).rpc()
  );

  await program.methods
    .vote(true)
    .accounts({ voter: creator, proposal, voteRecord: voteFor(creator) })
    .rpc();
  console.log("OK    vote yes by creator");

  await expectFail("duplicate vote", null, () =>
    program.methods
      .vote(false)
      .accounts({ voter: creator, proposal, voteRecord: voteFor(creator) })
      .rpc()
  );

  await expectFail("close by non-creator", "Unauthorized", () =>
    program.methods
      .close()
      .accounts({ creator: second.publicKey, proposal })
      .signers([second])
      .rpc()
  );

  await program.methods.close().accounts({ creator, proposal }).rpc();
  console.log("OK    close -> Closed");

  await expectFail("vote in Closed", "NotActive", () =>
    program.methods
      .vote(false)
      .accounts({
        voter: second.publicKey,
        proposal,
        voteRecord: voteFor(second.publicKey),
      })
      .signers([second])
      .rpc()
  );

  const state = await program.account.proposal.fetch(proposal);
  console.log("Final state:", JSON.stringify(state.state));
  console.log("yes votes:  ", state.yesVotes.toString());
  console.log("no votes:   ", state.noVotes.toString());
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});