import { ethers } from 'hardhat'
import fs from 'fs'

async function main() {
  // Load Merkle Root
  const merkleData = JSON.parse(fs.readFileSync('scripts/merkleRoot.json', 'utf-8'))
  const merkleRoot = merkleData.merkleRoot

  // Arbipup token address
  const tokenAddress = '0x7ae13917df95f495377b01a9bed0e2f6348abb33'

  // Deploy claim contract
  const Claim = await ethers.getContractFactory('Claim')
  const claim = await Claim.deploy(tokenAddress, merkleRoot)

  await claim.waitForDeployment()

  console.log('✅ Claim contract deployed at:', await claim.getAddress())
}

main().catch((error) => {
  console.error('❌ Deployment failed:', error)
  process.exit(1)
})
