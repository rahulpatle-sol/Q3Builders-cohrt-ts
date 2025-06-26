import wallet from "./dev-wallet.json"

import { Transaction, SystemProgram, Connection, Keypair, LAMPORTS_PER_SOL, sendAndConfirmTransaction, PublicKey } from '@solana/web3.js';
const from =Keypair.fromSecretKey(new Uint8Array(wallet));
const to=new PublicKey("4fBsPrzgwU6qF3HCHNtUcKU4kA3zZYXRpC5mGsCNWa1X");
const connection = new Connection("https://api.devnet.solana.com");
    
// (async()=>{
// try{
//     const transection =new Transaction().add(
//         SystemProgram.transfer({
//             fromPubkey:from.publicKey,
//             toPubkey:to,
//             lamports:LAMPORTS_PER_SOL/100
//         })
//     );
//     transection.recentBlockhash=(
//         await connection.getLatestBlockhash('confirmed')
//     ).blockhash;
// transection.feePayer=from.publicKey;
// const signature=await sendAndConfirmTransaction(
//     connection,
//     transection,
//     [from]
// );
// console.log(`success! my Tx is here https://explorer.solana.com/tx/${signature}?cluster=devnet`);

// }catch (e){
//     console.log(`oops something went wrong ${e}`);

// }
// }) ();
// 0.1 sol transfer success 
// now empty the wallet  


(async () => {
  try {
    //  Get full balance
    const balance = await connection.getBalance(from.publicKey);
    console.log(`Current balance: ${balance / LAMPORTS_PER_SOL} SOL`);

    //  Prepare dummy transaction to estimate fee
    let transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: from.publicKey,
        toPubkey: to,
        lamports: balance, // placeholder
      })
    );
    transaction.recentBlockhash = (await connection.getLatestBlockhash("confirmed")).blockhash;
    transaction.feePayer = from.publicKey;

    //  Calculate actual fee
    const fee = (
      await connection.getFeeForMessage(transaction.compileMessage(), "confirmed")
    ).value || 0;

    console.log(`Estimated fee: ${fee} lamports`);

    // Replace instruction with correct amount (balance - fee)
    transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: from.publicKey,
        toPubkey: to,
        lamports: balance - fee, //  sending all - fee
      })
    );
    transaction.recentBlockhash = (await connection.getLatestBlockhash("confirmed")).blockhash;
    transaction.feePayer = from.publicKey;

    //  Send transaction
    const signature = await sendAndConfirmTransaction(connection, transaction, [from]);

    console.log(`All SOL sent! Tx: https://explorer.solana.com/tx/${signature}?cluster=devnet`);
  } catch (e) {
    console.log(` Error while emptying wallet: ${e}`);
  }
})();