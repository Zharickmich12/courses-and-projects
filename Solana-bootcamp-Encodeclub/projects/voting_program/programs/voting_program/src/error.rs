use anchor_lang::prelude::*;

#[error_code]
pub enum ErrorCode {
    #[msg("Only the proposal creator can do this")]
    Unauthorized,
    #[msg("Proposal must be in Draft to be activated")]
    NotDraft,
    #[msg("Proposal is not Active")]
    NotActive,
    #[msg("Title is too long (max 50 bytes)")]
    TitleTooLong,
}