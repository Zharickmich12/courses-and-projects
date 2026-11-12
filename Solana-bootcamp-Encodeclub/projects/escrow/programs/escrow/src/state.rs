use anchor_lang::prelude::*;

pub const ESCROW_SEED: &[u8] = b"escrow";

#[account]
#[derive(InitSpace)]
pub struct Escrow {
    pub maker: Pubkey,
    pub seed: u64,
    pub mint_a: Pubkey,
    pub mint_b: Pubkey,
    pub receive: u64,
    pub bump: u8,
}

#[error_code]
pub enum EscrowError {
    #[msg("Amounts must be greater than zero")]
    InvalidAmount,
}