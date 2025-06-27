import { Connection, Keypair, PublicKey } from "@solana/web3.js";
import { AnchorProvider, Program, Wallet } from "@coral-xyz/anchor";
import wallet from "./dev-wallet.json"; // 👈 Turbin3 wallet here
import { IDL, Turbin3Prereq } from "./programs/Turbin3_prereq";

// Constants
const PROGRAM_ID = new PublicKey("3a3ySpCjcgya3Ed8eDLTx7yTG4Fr2nK5kH3ac1VXij4n");
const SYSTEM_PROGRAM_ID = new PublicKey("11111111111111111111111111111111");
const MPL_CORE_PROGRAM_ID = new PublicKey("CoREENxT6tW1HoK8ypY1SxRMZTcVPm7R94rH4PZNhX7d");

// Wallet setup (Turbine3 wallet)
const keypair = Keypair.fromSecretKey(new Uint8Array(wallet)); // ✅ This is your main wallet
const mintTs = keypair; // ✅ Mint using same wallet

const connection = new Connection("https://api.devnet.solana.com", "confirmed");
const provider = new AnchorProvider(connection, new Wallet(keypair), { commitment: "confirmed" });
const program: Program<Turbin3Prereq> = new Program(IDL, provider);

// PDA for account
const account_seeds = [Buffer.from("prereqs"), keypair.publicKey.toBuffer()];
const [account_key, _account_bump] = PublicKey.findProgramAddressSync(account_seeds, program.programId);

// Mint collection
const mintCollection = new PublicKey("5ebsp5RChCGK7ssRZMVMufgVZhd2kFbNaotcZ5UvytN2");

// Authority PDA
const [authorityPda] = PublicKey.findProgramAddressSync(
  [Buffer.from("collection"), mintCollection.toBuffer()],
  program.programId
);

// Run the flow
(async () => {
  try {
    // Optional: Close old account
    try {
      await program.methods
        .close()
        .accountsPartial({
          user: keypair.publicKey,
          account: account_key,
          system_program: SYSTEM_PROGRAM_ID,
        })
        .signers([keypair])
        .rpc();
      console.log("✅ Closed old account");
    } catch (e) {
      console.log("ℹ️ No account to close or already closed");
    }

    // Initialize
    const txInit = await program.methods
      .initialize("rahulpatle-sol")
      .accountsPartial({
        user: keypair.publicKey,
        account: account_key,
        system_program: SYSTEM_PROGRAM_ID,
      })
      .signers([keypair])
      .rpc();
    console.log(`✅ Initialized! TX: https://explorer.solana.com/tx/${txInit}?cluster=devnet`);

    // Submit & Mint NFT
    const txMint = await program.methods
      .submitTs()
      .accountsPartial({
        user: keypair.publicKey,
        account: account_key,
        mint: keypair.publicKey, // 👈 NFT goes into your wallet
        collection: mintCollection,
        authority: authorityPda,
        mpl_core_program: MPL_CORE_PROGRAM_ID,
        system_program: SYSTEM_PROGRAM_ID,
      })
      .signers([keypair]) // 👈 Only one signer needed now
      .rpc();

    console.log(`✅ NFT Minted! TX: https://explorer.solana.com/tx/${txMint}?cluster=devnet`);
  } catch (e: any) {
    console.error("❌ Error:", e);
    if (e.logs) console.error("Logs:\n" + e.logs.join("\n"));
  }
})();
