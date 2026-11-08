use {
    anchor_lang::{
        prelude::Pubkey,
        solana_program::{instruction::Instruction, system_program},
        AccountDeserialize, InstructionData, ToAccountMetas,
    },
    litesvm::LiteSVM,
    solana_keypair::Keypair,
    solana_message::{Message, VersionedMessage},
    solana_signer::Signer,
    solana_transaction::versioned::VersionedTransaction,
    voting_program::state::{Proposal, ProposalState, VoteRecord},
};

fn setup() -> (LiteSVM, Pubkey) {
    let program_id = voting_program::id();
    let mut svm = LiteSVM::new();
    let bytes = include_bytes!(concat!(
        env!("CARGO_TARGET_TMPDIR"),
        "/../deploy/voting_program.so"
    ));
    svm.add_program(program_id, bytes).unwrap();
    (svm, program_id)
}

fn funded(svm: &mut LiteSVM) -> Keypair {
    let kp = Keypair::new();
    svm.airdrop(&kp.pubkey(), 1_000_000_000).unwrap();
    kp
}

fn proposal_pda(creator: &Pubkey, id: u64, program_id: &Pubkey) -> Pubkey {
    Pubkey::find_program_address(
        &[
            voting_program::constants::PROPOSAL_SEED,
            creator.as_ref(),
            &id.to_le_bytes(),
        ],
        program_id,
    )
    .0
}

fn vote_pda(proposal: &Pubkey, voter: &Pubkey, program_id: &Pubkey) -> Pubkey {
    Pubkey::find_program_address(
        &[
            voting_program::constants::VOTE_SEED,
            proposal.as_ref(),
            voter.as_ref(),
        ],
        program_id,
    )
    .0
}

fn send(svm: &mut LiteSVM, ix: Instruction, signer: &Keypair) -> bool {
    svm.expire_blockhash();
    let blockhash = svm.latest_blockhash();
    let msg = Message::new_with_blockhash(&[ix], Some(&signer.pubkey()), &blockhash);
    let tx = VersionedTransaction::try_new(VersionedMessage::Legacy(msg), &[signer]).unwrap();
    svm.send_transaction(tx).is_ok()
}

fn read_proposal(svm: &LiteSVM, pda: &Pubkey) -> Proposal {
    let account = svm.get_account(pda).unwrap();
    let mut data: &[u8] = &account.data;
    Proposal::try_deserialize(&mut data).unwrap()
}

fn read_vote(svm: &LiteSVM, pda: &Pubkey) -> VoteRecord {
    let account = svm.get_account(pda).unwrap();
    let mut data: &[u8] = &account.data;
    VoteRecord::try_deserialize(&mut data).unwrap()
}

fn create_ix(
    program_id: Pubkey,
    creator: Pubkey,
    proposal: Pubkey,
    id: u64,
    title: &str,
) -> Instruction {
    Instruction::new_with_bytes(
        program_id,
        &voting_program::instruction::CreateProposal {
            id,
            title: title.to_string(),
        }
        .data(),
        voting_program::accounts::CreateProposal {
            creator,
            proposal,
            system_program: system_program::ID,
        }
        .to_account_metas(None),
    )
}

fn activate_ix(program_id: Pubkey, creator: Pubkey, proposal: Pubkey) -> Instruction {
    Instruction::new_with_bytes(
        program_id,
        &voting_program::instruction::Activate {}.data(),
        voting_program::accounts::ActivateProposal { creator, proposal }.to_account_metas(None),
    )
}

fn vote_ix(
    program_id: Pubkey,
    voter: Pubkey,
    proposal: Pubkey,
    vote_record: Pubkey,
    yes: bool,
) -> Instruction {
    Instruction::new_with_bytes(
        program_id,
        &voting_program::instruction::Vote { yes }.data(),
        voting_program::accounts::CastVote {
            voter,
            proposal,
            vote_record,
            system_program: system_program::ID,
        }
        .to_account_metas(None),
    )
}

fn close_ix(program_id: Pubkey, creator: Pubkey, proposal: Pubkey) -> Instruction {
    Instruction::new_with_bytes(
        program_id,
        &voting_program::instruction::Close {}.data(),
        voting_program::accounts::CloseProposal { creator, proposal }.to_account_metas(None),
    )
}

#[test]
fn happy_path_draft_active_vote_closed() {
    let (mut svm, program_id) = setup();
    let creator = funded(&mut svm);
    let voter = funded(&mut svm);
    let proposal = proposal_pda(&creator.pubkey(), 1, &program_id);
    let record = vote_pda(&proposal, &voter.pubkey(), &program_id);

    assert!(send(
        &mut svm,
        create_ix(program_id, creator.pubkey(), proposal, 1, "Fund the garden"),
        &creator
    ));
    let p = read_proposal(&svm, &proposal);
    assert!(p.state == ProposalState::Draft);
    assert_eq!(p.creator, creator.pubkey());
    assert_eq!(p.yes_votes, 0);
    assert_eq!(p.no_votes, 0);

    assert!(send(
        &mut svm,
        activate_ix(program_id, creator.pubkey(), proposal),
        &creator
    ));
    assert!(read_proposal(&svm, &proposal).state == ProposalState::Active);

    assert!(send(
        &mut svm,
        vote_ix(program_id, voter.pubkey(), proposal, record, true),
        &voter
    ));
    let p = read_proposal(&svm, &proposal);
    assert_eq!(p.yes_votes, 1);
    assert_eq!(p.no_votes, 0);

    let v = read_vote(&svm, &record);
    assert!(v.yes);
    assert_eq!(v.voter, voter.pubkey());
    assert_eq!(v.proposal, proposal);

    assert!(send(
        &mut svm,
        close_ix(program_id, creator.pubkey(), proposal),
        &creator
    ));
    assert!(read_proposal(&svm, &proposal).state == ProposalState::Closed);
}

#[test]
fn vote_in_draft_fails() {
    let (mut svm, program_id) = setup();
    let creator = funded(&mut svm);
    let voter = funded(&mut svm);
    let proposal = proposal_pda(&creator.pubkey(), 1, &program_id);
    let record = vote_pda(&proposal, &voter.pubkey(), &program_id);

    assert!(send(
        &mut svm,
        create_ix(program_id, creator.pubkey(), proposal, 1, "Draft vote"),
        &creator
    ));

    assert!(!send(
        &mut svm,
        vote_ix(program_id, voter.pubkey(), proposal, record, true),
        &voter
    ));
    let p = read_proposal(&svm, &proposal);
    assert!(p.state == ProposalState::Draft);
    assert_eq!(p.yes_votes, 0);
    assert!(svm.get_account(&record).is_none());
}

#[test]
fn vote_in_closed_fails() {
    let (mut svm, program_id) = setup();
    let creator = funded(&mut svm);
    let voter = funded(&mut svm);
    let proposal = proposal_pda(&creator.pubkey(), 1, &program_id);
    let record = vote_pda(&proposal, &voter.pubkey(), &program_id);

    assert!(send(
        &mut svm,
        create_ix(program_id, creator.pubkey(), proposal, 1, "Closed vote"),
        &creator
    ));
    assert!(send(
        &mut svm,
        activate_ix(program_id, creator.pubkey(), proposal),
        &creator
    ));
    assert!(send(
        &mut svm,
        close_ix(program_id, creator.pubkey(), proposal),
        &creator
    ));

    assert!(!send(
        &mut svm,
        vote_ix(program_id, voter.pubkey(), proposal, record, true),
        &voter
    ));
    let p = read_proposal(&svm, &proposal);
    assert!(p.state == ProposalState::Closed);
    assert_eq!(p.yes_votes, 0);
    assert!(svm.get_account(&record).is_none());
}

#[test]
fn non_creator_cannot_activate() {
    let (mut svm, program_id) = setup();
    let creator = funded(&mut svm);
    let other = funded(&mut svm);
    let proposal = proposal_pda(&creator.pubkey(), 1, &program_id);

    assert!(send(
        &mut svm,
        create_ix(program_id, creator.pubkey(), proposal, 1, "Only creator"),
        &creator
    ));

    assert!(!send(
        &mut svm,
        activate_ix(program_id, other.pubkey(), proposal),
        &other
    ));
    assert!(read_proposal(&svm, &proposal).state == ProposalState::Draft);
}

#[test]
fn non_creator_cannot_close() {
    let (mut svm, program_id) = setup();
    let creator = funded(&mut svm);
    let other = funded(&mut svm);
    let proposal = proposal_pda(&creator.pubkey(), 1, &program_id);

    assert!(send(
        &mut svm,
        create_ix(program_id, creator.pubkey(), proposal, 1, "Only creator"),
        &creator
    ));
    assert!(send(
        &mut svm,
        activate_ix(program_id, creator.pubkey(), proposal),
        &creator
    ));

    assert!(!send(
        &mut svm,
        close_ix(program_id, other.pubkey(), proposal),
        &other
    ));
    assert!(read_proposal(&svm, &proposal).state == ProposalState::Active);
}

#[test]
fn duplicate_vote_fails() {
    let (mut svm, program_id) = setup();
    let creator = funded(&mut svm);
    let voter = funded(&mut svm);
    let proposal = proposal_pda(&creator.pubkey(), 1, &program_id);
    let record = vote_pda(&proposal, &voter.pubkey(), &program_id);

    assert!(send(
        &mut svm,
        create_ix(program_id, creator.pubkey(), proposal, 1, "No double vote"),
        &creator
    ));
    assert!(send(
        &mut svm,
        activate_ix(program_id, creator.pubkey(), proposal),
        &creator
    ));
    assert!(send(
        &mut svm,
        vote_ix(program_id, voter.pubkey(), proposal, record, true),
        &voter
    ));

    assert!(!send(
        &mut svm,
        vote_ix(program_id, voter.pubkey(), proposal, record, false),
        &voter
    ));
    let p = read_proposal(&svm, &proposal);
    assert_eq!(p.yes_votes, 1);
    assert_eq!(p.no_votes, 0);
}

#[test]
fn two_voters_can_vote() {
    let (mut svm, program_id) = setup();
    let creator = funded(&mut svm);
    let voter_a = funded(&mut svm);
    let voter_b = funded(&mut svm);
    let proposal = proposal_pda(&creator.pubkey(), 1, &program_id);
    let record_a = vote_pda(&proposal, &voter_a.pubkey(), &program_id);
    let record_b = vote_pda(&proposal, &voter_b.pubkey(), &program_id);

    assert!(send(
        &mut svm,
        create_ix(program_id, creator.pubkey(), proposal, 1, "Two voters"),
        &creator
    ));
    assert!(send(
        &mut svm,
        activate_ix(program_id, creator.pubkey(), proposal),
        &creator
    ));
    assert!(send(
        &mut svm,
        vote_ix(program_id, voter_a.pubkey(), proposal, record_a, true),
        &voter_a
    ));
    assert!(send(
        &mut svm,
        vote_ix(program_id, voter_b.pubkey(), proposal, record_b, false),
        &voter_b
    ));

    let p = read_proposal(&svm, &proposal);
    assert_eq!(p.yes_votes, 1);
    assert_eq!(p.no_votes, 1);
}

#[test]
fn activate_twice_fails() {
    let (mut svm, program_id) = setup();
    let creator = funded(&mut svm);
    let proposal = proposal_pda(&creator.pubkey(), 1, &program_id);

    assert!(send(
        &mut svm,
        create_ix(program_id, creator.pubkey(), proposal, 1, "Activate once"),
        &creator
    ));
    assert!(send(
        &mut svm,
        activate_ix(program_id, creator.pubkey(), proposal),
        &creator
    ));

    assert!(!send(
        &mut svm,
        activate_ix(program_id, creator.pubkey(), proposal),
        &creator
    ));
    assert!(read_proposal(&svm, &proposal).state == ProposalState::Active);
}

#[test]
fn title_too_long_fails() {
    let (mut svm, program_id) = setup();
    let creator = funded(&mut svm);
    let proposal = proposal_pda(&creator.pubkey(), 1, &program_id);
    let long_title = "x".repeat(51);

    assert!(!send(
        &mut svm,
        create_ix(program_id, creator.pubkey(), proposal, 1, &long_title),
        &creator
    ));
    assert!(svm.get_account(&proposal).is_none());
}