import { Connection, Keypair, PublicKey } from "@solana/web3.js";
import { AnchorProvider, Program, Wallet } from "@coral-xyz/anchor";
import wallet from "./dev-wallet.json";
import { IDL, Turbin3Prereq } from "./programs/Turbin3_prereq";

//  Required Constants
const PROGRAM_ID = new PublicKey("3a3ySpCjcgya3Ed8eDLTx7yTG4Fr2nK5kH3ac1VXij4n");
const SYSTEM_PROGRAM_ID = new PublicKey("11111111111111111111111111111111");
const MPL_CORE_PROGRAM_ID = new PublicKey("CoREENxT6tW1HoK8ypY1SxRMZTcVPm7R94rH4PZNhX7d");
const MINT_COLLECTION = new PublicKey("5ebsp5RChCGK7ssRZMVMufgVZhd2kFbNaotcZ5UvytN2");

//  Wallet setup
const keypair = Keypair.fromSecretKey(new Uint8Array(wallet));
const connection = new Connection("https://api.devnet.solana.com", "confirmed");
const provider = new AnchorProvider(connection, new Wallet(keypair), {
  commitment: "confirmed",
});

// Anchor Program
const program = new Program(IDL, PROGRAM_ID as any, provider as any);


// Derive your on-chain account PDA
const [account_key, _bump] = PublicKey.findProgramAddressSync(
  [Buffer.from("prereqs"), keypair.publicKey.toBuffer()],
  PROGRAM_ID
);

// Generate new mint for NFT
const mintTs = Keypair.generate();

// Step 1: initialize()
(async () => {
  try {
    const tx1 = await program.methods
      .initialize("rahulpatle-sol") // << 🎯 Your GitHub username
      .accountsPartial({
        user: keypair.publicKey,
        account: account_key,
        systemProgram: SYSTEM_PROGRAM_ID,
      })
      .signers([keypair])
      .rpc();

    console.log(` Initialized: https://explorer.solana.com/tx/${tx1}?cluster=devnet`);
  } catch (e) {
    console.error(" Error in initialize():", e);
  }

  // Step 2: submitTs()
  try {
    const tx2 = await program.methods
      .submitTs()
      .accountsPartial({
        user: keypair.publicKey,
        account: account_key,
        mint: mintTs.publicKey,
        collection: MINT_COLLECTION,
        authority: keypair.publicKey,
        mplCoreProgram: MPL_CORE_PROGRAM_ID,
        systemProgram: SYSTEM_PROGRAM_ID,
      })
      .signers([keypair, mintTs])
      .rpc();

    console.log(`NFT Minted: https://explorer.solana.com/tx/${tx2}?cluster=devnet`);
  } catch (e) {
    console.error("Error in submitTs():", e);
  }
})();
