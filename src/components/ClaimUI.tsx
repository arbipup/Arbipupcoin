Last claim update "Commit"

'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useAccount, useDisconnect } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { motion, AnimatePresence, easeOut } from 'framer-motion';
import { ethers } from 'ethers';
import Confetti from 'react-confetti';
import { supabase } from '../lib/supabaseClient';
import claimAbi from '../abi/ClaimContract.json';

const CONTRACT_ADDRESS = '0x669CBed6828e9cFDBCe36f1116A2cE5fc1e563C8';
const CLAIM_FEE_ETH = '0.00003';

const happyGif = 'https://media.giphy.com/media/VpysUTI25mTlK/giphy.gif';
const sadGif = 'https://media.giphy.com/media/L5WQjD4p8IpO0/giphy.gif';
const happySound = 'https://www.myinstants.com/media/sounds/that-was-easy.mp3';
const sadSound = 'https://www.myinstants.com/media/sounds/sadtrombone.mp3';

// Motion variants (only one declaration now)
const cardVariants = {
  hidden: { opacity: 0, y: 12, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.45, ease: easeOut }
  },
  exit: { opacity: 0, y: -8, transition: { duration: 0.25 } },
};

export default function ClaimPage() {
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();

  const [agreed, setAgreed] = useState(false);
  const [eligibility, setEligibility] = useState<'unknown' | 'eligible' | 'ineligible'>('unknown');
  const [claimed, setClaimed] = useState(false);
  const [isClaiming, setIsClaiming] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [txHash, setTxHash] = useState<string | null>(null);


  // UI states
  const [showCelebration, setShowCelebration] = useState(false);
  const [confettiDims, setConfettiDims] = useState<{ width: number; height: number }>({ width: 300, height: 300 });

  const topRef = useRef<HTMLDivElement | null>(null);

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

    try {
      setEligibility('unknown');
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
    } catch (err) {
      console.error('Eligibility check error', err);
      setEligibility('ineligible');
    }
  };

  const handleClaim = async () => {
    if (!supabase || !address) return;

    try {
      setIsClaiming(true);
      const { ethereum } = window as any;
      if (!ethereum) throw new Error('Wallet not found');

      const provider = new ethers.BrowserProvider(ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, claimAbi, signer);
      const tx = await contract.claim({ value: ethers.parseEther(CLAIM_FEE_ETH) }); setTxHash(tx.hash);


      await tx.wait();

      const { error } = await supabase
        .from('wallets')
        .update({ claimed: true })
        .eq('address', address.toLowerCase());

      if (error) {
        alert('✅ Claimed on-chain, but failed to update backend.');
      } else {
        setClaimed(true);
      }

      setShowCelebration(true);
      playSound(happySound);
    } catch (err: any) {
      console.error('Claim error:', err);
      playSound(sadSound);
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

  useEffect(() => {
    const update = () => {
      setConfettiDims({ width: window.innerWidth, height: window.innerHeight });
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  const stepItems = [
    { id: 1, title: 'Connect Wallet', color: '#FACC15' },
    { id: 2, title: 'Terms & Conditions', color: '#FB7185' },
    { id: 3, title: 'Eligibility Check', color: '#60A5FA' },
    { id: 4, title: 'Claim Reward', color: '#34D399' },
  ];

  return (
    <div className="min-h-screen bg-[#050508] text-white py-10 px-6" ref={topRef}>
      {/* SOUND TOGGLE */}
      <div className="fixed top-5 right-5 z-50">
        <button
          onClick={() => setSoundEnabled(!soundEnabled)}
          className="text-white bg-white/6 hover:bg-white/8 px-3 py-1 rounded-full text-sm shadow"
        >
          {soundEnabled ? '🔊 Sound On' : '🔇 Sound Off'}
        </button>
      </div>

      {/* Top Step Indicator */}
      {/* Step indicator container */}
<div className="flex flex-wrap sm:flex-nowrap items-center justify-between gap-4 overflow-x-auto">
  {stepItems.map((s, idx) => {
    const completed = currentStep > s.id;
    const active = currentStep === s.id;
    return (
      <div key={s.id} className="flex-1 min-w-[120px] sm:min-w-0">
        <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left">
          {/* Step circle */}
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: active || completed ? 1 : 0.98 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-black font-bold`}
            style={{
              background: completed ? s.color : active ? 'linear-gradient(135deg,#ffffff,#f3f4f6)' : 'rgba(255,255,255,0.06)',
              boxShadow: completed ? `0 6px 24px ${s.color}40, inset 0 -6px 16px #00000080` : active ? `0 6px 20px #ffffff20` : 'none',
            }}
          >
            {completed ? '✓' : idx + 1}
          </motion.div>

          {/* Step text */}
          <div className="mt-2 sm:mt-0 sm:ml-4">
            <div className={`text-xs sm:text-sm ${active ? 'text-white font-bold' : 'text-gray-300'}`}>
              {s.title}
            </div>
            <div className="text-[10px] sm:text-xs text-gray-400">
              {completed ? 'Completed' : active ? 'Current' : 'Pending'}
            </div>
          </div>
        </div>
      </div>
    );
  })}
</div>
      {/* Info Card */}
<div className="max-w-4xl mx-auto mt-8 mb-8">
  <div className="bg-white/6 backdrop-blur-sm border border-white/6 rounded-lg p-4 text-center">
    Eligible wallets can snag <span className="text-green-400 font-bold">8000 $Arbipup tokens </span>, Check if you are in the pack and claim your spot!.
  </div>
</div>


      {/* Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
        {/* Step 1 Card */}
        <AnimatePresence>
          <motion.div
            key="step1"
            initial="hidden"
            animate="visible"
            variants={cardVariants}
            whileHover={{ scale: 1.02, y: -6 }}
            className="relative p-5 rounded-2xl"
            style={{
              background: 'linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01))',
              boxShadow: '0 10px 30px rgba(0,0,0,0.6), 0 0 40px rgba(250, 204, 21, 0.06)',
              border: '1px solid rgba(255,255,255,0.04)',
              minHeight: 220,
            }}
          >
            <motion.div
              whileHover={{ rotateX: 6, rotateY: -6 }}
              transition={{ type: 'spring', stiffness: 200, damping: 14 }}
              className="w-full h-full"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-yellow-400 font-extrabold text-lg">1. Connect Wallet</h3>
                  <p className="text-sm text-gray-300 mt-2">Connect your wallet to get started.</p>
                </div>
                <div className="text-yellow-200 font-bold"></div>
              </div>

              <div className="mt-6">
                {!isConnected ? (
                  <div className="w-full">
                    <ConnectButton />
                  </div>
                ) : (
                  <div>
                    <p className="text-sm mb-2 text-gray-300">
                      Connected: <span className="font-mono">{address?.slice(0, 6)}...{address?.slice(-4)}</span>
                    </p>
                    <button
                      onClick={() => disconnect()}
                      className="w-full py-2 rounded-lg font-semibold"
                      style={{
                        background: 'linear-gradient(90deg,#ff6b6b,#ef4444)',
                        color: '#fff',
                        boxShadow: '0 8px 30px rgba(239,68,68,0.2)',
                      }}
                    >
                      Disconnect
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        </AnimatePresence>

        {/* Step 2 Card (visible only if connected) */}
        {isConnected && (
          <AnimatePresence>
            <motion.div
              key="step2"
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={cardVariants}
              whileHover={{ scale: 1.02, y: -6 }}
              className="relative p-5 rounded-2xl"
              style={{
                background: 'linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01))',
                boxShadow: '0 10px 30px rgba(0,0,0,0.6), 0 0 40px rgba(251, 113, 133, 0.06)',
                border: '1px solid rgba(255,255,255,0.04)',
                minHeight: 220,
              }}
            >
              <motion.div whileHover={{ rotateX: -4, rotateY: 4 }} transition={{ type: 'spring', stiffness: 200, damping: 14 }}>
                <h3 className="text-pink-400 font-extrabold text-lg">2. Terms & Conditions</h3>
                <ul className="text-sm list-disc pl-5 text-gray-300 space-y-1 mt-3">
                   <li>One wallet per degen. Don it be greedy, share the love.</li>
<li>Arbitrum only. L2 gang, we ride together.</li>
<li>No contract wallets. Bots, take the L and touch grass.</li>
<li>Once you claim, that is it. No undo, no refunds, no tears.</li>
<li>Not financial advice. This is for fun, not for your retirement plan.</li>
<li>Volatility is the game. Prices go up, down, and sideways, sometimes in the same minute.</li>
<li>You are 100% responsible for your clicks, trades, and memes.</li>
<li>If you lose sleep over this, maybe go outside and get some sunlight.</li>
<li>We reserve the right to change the rules if the vibes demand it.</li>

                </ul>

                <label className="flex items-center space-x-2 mt-4">
                  <input
                    type="checkbox"
                    checked={agreed}
                    onChange={(e) => setAgreed(e.target.checked)}
                    className="h-4 w-4 rounded border-gray-600 bg-black/40"
                  />
                  <span className="text-sm">i am down with the terms, dawg, send it</span>
                </label>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        )}

        {/* Step 3 Card (visible if connected & agreed) */}
        {isConnected && agreed && (
          <AnimatePresence>
            <motion.div
              key="step3"
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={cardVariants}
              whileHover={{ scale: 1.02, y: -6 }}
              className="relative p-5 rounded-2xl"
              style={{
                background: 'linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01))',
                boxShadow: '0 10px 30px rgba(0,0,0,0.6), 0 0 40px rgba(96,165,250,0.06)',
                border: '1px solid rgba(255,255,255,0.04)',
                minHeight: 220,
              }}
            >
              <motion.div whileHover={{ rotateX: 3, rotateY: -3 }} transition={{ type: 'spring', stiffness: 200, damping: 14 }}>
                <h3 className="text-blue-300 font-extrabold text-lg">3. Eligibility Check</h3>
                <p className="text-sm text-gray-300 mt-2">In this section, we will review your activity on the Arbitrum network to determine your eligibility</p>

                <div className="mt-6">
                  {eligibility === 'unknown' && (
                    <button
                      onClick={checkEligibility}
                      className="w-full py-2 rounded-lg font-semibold"
                      style={{ background: 'linear-gradient(90deg,#2563eb,#60a5fa)', color: '#fff', boxShadow: '0 8px 30px rgba(37,99,235,0.12)' }}
                    >
                      Check Now
                    </button>
                  )}

                  {eligibility === 'eligible' && (
                    <div className="text-center">
                      <p className="text-green-400 font-semibold mb-3">Ultra-lucky dawg, the gates is wide open!</p>
                      <motion.img
                        src={happyGif}
                        alt="Happy"
                        className="w-36 mx-auto rounded-lg shadow-lg"
                        animate={{ rotate: [-6, 6, -6] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                      />
                    </div>
                  )}

                  {eligibility === 'ineligible' && (
                    <div className="text-center">
                      <p className="text-red-400 font-semibold mb-3">😵 Dawg, no luck today. Maybe go get a job? 😂 Just kidding, catch us next time.</p>
                      <motion.img
                        src={sadGif}
                        alt="Sad"
                        className="w-36 mx-auto rounded-lg"
                        animate={{ y: [0, -6, 0] }}
                        transition={{ repeat: Infinity, duration: 1.2 }}
                      />
                    </div>
                  )}
                </div>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        )}

        {/* Step 4 Card (visible when eligible) */}
        {isConnected && agreed && eligibility === 'eligible' && (
          <AnimatePresence>
            <motion.div
              key="step4"
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={cardVariants}
              whileHover={{ scale: 1.02, y: -6 }}
              className="relative p-5 rounded-2xl"
              style={{
                background: 'linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01))',
                boxShadow: '0 10px 30px rgba(0,0,0,0.6), 0 0 40px rgba(52,211,153,0.06)',
                border: '1px solid rgba(255,255,255,0.04)',
                minHeight: 220,
              }}
            >
              <motion.div whileHover={{ rotateX: -4, rotateY: -6 }} transition={{ type: 'spring', stiffness: 200, damping: 14 }}>
                <h3 className="text-green-300 font-extrabold text-lg">4. Claim Reward</h3>
                <p className="text-sm text-gray-300 mt-2">Snag your tokens, dawg, just cover the gas.</p>

                <div className="mt-6">
                  {!claimed ? (
                    <button
                      onClick={handleClaim}
                      disabled={isClaiming}
                      className="w-full py-2 rounded-lg font-semibold"
                      style={{
                        background: 'linear-gradient(90deg,#16a34a,#34d399)',
                        color: '#fff',
                        boxShadow: '0 8px 30px rgba(16,185,129,0.12)',
                      }}
                    >
                      {isClaiming ? 'Processing...' : `Claim 8,000 $ArbiPup`}
                    </button>
                  ) : (
                    <div className="text-center text-green-400 font-semibold">
                      <div>🎉 Already claimed! What now, dawg, trying to take the whole supply?</div>
                      <div className="text-sm text-gray-300 mt-1">Check your wallet.</div>
                    </div>
                  )}
                </div>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        )}
      </div>

      {/* Celebration Modal */}
      <AnimatePresence>
        {showCelebration && (
          <>
            <motion.div
              key="modal-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
              onClick={() => setShowCelebration(false)}
            />

            <motion.div
              key="modal"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 260, damping: 20 }}
              className="fixed z-60 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#0b0b0c] border border-white/8 rounded-2xl shadow-2xl w-full max-w-lg p-6"
            >
              {/* confetti canvas */}
              <Confetti width={confettiDims.width} height={confettiDims.height} numberOfPieces={350} recycle={false} />

              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-extrabold text-white">🎉 Bag secured, dawg!</h2>
                  <p className="text-sm text-gray-300 mt-2">You bagged 8,000 $ArbiPup, enjoy the gains, dawg. Thanks for riding with the fam. Stay tuned, big listing news dropping soon.!</p>
                </div>

                <button
                  onClick={() => setShowCelebration(false)}
                  className="ml-4 rounded-full p-2"
                  style={{ background: 'rgba(255,255,255,0.04)' }}
                >
                  ✕
                </button>
              </div>

              <div className="mt-5 flex gap-3">
                 <a
  href={txHash ? `https://arbiscan.io/tx/${txHash}` : '#'}
  target="_blank"
  rel="noopener noreferrer"
  className="flex-1 text-center py-2 rounded-lg font-semibold"
  style={{ background: 'linear-gradient(90deg,#f97316,#fb923c)', color: '#fff' }}
>
  View on Explorer
</a>

                <button
                  onClick={() => setShowCelebration(false)}
                  className="flex-1 py-2 rounded-lg font-semibold"
                  style={{ background: 'linear-gradient(90deg,#06b6d4,#0891b2)', color: '#fff' }}
                >
                  Close
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Extra Styles (Tailwind + inline for glows where needed) */}
      <style jsx>{`
        /* subtle animated neon border for the whole page (keeps theme) */
        ::selection {
          background: rgba(255, 255, 255, 0.06);
        }
      `}</style>
    </div>
  );
}
