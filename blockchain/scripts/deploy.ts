import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with account: ", deployer.address);

  const NFTMakerFactory = await ethers.getContractFactory("NFTMaker");
  const NFTMakerContract = await NFTMakerFactory.deploy();

  await NFTMakerContract.deployed();

  console.log("Web3SNS Contract Address: ", NFTMakerContract.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
