import {
  Connection,
  Transaction,
  SystemProgram,
  sendAndConfirmTransaction,
  PublicKey,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";
import "dotenv/config";
import { getKeypairFromEnvironment } from "@solana-developers/helpers";

const suppliedToPubkey = process.argv[2] || null;

if (!suppliedToPubkey) {
  console.log(`Please provide a public key to send to`);
  process.exit(1);
}

const senderKeypair = getKeypairFromEnvironment("SECRET_KEY");

console.log(`suppliedToPubkey: ${suppliedToPubkey}`);

const toPubkey = new PublicKey(suppliedToPubkey);

const connection = new Connection("https://api.devnet.solana.com", "confirmed");

console.log(
  `✅ Loaded our own keypair, the destination public key, and connected to Solana`
);

const sendSol = async () => {
  try {
    const transaction = new Transaction();

    const sendSolInstruction = SystemProgram.transfer({
      fromPubkey: senderKeypair.publicKey,
      toPubkey,
      lamports: LAMPORTS_PER_SOL / 100,
    });

    transaction.add(sendSolInstruction);

    const startTime = Date.now();

    const signature = await sendAndConfirmTransaction(connection, transaction, [
      senderKeypair,
    ]);

    const endTime = Date.now();
    const duration = (endTime - startTime) / 1000; // duration in seconds

    const feeInUSD = await getTransactionFeeInUSD(transaction);

    console.log(`💸 Finished! Sent 0.01 SOL to the address ${toPubkey}.`);
    console.log(`Transaction signature is ${signature}`);
    console.log(`Transaction fee in USD: $${feeInUSD}`);
    console.log(`Transaction duration: ${duration} seconds`);
  } catch (error) {
    console.error("Error sending SOL:", error);
  }
};

async function getTransactionFeeInUSD(transaction: Transaction) {
  const fee = await transaction.getEstimatedFee(connection);
  if (!fee) {
    throw new Error("Transaction fee is null");
  }

  const feeInSol = fee / LAMPORTS_PER_SOL;

  const response = await fetch(
    "https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd"
  );

  const data = await response.json();
  const solPrice = data.solana.usd;

  return feeInSol * solPrice;
}

const main = async () => {
  await sendSol();
};

main().catch((error) => {
  console.error("Error:", error);
});
