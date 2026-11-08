use anchor_lang::prelude::*;

use crate::{
    constants::*,
    error::ErrorCode,
    state::{Proposal, ProposalState},
};

#[derive(Accounts)]
pub struct CloseProposal<'info> {
    pub creator: Signer<'info>,
    #[account(
        mut,
        seeds = [PROPOSAL_SEED, proposal.creator.as_ref(), &proposal.id.to_le_bytes()],
        bump = proposal.bump
    )]
    pub proposal: Account<'info, Proposal>,
}

pub fn handle_close(ctx: Context<CloseProposal>) -> Result<()> {
    let proposal = &mut ctx.accounts.proposal;

    require_keys_eq!(
        proposal.creator,
        ctx.accounts.creator.key(),
        ErrorCode::Unauthorized
    );
    require!(proposal.state == ProposalState::Active, ErrorCode::NotActive);

    proposal.state = ProposalState::Closed;
    Ok(())
}