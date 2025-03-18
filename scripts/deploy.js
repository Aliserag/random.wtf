const hre = require("hardhat");

async function main() {
  console.log("Deploying RandomnessWTF contract...");

  const RandomnessWTF = await hre.ethers.getContractFactory("RandomnessWTF");
  const randomness = await RandomnessWTF.deploy();

  await randomness.waitForDeployment();
  const address = await randomness.getAddress();

  console.log(`RandomnessWTF deployed to: ${address}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 