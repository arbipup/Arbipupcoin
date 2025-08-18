'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AudioPlayer from '@/components/AudioPlayer';
import ClaimFlow from '@/components/ClaimUI';
import { supabase } from '@/lib/supabaseClient';

export default function ClaimPage() {
  const [agreed, setAgreed] = useState(false);
  const [joined, setJoined] = useState(false); // NEW STATE
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [remainingTime, setRemainingTime] = useState<number | null>(null);
  const [walletInput, setWalletInput] = useState('');

  // === STEP CONTROL ===
  const currentStep = !agreed ? 0 : !joined ? 1 : !submitted ? 2 : 3;

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
      if (!walletInput) {
        setSubmitted(false);
        return;
      }

      const { data } = await supabase
        .from('wallets')
        .select('address')
        .eq('address', walletInput.toLowerCase());

      setSubmitted((data?.length ?? 0) > 0);
    };

    checkIfSubmitted();
  }, [walletInput]);

  const handleSubmit = async () => {
    setLoading(true);
    setError('');

    if (!walletInput) {
      setError('Please enter your wallet address.');
      setLoading(false);
      return;
    }

    if (!/^0x[a-fA-F0-9]{40}$/.test(walletInput)) {
      setError('Invalid Ethereum wallet address.');
      setLoading(false);
      return;
    }

    try {
      const { data: existing } = await supabase
        .from('wallets')
        .select('address')
        .eq('address', walletInput.toLowerCase());

      if ((existing?.length ?? 0) > 0) {
        setSubmitted(true);
        setLoading(false);
        return;
      }

      const { error: insertErr } = await supabase.from('wallets').insert([
        { address: walletInput.toLowerCase(), tx_count: 0 },
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

  // UPDATED steps
  const steps = ["Agree to Terms", "Join Us", "Enter Wallet", "Done"];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-900 via-blue-800 to-blue-950 text-white relative overflow-hidden">
      <Navbar />
      <AudioPlayer />

      {/* Step Indicator */}
      <div className="flex justify-center space-x-6 mt-24 mb-10 z-10">
        {steps.map((step, index) => (
          <div key={index} className="flex flex-col items-center">
            <div
              className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm font-bold transition ${
                index <= currentStep
                  ? 'bg-blue-500 border-yellow-400 text-white'
                  : 'bg-blue-950 border-blue-700 text-blue-300'
              }`}
            >
              {index + 1}
            </div>
            <span
              className={`mt-2 text-xs sm:text-sm ${
                index <= currentStep ? 'text-yellow-300' : 'text-blue-300'
              }`}
            >
              {step}
            </span>
          </div>
        ))}
      </div>

      <main className="flex-grow px-6 relative z-10">
        <motion.div
          className="max-w-2xl mx-auto bg-blue-900/70 backdrop-blur-md border border-yellow-500 rounded-2xl p-8 shadow-2xl space-y-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Intro Header */}
          <motion.h1
            className="text-2xl sm:text-3xl font-extrabold text-center bg-gradient-to-r from-yellow-400 via-white to-blue-400 bg-clip-text text-transparent"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            🐶 Arbipup Airdrop Registration, Lock In Your Wallet
          </motion.h1>

          {/* Timer */}
          {remainingTime !== null && remainingTime > 0 && (
            <div className="text-center text-lg font-mono bg-blue-950/50 py-2 px-6 inline-block rounded-xl border border-yellow-400 text-yellow-300 shadow-md">
              ⏳ Time Left: {formatTime(remainingTime)}
            </div>
          )}

          {/* Terms */}
          <div className="space-y-4 text-sm sm:text-base text-left">
            <h2 className="text-yellow-300 font-semibold">Eligibility Criteria:</h2>
            <ul className="list-disc list-inside space-y-1 text-blue-100">
              <li>
                Interacted with Arbitrum between{' '}
                <strong className="text-yellow-300">Apr 11, 2024 – Apr 11, 2025</strong>
              </li>
              <li>
                Snapshot: <strong className="text-yellow-300">Apr 11, 2025 – 00:00 AM UTC</strong>
              </li>
              <li>
                Eligibility is{' '}
                <strong className="text-yellow-300">
                  not automatic, you must register your wallet
                </strong>
              </li>
              <li>
                Ends after <strong className="text-yellow-300">3 days</strong>
              </li>
            </ul>

            <label className="flex items-start space-x-2 mt-4 cursor-pointer">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="mt-1 w-5 h-5 accent-yellow-400"
              />
              <span className="text-blue-100">
                Submission = my choice, my bark.
                The final woof on eligibility? Arbipup’s pack calls it.
              </span>
            </label>
          </div>

          {/* NEW Join Us step */}
          {agreed && !joined && (
            <div className="space-y-4 text-center">
              <p className="text-yellow-300 font-semibold">Join the pack before continuing 🐾</p>
              <div className="flex justify-center gap-4">
                <a
                  href="https://twitter.com/yourhandle" // replace with real
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 bg-gradient-to-r from-sky-400 to-blue-600 rounded-lg font-bold hover:scale-105 transition"
                >
                  🐦 Follow on Twitter
                </a>
                <a
                  href="https://t.me/yourchannel" // replace with real
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 bg-gradient-to-r from-green-400 to-teal-600 rounded-lg font-bold hover:scale-105 transition"
                >
                  💬 Join Telegram
                </a>
              </div>
              <button
                onClick={() => setJoined(true)}
                className="mt-4 px-6 py-3 bg-yellow-500 text-blue-900 font-bold rounded-lg hover:scale-105 transition"
              >
                ✅ I’ve Joined
              </button>
            </div>
          )}

          {/* Wallet Input */}
          {agreed && joined && !submitted && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  value={walletInput}
                  onChange={(e) => setWalletInput(e.target.value.trim())}
                  placeholder="Enter your Ethereum wallet address"
                  className="flex-grow px-4 py-3 rounded-lg border border-yellow-400 bg-blue-950/50 text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                />
                <button
                  onClick={handleSubmit}
                  disabled={submitted || loading}
                  className={`px-6 py-3 rounded-lg font-bold whitespace-nowrap transition ${
                    submitted
                      ? 'bg-green-600 cursor-default'
                      : 'bg-gradient-to-r from-yellow-400 to-blue-500 hover:scale-105'
                  }`}
                >
                  {submitted ? '✅ Submitted' : loading ? 'Submitting...' : 'Submit'}
                </button>
              </div>
              {error && <p className="text-red-500 text-center">{error}</p>}
            </div>
          )}

          {/* Success */}
          {submitted && (
            <motion.div
              className="mt-6 text-center space-y-4 bg-blue-950/40 border border-green-500 rounded-xl p-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <p className="text-sm text-blue-200 break-all">
                📌 Submitted Wallet: <span className="font-mono text-yellow-300">{walletInput}</span>
              </p>
              <p className="text-lg font-semibold text-yellow-300">
                🎉 Dawg, your wallet is locked in. Stay tuned for the next phase!
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
