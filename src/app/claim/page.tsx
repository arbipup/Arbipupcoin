'use client';

import React, { useEffect, useState } from 'react';
import { useAccount, useDisconnect } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { motion } from 'framer-motion';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AudioPlayer from '@/components/AudioPlayer';
import ClaimFlow from '@/components/ClaimUI';
import { supabase } from '@/lib/supabaseClient';

export default function ClaimPage() {
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();

  const [agreed, setAgreed] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [remainingTime, setRemainingTime] = useState<number | null>(null);

  // === STEP CONTROL ===
  const currentStep = !agreed
    ? 0
    : !isConnected
    ? 1
    : !submitted
    ? 2
    : 3;

  useEffect(() => {
    const fetchStartTime = async () => {
      const { data, error } = await supabase
        .from('global_timer')
        .select('starts_at')
        .eq('key', 'airdrop')
        .single();

      if (error) return;

      if (data?.starts_at) {
        const startTime = new Date(data.starts_at).getTime();
        const endTime = startTime + 3 * 24 * 60 * 60 * 1000;

        const updateTimer = () => {
          const now = Date.now();
          const diff = Math.max(endTime - now, 0);
          setRemainingTime(diff);
        };

        updateTimer();
        const interval = setInterval(updateTimer, 1000);
        return () => clearInterval(interval);
      }
    };

    fetchStartTime();
  }, []);

  useEffect(() => {
    const checkIfSubmitted = async () => {
      if (!address || !isConnected) {
        setSubmitted(false);
        return;
      }

      const { data } = await supabase
        .from('wallets')
        .select('address')
        .eq('address', address.toLowerCase());

      setSubmitted((data?.length ?? 0) > 0);
    };

    checkIfSubmitted();
  }, [address, isConnected]);

  const handleSubmit = async () => {
    setLoading(true);
    setError('');

    if (!address) {
      setError('Please connect your wallet first.');
      setLoading(false);
      return;
    }

    try {
      const { data: existing } = await supabase
        .from('wallets')
        .select('address')
        .eq('address', address.toLowerCase());

      if ((existing?.length ?? 0) > 0) {
        setSubmitted(true);
        setLoading(false);
        return;
      }

      const { error: insertErr } = await supabase.from('wallets').insert([
        { address: address.toLowerCase(), tx_count: 0 },
      ]);

      if (insertErr) throw insertErr;

      setSubmitted(true);
    } catch (err) {
      console.error(err);
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const hrs = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
    const mins = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
    const secs = String(totalSeconds % 60).padStart(2, '0');
    return `${hrs}:${mins}:${secs}`;
  };

  const steps = ['Agree to Terms', 'Connect Wallet', 'Submit Wallet', 'Done'];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-black via-[#100417] to-[#0c0c0c] text-white relative overflow-hidden">
      <Navbar />
      <AudioPlayer />

      {/* Step Indicator */}
      <div className="flex justify-center space-x-6 mt-24 mb-10 z-10">
        {steps.map((step, index) => (
          <div key={index} className="flex flex-col items-center">
            <div
              className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm font-bold transition ${
                index <= currentStep
                  ? 'bg-purple-600 border-purple-400'
                  : 'bg-gray-800 border-gray-600 text-gray-400'
              }`}
            >
              {index + 1}
            </div>
            <span
              className={`mt-2 text-xs sm:text-sm ${
                index <= currentStep ? 'text-white' : 'text-gray-500'
              }`}
            >
              {step}
            </span>
          </div>
        ))}
      </div>

      <main className="flex-grow px-6 relative z-10">
        <motion.div
          className="max-w-2xl mx-auto bg-black/60 backdrop-blur-md border border-purple-700 rounded-2xl p-8 shadow-2xl space-y-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Intro Header */}
          <motion.h1
            className="text-2xl sm:text-3xl font-extrabold text-center bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            🐶 Arbipup Airdrop Registration, Lock In Your Wallet
          </motion.h1>

          {/* Timer */}
          {remainingTime !== null && remainingTime > 0 && (
            <div className="text-center text-lg font-mono bg-black/40 py-2 px-6 inline-block rounded-xl border border-cyan-500 text-cyan-300 shadow-md">
              ⏳ Time Left: {formatTime(remainingTime)}
            </div>
          )}

          {/* Terms & Eligibility */}
          <div className="space-y-4 text-sm sm:text-base text-left">
            <h2 className="text-purple-400 font-semibold">Eligibility Criteria:</h2>
            <ul className="list-disc list-inside space-y-1">
              <li>Interacted with Arbitrum between <strong>Apr 11, 2024 – Apr 11, 2025</strong></li>
              <li>Snapshot: <strong>Apr 11, 2025 – 00:00 AM UTC</strong></li>
              <li>Eligibility is <strong>not automatic you must register your wallet </strong></li>
              <li>Ends after <strong>3 days</strong><strong></strong></li>
            </ul>

            <label className="flex items-start space-x-2 mt-4 cursor-pointer">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="mt-1 w-5 h-5 accent-purple-500"
              />
              <span>
                I agree that this submission reflects my own decision, and eligibility will be determined by the Arbipup team.
              </span>
            </label>
          </div>

          {/* Connect Wallet */}
          {!isConnected && agreed && (
            <div className="flex justify-center">
              <ConnectButton showBalance={false} chainStatus="icon" />
            </div>
          )}

          {!isConnected && !agreed && (
            <p className="text-center text-red-400">Please agree to the terms to proceed.</p>
          )}

          {/* After Connected */}
          {isConnected && (
            <div className="text-center space-y-4">
              <p className="text-green-400">
                Connected: {address?.slice(0, 6)}...{address?.slice(-4)}
              </p>
              <button
                onClick={() => disconnect()}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg font-semibold"
              >
                Disconnect
              </button>

              <button
                onClick={handleSubmit}
                disabled={submitted || loading}
                className={`w-full py-3 rounded-xl font-bold transition ${
                  submitted
                    ? 'bg-green-600 cursor-default'
                    : 'bg-gradient-to-r from-blue-500 to-cyan-400 hover:scale-105'
                }`}
              >
                {submitted ? '✅ Wallet Submitted' : loading ? 'Submitting...' : 'Submit Wallet'}
              </button>

              {error && <p className="text-red-500">{error}</p>}
            </div>
          )}

          {/* Success */}
          {isConnected && submitted && (
            <motion.div
              className="mt-6 text-center space-y-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <p className="text-lg font-semibold text-green-400">
                🎉Dawg, Your wallet is locked in. Stay tuned for next phase!.
              </p>
              <motion.img
                src="https://media.giphy.com/media/jp2KXzsPtoKFG/giphy.gif"
                alt="Success GIF"
                className="mx-auto w-48 rounded-xl shadow-lg"
                animate={{ rotate: [-5, 5, -5] }}
                transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
              />
            </motion.div>
          )}
        </motion.div>

        <div className="mt-16">
          <ClaimFlow />
        </div>
      </main>

      <Footer />
    </div>
  );
}
