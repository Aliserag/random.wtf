import { ethers, network } from 'hardhat';

async function main() {
  const signers = await ethers.getSigners();

  if (signers.length === 0) {
    console.error('No signers available. Please check your PRIVATE_KEY in .env file');
    process.exit(1);
  }

  const deployer = signers[0];
  const networkName = network.name;
  const isMainnet = networkName === 'flow_mainnet';
  const explorerUrl = isMainnet ? 'https://evm.flowscan.io' : 'https://evm-testnet.flowscan.io';

  console.log(`Deploying RandomnessWTF v2 to ${networkName} with the account:`, deployer.address);
  console.log('Account balance:', (await ethers.provider.getBalance(deployer.address)).toString());

  const RandomnessWTF = await ethers.getContractFactory('contracts/RandomnessWTF.sol:RandomnessWTF');
  const deployment = await RandomnessWTF.deploy();

  await deployment.waitForDeployment();
  const contractAddress = await deployment.getAddress();

  console.log('RandomnessWTF v2 deployed to:', contractAddress);
  console.log('Transaction hash:', deployment.deploymentTransaction()?.hash);
  console.log('Verify on Flowscan:', `${explorerUrl}/address/${contractAddress}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 