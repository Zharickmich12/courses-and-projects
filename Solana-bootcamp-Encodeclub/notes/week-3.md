### Tokens and Token-2022

### Concepts

**A wallet does not "contain" tokens. Token accounts do.**

| Account | What it is |
|---|---|
| **Mint account** | Defines the token: total supply, decimals, mint authority. One per token. |
| **Token account** | Holds one wallet's balance of **one** mint. Three tokens = three token accounts. |
| **ATA (Associated Token Account)** | Deterministic token account derived from **wallet + mint**. The standard way to locate balances. |

**Common mix-up:** reading a token balance from a wallet address fails. Always derive or look up the ATA first (`account not found` usually means the ATA was never created, or a wallet address was used as a token account).

**Decimals and base units.** Token amounts are stored as integers in base units. Display value = raw amount / 10^decimals.

| Decimals | 1000 tokens are stored as |
|---|---|
| 9 | `1000000000000` |
| 6 | `1000000000` |

Never hardcode the decimals in a script: read them from the mint.

**Two token programs**

| | SPL Token (classic) | Token-2022 |
|---|---|---|
| Program ID starts with | `Tokenkeg...` | `TokenzQd...` |
| Mint data | Standard fields only | Standard fields + extension data |
| Behavior | Fixed token logic | Programmable extension logic |

### `spl-token` CLI cheat sheet

| Command | What it does |
|---|---|
| `spl-token --version` | Check the CLI is installed |
| `spl-token create-token` | Create a mint (prints address + decimals) |
| `spl-token create-account <MINT>` | Create my token account (ATA) for that mint |
| `spl-token mint <MINT> <AMOUNT>` | Mint supply to my token account (only the mint authority can) |
| `spl-token accounts` | List my balances per mint |
| `spl-token address --token <MINT> --verbose` | Show my wallet and my associated token address for that mint |
| `spl-token transfer <MINT> <AMOUNT> <RECIPIENT_WALLET> --fund-recipient` | Transfer; creates the recipient's token account if missing |
| `spl-token display <MINT>` | Inspect a mint (program, supply, decimals, authorities, extensions) |
| `spl-token accounts --owner <WALLET>` | List another wallet's balances |

**Token-2022:** add `--program-2022`, and put it **before** the command. It is needed when reading too: a command fails if the selected program doesn't own the address.

```bash
spl-token --program-2022 display <MINT>
```

If a flag is rejected, `spl-token <command> --help` shows the current one (flags change between versions).

### SPL token flow (classic)

1. Create a mint and **save the address**.
   ```bash
   spl-token create-token
   ```
2. Create my token account for that mint.
   ```bash
   spl-token create-account <MINT>
   ```
3. Mint a round amount.
   ```bash
   spl-token mint <MINT> 1000
   ```
4. Verify.
   ```bash
   spl-token accounts
   ```
5. Check the mint on the devnet Explorer: supply, decimals and mint authority must match what I intended.

By default the mint authority is the wallet that created the mint (that is why only it can mint).

### Save the public metadata once

`config/tokens.devnet.json`:

```json
{
  "cluster": "devnet",
  "tokens": {
    "token1": {
      "mint": "<MINT>",
      "ownerTokenAccount": "<MY_TOKEN_ACCOUNT>",
      "decimals": 9
    }
  }
}
```

- `ownerTokenAccount` is the **token account** (from `spl-token address --token <MINT> --verbose`, the "Associated token address"), **not** the wallet address.
- Also useful to keep: transaction signatures for debugging.
- **Never store secrets:** no private keys, seed phrases or keypair JSON contents in project files.

### Second wallet and transfer

```bash
solana-keygen new --outfile ~/second-wallet.json
solana transfer <SECOND_WALLET> 0.1 --allow-unfunded-recipient
spl-token transfer <MINT> 100 <SECOND_WALLET> --fund-recipient
spl-token accounts
spl-token accounts --owner <SECOND_WALLET>
```

- The second wallet needs **SOL** even though it receives tokens: creating accounts needs rent and transactions need fees. With `--fund-recipient` the sender pays the recipient's account rent.
- If `solana airdrop` hits the devnet rate limit, send SOL from the main wallet with `solana transfer`.
- Expected end state: main wallet drops by 100, recipient receives 100. Confirm in the CLI and in Explorer.
- Keep the keypair files (`~/.config/solana/id.json`, `~/second-wallet.json`) **outside** the project folder.

### TypeScript balance script

Setup:

```bash
npm init -y
npm install @solana/web3.js@1 @solana/spl-token
npm install -D tsx typescript
echo "node_modules/" > .gitignore
```

Flow (functions from `@solana/spl-token`):

1. Connect: `new Connection(clusterApiUrl("devnet"), "confirmed")`
2. Mint address + wallet addresses as `PublicKey` (hardcoded is fine).
3. `getMint(connection, mint)` → read `decimals` from it.
4. `getAssociatedTokenAddress(mint, wallet)` → derive each ATA.
5. `getAccount(connection, ata)` → token account data; the balance is `account.amount` (a `bigint`).
6. Print `Number(account.amount) / 10 ** decimals`.

```ts
const mintInfo = await getMint(connection, mint);
const decimals = mintInfo.decimals;                 // never hardcode 9
const ata = await getAssociatedTokenAddress(mint, wallet);
const account = await getAccount(connection, ata);
console.log(Number(account.amount) / 10 ** decimals);
```

Run: `npx tsx balances.ts`.

Done when the CLI and the script report the same balances and Explorer confirms supply + ownership fields. Common AI mistakes: hardcoding 9 decimals, printing raw integers, mixing wallet addresses with token accounts.

### Token-2022 extensions

Extensions are **baked in at mint creation**. You cannot add them to an existing mint: if the config changes, create a new mint. Check that the chosen set is compatible (for example, `non-transferable` + `transfer fee` makes no sense: the fee is charged on transfers, and transfers are blocked).

| Extension | Behavior | How to test it |
|---|---|---|
| **Metadata** | Name, symbol and URI live on the mint, no separate account | `display` shows them |
| **Transfer fee** | Each transfer withholds a fee, collected later by the fee authority | Recipient gets less than the amount sent |
| **Non-transferable** | Can be minted and burned, cannot move between wallets | Transfer must fail |
| **Default frozen state** | New accounts start frozen until the authority thaws them | Transfer fails until thawed |

### Create a mint with metadata + non-transferable

```bash
spl-token --program-2022 create-token --enable-metadata --enable-non-transferable --decimals 6
spl-token --program-2022 initialize-metadata <MINT> "<NAME>" <SYMBOL> <URI>
spl-token --program-2022 create-account <MINT>
spl-token --program-2022 mint <MINT> 1000
spl-token --program-2022 display <MINT>
```

- `--enable-metadata` only **reserves space** (and sets the metadata pointer to the mint itself). The actual name, symbol and URI are written with `initialize-metadata` (order: mint, name, symbol, URI). The URI doesn't need to exist for testing.
- `initialize-metadata` can only run once: a second run fails with `Extension already initialized on this account`.
- `display` now shows an **Extensions** section and the program `TokenzQd...`. The metadata pointer's address equals the mint address (metadata stored on the mint).

### Test the behavior

```bash
spl-token --program-2022 transfer <MINT> 100 <SECOND_WALLET> --fund-recipient
spl-token --program-2022 accounts
```

- The transfer fails with `Transfer is disabled for this mint`; the balance stays unchanged.
- The CLI sends "create recipient account" and "transfer" in one transaction, so a failed simulation creates nothing.

### Decode the extensions in TypeScript

```ts
const mint = await getMint(connection, mintAddress, "confirmed", TOKEN_2022_PROGRAM_ID);
const types = getExtensionTypes(mint.tlvData);                  // e.g. NonTransferable, MetadataPointer, TokenMetadata
const pointer = getMetadataPointerState(mint);                   // authority + metadataAddress
const metadata = await getTokenMetadata(connection, mintAddress); // name, symbol, uri
```

- Extensions are stored in the mint account's own data, after the base fields (`mint.tlvData`), so a script can discover them without being told.
- Also check the owner program: `connection.getAccountInfo(mintAddress)` → `owner` should be the Token-2022 program ID.

### Verify
1. Program ID targets Token-2022, not classic SPL.
2. Extensions are configured at mint creation.
3. The chosen extension set is compatible.
4. CLI flags match current documentation.

### Common errors

| Error | Likely cause | Action |
|---|---|---|
| `Invalid value "<placeholder>" for '<TOKEN_MINT_ADDRESS>'` | A placeholder was left in the command | Replace it with the real address |
| `syntax error near unexpected token 'newline'` | `<` `>` typed literally | Remove the `< >` symbols |
| `account not found` (script) | ATA never created, or a wallet address used as token account | Create the ATA / derive it with wallet + mint |
| `Transfer is disabled for this mint` | Non-transferable extension working as intended | Expected |
| `Extension already initialized on this account` | `initialize-metadata` already ran | Nothing to do |
| Command fails because the program doesn't own the address | Missing `--program-2022` when reading a Token-2022 mint | Add `--program-2022` before the command |
| `airdrop request failed` (rate limit) | Devnet limit | Send SOL with `solana transfer` instead |
| `Author identity unknown` (git) | Ubuntu git has no identity | `git config --global user.name` / `user.email` |

### Git hygiene for token projects

- Preview before staging: `git add -n .`. It must list only code, config and `package*.json`, never `node_modules`, `id.json`, or any keypair file.
- From inside the project folder, `git add .` only adds that folder. Avoid `git add -A` from the repo root if other folders have unrelated modifications.

### Done when

**SPL token flow**
- [ ] Mint created, token account created, supply minted
- [ ] A second wallet received tokens; both balances verified in CLI and Explorer
- [ ] TypeScript script reads both balances using the mint's decimals

**Token-2022**
- [ ] Mint created with at least two extensions
- [ ] Behavior tested (for example the blocked transfer)
- [ ] `spl-token --program-2022 display` inspected
- [ ] Script decodes the extension settings from the mint account
- [ ] I can explain the account-level differences between SPL Token and Token-2022 (program owner, mint data, behavior)