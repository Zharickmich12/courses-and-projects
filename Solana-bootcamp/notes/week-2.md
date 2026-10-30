### Solana + Anchor

Loop to repeat in every project: **build → deploy → verify**.

### Setup (once per machine)

### Tools

| Tool | Role |
|---|---|
| `rustc` / `cargo` | Rust compiler and build tool (programs are written in Rust) |
| `solana` | Solana CLI: network, wallet, airdrop, inspect accounts |
| `anchor` | Anchor CLI: create, build, test, deploy programs |
| `surfpool` | Part of the toolchain |
| `node` / `yarn` | JavaScript tooling |

### Verify everything

```bash
rustc --version && solana --version && anchor --version && surfpool --version && node --version && yarn --version
```

If one fails, fix the installation before anything else. `&&` only works in bash; in Windows PowerShell 5.1 use `;`.

### Windows: use WSL2 (Ubuntu)

From PowerShell:

```powershell
wsl --install -d Ubuntu     # reboot if asked, then run it again
```

Inside Ubuntu (prompt `user@machine:~$`):

```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y build-essential pkg-config libssl-dev libudev-dev curl git

curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
source "$HOME/.cargo/env"

curl --proto '=https' --tlsv1.2 -sSfL https://solana-install.solana.workers.dev | bash
```

Reopen the terminal, then run the verification above. Confirm install commands against the official Anchor docs, since they change often.

- `wsl` (in PowerShell) enters Ubuntu.
- Windows' Rust/Node are not visible from Ubuntu.
- Create projects in Ubuntu's filesystem (`~/projects`); building on `/mnt/c/...` is very slow.

### Devnet + wallet

```bash
solana config set --url devnet
solana-keygen new
solana airdrop 2
solana config get
solana balance
```

Checklist:
1. RPC URL shows devnet.
2. Keypair path points to my wallet (`~/.config/solana/id.json`).
3. Balance has test SOL.

The wallet pays for account creation and deployments. Config and wallet live in the user folder, not in the project. `airdrop` can fail with a rate limit; retry later.

### Create, build, deploy, verify

```bash
mkdir -p ~/projects && cd ~/projects
anchor init hello_solana
cd hello_solana
anchor build
anchor deploy --provider.cluster devnet
anchor test
```

| Step | What it does | Success looks like |
|---|---|---|
| `anchor init` | Generates the scaffold | `Anchor.toml`, `programs/`, ... |
| `anchor build` | Compiles the program | `target/deploy/hello_solana.so` + `hello_solana-keypair.json` |
| `anchor deploy` | Uploads the program | Prints the **Program ID**, `Deploy success` |
| `anchor test` | Runs the tests | `test result: ok` |

**Check the network.** In `Anchor.toml`:

```toml
[provider]
cluster = "localnet"     # default, NOT devnet
```

Pass `--provider.cluster devnet` or change it to `"devnet"`.

Notes for this Anchor version (1.1.2): `anchor deploy` shows a deprecation warning (newer name: `anchor program deploy`), and tests are written in Rust (`cargo test`, litesvm, runs in memory).

### Verify on-chain

Open `https://explorer.solana.com/address/<PROGRAM_ID>?cluster=devnet` (Devnet selected) and check: executable program, upgrade authority, recent transactions with their instructions and accounts.

### Project anatomy

```
hello_solana/
├── Anchor.toml
├── Cargo.toml
├── rust-toolchain.toml
├── app/
├── programs/hello_solana/
│   ├── Cargo.toml
│   └── src/
│       ├── lib.rs
│       ├── state.rs
│       ├── constants.rs
│       ├── error.rs
│       ├── instructions.rs
│       └── instructions/
│           ├── initialize.rs
│           └── increment.rs
└── target/deploy/
    ├── hello_solana.so
    └── hello_solana-keypair.json
```

| File | Purpose |
|---|---|
| `Anchor.toml` | Project config: program ID per network, default cluster + wallet, test command |
| `Cargo.toml` (root) | Rust workspace |
| `rust-toolchain.toml` | Pins the Rust version |
| `app/` | Place for a client |
| `src/lib.rs` | **Entry point**: program ID + public instructions |
| `src/state.rs` | Data stored in accounts |
| `src/constants.rs` | Constants (seed, limits) |
| `src/error.rs` | Custom errors |
| `src/instructions/*.rs` | One file per instruction: its accounts and logic |
| `target/` | Build output, never edit |
| `target/deploy/*.so` | Compiled program uploaded on-chain |
| `target/deploy/*-keypair.json` | Keypair whose public key **is** the Program ID |

The Program ID must match in `declare_id!` (`lib.rs`), `Anchor.toml` and the keypair file.

### Reading the generated program

### `lib.rs`
```rust
declare_id!("5VbVapiA9eZ9VRrwTrb7NwH2iz3Hw6rRW5mZgJbx9fs4");

#[program]
pub mod hello_solana {
    pub fn initialize(ctx: Context<Initialize>) -> Result<()> { ... }
    pub fn increment(ctx: Context<Increment>) -> Result<()> { ... }
}
```
- `declare_id!` = the program's address.
- `#[program]` = the instructions anyone can call.
- `Context<X>` = the accounts of the call, validated by struct `X`.

### `state.rs`
```rust
#[account]
#[derive(InitSpace)]
pub struct Counter {
    pub count: u64,        // 8 bytes
    pub authority: Pubkey, // 32 bytes
}
```
Data stored on-chain. `InitSpace` computes the size (40 bytes). When creating the account: `space = 8 + Counter::INIT_SPACE`; the extra 8 bytes are Anchor's **discriminator**, which identifies the account type.

### `constants.rs` / `error.rs`
- `COUNTER_SEED = b"counter"`, `HELLO_WORLD_LAMPORTS = 1`, `MAX_COUNT = 10`
- Errors: `Unauthorized`, `CounterOverflow`

### `initialize.rs`
```rust
#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,
    #[account(init, payer = payer, space = 8 + Counter::INIT_SPACE,
              seeds = [COUNTER_SEED], bump)]
    pub counter: Account<'info, Counter>,
    pub system_program: Program<'info, System>,
}
```

| Piece | Meaning |
|---|---|
| `#[derive(Accounts)]` | Lists the accounts the instruction needs and the rules they must pass |
| `Signer` | Must have signed the transaction |
| `mut` | The account gets modified (payer's balance drops) |
| `init` | Create the account |
| `payer = payer` | Who pays the rent |
| `space` | Bytes to allocate |
| `seeds` + `bump` | The account is a **PDA** derived from these seeds |
| `system_program` | Needed because accounts are created through the System Program |

Handler: sets `count = 0`, stores `authority = payer`, transfers 1 lamport to the counter through the system program (a call from one program to another is a **CPI**), and logs a message. With `init`, calling it twice for the same PDA fails.

### `increment.rs`
```rust
#[derive(Accounts)]
pub struct Increment<'info> {
    #[account(mut, seeds = [COUNTER_SEED], bump)]
    pub counter: Account<'info, Counter>,
    pub authority: Signer<'info>,
}
```
Handler:
1. `require_keys_eq!` → only the stored authority can increment (else `Unauthorized`).
2. `require!(count < MAX_COUNT)` → else `CounterOverflow`.
3. `count += 1`, log.

No `init` here: the account must already exist. `seeds` + `bump` make Anchor re-derive the PDA and check the address.

### Key concepts

- **PDA (Program Derived Address):** address derived from **seeds + program ID**. Programs need to own accounts to store data, but they are code and can't sign; a PDA has no private key and the runtime lets the deriving program act as its signer.
- **Seeds:** bytes I choose to structure storage. `["counter"]` = one global counter. `["counter", user_wallet]` = one counter per user.
- **Bump:** number that pushes the address off the elliptic curve so no private key exists. `find_program_address` tries from 255 downward and returns the first valid one.
- **Deterministic:** same seeds + same program ID = same address, always, from anywhere.
- **Payer / rent:** creating an account costs lamports; `payer` pays.
- **Constraints:** the `#[account(...)]` rules Anchor checks before the logic runs.

---

### Command reference

| Command | Use |
|---|---|
| `solana config set --url devnet` | Select devnet |
| `solana config get` | Show RPC URL and keypair path |
| `solana-keygen new` | Create a wallet |
| `solana airdrop 2` | Request test SOL |
| `solana balance` | Check balance |
| `solana account <ADDRESS>` | Inspect an account |
| `anchor init <name>` | New project |
| `anchor build` | Compile |
| `anchor deploy --provider.cluster devnet` | Deploy to devnet |
| `anchor test` | Run tests |
| `ls target/deploy` | Confirm `.so` and keypair exist |
| `wsl` / `wsl --list --verbose` / `wsl --install -d Ubuntu` | WSL (run from PowerShell) |


Payer and authority are different roles: the **payer** funds the account creation, the **authority** is who may modify the state. They are often the same wallet.

### Seed drift
Seeds must be identical (same content, same order) in:
- the create instruction (program)
- every instruction that uses the PDA (program)
- the TypeScript client/test
If any of them differs, the derived addresses differ. Client derivation:
```ts
PublicKey.findProgramAddressSync([...seeds], programId)
```

### Prompting AI for the code

Ask for framework, seeds, instructions, account fields and tests in one constrained request:

```
Using Anchor in Rust:
- PDA seeds = ["<static_seed>", user_pubkey]
- <create instruction> creates the account, payer = signer
- <update instruction> changes <field>
- account stores <fields> (+ bump)
- include a test: <flow> -> assert the final value
```

Do not accept the first output: read constraints, the space calculation and seed consistency before running tests.

### Reviewing generated code

| Area | What to look for |
|---|---|
| Account struct + space | Discriminator + fields + bump bytes included in the allocation |
| Seeds in all locations | Same order and content in every instruction and in TypeScript |
| Constraints + signer checks | `init`, `payer`, `seeds`, `bump`, authority enforcement |
| Test quality | Asserts account values, not only that the transaction did not throw |

Most failures come from these mismatches, not from Rust syntax.

### Verifying the result

Passing tests is not the finish line. Read the real account:

```bash
solana account <PDA_ADDRESS>
```

- Owner = my program ID
- Data exists
- Account length matches the expected layout

Then:
- Open the PDA and its recent transactions in the devnet Explorer; inspect instruction accounts and results.
- Compute the PDA in the client and compare it with the on-chain address. A mismatch means seed drift.

### Common errors

| Error | Likely cause | Action |
|---|---|---|
| `Account already in use` | `init` called twice for the same PDA | Expected for a duplicate init; test that path |
| `A seeds constraint was violated` | Seed mismatch between program and client | Normalize seed bytes/order in all calls |
| `Insufficient funds` | Devnet wallet out of SOL | `solana airdrop 2` and retry |
| `AccountNotInitialized` | Update called before init | Enforce init-first in tests/client |
| `Transaction simulation failed` | Wrong account list or missing signer | Inspect full simulation logs and account metas |

Debug habit: diagnose first, then ask AI with the full command, OS, complete error text and relevant code.

### Done when

- [ ] The instructions reach the expected state
- [ ] `solana account` confirms owner and data presence
- [ ] A duplicate `init` fails as expected
- [ ] The client-derived PDA matches the on-chain PDA