import {Keypair} from "@solana/web3.js";
let kp=Keypair.generate();
console.log(`Generated new solana wallet ${kp.publicKey.toBase58()}`);
console.log(`[${kp.secretKey}]`);
