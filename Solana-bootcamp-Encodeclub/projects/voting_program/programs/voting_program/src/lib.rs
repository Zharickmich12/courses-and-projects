pub mod constants;
pub mod error;
pub mod instructions;
pub mod state;

use anchor_lang::prelude::*;

pub use constants::*;
pub use instructions::*;
pub use state::*;

declare_id!("6x8btR4tNnNhYPHtYVDVHckQbEW2Nfruxo8RtiiaEKp9");

#[program]
pub mod voting_program {
    use super::*;

    pub fn create_proposal(ctx: Context<CreateProposal>, id: u64, title: String) -> Result<()> {
        crate::instructions::create_proposal::handle_create_proposal(ctx, id, title)
    }

    pub fn activate(ctx: Context<ActivateProposal>) -> Result<()> {
        crate::instructions::activate_proposal::handle_activate(ctx)
    }

    pub fn vote(ctx: Context<CastVote>, yes: bool) -> Result<()> {
        crate::instructions::cast_vote::handle_vote(ctx, yes)
    }

    pub fn close(ctx: Context<CloseProposal>) -> Result<()> {
        crate::instructions::close_proposal::handle_close(ctx)
    }
}