use anchor_lang::prelude::*;
use anchor_spl::token_interface::{
    close_account, transfer_checked, CloseAccount, TransferChecked,
};

pub mod cancel_ctx;
pub mod make_ctx;
pub mod state;
pub mod take_ctx;

pub use cancel_ctx::*;
pub use make_ctx::*;
pub use state::*;
pub use take_ctx::*;

declare_id!("8gyvieK6Hpive2WaDLvyuEcceLSGRWesbiVLN4Drhm17");

#[program]
pub mod escrow {
    use super::*;

    pub fn make(ctx: Context<Make>, seed: u64, deposit: u64, receive: u64) -> Result<()> {
        require!(deposit > 0 && receive > 0, EscrowError::InvalidAmount);

        let escrow = &mut ctx.accounts.escrow;
        escrow.maker = ctx.accounts.maker.key();
        escrow.seed = seed;
        escrow.mint_a = ctx.accounts.mint_a.key();
        escrow.mint_b = ctx.accounts.mint_b.key();
        escrow.receive = receive;
        escrow.bump = ctx.bumps.escrow;

        let cpi = CpiContext::new(
            ctx.accounts.token_program.key(),
            TransferChecked {
                from: ctx.accounts.maker_ata_a.to_account_info(),
                mint: ctx.accounts.mint_a.to_account_info(),
                to: ctx.accounts.vault.to_account_info(),
                authority: ctx.accounts.maker.to_account_info(),
            },
        );
        transfer_checked(cpi, deposit, ctx.accounts.mint_a.decimals)
    }

    pub fn take(ctx: Context<Take>) -> Result<()> {
        let cpi_b = CpiContext::new(
            ctx.accounts.token_program.key(),
            TransferChecked {
                from: ctx.accounts.taker_ata_b.to_account_info(),
                mint: ctx.accounts.mint_b.to_account_info(),
                to: ctx.accounts.maker_ata_b.to_account_info(),
                authority: ctx.accounts.taker.to_account_info(),
            },
        );
        transfer_checked(cpi_b, ctx.accounts.escrow.receive, ctx.accounts.mint_b.decimals)?;

        let maker_key = ctx.accounts.escrow.maker;
        let seed_bytes = ctx.accounts.escrow.seed.to_le_bytes();
        let bump = [ctx.accounts.escrow.bump];
        let signer_seeds: &[&[&[u8]]] =
            &[&[ESCROW_SEED, maker_key.as_ref(), seed_bytes.as_ref(), &bump]];

        let amount = ctx.accounts.vault.amount;
        let cpi_a = CpiContext::new_with_signer(
            ctx.accounts.token_program.key(),
            TransferChecked {
                from: ctx.accounts.vault.to_account_info(),
                mint: ctx.accounts.mint_a.to_account_info(),
                to: ctx.accounts.taker_ata_a.to_account_info(),
                authority: ctx.accounts.escrow.to_account_info(),
            },
            signer_seeds,
        );
        transfer_checked(cpi_a, amount, ctx.accounts.mint_a.decimals)?;

        let cpi_close = CpiContext::new_with_signer(
            ctx.accounts.token_program.key(),
            CloseAccount {
                account: ctx.accounts.vault.to_account_info(),
                destination: ctx.accounts.maker.to_account_info(),
                authority: ctx.accounts.escrow.to_account_info(),
            },
            signer_seeds,
        );
        close_account(cpi_close)
    }

    pub fn cancel(ctx: Context<Cancel>) -> Result<()> {
        let maker_key = ctx.accounts.escrow.maker;
        let seed_bytes = ctx.accounts.escrow.seed.to_le_bytes();
        let bump = [ctx.accounts.escrow.bump];
        let signer_seeds: &[&[&[u8]]] =
            &[&[ESCROW_SEED, maker_key.as_ref(), seed_bytes.as_ref(), &bump]];

        let amount = ctx.accounts.vault.amount;
        let cpi_a = CpiContext::new_with_signer(
            ctx.accounts.token_program.key(),
            TransferChecked {
                from: ctx.accounts.vault.to_account_info(),
                mint: ctx.accounts.mint_a.to_account_info(),
                to: ctx.accounts.maker_ata_a.to_account_info(),
                authority: ctx.accounts.escrow.to_account_info(),
            },
            signer_seeds,
        );
        transfer_checked(cpi_a, amount, ctx.accounts.mint_a.decimals)?;

        let cpi_close = CpiContext::new_with_signer(
            ctx.accounts.token_program.key(),
            CloseAccount {
                account: ctx.accounts.vault.to_account_info(),
                destination: ctx.accounts.maker.to_account_info(),
                authority: ctx.accounts.escrow.to_account_info(),
            },
            signer_seeds,
        );
        close_account(cpi_close)
    }
}