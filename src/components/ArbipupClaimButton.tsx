// components/ArbipupClaimButton.tsx
'use client';

import { useAccount, useContractWrite, useWaitForTransactionReceipt } from 'wagmi';
import { parseEther } from 'viem';
import { arbipupClaimAbi } from '@/lib/abi/ArbipupClaim';

const CLAIM_CONTRACT = '0xDf00AAe3cc6798a2Eab99D0768c165aeeD72a734';

export default function ArbipupClaimButton() {
  const { address, isConnected } = useAccount();

  const {
    data: txHash,
    write,
    isPending,
    error,
  } = useContractWrite({
    address: CLAIM_CONTRACT,
    abi: arbipupClaimAbi,
    functionName: 'claim',
    value: parseEther('0.00003'),
  });

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash: txHash,
  });

  return (
    <div className="p-4 rounded-xl bg-[#1e1e1e] text-white max-w-md mx-auto text-center">
      {!isConnected && <p>Please connect your wallet</p>}

      {isConnected && (
        <>
          <p className="mb-2">Connected Wallet: <strong>{address}</strong></p>
          <button
            onClick={() => write()}
            disabled={isPending || isConfirming}
            className="bg-yellow-400 text-black px-6 py-2 rounded-full font-bold disabled:opacity-50"
          >
            {isPending || isConfirming ? 'Processing...' : 'Claim 8,000 Arbipup'}
          </button>

          {error && <p className="text-red-500 mt-2">Error: {error.message}</p>}
          {isSuccess && <p className="text-green-500 mt-2">Claim successful!</p>}
        </>
      )}
    </div>
  );
}
