import { ethers } from 'hardhat';

async function main() {
  const signers = await ethers.getSigners();
  
  if (signers.length === 0) {
    console.error('No signers available. Please check your PRIVATE_KEY in .env file');
    process.exit(1);
  }
  
  const deployer = signers[0];
  console.log('Deploying RandomnessWTF v2 with the account:', deployer.address);
  console.log('Account balance:', (await ethers.provider.getBalance(deployer.address)).toString());

  const RandomnessWTF = await ethers.getContractFactory('contracts/RandomnessWTF.sol:RandomnessWTF');
  const deployment = await RandomnessWTF.deploy();
  
  await deployment.waitForDeployment();
  const contractAddress = await deployment.getAddress();

  console.log('RandomnessWTF v2 deployed to:', contractAddress);
  console.log('Transaction hash:', deployment.deploymentTransaction()?.hash);
  console.log('Verify on Flowscan:', `https://evm-testnet.flowscan.io/address/${contractAddress}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 