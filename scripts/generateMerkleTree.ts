import 'dotenv/config'
import { supabase } from '../backend/supabaseClient'
import { keccak256, AbiCoder } from 'ethers'
import { MerkleTree } from 'merkletreejs'
import fs from 'fs'

// === CONFIG ===
const tableName = 'wallets' // Supabase table name
const abiCoder = new AbiCoder()

// === Claim logic ===
// 50 txs = 5,000 tokens, +500 per 10 txs above 50, capped at 50,000
function calculateClaimAmount(txCount: number): number {
  if (txCount < 50) return 0
  const base = 5000
  const extra = Math.floor((txCount - 50) / 10) * 500
  return Math.min(base + extra, 50000)
}

// === Main ===
async function main() {
  const { data, error } = await supabase.from(tableName).select()

  if (error || !data) {
    console.error('❌ Error fetching from Supabase:', error || 'No data')
    return
  }

  const validClaims = data
    .filter((entry: any) => calculateClaimAmount(entry.tx_count) > 0)
    .map((entry: any) => ({
      address: entry.address.toLowerCase(),
      amount: calculateClaimAmount(entry.tx_count),
    }))

  const leaves = validClaims.map(({ address, amount }) => {
    const encoded = abiCoder.encode(['address', 'uint256'], [address, amount])
    return keccak256(encoded)
  })

  const tree = new MerkleTree(leaves, keccak256, { sortPairs: true })
  const root = tree.getHexRoot()

  const output = {
    merkleRoot: root,
    claims: validClaims,
  }

  fs.writeFileSync('scripts/merkleRoot.json', JSON.stringify(output, null, 2))
  console.log('✅ Merkle tree generated. Root:', root)
}

main()
