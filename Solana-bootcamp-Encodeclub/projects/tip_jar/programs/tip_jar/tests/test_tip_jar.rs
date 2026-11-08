use {
    anchor_lang::{
        prelude::Pubkey,
        solana_program::{instruction::Instruction, system_program},
        InstructionData, ToAccountMetas,
    },
    litesvm::LiteSVM,
    solana_keypair::Keypair,
    solana_message::{Message, VersionedMessage},
    solana_signer::Signer,
    solana_transaction::versioned::VersionedTransaction,
};

fn setup() -> (LiteSVM, Pubkey) {
    let program_id = tip_jar::id();
    let mut svm = LiteSVM::new();
    let bytes = include_bytes!(concat!(
        env!("CARGO_TARGET_TMPDIR"),
        "/../deploy/tip_jar.so"
    ));
    svm.add_program(program_id, bytes).unwrap();
    (svm, program_id)
}

fn funded(svm: &mut LiteSVM) -> Keypair {
    let kp = Keypair::new();
    svm.airdrop(&kp.pubkey(), 1_000_000_000).unwrap();
    kp
}

fn vault_pda(owner: &Pubkey, program_id: &Pubkey) -> Pubkey {
    Pubkey::find_program_address(&[tip_jar::VAULT_SEED, owner.as_ref()], program_id).0
}

fn lamports(svm: &LiteSVM, key: &Pubkey) -> u64 {
    svm.get_account(key).map(|a| a.lamports).unwrap_or(0)
}

fn send(svm: &mut LiteSVM, ix: Instruction, signer: &Keypair) -> bool {
    svm.expire_blockhash();
    let blockhash = svm.latest_blockhash();
    let msg = Message::new_with_blockhash(&[ix], Some(&signer.pubkey()), &blockhash);
    let tx = VersionedTransaction::try_new(VersionedMessage::Legacy(msg), &[signer]).unwrap();
    svm.send_transaction(tx).is_ok()
}

fn deposit_ix(program_id: Pubkey, owner: Pubkey, vault: Pubkey, amount: u64) -> Instruction {
    Instruction::new_with_bytes(
        program_id,
        &tip_jar::instruction::Deposit { amount }.data(),
        tip_jar::accounts::Deposit {
            owner,
            vault,
            system_program: system_program::ID,
        }
        .to_account_metas(None),
    )
}

fn withdraw_ix(program_id: Pubkey, owner: Pubkey, vault: Pubkey, amount: u64) -> Instruction {
    Instruction::new_with_bytes(
        program_id,
        &tip_jar::instruction::Withdraw { amount }.data(),
        tip_jar::accounts::Withdraw {
            owner,
            vault,
            system_program: system_program::ID,
        }
        .to_account_metas(None),
    )
}

#[test]
fn deposit_then_withdraw_everything() {
    let (mut svm, program_id) = setup();
    let owner = funded(&mut svm);
    let vault = vault_pda(&owner.pubkey(), &program_id);

    assert!(send(&mut svm, deposit_ix(program_id, owner.pubkey(), vault, 100_000_000), &owner));
    assert_eq!(lamports(&svm, &vault), 100_000_000);

    assert!(send(&mut svm, withdraw_ix(program_id, owner.pubkey(), vault, 40_000_000), &owner));
    assert_eq!(lamports(&svm, &vault), 60_000_000);

    assert!(send(&mut svm, withdraw_ix(program_id, owner.pubkey(), vault, 60_000_000), &owner));
    assert_eq!(lamports(&svm, &vault), 0);
}

#[test]
fn two_deposits_accumulate() {
    let (mut svm, program_id) = setup();
    let owner = funded(&mut svm);
    let vault = vault_pda(&owner.pubkey(), &program_id);

    assert!(send(&mut svm, deposit_ix(program_id, owner.pubkey(), vault, 10_000_000), &owner));
    assert!(send(&mut svm, deposit_ix(program_id, owner.pubkey(), vault, 5_000_000), &owner));
    assert_eq!(lamports(&svm, &vault), 15_000_000);
}

#[test]
fn withdraw_more_than_balance_fails() {
    let (mut svm, program_id) = setup();
    let owner = funded(&mut svm);
    let vault = vault_pda(&owner.pubkey(), &program_id);

    assert!(send(&mut svm, deposit_ix(program_id, owner.pubkey(), vault, 10_000_000), &owner));
    assert!(!send(&mut svm, withdraw_ix(program_id, owner.pubkey(), vault, 20_000_000), &owner));
    assert_eq!(lamports(&svm, &vault), 10_000_000);
}

#[test]
fn other_wallet_cannot_withdraw_from_my_vault() {
    let (mut svm, program_id) = setup();
    let owner = funded(&mut svm);
    let other = funded(&mut svm);
    let vault = vault_pda(&owner.pubkey(), &program_id);

    assert!(send(&mut svm, deposit_ix(program_id, owner.pubkey(), vault, 50_000_000), &owner));
    assert!(!send(&mut svm, withdraw_ix(program_id, other.pubkey(), vault, 10_000_000), &other));
    assert_eq!(lamports(&svm, &vault), 50_000_000);
}

#[test]
fn zero_amounts_fail() {
    let (mut svm, program_id) = setup();
    let owner = funded(&mut svm);
    let vault = vault_pda(&owner.pubkey(), &program_id);

    assert!(!send(&mut svm, deposit_ix(program_id, owner.pubkey(), vault, 0), &owner));
    assert!(send(&mut svm, deposit_ix(program_id, owner.pubkey(), vault, 10_000_000), &owner));
    assert!(!send(&mut svm, withdraw_ix(program_id, owner.pubkey(), vault, 0), &owner));
}