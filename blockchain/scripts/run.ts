import { ethers } from "hardhat"

const main = async () => {
    const NFTMintFactory = await ethers.getContractFactory("NFTMaker")
    const NFTMakerContract = await NFTMintFactory.deploy()
    await NFTMakerContract.deployed()

    console.log(NFTMakerContract.address)

    const txn = await NFTMakerContract.mintNFT("test", "testURI");
    await txn.wait();

    const tokenURI = await NFTMakerContract.tokenURI(0);

    console.log("tokenURI:", tokenURI);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});