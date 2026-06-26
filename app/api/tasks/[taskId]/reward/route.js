import { createApiSupabaseClient } from "@/lib/supabase-server";
import { NextResponse } from "next/server";
import { ethers } from 'ethers';

export const POST = async (request, { params }) => {
    const WPT_ABI = ["function mint(address to, uint256 amount) external"];

    const { taskId } = await params;
    const admin = createApiSupabaseClient(request);
    const {
        data: { user },
    } = await admin.auth.getUser();

    if (!user) return NextResponse.json({ message: "Invalid User " })

    const { data: task } = await admin.from("tasks").select("*").eq("id", taskId).single();

    if (!task) return NextResponse.json({ message: "Invalid Task " })

    if (task.status !== "complete") return NextResponse.json({ message: "Task is not completed " })

    const { data: existingReward } = await admin
        .from("task_rewards")
        .select("id, tx_hash")
        .eq("task_id", taskId)
        .maybeSingle();

    if (existingReward && existingReward.tx_hash) {
        return NextResponse.json({ error: true, message: "Reward already minted for this task." }, { status: 400 });
    }


    const RPCURL = process.env.HARDHAT_RPC_URL || "http://127.0.0.1:8545/"
    const MINTER = process.env.REWARD_MINTER_PRIVATE_KEY || "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"
    const CONTRACT = process.env.WPT_CONTRACT_ADDRESS || "";
    const RECIEVER = process.env.REWARD_RECEIVER_ADDRESS || "";
    const REWARD_AMT = parseInt(process.env.WPT_REWARD_AMOUNT || "10", 10);

    if (!MINTER || !CONTRACT || !RECIEVER) {
        return NextResponse.json({ message: "Please configure the reward variables " }, { status: 500 })
    }
    let txHash;
    try {
        const provider = new ethers.JsonRpcProvider(RPCURL)
        const wallet = new ethers.Wallet(MINTER, provider)
        const nftContract = new ethers.Contract(CONTRACT, WPT_ABI, wallet)

        const tx = await nftContract.mint(
            RECIEVER,
            ethers.parseUnits(String(REWARD_AMT), 18)
        );
        const receipt = await tx.wait(1);

        txHash = receipt.hash;
    } catch (error) {
        return NextResponse.json({ error: true, message: error.message })
    }


    const { error: insertError } = await admin.from("task_rewards").insert({
        task_id: taskId,
        rewarded_by: user.id,
        tx_hash: txHash,
        receiver_address: RECIEVER,
        amount: REWARD_AMT,
        rewarded_at: new Date().toISOString(),
    });

    if (insertError) {
        console.error("[reward] DB insert failed:", insertError);
    }


    return NextResponse.json({ success: true, txHash }, { status: 200 });


}