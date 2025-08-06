'use client';

import React, { useState, useEffect } from 'react';
import { useAccount, useDisconnect } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { motion } from 'framer-motion';
import { ethers } from 'ethers';
import { supabase } from '../lib/supabaseClient'; // ✅ use this directly
import claimAbi from '../abi/ClaimContract.json';

const CONTRACT_ADDRESS = '0xDf00AAe3cc6798a2Eab99D0768c165aeeD72a734';
const CLAIM_FEE_ETH = '0.00003';

const happyGif = 'https://media.giphy.com/media/LMcB8XospGZO8UQq87/giphy.gif';
const sadGif = 'https://media.giphy.com/media/3oz8xKaR836UJOYeOc/giphy.gif';
const happySound = 'https://www.myinstants.com/media/sounds/that-was-easy.mp3';
const sadSound = 'https://www.myinstants.com/media/sounds/sadtrombone.mp3';

export default function ClaimPage() {
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();

  const [agreed, setAgreed] = useState(false);
  const [eligibility, setEligibility] = useState<'unknown' | 'eligible' | 'ineligible'>('unknown');
  const [claimed, setClaimed] = useState(false);
  const [isClaiming, setIsClaiming] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const resetFlow = () => {
    setAgreed(false);
    setEligibility('unknown');
    setClaimed(false);
  };

  const checkEligibility = async () => {
    if (!supabase || !address) return;

    const { data, error } = await supabase
      .from('wallets')
      .select('tx_count, claimed')
      .eq('address', address.toLowerCase());

    if (error || !data || data.length === 0) {
      setEligibility('ineligible');
    } else {
      const record = data[0];
      if (record.claimed) {
        setClaimed(true);
        setEligibility('eligible');
      } else if (record.tx_count < 50) {
        setEligibility('ineligible');
      } else {
        setEligibility('eligible');
      }
    }
  };

  const handleClaim = async () => {
    if (!supabase || !address) return;

    try {
      setIsClaiming(true);
      const { ethereum } = window as any;
      if (!ethereum) throw new Error("Wallet not found");

      const provider = new ethers.BrowserProvider(ethereum);
      const signer = await provider.getSigner();

      const contract = new ethers.Contract(CONTRACT_ADDRESS, claimAbi, signer);
      const tx = await contract.claim({ value: ethers.parseEther(CLAIM_FEE_ETH) });

      await tx.wait();

      const { error } = await supabase
        .from('wallets')
        .update({ claimed: true })
        .eq('address', address.toLowerCase());

      if (error) {
        alert('✅ Claimed, but failed to update backend.');
        return;
      }

      setClaimed(true);
      alert('🎉 Claim successful!');
    } catch (err: any) {
      console.error("Claim error:", err);
      alert('❌ Claim failed: ' + (err?.reason || err?.message || 'Unknown error'));
    } finally {
      setIsClaiming(false);
    }
  };

  const playSound = (url: string) => {
    if (soundEnabled) {
      const audio = new Audio(url);
      audio.play().catch(() => {});
    }
  };

  useEffect(() => {
    if (eligibility === 'eligible') playSound(happySound);
    if (eligibility === 'ineligible') playSound(sadSound);
  }, [eligibility]);

  useEffect(() => {
    if (isConnected) {
      setEligibility('unknown');
      setClaimed(false);
    } else {
      resetFlow();
    }
  }, [isConnected]);

  return (
    <div className="min-h-screen bg-black text-white py-10 px-4 flex flex-col items-center space-y-10">
      <div className="absolute top-5 right-5">
        <button
          onClick={() => setSoundEnabled(!soundEnabled)}
          className="text-white bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded-full text-sm"
        >
          {soundEnabled ? '🔊 Sound On' : '🔇 Sound Off'}
        </button>
      </div>

      {/* 1. Connect Wallet */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full max-w-md p-6 bg-gray-900 rounded-xl shadow-xl space-y-4">
        <h2 className="text-2xl font-bold mb-2">1. Connect Your Wallet</h2>
        {!isConnected ? (
          <ConnectButton />
        ) : (
          <>
            <p className="text-sm">Connected: <span className="font-mono">{address?.slice(0, 6)}...{address?.slice(-4)}</span></p>
            <button
              onClick={() => disconnect()}
              className="w-full py-2 bg-red-600 hover:bg-red-700 rounded-xl text-sm"
            >
              Disconnect
            </button>
          </>
        )}
      </motion.div>

      {/* 2. Agree to Terms */}
      {isConnected && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full max-w-md p-6 bg-gray-800 rounded-xl shadow-xl space-y-4">
          <h2 className="text-2xl font-bold mb-2">2. Agree to Terms</h2>
          <ul className="text-sm list-disc pl-5 text-gray-400 space-y-1">
            <li>Only 1 wallet per user</li>
            <li>Must be on Arbitrum network</li>
            <li>Claim fee: {CLAIM_FEE_ETH} ETH required</li>
            <li>Contract wallets not allowed</li>
            <li>Claim is final and cannot be undone</li>
          </ul>
          <label className="flex items-center space-x-2 mt-3">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="form-checkbox h-4 w-4 text-blue-500"
            />
            <span>I agree to the above terms ✅</span>
          </label>
        </motion.div>
      )}

      {/* 3. Check Eligibility */}
      {isConnected && agreed && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full max-w-md p-6 bg-gray-700 rounded-xl shadow-xl space-y-4">
          <h2 className="text-2xl font-bold mb-2">3. Check Eligibility</h2>
          {eligibility === 'unknown' && (
            <button
              onClick={checkEligibility}
              className="w-full py-2 bg-blue-600 hover:bg-blue-700 rounded-xl font-semibold"
            >
              Check Eligibility
            </button>
          )}
          {eligibility === 'eligible' && (
            <div className="text-center">
              <p className="text-green-400 font-semibold mb-2">You are eligible! 🟢</p>
              <motion.img
                src={happyGif}
                alt="Happy"
                className="w-40 mx-auto rounded-lg"
                animate={{ rotate: [-5, 5, -5] }}
                transition={{ repeat: Infinity, duration: 2 }}
              />
            </div>
          )}
          {eligibility === 'ineligible' && (
            <div className="text-center">
              <p className="text-red-400 font-semibold mb-2">Sorry, You are unlucky this time ❌</p>
              <motion.img
                src={sadGif}
                alt="Sad"
                className="w-40 mx-auto rounded-lg"
                animate={{ y: [0, -5, 0] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
              />
            </div>
          )}
        </motion.div>
      )}

      {/* 4. Claim Tokens */}
      {isConnected && agreed && eligibility === 'eligible' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full max-w-md p-6 bg-green-800 rounded-xl shadow-xl space-y-4">
          <h2 className="text-2xl font-bold mb-2">4. Claim Your Tokens</h2>
          {!claimed ? (
            <button
              onClick={handleClaim}
              disabled={isClaiming}
              className="w-full py-2 bg-green-500 hover:bg-green-600 rounded-xl font-bold"
            >
              {isClaiming ? 'Claiming...' : `Claim 8,000 $ArbiPup for ${CLAIM_FEE_ETH} ETH`}
            </button>
          ) : (
            <p className="text-center text-green-300 font-semibold">
              🎉 You already claimed your tokens!
            </p>
          )}
        </motion.div>
      )}
    </div>
  );
}
