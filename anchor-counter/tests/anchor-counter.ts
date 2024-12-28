import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { expect, assert } from "chai";
import { AnchorCounter } from "../target/types/anchor_counter";
 
describe("anchor-counter", () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
 
  const program = anchor.workspace.AnchorCounter as Program<AnchorCounter>;
 
  const counter = anchor.web3.Keypair.generate();
 
  it("Is initialized!", async () => {
    await program.methods
      .initialize()
      .accounts({ counter: counter.publicKey })
      .signers([counter])
      .rpc();
   
    const account = await program.account.counter.fetch(counter.publicKey);
    expect(account.count.toNumber()).to.equal(0);
  });
 
  it("Incremented the count", async () => {
    await program.methods
      .increment()
      .accounts({ counter: counter.publicKey })
      .rpc();
   
    const account = await program.account.counter.fetch(counter.publicKey);
    expect(account.count.toNumber()).to.equal(1);
  });

  it("Decremented the count", async () => {
    await program.methods
      .decrement()
      .accounts({ counter: counter.publicKey })
      .rpc();
   
    const account = await program.account.counter.fetch(counter.publicKey);
    expect(account.count.toNumber()).to.equal(0);

    try {
      await program.methods
        .decrement()
        .accounts({ counter: counter.publicKey })
        .rpc();

      assert.ok(false);
    } catch (error) {
      assert.isTrue(error.transactionMessage.includes("Transaction simulation failed"));
    }
  });
});
