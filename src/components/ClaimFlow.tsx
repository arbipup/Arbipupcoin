'use client';

import React, { useState, useEffect } from 'react';
import { useAccount, useDisconnect, useChainId } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { createClient } from '@supabase/supabase-js';
import { motion } from 'framer-motion';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const CONTRACT_ADDRESS = '0x1234567890ABCDEF1234567890abcdef12345678'; // Replace with yours
const CLAIM_FEE_ETH = '0.000042 ETH'; // Replace with your amount
const successSound = 'https://www.myinstants.com/media/sounds/success-fanfare-trumpets.mp3';
const errorSound = 'https://www.myinstants.com/media/sounds/wrong-answer-sound-effect.mp3';

export default function ClaimPage() {
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const chainId = useChainId();
  const isArbitrum = chainId === 42161;

  const [agreed, setAgreed] = useState(false);
  const [eligibility, setEligibility] = useState<'unknown' | 'eligible' | 'ineligible'>('unknown');
  const [claimed, setClaimed] = useState(false);
  const [checkStarted, setCheckStarted] = useState(false);

  const playSound = (url: string) => new Audio(url).play();

  const resetFlow = () => {
    setAgreed(false);
    setEligibility('unknown');
    setClaimed(false);
    setCheckStarted(false);
  };

  const checkEligibility = async () => {
    if (!address) return;
    setCheckStarted(true);

    const { data, error } = await supabase
      .from('wallets')
      .select('tx_count, claimed')
      .eq('address', address.toLowerCase());

    if (error || !data || data.length === 0) {
      setEligibility('ineligible');
      playSound(errorSound);
    } else {
      const record = data[0];
      if (record.claimed) {
        setClaimed(true);
        setEligibility('eligible');
        playSound(successSound);
      } else if (record.tx_count < 50) {
        setEligibility('ineligible');
        playSound(errorSound);
      } else {
        setEligibility('eligible');
        playSound(successSound);
      }
    }
  };

  const handleClaim = async () => {
    if (!address) return;

    await supabase
      .from('wallets')
      .update({ claimed: true })
      .eq('address', address.toLowerCase());

    setClaimed(true);
    playSound(successSound);
  };

  useEffect(() => {
    if (!isConnected) {
      resetFlow();
    }
  }, [isConnected]);

  return (
    <div className="min-h-screen w-full bg-black text-white p-6 space-y-10">
      {/* Section 1: Connect Wallet */}
      <section className="p-6 rounded-xl bg-gradient-to-br from-gray-800 to-gray-700 shadow-lg">
        <h2 className="text-2xl font-bold mb-4">1. Connect Wallet</h2>
        {!isConnected ? (
          <ConnectButton />
        ) : (
          <div className="space-y-2">
            <p className="text-sm">Address: <span className="font-mono">{address?.slice(0, 6)}...{address?.slice(-4)}</span></p>
            <p className="text-sm text-yellow-400">Network: {isArbitrum ? 'Arbitrum ✅' : 'Unsupported ❌'}</p>
            <button
              onClick={() => disconnect()}
              className="mt-2 px-4 py-2 text-sm bg-red-600 hover:bg-red-700 rounded-xl"
            >
              Disconnect Wallet
            </button>
          </div>
        )}
      </section>

      {/* Section 2: Agreement */}
      {isConnected && (
        <section className="p-6 rounded-xl bg-gradient-to-br from-gray-700 to-gray-600 shadow-lg">
          <h2 className="text-2xl font-bold mb-4">2. Agree to Terms</h2>
          <ul className="list-disc pl-5 text-sm mb-4 space-y-1 text-gray-300">
            <li>Only 1 wallet per user</li>
            <li>Must be on Arbitrum network</li>
            <li>No contract wallets allowed</li>
            <li>Claiming is final & irreversible</li>
            <li>We reserve the right to verify eligibility manually</li>
          </ul>
          <label className="flex items-center space-x-3 text-sm">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="form-checkbox h-4 w-4 text-blue-500"
            />
            <span>I agree to all the terms above ✅</span>
          </label>
        </section>
      )}

      {/* Section 3: Eligibility */}
      {isConnected && agreed && (
        <section className="p-6 rounded-xl bg-gradient-to-br from-gray-600 to-gray-500 shadow-lg">
          <h2 className="text-2xl font-bold mb-4">3. Check Eligibility</h2>
          {!checkStarted && (
            <button
              onClick={checkEligibility}
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-xl font-semibold"
            >
              Check Now
            </button>
          )}
          {checkStarted && (
            <>
              {eligibility === 'eligible' && (
                <p className="text-green-400">✅ Eligible to claim!</p>
              )}
              {eligibility === 'ineligible' && (
                <p className="text-red-400">❌ Not eligible (less than 50 txs or not in database)</p>
              )}
              {eligibility === 'unknown' && (
                <p className="text-yellow-400">Checking...</p>
              )}
            </>
          )}
        </section>
      )}

      {/* Section 4: Claim */}
      {isConnected && agreed && eligibility === 'eligible' && (
        <section className="p-6 rounded-xl bg-gradient-to-br from-green-700 to-green-600 shadow-lg">
          <h2 className="text-2xl font-bold mb-4">4. Claim Reward</h2>
          {claimed ? (
            <p className="text-green-300 font-semibold">🎉 You have already claimed your 12,000 $ArbiPup!</p>
          ) : (
            <>
              <p className="text-sm mb-2">Reward: <strong>12,000 $ArbiPup</strong></p>
              <p className="text-sm mb-2">Fee: <strong>{CLAIM_FEE_ETH}</strong></p>
              <p className="text-sm mb-4">Contract: <code>{CONTRACT_ADDRESS}</code></p>
              <button
                onClick={handleClaim}
                className="px-4 py-2 bg-green-500 hover:bg-green-600 rounded-xl font-bold"
              >
                Claim Now
              </button>
            </>
          )}
        </section>
      )}
    </div>
  );
}

