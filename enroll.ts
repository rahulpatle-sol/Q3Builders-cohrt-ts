import { Connection, Keypair, PublicKey } from "@solana/web3.js";
import { AnchorProvider, Program, Wallet } from "@coral-xyz/anchor";
import wallet from "./dev-wallet.json";
import { IDL, Turbin3Prereq } from "./programs/Turbin3_prereq";
import { log } from "console";

//  Required Constants
const PROGRAM_ID = new PublicKey("3a3ySpCjcgya3Ed8eDLTx7yTG4Fr2nK5kH3ac1VXij4n");
const SYSTEM_PROGRAM_ID = new PublicKey("11111111111111111111111111111111");
const MPL_CORE_PROGRAM_ID = new PublicKey("CoREENxT6tW1HoK8ypY1SxRMZTcVPm7R94rH4PZNhX7d");

//  Wallet setup
const keypair = Keypair.fromSecretKey(new Uint8Array(wallet));
const connection = new Connection("https://solana-devnet.g.alchemy.com/v2/A4n7tJP75oDaD4emFu7wcMBo6bEelthD", "confirmed");
const provider = new AnchorProvider(connection, new Wallet(keypair), {
  commitment: "confirmed",
});

// Anchor Program
const program: Program<Turbin3Prereq> = new Program(IDL, provider);

// Create the PDA for our enrollment account
const account_seeds = [
  Buffer.from("prereqs"),
  keypair.publicKey.toBuffer(),
];
const [account_key, _account_bump] =
  PublicKey.findProgramAddressSync(account_seeds, program.programId);


const mintCollection = new
  PublicKey("5ebsp5RChCGK7ssRZMVMufgVZhd2kFbNaotcZ5UvytN2");

const mintTs = Keypair.generate();

// (async () => {
//   try {
//     // 🧹 Try closing if already exists
//     try {
//       await program.methods
//         .close()
//         .accountsPartial({
//             user: keypair.publicKey,
//             account: account_key,
//             system_program: SYSTEM_PROGRAM_ID,
//         })
//         .signers([keypair])
//         .rpc();

//       console.log("✅ Closed old account");
//     } catch (e) {
//       console.log("ℹ️ No account to close or already closed");
//     }
//   } catch (e) {
//     console.log("⚠️ Unexpected error while closing account:", e);
//   }
// })();


// Execute the initialize transaction
// (async () => {
//   try {
//     const txhash = await program.methods
//       .initialize("rahulpatle-sol")
//       .accountsPartial({
//         user: keypair.publicKey,
//         account: account_key,
//         system_program: SYSTEM_PROGRAM_ID,
//       })
//       .signers([keypair])
//       .rpc();
//     console.log(`✅DONE 1st Success! Check out your TX here:
// https://explorer.solana.com/tx/${txhash}?cluster=devnet`);
//   } catch (e) {
//     console.error(`Oops, something went wrong: ${e}`);
//   }
// })();


// Execute the submitTs transaction


(async () => {
  try {
    const txhash = await program.methods
      .submitTs()
      .accountsPartial({
        user: keypair.publicKey,
        account: account_key,
        mint: mintTs.publicKey,
        collection: mintCollection,
        authority:keypair.publicKey,
        mpl_core_program: MPL_CORE_PROGRAM_ID,
        system_program: SYSTEM_PROGRAM_ID,
      })
      .signers([keypair, mintTs])
      .rpc();
    console.log(`✅DONE 2nd Success! Check out your TX here:
https://explorer.solana.com/tx/${txhash}?cluster=devnet`);
  } catch (e) {
    console.error(`Oops, something went wrong: ${e}`);
  }
})