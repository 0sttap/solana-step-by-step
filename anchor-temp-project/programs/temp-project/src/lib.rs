use anchor_lang::prelude::*;

declare_id!("3TM1ekE27qViqLTqmNHCa9yX9AzReb7e4sWGb57stg2z");

#[program]
pub mod temp_project {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        msg!("Greetings from: {:?}", ctx.program_id);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
