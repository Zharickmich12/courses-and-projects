### Programs and Frontend

State machines, CPI and a wallet-connected UI. Not repeating setup, PDAs or deploy steps.

### State machines

**Model:** an enum of allowed states + guards on every transition. State is simple; permission checks and transition guards are the real work.

```
Draft --activate--> Active --close--> Closed
```

| Instruction | Who | Required state | Result |
|---|---|---|---|
| `create` | anyone (becomes creator) | (new account) | Draft |
| `activate` | creator only | Draft | Active |
| `vote` | anyone, once | Active | counts change |
| `close` | creator only | Active | Closed |

**Account design**
- State enum derives `AnchorSerialize, AnchorDeserialize, Clone, Copy, PartialEq, Eq, InitSpace`. `PartialEq` lets guards use `==`.
- The main account stores creator, an `id`, the title, the state, vote counts and the bump.
- `String` allocation = **4-byte length prefix + max bytes**. With `#[max_len(50)]` a title costs 54 bytes. Reject longer titles with an explicit error.
- Space = 8 (discriminator) + `INIT_SPACE`.

**Seeds**
- Main account: `[seed, creator, id.to_le_bytes()]`. A `u64` becomes seed bytes with `&id.to_le_bytes()`. The instruction needs `#[instruction(id: u64)]` to use `id` inside `seeds`.
- Vote record: `[seed, proposal, voter]`. Both the proposal and the voter must be in the seeds, otherwise different voters collide.
- Store the bump (`ctx.bumps.<account>` when creating) and reuse it later with `bump = account.bump`.

**Guards (one condition each)**
```rust
require_keys_eq!(proposal.creator, ctx.accounts.creator.key(), ErrorCode::Unauthorized);
require!(proposal.state == ProposalState::Draft, ErrorCode::NotDraft);
require!(proposal.state == ProposalState::Active, ErrorCode::NotActive);
```
One condition (`state == Active`) blocks both "vote in Draft" and "vote in Closed".

**Custom errors** make failed transitions explainable:
```rust
#[error_code]
pub enum ErrorCode {
    #[msg("Only the proposal creator can do this")] Unauthorized,
    #[msg("Proposal must be in Draft to be activated")] NotDraft,
    #[msg("Proposal is not Active")] NotActive,
    #[msg("Title is too long (max 50 bytes)")] TitleTooLong,
}
```

**Duplicate vote needs no code:** the vote record is created with `init`; a second attempt tries to create an account that already exists and fails before the handler runs. That error comes from the System Program, so it has no name of our own (unlike `NotActive`).

**Atomicity:** `init` runs before the handler, but if the handler's `require!` fails, the whole transaction is discarded, so no vote record is left behind.

### Testing guards (Rust + litesvm)

Tests run in memory against the compiled `.so`, so run `anchor build` first. Use small helpers so each test reads like a story:

- `setup()` loads the program; `funded(&mut svm)` makes an airdropped keypair.
- `*_pda(...)` helpers derive each PDA exactly like the program.
- `send(&mut svm, ix, &signer) -> bool` expires the blockhash, signs and sends.
- `*_ix(...)` builders create each instruction; the keypair you pass to `send` is the one that signs, so a non-creator is just another keypair.
- Read state back by deserializing the account (`Account::try_deserialize`).

**Cover success and failure:**
- Happy path: Draft → Active → vote → Closed.
- Vote in Draft fails; vote in Closed fails.
- Non-creator cannot activate; non-creator cannot close.
- Duplicate vote fails; two different voters can both vote.
- Activate twice fails; title too long fails.

In failure tests also assert **nothing changed** (state unchanged, counts unchanged, the vote record does not exist: `svm.get_account(&pda).is_none()`).

Tests that only check "the tx failed" do not prove *which* rule failed: the client script below does.

### Running against devnet with a client script

```bash
anchor build
anchor deploy --provider.cluster devnet
```

- Re-deploying to an existing program ID upgrades it.
- A script (Node + `@anchor-lang/core`, see the pattern in `week-2-exercise-2.md`) runs the whole flow. For failures, read the error name:

```js
try { await tx.rpc(); }
catch (e) { console.log(e.error?.errorCode?.code ?? e.message); }
```

- Names seen: `NotActive`, `Unauthorized`, `NotDraft`, `ConstraintSeeds` (wrong seeds / wrong signer for a PDA), `InsufficientFunds` / `ZeroAmount` (custom).
- A second signer can be passed with `.signers([keypair])`.
- Use a fresh `id` per run (for example `Date.now()`) so reruns don't hit an existing account.
- Load extra keypairs from a path **outside** the repo.

### CPI: calling another program

| | `invoke` | `invoke_signed` |
|---|---|---|
| Who signs | the user (signature already in the transaction) | the PDA, via seeds + bump |
| Use for | deposit: user sends their own SOL into a vault PDA | withdraw: the vault PDA sends SOL out |
| Anchor | `CpiContext::new(program_id, accounts)` | `CpiContext::new_with_signer(program_id, accounts, signer_seeds)` |

```rust
// deposit: user signs
let cpi = CpiContext::new(system_program::ID, Transfer { from: owner, to: vault });
transfer(cpi, amount)?;

// withdraw: PDA signs with its seeds + bump
let signer_seeds: &[&[&[u8]]] = &[&[b"vault", owner_key.as_ref(), &[bump]]];
let cpi = CpiContext::new_with_signer(system_program::ID, Transfer { from: vault, to: owner }, signer_seeds);
transfer(cpi, amount)?;
```

**Vault design**
- Seeds `["vault", owner_wallet]`: each owner has deterministic storage.
- The vault holds only SOL (no data), so it is a **`SystemAccount`**: the System Program can move SOL out of it. It exists as soon as it receives its first deposit; there is no create instruction.
- **Who can withdraw comes from the seeds:** the program derives the vault from the *signer*. If someone else signs, the derived address differs and the transaction fails with `ConstraintSeeds`. No extra authority check is needed.
- Get the bump with `ctx.bumps.vault`; the seeds in `invoke_signed` must match the derivation exactly (same bytes, same order).

**Rent and balances (observed on devnet)**
- Withdrawing everything works and the account then **disappears** (balance 0, `getAccountInfo` returns null).
- Withdrawing so that 1 lamport stays in the vault failed (`Simulation failed`) and left the balance unchanged. The exact cause was not confirmed in the logs; it fits the rent-exempt rule.
- litesvm accepted a first deposit of 1 lamport, so **in-memory tests can differ from the real network** on rent rules. Verify rent behavior on devnet.
- Also guard in the program: amount > 0, and enough balance.

**CPI failure map**

| Symptom | Likely cause | Fix |
|---|---|---|
| Missing required signature | `invoke` where a PDA must sign | use `new_with_signer` with the right seeds |
| Insufficient account keys | System Program or transfer accounts omitted | pass sender, recipient and system program |
| Invalid seeds | derivation and signer seed bytes differ | unify seed order and encoding |
| Vault disappears | balance dropped below the rent-exempt threshold | check the minimum, or close it on purpose |

### Frontend: React + wallet adapter (devnet)

**Providers:** wrap the app so hooks and the connect button work in every child.

```tsx
<ConnectionProvider endpoint={clusterApiUrl("devnet")}>
  <WalletProvider wallets={[]} autoConnect>
    <WalletModalProvider>
      <App />
    </WalletModalProvider>
  </WalletProvider>
</ConnectionProvider>
```

- `wallets={[]}` lets the browser detect installed wallets; the "all wallets" bundle package was not needed.
- Import `@solana/wallet-adapter-react-ui/styles.css` or the modal looks broken.
- `WalletMultiButton` is the connect button.

**Packages (pin versions that fit each other)**
```bash
npm install @solana/web3.js@1 @anchor-lang/core @solana/wallet-adapter-base @solana/wallet-adapter-react @solana/wallet-adapter-react-ui buffer
```
- Use **web3.js v1** with `@anchor-lang/core`; do not mix v1 and v2 patterns.

**Browser setup (Vite)**
- `buffer` polyfill: a file that does `(window as any).Buffer = Buffer`, imported first in `main.tsx`.
- `vite.config.ts`: `define: { global: "globalThis" }`.
- Copy a **fresh IDL** into the frontend (`target/idl/<program>.json`) after every `anchor build`. A stale IDL causes instruction decode mismatches.

**Hooks**
- `useConnection()` → `connection`; `useAnchorWallet()` → wallet for signing.
- Build a `Program` with `new AnchorProvider(connection, wallet, { commitment: "confirmed" })`.

**Read path:** derive the PDA with the same seeds → `program.account.<name>.fetch(pda)` → decode → render. Enum fields come back as an object (`{ draft: {} }`), so show `Object.keys(value)[0]`. Numbers come as BN: use `.toString()`.

**Write path:** build instruction → wallet pops up for signature → send → confirm → **refetch** → update UI.
```ts
await program.methods.vote(true).accounts({ ... }).rpc();
await refetch();
```
- **Refetch instead of incrementing locally:** the chain is the source of truth. A local `+1` can show something the network never recorded (failed transaction, or someone else voted meanwhile).
- Show **pending / confirmed / error** status so users understand wallet popups and network delay.
- **Map program errors to readable messages** (lookup by `e.error.errorCode.code`, plus text checks for "User rejected", "already in use", `ConstraintSeeds`, "429", "Blockhash not found") instead of dumping raw objects.

**Test the UI like a script:** connect → create → try an invalid action (readable error) → activate → vote → duplicate vote (readable error) → close → reload and refresh (state persists).

**Wallet side**
- Use a **separate browser wallet** set to devnet and send it a little SOL from the CLI. Never import the CLI keypair files into an extension.
- Public devnet RPC can rate-limit (429) or be briefly out of sync (`Blockhash not found`): retry or throttle polling.

### Dependency and tooling lessons

- `npm audit fix --force` **breaks things**: it downgraded the Anchor client to `0.0.0` and a wallet package. Don't run it. The vulnerability list in wallet packages is mostly about dev dependencies, not the running app.
- A peer-dependency conflict from dev tooling (linter vs a newer TypeScript) blocks installs. Use `--legacy-peer-deps` when the conflicting package is only a dev tool.
- Recover from a bad install with exact pins: `npm install @anchor-lang/core@<version> --legacy-peer-deps`, then `npm ls <packages>` to verify.
- `anchor new <name>` run **inside** an existing Anchor project adds a second program to that project (and a line in `Anchor.toml`). For a separate project, use `anchor init`.
- `anchor init --no-git <name>` avoids creating a repo inside another repo.
- Paths: file creation in VSCode needs the right folder. `code <path>` from the terminal opens a path (a missing file opens empty and is created on save).
- Building inside the Windows disk (`/mnt/c/...`) is slow (~7 min first build).
- Long commands can split into two lines when pasted: use `export VAR=...` on separate lines.

### Git hygiene (monorepo of projects)

- Preview before staging: `git add -n <folder> | wc -l`, then grep the preview for secrets:
  ```bash
  git add -n <folder> | grep -iE "keypair|wallet|id.json|\.env|node_modules|/target/|\.bak"
  ```
  It must print nothing.
- Stage only the folder you mean: `git add <folder>`. Avoid `git add -A` from the repo root when unrelated folders have modifications.
- Renaming a folder looks like deletions + untracked folder until both are staged (`git add -A <old> <new>`); git then shows it as renames.
- Check what is staged without noise: `git status --short | grep -v "^ M"`.
- A commit is saved locally even if the push can't authenticate yet; push later.
- Check that local and remote match: `git log --oneline -3` (`HEAD -> main, origin/main`).

## Done when

**Programs**
- [ ] Transitions enforce rules with specific custom errors
- [ ] CPI vault accepts deposits and owner-only withdrawals
- [ ] Tests cover success and failure cases (in memory and against devnet)

**Frontend**
- [ ] Wallet connect works on devnet
- [ ] On-chain state displays correctly
- [ ] A submit action triggers the wallet signature prompt
- [ ] The UI refreshes after confirmation and shows readable errors