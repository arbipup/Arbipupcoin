'use client';

import React, { useState, useEffect } from 'react';
import { useAccount, useDisconnect } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { motion } from 'framer-motion';
import { ethers } from 'ethers';
import { supabase } from '../lib/supabaseClient';
import claimAbi from '../abi/ClaimContract.json';

const CONTRACT_ADDRESS = '0x669CBed6828e9cFDBCe36f1116A2cE5fc1e563C8';
const CLAIM_FEE_ETH = '0.00003';

const happyGif = 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNDZhY3pnajFwaTl6NjBqeXVwNXptMTc0aG9wY2kyemJxcWRrdmJ4ZSZlcD12MV9naWZzX3NlYXJjaCZjdD1n/VpysUTI25mTlK/giphy.gif';
const sadGif = 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExYmY4aDhuOXFtOGo0YTQ4NzE5dW9rYW1rZzNjZjc0ejJkanV0bW51MSZlcD12MV9naWZzX3NlYXJjaCZjdD1n/L5WQjD4p8IpO0/giphy.gif';
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
    <div className="min-h-screen bg-gradient-to-br from-[#111] to-[#222] text-white py-12 px-4 flex flex-col items-center space-y-10">
      <div className="absolute top-5 right-5">
        <button
          onClick={() => setSoundEnabled(!soundEnabled)}
          className="text-white bg-gray-800 hover:bg-gray-700 px-3 py-1 rounded-full text-sm shadow"
        >
          {soundEnabled ? '🔊 Sound On' : '🔇 Sound Off'}
        </button>
      </div>

      {/* Wallet Connect */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full max-w-md p-6 bg-black/70 backdrop-blur-md rounded-2xl shadow-2xl space-y-4 border border-gray-700">
        <h2 className="text-3xl font-extrabold text-yellow-400">1. Connect Wallet</h2>
        {!isConnected ? (
          <ConnectButton />
        ) : (
          <>
            <p className="text-sm">Connected: <span className="font-mono">{address?.slice(0, 6)}...{address?.slice(-4)}</span></p>
            <button
              onClick={() => disconnect()}
              className="w-full py-2 bg-red-600 hover:bg-red-700 rounded-xl text-sm font-bold"
            >
              Disconnect
            </button>
          </>
        )}
      </motion.div>

      {/* Terms */}
      {isConnected && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full max-w-md p-6 bg-black/70 backdrop-blur-md rounded-2xl shadow-2xl space-y-4 border border-gray-700">
            <h2 className="text-2xl font-bold text-pink-300">2. Terms & Conditions</h2>
<ul className="text-sm list-disc pl-5 text-gray-300 space-y-1">
  <li>One wallet per degen. Do not be greedy.</li>
  <li>Only works on Arbitrum. L2 gang only.</li>
  <li>No contract wallets. Bots, take the L.</li>
  <li>Once you claim, that's it. No undo button.</li>
  <li>Not financial advice. We're just having fun here.</li>
  <li>No promises, no moon guarantees, no lambos.</li>
</ul>


          <p className="text-xs text-gray-400 italic">
            Disclaimer: This is a chaotic experiment. Not financial advice. 🐶🔥
          </p>
          <label className="flex items-center space-x-2 mt-3">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="form-checkbox h-4 w-4 text-blue-500"
            />
            <span>I accept these terms</span>
          </label>
        </motion.div>
      )}

      {/* Eligibility */}
      {isConnected && agreed && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full max-w-md p-6 bg-black/70 backdrop-blur-md rounded-2xl shadow-2xl space-y-4 border border-gray-700">
          <h2 className="text-2xl font-bold text-blue-300">3. Eligibility Check</h2>
          {eligibility === 'unknown' && (
            <button
              onClick={checkEligibility}
              className="w-full py-2 bg-blue-500 hover:bg-blue-600 rounded-xl font-bold"
            >
              Check Now
            </button>
          )}
          {eligibility === 'eligible' && (
            <div className="text-center">
              <p className="text-green-400 font-semibold mb-2"> 🐶 Lucky dawg, you actually made it!
🎯 Eligibility unlocked, destiny, and memes are on your side!</p>
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
              <p className="text-red-400 font-semibold mb-2">😵 Dawg, you missed it this time...
Maybe it is time to touch grass or get a real job.</p>
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

      {/* Claim */}
      {isConnected && agreed && eligibility === 'eligible' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full max-w-md p-6 bg-black/70 backdrop-blur-md rounded-2xl shadow-2xl space-y-4 border border-gray-700">
          <h2 className="text-2xl font-bold text-green-300">4. Claim Reward</h2>
          {!claimed ? (
            <button
              onClick={handleClaim}
              disabled={isClaiming}
              className="w-full py-2 bg-green-500 hover:bg-green-600 rounded-xl font-extrabold"
            >
              {isClaiming ? 'Processing...' : `Claim 8,000 $ArbiPup for ${CLAIM_FEE_ETH} ETH`}
            </button>
          ) : (
            <p className="text-center text-green-300 font-semibold">
              🎉 Already claimed, dawg!
🐾 Check that wallet, your pup is in.
📦 Now sit tight and wait for the big bang (aka official listing)! 💥
            </p>
          )}
        </motion.div>
      )}
    </div>
  );
}
