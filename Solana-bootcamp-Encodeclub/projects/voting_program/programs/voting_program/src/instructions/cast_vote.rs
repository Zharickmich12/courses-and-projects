use anchor_lang::prelude::*;

use crate::{
    constants::*,
    error::ErrorCode,
    state::{Proposal, ProposalState, VoteRecord},
};

#[derive(Accounts)]
pub struct CastVote<'info> {
    #[account(mut)]
    pub voter: Signer<'info>,
    #[account(
        mut,
        seeds = [PROPOSAL_SEED, proposal.creator.as_ref(), &proposal.id.to_le_bytes()],
        bump = proposal.bump
    )]
    pub proposal: Account<'info, Proposal>,
    #[account(
        init,
        payer = voter,
        space = 8 + VoteRecord::INIT_SPACE,
        seeds = [VOTE_SEED, proposal.key().as_ref(), voter.key().as_ref()],
        bump
    )]
    pub vote_record: Account<'info, VoteRecord>,
    pub system_program: Program<'info, System>,
}

pub fn handle_vote(ctx: Context<CastVote>, yes: bool) -> Result<()> {
    let proposal = &mut ctx.accounts.proposal;
    require!(proposal.state == ProposalState::Active, ErrorCode::NotActive);

    if yes {
        proposal.yes_votes += 1;
    } else {
        proposal.no_votes += 1;
    }

    let record = &mut ctx.accounts.vote_record;
    record.proposal = proposal.key();
    record.voter = ctx.accounts.voter.key();
    record.yes = yes;
    record.bump = ctx.bumps.vote_record;
    Ok(())
}