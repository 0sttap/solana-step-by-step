import "dotenv/config";
import { getKeypairFromEnvironment } from "@solana-developers/helpers";
 
const keypair = getKeypairFromEnvironment("SECRET_KEY");

console.log(`The public key is: `, keypair.publicKey.toBase58());
console.log("PKS5pr6ZLwhPS4SXdQrE4fAGHqCrWcxwbP9JkFxr2w1" == keypair.publicKey.toBase58());
 
console.log(
  `✅ Finished! We've loaded our secret key securely, using an env file!`,
);
