import { ContractFactory, ethers, JsonRpcProvider, Wallet, type InterfaceAbi } from 'ethers';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';


type ContractArtifact = {
    abi: InterfaceAbi;
    bytecode: string;
}


const RPC_URL = process.env.HARDHAT_RPC_URL || 'http://localhost:8545';

const OWNER_PRIVATE_KEY = process.env.REWARD_MINTER_PRIVATE_KEY || '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

const artifactPath = path.resolve(dirname, '../artifacts/contracts/WorkloPointToken.sol/WorkloPointToken.json')


async function main(): Promise<void> {
    const artifact = JSON.parse(readFileSync(artifactPath, 'utf-8')) as ContractArtifact;

    const provider = new JsonRpcProvider(RPC_URL);
    const wallet = new ethers.Wallet(OWNER_PRIVATE_KEY, provider)

    const factory = new ContractFactory(
        artifact.abi,
        artifact.bytecode,
        wallet
    )
    const contract = await factory.deploy()
    await contract.waitForDeployment()

    const address = await contract.getAddress();
    console.log("Contract deployed to:", address);
    console.log("owner:" , wallet.address);

}

main().catch((error: unknown) => {
    console.error("Deployment failed:", error);
    process.exit(1);
});