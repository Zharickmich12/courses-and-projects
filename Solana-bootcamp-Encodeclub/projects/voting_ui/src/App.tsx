import { useCallback, useEffect, useMemo, useState } from "react";
import { useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { AnchorProvider, BN, Program } from "@anchor-lang/core";
import { PublicKey } from "@solana/web3.js";
import idl from "./idl/voting_program.json";

type StatusKind = "idle" | "pending" | "confirmed" | "error";

type ProposalView = {
  title: string;
  state: string;
  yesVotes: string;
  noVotes: string;
  creator: string;
};

const ERROR_MESSAGES: Record<string, string> = {
  NotActive: "This proposal is not Active, so it cannot receive votes or be closed.",
  Unauthorized: "Only the creator of the proposal can do that.",
  NotDraft: "Only a Draft proposal can be activated.",
  TitleTooLong: "The title is too long (max 50 bytes).",
};

function readableError(e: any): string {
  const code = e?.error?.errorCode?.code;
  if (code && ERROR_MESSAGES[code]) return ERROR_MESSAGES[code];

  const text = `${e?.message ?? ""} ${(e?.logs ?? []).join(" ")}`;
  if (text.includes("User rejected")) return "You rejected the request in your wallet.";
  if (text.includes("already in use")) return "This wallet already voted on this proposal.";
  if (text.includes("ConstraintSeeds")) return "That proposal address does not match this creator and id.";
  if (text.includes("AccountNotInitialized")) return "That proposal does not exist yet.";
  if (text.includes("429")) return "The public RPC is rate-limiting requests. Wait a few seconds and retry.";
  if (text.includes("Blockhash not found")) return "Devnet RPC was out of sync. Try again.";
  return "The transaction failed. Open the browser console for details.";
}

function idBytes(id: number): Uint8Array {
  const bytes = new Uint8Array(8);
  new DataView(bytes.buffer).setBigUint64(0, BigInt(id), true);
  return bytes;
}

function proposalPdaFor(programId: PublicKey, creator: PublicKey, id: number): PublicKey {
  return PublicKey.findProgramAddressSync(
    [new TextEncoder().encode("proposal"), creator.toBytes(), idBytes(id)],
    programId
  )[0];
}

function votePdaFor(programId: PublicKey, proposal: PublicKey, voter: PublicKey): PublicKey {
  return PublicKey.findProgramAddressSync(
    [new TextEncoder().encode("vote"), proposal.toBytes(), voter.toBytes()],
    programId
  )[0];
}

export default function App() {
  const { connection } = useConnection();
  const wallet = useAnchorWallet();

  const [idInput, setIdInput] = useState("1");
  const [creatorInput, setCreatorInput] = useState("");
  const [title, setTitle] = useState("My first on-chain proposal");
  const [proposal, setProposal] = useState<ProposalView | null>(null);
  const [status, setStatus] = useState<{ kind: StatusKind; message: string }>({
    kind: "idle",
    message: "",
  });

  const program: any = useMemo(() => {
    if (!wallet) return null;
    const provider = new AnchorProvider(connection, wallet, { commitment: "confirmed" });
    return new Program(idl as any, provider);
  }, [connection, wallet]);

  const idNum = Number(idInput);
  const idValid = Number.isSafeInteger(idNum) && idNum >= 0;

  const creatorKey: PublicKey | null = useMemo(() => {
    try {
      if (creatorInput.trim()) return new PublicKey(creatorInput.trim());
      return wallet?.publicKey ?? null;
    } catch {
      return null;
    }
  }, [creatorInput, wallet]);

  const proposalPda: PublicKey | null = useMemo(() => {
    if (!program || !creatorKey || !idValid) return null;
    return proposalPdaFor(program.programId, creatorKey, idNum);
  }, [program, creatorKey, idValid, idNum]);

  const refetch = useCallback(async () => {
    if (!program || !proposalPda) {
      setProposal(null);
      return;
    }
    try {
      const p = await program.account.proposal.fetch(proposalPda);
      setProposal({
        title: p.title,
        state: Object.keys(p.state)[0],
        yesVotes: p.yesVotes.toString(),
        noVotes: p.noVotes.toString(),
        creator: p.creator.toBase58(),
      });
    } catch {
      setProposal(null);
    }
  }, [program, proposalPda]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  async function run(label: string, fn: () => Promise<string>) {
    setStatus({ kind: "pending", message: `${label}: waiting for wallet signature and confirmation...` });
    try {
      const signature = await fn();
      setStatus({ kind: "confirmed", message: `${label} confirmed. Signature: ${signature}` });
      await refetch();
    } catch (e) {
      console.error(e);
      setStatus({ kind: "error", message: readableError(e) });
    }
  }

  const busy = status.kind === "pending";
  const canAct = !!program && !!wallet && !!proposalPda && idValid && !busy;

  const createProposal = () =>
    run("Create proposal", () =>
      program.methods
        .createProposal(new BN(idNum), title)
        .accounts({
          creator: wallet!.publicKey,
          proposal: proposalPdaFor(program.programId, wallet!.publicKey, idNum),
        })
        .rpc()
    );

  const activate = () =>
    run("Activate", () =>
      program.methods
        .activate()
        .accounts({ creator: wallet!.publicKey, proposal: proposalPda })
        .rpc()
    );

  const vote = (yes: boolean) =>
    run(yes ? "Vote yes" : "Vote no", () =>
      program.methods
        .vote(yes)
        .accounts({
          voter: wallet!.publicKey,
          proposal: proposalPda,
          voteRecord: votePdaFor(program.programId, proposalPda!, wallet!.publicKey),
        })
        .rpc()
    );

  const close = () =>
    run("Close", () =>
      program.methods
        .close()
        .accounts({ creator: wallet!.publicKey, proposal: proposalPda })
        .rpc()
    );

  return (
    <div className="app">
      <div className="header">
        <h2>On-chain voting (devnet)</h2>
        <WalletMultiButton />
      </div>

      {!wallet && <p className="muted">Connect a wallet set to devnet to start.</p>}

      <div className="card">
        <label>Proposal id</label>
        <input value={idInput} onChange={(e) => setIdInput(e.target.value)} />
        <div style={{ height: 10 }} />
        <label>Creator address (empty = my wallet)</label>
        <input
          value={creatorInput}
          onChange={(e) => setCreatorInput(e.target.value)}
          placeholder={wallet?.publicKey.toBase58() ?? ""}
        />
        {proposalPda && (
          <p className="muted">Proposal account: {proposalPda.toBase58()}</p>
        )}
      </div>

      <div className="card">
        <h3>Proposal state</h3>
        {proposal ? (
          <>
            <p><strong>{proposal.title}</strong></p>
            <p>State: {proposal.state}</p>
            <p>Yes: {proposal.yesVotes} · No: {proposal.noVotes}</p>
            <p className="muted">Creator: {proposal.creator}</p>
          </>
        ) : (
          <p className="muted">No proposal found for this creator and id.</p>
        )}
        <div className="row">
          <button className="action" onClick={refetch} disabled={!proposalPda}>
            Refresh
          </button>
        </div>
      </div>

      <div className="card">
        <h3>Actions</h3>
        <label>Title (for a new proposal)</label>
        <input value={title} onChange={(e) => setTitle(e.target.value)} />
        <div className="row">
          <button className="action" onClick={createProposal} disabled={!wallet || !idValid || busy}>
            Create (as me)
          </button>
          <button className="action" onClick={activate} disabled={!canAct}>
            Activate
          </button>
          <button className="action" onClick={() => vote(true)} disabled={!canAct}>
            Vote yes
          </button>
          <button className="action" onClick={() => vote(false)} disabled={!canAct}>
            Vote no
          </button>
          <button className="action" onClick={close} disabled={!canAct}>
            Close
          </button>
        </div>
      </div>

      {status.kind !== "idle" && (
        <div className={`status ${status.kind}`}>{status.message}</div>
      )}
    </div>
  );
}