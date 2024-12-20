import { Connection, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";

// Constants for network endpoints and public keys
const MAINNET_ENDPOINT = "https://api.mainnet-beta.solana.com";
const DEVNET_ENDPOINT = "https://api.devnet.solana.com";
const MAINNET_PUBLIC_KEY = "3sMjMtr7dj8eb8UD89XFPo3GwF8uFbMhzs9w1UVFU59A";
const DEVNET_PUBLIC_KEY = "F9CahUZMih86noSdcrDWyAa7hmWTGDTHpHrErz9cMQe5";

// mainnet = 0, devnet = 1...n
const network = process.argv[2];

if (!network) {
  throw new Error("You need to provide a network name as an argument!");
}

const getAddressAndConnection = (publicKey: string, endpoint: string) => {
  const address = new PublicKey(publicKey);

  if (!PublicKey.isOnCurve(address.toBuffer())) {
    throw new Error("Invalid public key");
  }
  const connection = new Connection(endpoint, "confirmed");
  return { address, connection };
};

const main = async () => {
  const { address, connection } = network === "0"
    ? getAddressAndConnection(MAINNET_PUBLIC_KEY, MAINNET_ENDPOINT)
    : getAddressAndConnection(DEVNET_PUBLIC_KEY, DEVNET_ENDPOINT);

  const balanceInLamports = await connection.getBalance(address);
  const balanceInSOL = balanceInLamports / LAMPORTS_PER_SOL;

  console.log(
    `💰 Finished! The balance for the wallet at address ${address} is ${balanceInSOL}!`,
  );
};

main().catch((error) => {
  console.error("Error:", error);
});
