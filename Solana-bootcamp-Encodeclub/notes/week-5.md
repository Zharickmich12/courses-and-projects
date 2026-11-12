# Escrow, DeFi and NFTs
Multi-party token flows, price feeds and NFT collections.

## Escrow: trustless token swap

**Idea:** the maker locks Token A in a vault controlled by a PDA and asks for Token B. A taker can only get Token A by paying Token B. The program makes the exchange **atomic**: both transfers happen or none does.

| Instruction | Who | Effect |
|---|---|---|
| `make` | maker | creates the escrow state + vault, moves Token A from maker into the vault |
| `take` | taker | sends Token B to the maker, vault sends Token A to the taker, vault and escrow are closed |
| `cancel` | maker only | vault returns Token A to the maker, vault and escrow are closed |

**State to store:** maker pubkey, both mint addresses, requested Token B amount, a `seed` (u64), the bump.

**Why a `seed` field:** seeds `[b"escrow", maker, seed.to_le_bytes()]` let the same maker open many escrows at once. Each escrow gets its own address.

**Authority vs owner (the key concept)**
- The *owner* of any token account is the Token Program.
- The *authority* of the vault is who can move its tokens. It must be the **escrow PDA**, never the maker. If the maker were the authority, they could drain the vault without the program.
- Set it when creating the vault: `associated_token::authority = escrow`.

**Account constraints that matter**
```rust
#[account(has_one = maker, has_one = mint_a, has_one = mint_b, close = maker, seeds = [...], bump = escrow.bump)]
pub escrow: Box<Account<'info, Escrow>>,
```
- `has_one = mint_b` forces the taker to pay the expected mint. Without it, worthless tokens could drain the escrow.
- `has_one = maker` on `cancel` (with `maker: Signer`) blocks anyone else from cancelling.
- `close = maker` closes the escrow account and sends its rent lamports to the maker.

**Moving tokens: use the checked transfer**
```rust
transfer_checked(CpiContext::new(token_program, TransferChecked { from, mint, to, authority }), amount, decimals)?;
```
It validates mint and decimals. Use `InterfaceAccount` / `Interface<TokenInterface>` so the same code works with SPL Token and Token-2022.

**Vault signs through the PDA** (see `invoke_signed` in week 4):
```rust
let seeds: &[&[&[u8]]] = &[&[b"escrow", maker.as_ref(), &seed.to_le_bytes(), &[bump]]];
transfer_checked(CpiContext::new_with_signer(program, accounts, seeds), amount, decimals)?;
```

**Closing the vault is a separate CPI:** closing the escrow with `close =` does not close the vault token account. Call `close_account` (CloseAccount, signed by the PDA) after the transfer, with the destination set to the maker.

**Creating the taker's destination accounts:** use `init_if_needed` so a first-time taker does not need pre-made token accounts. It needs the feature flag in `Cargo.toml`:
```toml
anchor-lang = { version = "1.2.2", features = ["init-if-needed"] }
anchor-spl  = "1.2.2"
[features]
idl-build = ["anchor-lang/idl-build", "anchor-spl/idl-build"]
```

**Stack overflow ("Access violation ... unallocated region")**
Escrow instructions have many accounts. If a transaction fails at runtime with an access violation, wrap big accounts in `Box<...>` (`Box<InterfaceAccount<'info, Mint>>`, `Box<Account<'info, Escrow>>`) so they live on the heap instead of the stack.

**Code layout when the file gets big:** split into `state.rs` (account + errors), one file per instruction context (`make_ctx.rs`, `take_ctx.rs`, `cancel_ctx.rs`) and a small `lib.rs` that only calls them.

**Test matrix**

| Case | Expected |
|---|---|
| make → take | maker gets B, taker gets A, vault and escrow closed |
| make → cancel | maker gets A back, escrow closed |
| double take | second take fails (escrow closed) |
| take after cancel | fails |
| wrong mint / non-maker cancel | fail with a constraint error |
| balance reconciliation | total supply conserved, no hidden mint or burn |

Assert **before and after balances** for every actor, not only "the transaction succeeded".

**Devnet test script pattern:** create 3 mints, fund maker and taker, run each case and print PASS/FAIL per check. A second keypair (taker) lives outside the repo and signs with `.signers([taker])`.

## DeFi: read prices, compare routes

**Goal:** one TypeScript CLI that reads a Pyth price, checks it is fresh, gets a Jupiter quote and prints the spread. **Quote only, no swap.**

```bash
npm init -y && npm install @solana/web3.js@1 && npm install -D tsx typescript @types/node
npx tsx price-cli.ts
```

**Pyth**
- Use the feed account for the **network you are on** (devnet account for a devnet RPC). Wrong feed id or network mixup gives "account not found" or stale data.
- Read the raw account and decode price, confidence, exponent and publish time. Verify the feed id bytes inside the account match the feed you expect before trusting the number.
- Real price = `price * 10^exponent`. Confidence uses the same exponent.
- **Staleness:** `now - publishTime`. Warn when it is over 30 seconds.

**Jupiter**
- Quotes come from **mainnet** liquidity. Devnet liquidity gives nonsense comparisons, so keep the quote on mainnet even if the Pyth read is devnet.
- Request shape: input mint, output mint, `amount` in **raw units**, `slippageBps`.
- The API format and base URL change over time and may need an API key. Confirm the current format in the docs before coding. Keep the URL and key in environment variables.

**Decimals (most common bug):** SOL has 9 decimals, USDC has 6.
```
implied price = (outAmount / 1e6) / (inAmount / 1e9)
spread %      = |jupiter - pyth| / pyth * 100
```

**Output shape**
```
SOL/USD (Pyth):     $82.93 +/- $0.0311
Last updated:       5s ago
SOL/USDC (Jupiter): $82.94 (for 1 SOL)
Spread:             0.015%
```

## NFTs with Metaplex Token Metadata + Umi

**What an NFT is:** a mint with supply 1 and 0 decimals. What makes it an NFT is the **metadata account** (name, symbol, URI, collection), not special token math.

**Standard used:** Metaplex Token Metadata with Umi (widest ecosystem support). Alternatives: Token-2022 metadata extension, Metaplex Core.

```bash
npm install @metaplex-foundation/umi @metaplex-foundation/umi-bundle-defaults @metaplex-foundation/mpl-token-metadata
npm install -D tsx typescript @types/node
```

**Umi setup (script, devnet):**
```ts
const umi = createUmi('https://api.devnet.solana.com').use(mplTokenMetadata())
const keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(JSON.parse(readFileSync(path, 'utf8'))))
umi.use(keypairIdentity(keypair))
```
Umi has its own signer model (`generateSigner`, `keypairIdentity`, `umi.identity`). It differs from wallet-adapter and plain web3.js scripts. Load the key file from outside the repo.

**Create the collection, then members**
```ts
await createNft(umi, { mint: collectionMint, name, uri, sellerFeeBasisPoints: percentAmount(0), isCollection: true }).sendAndConfirm(umi)

await createNft(umi, { mint, name, uri, sellerFeeBasisPoints: percentAmount(0),
  collection: { key: collectionMint.publicKey, verified: false } }).sendAndConfirm(umi)
```
A member created with `verified: false` only *claims* membership. Verify it with the collection authority:
```ts
await verifyCollectionV1(umi, {
  metadata: findMetadataPda(umi, { mint: mint.publicKey }),
  collectionMint: collectionMint.publicKey,
  authority: umi.identity,
}).sendAndConfirm(umi)
```
If members show as unverified, the collection authority signature was not included.

**Metadata JSON** (what the URI must return):
```json
{
  "name": "...", "symbol": "...", "description": "...",
  "image": "https://.../nft1.png",
  "attributes": [{ "trait_type": "Shape", "value": "Circle" }],
  "properties": { "files": [{ "uri": "https://.../nft1.png", "type": "image/png" }] }
}
```
- The URI must be a **public** URL that returns valid JSON; a broken URL means missing image and attributes in wallets.
- Free hosting for a test: put the files in a public GitHub repo and use `https://raw.githubusercontent.com/<user>/<repo>/<branch>/<path>/<file>`. The repo must be public and the files pushed, so check each URL first:
  ```bash
  curl -s -o /dev/null -w "%{http_code}\n" "<url>"     # must print 200
  ```
- Check URLs **before** minting. The URI is stored in the metadata account; changing it later needs a metadata update.

**List a collection's items**
```ts
const asset = await fetchDigitalAsset(umi, publicKey(mintAddress))
const json = await (await fetch(asset.metadata.uri)).json()
const col = unwrapOption(asset.metadata.collection)   // { key, verified } or null
```
Print `json.name`, `json.image`, `json.attributes` and whether `col.verified` is true.

**Errors seen**
- `IncorrectOwner` on the Verify instruction right after creating the NFT: the account was not visible yet to the RPC node that simulated the transaction. What worked: pass `confirmed` commitment on send/confirm and wait a few seconds before verifying, with a retry loop. (Both changes were made together, so which one fixed it was not isolated.)
  ```ts
  const opts = { send: { preflightCommitment: 'confirmed' }, confirm: { commitment: 'confirmed' } }
  ```
- `404` when reading the metadata URI: the hosting repo was missing, private, or the files were not at the path in the URL.

## Small tooling lessons

- A `301` from `curl https://github.com/<user>/<repo>` means the repo was **renamed**. Follow it and read the final URL: `curl -sL -o /dev/null -w "%{http_code} %{url_effective}\n" <url>`.
- `unzip` may not exist in WSL. Without installing anything: `python3 -c "import zipfile; zipfile.ZipFile('file.zip').extractall('dest')"`.
- To rewrite a URL in many files at once: `sed -i 's#old#new#g' files...`, then `grep` to confirm no file still has the old text.
- Keep generated output out of git: `printf "node_modules\n" > .gitignore`. Add any file that lists addresses you do not need to publish.
- Mixed WSL and Windows: staging and committing in WSL, pushing from PowerShell (where the credentials live) works on the same working tree.

## Done when

**Escrow + tests**
- [ ] `make`, `take` and `cancel` work
- [ ] Wrong mint, wrong authority and closed-account paths fail clearly
- [ ] Balances reconcile, no tokens created or destroyed

**Integrations**
- [ ] CLI prints Pyth price, confidence, staleness and spread vs Jupiter quote
- [ ] Collection and three members minted and **verified** on devnet
- [ ] Script lists each member's name, image and attributes