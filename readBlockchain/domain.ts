import { Connection, PublicKey } from "@solana/web3.js";
import { getDomainKeySync, NAME_PROGRAM_ID } from "@bonfida/spl-name-service";

const domainName = "toly";
const connection = new Connection("https://api.mainnet-beta.solana.com");

const { pubkey } = getDomainKeySync(domainName);

console.log(`The public key is: ${pubkey.toBase58()}`);

async function findOwnedNameAccountsForUser(
  connection: Connection,
  userAccount: PublicKey
): Promise<PublicKey[]> {
  const filters = [
    {
      memcmp: {
        offset: 32,
        bytes: userAccount.toBase58(),
      },
    },
  ];
  const accounts = await connection.getProgramAccounts(NAME_PROGRAM_ID, {
    filters,
  });
  return accounts.map((a) => a.pubkey);
}

async function main() {
  const ownedNames = await findOwnedNameAccountsForUser(connection, pubkey);
  console.log(`Owned names for ${pubkey.toBase58()}:`, ownedNames);
}

main().catch((error) => {
  console.error("Error:", error);
});
