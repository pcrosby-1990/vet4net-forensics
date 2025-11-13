const { ethers } = require("hardhat");

async function main() {
  const SnapshotRegistry = await ethers.getContractFactory("SnapshotRegistry");
  const snapshotRegistry = await SnapshotRegistry.deploy();
  await snapshotRegistry.deployed();
  console.log("SnapshotRegistry deployed to:", snapshotRegistry.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
