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

const happyGif = 'https://media.giphy.com/media/VpysUTI25mTlK/giphy.gif';
const sadGif = 'https://media.giphy.com/media/L5WQjD4p8IpO0/giphy.gif';
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

  const getStep = () => {
    if (!isConnected) return 1;
    if (!agreed) return 2;
    if (eligibility !== 'eligible') return 3;
    return 4;
  };
  const currentStep = getStep();

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
    <div className="min-h-screen bg-gradient-to-br from-[#f8f8f8] via-[#eeeeee] to-[#f8f8f8] text-black py-12 px-4">
      {/* Sound Toggle */}
      <div className="fixed top-5 right-5 z-50">
        <button
          onClick={() => setSoundEnabled(!soundEnabled)}
          className="text-white bg-gray-800 hover:bg-gray-700 px-3 py-1 rounded-full text-sm shadow"
        >
          {soundEnabled ? '🔊 Sound On' : '🔇 Sound Off'}
        </button>
      </div>

      {/* Step Progress */}
      <div className="w-full max-w-4xl mx-auto mb-6">
        <div className="flex justify-between items-center">
          {['Connect Wallet', 'Terms & Conditions', 'Eligibility Check', 'Claim Reward'].map((label, i) => {
            const stepNum = i + 1;
            const isActive = currentStep === stepNum;
            const isCompleted = currentStep > stepNum;

            return (
              <div key={i} className="flex flex-col items-center w-full relative">
                <div className={`rounded-full w-8 h-8 flex items-center justify-center font-bold
                  ${isCompleted ? 'bg-green-500 text-white' : isActive ? 'bg-purple-500 text-white' : 'bg-gray-400 text-white'}`}>
                  {isCompleted ? '✓' : stepNum}
                </div>
                <span className={`mt-2 text-sm text-center ${isActive ? 'text-black font-semibold' : 'text-gray-500'}`}>
                  {label}
                </span>
                {i < 3 && (
                  <div className="absolute top-4 left-full w-full h-0.5 bg-gray-400 z-[-1]"></div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Info Text */}
      <div className="bg-white/60 backdrop-blur rounded-lg shadow-md p-4 text-center mb-8 text-sm text-gray-800 max-w-2xl mx-auto">
        Eligible wallets can claim <span className="text-green-700 font-bold">8000 $ArbiPup</span> tokens for a small gas fee.
        Make sure your wallet qualifies before claiming.
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 gap-6 justify-center items-start max-w-4xl mx-auto">
        {/* Step 1: Connect */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="step-card">
          <h2 className="step-title text-yellow-500">1. Connect Wallet</h2>
          {!isConnected ? (
            <ConnectButton />
          ) : (
            <>
              <p className="text-sm mb-2">Connected: <span className="font-mono">{address?.slice(0, 6)}...{address?.slice(-4)}</span></p>
              <button onClick={() => disconnect()} className="button-red">Disconnect</button>
            </>
          )}
        </motion.div>

        {/* Step 2: Terms */}
        {isConnected && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="step-card">
            <h2 className="step-title text-pink-500">2. Terms & Conditions</h2>
            <ul className="text-sm list-disc pl-5 text-gray-600 space-y-1">
              <li>One wallet per degen. Do not be greedy.</li>
              <li>Only works on Arbitrum. L2 gang only.</li>
              <li>No contract wallets. Bots, take the L.</li>
              <li>Once you claim, that's it. No undo button.</li>
              <li>Not financial advice. We're just having fun here.</li>
            </ul>
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

        {/* Step 3: Eligibility */}
        {isConnected && agreed && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="step-card">
            <h2 className="step-title text-blue-500">3. Eligibility Check</h2>
            {eligibility === 'unknown' && (
              <button onClick={checkEligibility} className="button-blue">Check Now</button>
            )}
            {eligibility === 'eligible' && (
              <div className="text-center">
                <p className="text-green-600 font-semibold mb-2">
                  🐶 Lucky dawg, you actually made it!<br />🎯 Eligibility unlocked!
                </p>
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
                <p className="text-red-500 font-semibold mb-2">
                  😵 Dawg, you missed it this time...<br />Go touch grass.
                </p>
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

        {/* Step 4: Claim */}
        {isConnected && agreed && eligibility === 'eligible' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="step-card">
            <h2 className="step-title text-green-600">4. Claim Reward</h2>
            {!claimed ? (
              <button
                onClick={handleClaim}
                disabled={isClaiming}
                className="button-green"
              >
                {isClaiming ? 'Processing...' : `Claim 8,000 $ArbiPup for ${CLAIM_FEE_ETH} ETH`}
              </button>
            ) : (
              <p className="text-center text-green-600 font-semibold">
                🎉 Already claimed!<br />🐾 Check your wallet.
              </p>
            )}
          </motion.div>
        )}
      </div>

      {/* Styles */}
      <style jsx>{`
        .step-card {
          background: #ffffff;
          border: 1px solid #ddd;
          border-radius: 1rem;
          padding: 1.5rem;
          min-height: 300px;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.05);
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }
        .step-title {
          font-size: 1.5rem;
          font-weight: 800;
          margin-bottom: 0.75rem;
        }
        .button-blue {
          background: #3b82f6;
          color: white;
          font-weight: bold;
          padding: 0.6rem 1rem;
          border-radius: 0.75rem;
          width: 100%;
        }
        .button-red {
          background: #ef4444;
          color: white;
          font-weight: bold;
          padding: 0.6rem 1rem;
          border-radius: 0.75rem;
          width: 100%;
        }
        .button-green {
          background: #22c55e;
          color: white;
          font-weight: bold;
          padding: 0.6rem 1rem;
          border-radius: 0.75rem;
          width: 100%;
        }
      `}</style>
    </div>
  );
}
