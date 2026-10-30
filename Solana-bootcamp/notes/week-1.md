A mental model is your internal map of how something works and why

### WHAT IS SOLANA 
A BLOCKCHAIN DESIGNED FOR SPEED

### THREE ARCHITECTURAL CHOICES
- Parallel execution: Transactions touching different accounts run on different cores at the same time.
- Proof of History: Orders transactions before consensus, cutting validator agreement time.
- Single runtime (SVM): One virtual machine, optimised for throughput.

### CORE CONCEPT: The accounts model (ALL DATA LIVES IN ACCOUNTS)
An account is a chunk of storage with an address, an owner, a balance, and a data field.
The closest analogy: a file on a filesystem.
- LOCATION
Address
Like a file path. A unique 32-byte public key that tells you where the account lives.
- PERMISSIONS
Owner
Like file permissions. The owner is the program that's allowed to modify this account's data.
- CONTENTS
Data
Like file contents. Arbitrary bytes the program structures however it wants.

### EVERY ACCOUNT HAS THESE FIVE FIELDS
| # | Campo | Tipo | Descripción |
|---|-------|------|-------------|
| 1 | `address` | `Pubkey` | Unique 32-byte public key. How you find and identify the account. |
| 2 | `owner` | `Pubkey` | The program that controls this account. Only the owner program can modify the account's data. This is Solana's permission model. |
| 3 | `lamports` | `u64` | SOL balance, in the smallest denomination. 1 SOL = 1,000,000,000 lamports. |
| 4 | `data` | `Vec<u8>` | A byte array that can store anything. The program defines the structure. The chain doesn't know or care what's in here — that's the program's job. |
| 5 | `executable` | `bool` | Whether this account contains a program (code) or just data. |

### PROGRAMS AND DATA ARE SEPARATE
A program is deployed once and is stateless. All the data it works with lives in separate accounts that get passed in per transaction.
ETHEREUM
A smart contract stores its own data internally. Codeand storage live together. Two transactions touching the same contract must run sequentially because they shareglobal state.
SOLANA
- Programs and data are separate.
- If two transactions touch different accounts, Solana processes them at the same time on different CPU cores.
- That separation is what enables parallel execution.

### FOUR TYPES YOU'LL ENCOUNTER
All accounts use the same five fields they differ by who owns them.
1. WALLET ACCOUNT
Owned by the System Program.
Holds SOL. Controlled by whoever has the private key. Yours, whenyou generate a keypair.
2. DATA ACCOUNT
Owned by a specific program.
Stores application state: token balances, voting records, gamestate whatever the program needs.
3. PROGRAM ACCOUNT
Marked as executable.
Contains the compiled program code itself. Read-only afterdeployment.
4. TOKEN ACCOUNT
A specific data account.
Owned by the SPL Token program. Stores how many tokens of a specific type a wallet holds.

### STORING DATA COSTS MONEY
- Every account must maintain a minimum SOL balance proportional to its data size. It's called rent exemption.
- If an account's balance drops below the threshold, it gets deleted. In practice you always fund accounts to be rentexempt when you create them.
- SECURITY DEPOSIT, NOT A FEE: The SOL is refunded when the account is closed. Think of it as a deposit, not a recurring charge.
- Bigger accounts cost more to keep alive. That's a forcing function: store as little as you need, and close accounts you're done with to reclaim the deposit.

### Programs and transactions
A SOLANA PROGRAM IS A COMPILED, STATELESS BINARY
- Equivalent to a smart contract on Ethereum, with one key difference: programs don't store data. They receive accounts as input, read and modify them, return.
- Written in Rust (most common), C, or any language that compiles to BPF bytecode. In practice, almost everyone uses Rust with the Anchor framework, which handles boilerplate and addssafety checks.

### FOUR PRE-BUILT PROGRAMS YOU'LL INTERACT WITH
1. System Program
Hard-coded into the runtime. The only program that can create accounts and move native SOL.
2. SPL Token
Standard, audited, on-chain. Logic for minting, burning, and transferring assets.
3. Token-2022
Newer token standard. Programmable fees, metadata, custom hooks.
4. Associated Token Account
Utility program deterministic link from wallet to token account.

### A TRANSACTION IS A BUNDLE OF INSTRUCTIONS
Signed by one or more wallets, submitted to the network, and atomic either all instructions succeed or none do.
EACH INSTRUCTION SPECIFIES:
1. Which program to call.
2. Which accounts to pass in and whether each is readable, writable, or a signer.
3. Instruction data arbitrary bytes that tell the program what to do.

### COMPOSABILITY IN ONE TX
A single transaction can contain multiple instructions to different programs. This is how you compose operations.
Example:
"create an account, initialise it with my program,transfer tokens to it" all atomic, in one transaction. If the transfer fails, the account isn't left half-created.

### CLICK SEND → ON-CHAIN , IN UNDER 500MS
Five steps. Each one matters when you're debugging.
1. Client constructs & signs. Builds the transaction, signs with your wallet, sends to an RPC node.
2. RPC forwards. The RPC node forwards it to the current leader validator.
3. Leader processes. For each instruction: loads accounts, calls the program, the program succeeds or returns an error.
4. Commit or rollback. All instructions succeed → state changes commit. Any failure → everything rolls back.
5. Block + verification. Transaction is included in a block, broadcast, and verified by other validators.

### COMPUTE UNITS
Every transaction has a budget measured in compute units (CU).
Default: 200,000 CU per instruction. Max: 1.4M CU per transaction.
Exceed it → transaction fails.
Request more (up to the max) by including a compute-budget instruction, and set a priority fee in CUs to skip the queue during congestion.

### CORE CONCEPT: Program Derived Addresses
- WHAT PROBLEM PDAS SOLVE:
PROGRAMS DON'T HAVE PRIVATE KEYS
Programs need to own accounts to store data. But they're code, not users. So how do they sign?
They don't need to. PDAs are addresses mathematically derived from a set of inputs (seeds) and a program ID. They're guaranteed to have no corresponding private key so no one can sign for them.
Instead, the runtime lets the program that derived the PDA act as the signer through a mechanism called invoke_signed.

### HOW A PDA IS GENERATED
A PDA is the result of hashing together:
1. One or more seeds. arbitrary byte arrays you choose. 
2. The program ID. the program deriving the PDA.
3. A bump seed. a number that pushes the result off the elliptic curve, guaranteeing no private key exists.

find_program_address tries bump values from 255 down and returns the first off-curve address. 
Deterministic, same inputs, same PDA, every time.

### SEEDS = STRUCTURED, FINDABLE STORAGE

Determinism is what makes this useful. If you know the seeds, you can compute the address from anywhere.

| Use case | What it is | Seeds | Description |
|----------|------------|-------|-------------|
| PER-USER COUNTER | One PDA per user | `["counter", user_wallet]` | Each user gets their own counter at a predictable address. |
| VOTING PROPOSAL | One PDA per proposal | `["proposal", proposal_id]` | Anyone can compute the address of proposal #7 without querying the chain. |
| ESCROW VAULT | One PDA per escrow | `["vault", escrow_id]` | The program can find and control the vault for any escrow it created. |

### ONE PROGRAM MANAGES ALL TOKENS
On Ethereum, each token is its own contract. On Solana, you create a mint account that the SPL Token program manages.
1. PER TOKEN
    Mint account
    - Defines a token type. Stores total supply, number of decimals, and who has authority to mint more.
    - One per token, one for USDC, one for BONK, one for your custom token.
2. PER USER · PER TOKEN
    Token account
    - Holds a specific user's balance of a specific token. Each one references the mint and the wallet that owns it.
    - If you hold 5 tokens, you have 5 token accounts.
3. CONVENTION
    Associated Token Account
    - A token account at a deterministic address derived from wallet + mint.
    - Compute the ATA address and you know where any wallet's balance for any token lives, no query needed.

### SPL Token vs Token-2022
TWO TOKEN PROGRAMS, ONE ECOSYSTEM
- SPL Token is the original. 
- Token-2022 adds optional features (extensions) on top of the same primitives.
| Program | Description |
|---------|-------------|
| SPL TOKEN | The original. Handles minting, transferring, burning, account management. Battle-tested. Used by most existing tokens. |
| TOKEN-2022 · TOKEN EXTENSIONS | Adds optional features: metadata on the mint (no Metaplex needed), transfer fees, transfer hooks, non-transferable (soulbound) tokens, confidential transfers. |
- EXTENSIONS ARE PERMANENT: Extensions are configured at mint creation time and become permanently part of that mint's behaviour. **You can't add extensions after creation.**

# Mental model shifts
| Concept | Ethereum / EVM | Solana |
|---------|----------------|--------|
| Data storage | Contract stores its own state internally (mappings, variables). | Programs are stateless. Data lives in separate accounts passed in per transaction. |
| Tokens | Each token = a separate smart contract (ERC-20). | One program (SPL Token) manages all tokens. You create mint accounts, not contracts. |
| Cost model | Gas price × gas used. Costs $1–$50+ per transaction. | Base fee + priority fee. Typically < $0.01. |
| Execution | Sequential. One transaction at a time. | Parallel. Non-conflicting transactions run simultaneously. |
| Language | Solidity (most common). | Rust with Anchor framework (most common). |
| Accounts | Implicit. Contracts access storage slots internally. | Explicit. Every account a transaction touches must be declared upfront. |
| Composability | Call any contract from any contract freely. | Cross-Program Invocation (CPI). Must pass accounts through the call chain. |