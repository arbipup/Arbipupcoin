"use client";

import { useAccount } from "wagmi";
import { motion } from "framer-motion";

export default function ClaimPage() {
  const { address, isConnected } = useAccount();

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-[#0f0f1c] to-black text-white p-6 flex flex-col items-center justify-center space-y-12">

      {/* ✅ Main Claim Section */}
      <motion.div
        className="text-center space-y-6"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl md:text-5xl font-extrabold text-white drop-shadow-md">
         TGE loading... 🐶🔥 Stay degenerate
        </h1>
        <p className="text-lg text-gray-300 max-w-md mx-auto">
          Absolute Chaos on Arbitrum
        </p>

        {/* Simulated wallet info section */}
        <div className="bg-black/40 border border-pink-500 px-6 py-4 rounded-xl shadow-md">
          {isConnected ? (
            <p className="text-green-400 font-bold">
              ✅ Connected: {address?.slice(0, 6)}...{address?.slice(-4)}
            </p>
          ) : (
            <p className="text-red-400">❌ Wallet not connected</p>
          )}
        </div>
      </motion.div>

      {/* ✅ COMING SOON Section */}
      <motion.div
        className="mt-10 bg-black/60 p-6 rounded-xl border border-yellow-500 text-center max-w-lg shadow-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <h2 className="text-2xl font-bold text-yellow-300 mb-2 animate-pulse">
          🚧 CLAIM COMING SOON
        </h2>
        <p className="text-sm text-gray-300">
          Touch grass. $Arbipup is not ready yet. Check back when the stars align. 🌌
        </p>
      </motion.div>
    </div>
  );
}
