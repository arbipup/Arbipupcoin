'use client';

import React, { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useAccount, useDisconnect } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AudioPlayer from '@/components/AudioPlayer';
import ClaimFlow from "@/components/ClaimUI";


const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function ClaimPage() {
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [remainingTime, setRemainingTime] = useState<number | null>(null);

  // Timer
  useEffect(() => {
    const fetchStartTime = async () => {
      const { data, error } = await supabase
        .from('global_timer')
        .select('starts_at')
        .eq('key', 'airdrop')
        .single();

      if (error) {
        console.error('Error fetching timer:', error);
        return;
      }

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

  // Check if already submitted
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
      setError('Please connect your wallet.');
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
      setError('Submission failed. Try again.');
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

  return (
    <div className="relative min-h-screen text-white flex flex-col overflow-hidden">
      <Navbar />
      <AudioPlayer />

      {/* Background GIF grid */}
      <div className="fixed inset-0 -z-10 grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 gap-2 opacity-30 animate-color-cycle">
        {Array.from({ length: 70 }).map((_, i) => (
          <motion.img
            key={i}
            src="https://media.giphy.com/media/GDC2INSW9bAwFGwyK8/giphy.gif"
            alt="bg"
            className="w-full h-full object-cover rounded-lg"
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.02 }}
          />
        ))}
      </div>

      {/* Main content */}
      <main className="flex-grow pt-28 px-6 space-y-16 relative z-10 text-center">
        <motion.div
          className="max-w-md mx-auto p-4 bg-black/40 backdrop-blur-md border border-purple-500 rounded-xl shadow-xl"
          initial={{ scale: 0.9, rotate: -2, opacity: 0 }}
          animate={{ scale: 1, rotate: 0, opacity: 1 }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
        >
          <h1 className="text-xl sm:text-2xl font-semibold text-center bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent leading-relaxed">
            ⚡️ Chaos is about to hit Arbitrum, dawg! Submit your wallet now before submissions close, do not miss the madness.
          </h1>
        </motion.div>

        {remainingTime !== null && remainingTime > 0 && (
          <div className="text-2xl font-bold text-cyan-300 bg-black/60 py-2 px-6 inline-block rounded-xl border border-cyan-500 shadow-md">
            ⏳ Time Left: {formatTime(remainingTime)}
          </div>
        )}

        <div className="max-w-xl mx-auto bg-black/70 rounded-2xl p-8 border border-white/20 shadow-lg">
          <p className="text-lg text-gray-300 mb-6">
            Submit your wallet to get checked for eligibility. Only wallets with 50+ Arbitrum txs will qualify. One submission per address.
          </p>

          {!isConnected ? (
            <div className="mb-6 flex justify-center">
              <ConnectButton showBalance={false} chainStatus="icon" />
            </div>
          ) : (
            <>
              <p className="text-green-400 mb-2">
                Connected: {address?.slice(0, 6)}...{address?.slice(-4)}
              </p>
              <button
                onClick={() => disconnect()}
                className="mb-4 px-4 py-2 bg-red-600 rounded-xl font-semibold hover:bg-red-700"
              >
                Disconnect Wallet
              </button>

              <button
                onClick={handleSubmit}
                disabled={submitted || loading}
                className={`py-3 px-6 rounded-xl font-bold transition ${
                  submitted
                    ? 'bg-green-600 cursor-default'
                    : 'bg-gradient-to-r from-blue-500 to-cyan-400 hover:scale-105'
                }`}
              >
                {submitted ? '✅ Wallet Submitted' : loading ? 'Submitting...' : 'Submit Wallet'}
              </button>
            </>
          )}

          {error && <p className="text-red-500 mt-4">{error}</p>}

          {isConnected && submitted && (
            <div className="mt-8 flex flex-col items-center justify-center space-y-4">
              <p className="text-xl font-bold px-4 py-2 bg-gradient-to-r from-pink-600 via-purple-500 to-blue-500 text-white rounded-xl shadow-lg">
                🎉 Your wallet has been submitted successfully! Stay tuned, eligibility checks and claiming details will be announced soon.
              </p>
              <motion.img
                src="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExbjJzamxwOTRtYm5lamM3YWE2c3R3cWpwZ2ZkaDIwMWlmN3VhbWJjeiZlcD12MV9naWZzX3NlYXJjaCZjdD1n/jp2KXzsPtoKFG/giphy.gif"
                alt="Success GIF"
                className="w-48 rounded-xl shadow-xl"
                animate={{ rotate: [-5, 5, -5] }}
                transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
              />
            </div>
          )}
        </div>

        <ClaimFlow />
      </main>

      <Footer />
    </div>
  );
}
