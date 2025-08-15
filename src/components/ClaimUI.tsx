"use client";

import { useAccount } from "wagmi";
import { motion } from "framer-motion";

export default function ClaimPage() {
  const { address, isConnected } = useAccount();

  return (
  <div className="min-h-screen w-full bg-gradient-to-br from-blue-900 via-blue-800 to-blue-950 text-white px-6 py-10 flex flex-col items-center justify-center relative overflow-hidden">

    {/* 🔵 Background Lights */}
    <div className="absolute top-0 left-0 w-full h-full z-0">
      <div className="absolute w-96 h-96 bg-blue-500 rounded-full mix-blend-screen blur-3xl opacity-30 animate-pulse top-10 left-10" />
      <div className="absolute w-80 h-80 bg-yellow-400 rounded-full mix-blend-screen blur-2xl opacity-20 animate-bounce top-[40%] right-10" />
      <div className="absolute w-72 h-72 bg-blue-700 rounded-full mix-blend-screen blur-3xl opacity-20 animate-spin-slow bottom-20 left-1/2 -translate-x-1/2" />
    </div>

    <div className="z-10 w-full max-w-2xl space-y-12 text-center">

      {/* 🐶 Title */}
      <motion.h1
        className="text-5xl font-black tracking-tight drop-shadow-lg bg-gradient-to-r from-yellow-400 via-white to-blue-400 bg-clip-text text-transparent"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        TGE loading... 🐶🔥 Stay degenerate
      </motion.h1>

      {/* 💬 Subtitle */}
      <motion.p
        className="text-lg md:text-xl text-blue-100 max-w-md mx-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        Absolute Chaos on Arbitrum
      </motion.p>

      {/* 💸 Wallet Status Box */}
      <motion.div
        className={`rounded-xl px-6 py-4 border text-lg font-bold shadow-lg transition-all duration-300 ${
          isConnected
            ? "bg-blue-800/20 border-yellow-400 text-yellow-300"
            : "bg-blue-950/30 border-blue-400 text-blue-300"
        }`}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        {isConnected ? (
          <span>
            ✅ Connected: {address?.slice(0, 6)}...{address?.slice(-4)}
          </span>
        ) : (
          <span>❌ Wallet not connected</span>
        )}
      </motion.div>

      {/* 🚧 Coming Soon Box */}
      <motion.div
        className="mt-10 bg-blue-900/40 backdrop-blur-lg border border-yellow-400 text-yellow-300 px-6 py-6 rounded-2xl shadow-2xl max-w-xl mx-auto animate-in fade-in"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.6 }}
      >
        <h2 className="text-2xl md:text-3xl font-extrabold mb-2 animate-pulse">
          🚧 CLAIM COMING SOON
        </h2>
        <p className="text-sm md:text-base text-yellow-200">
          Touch grass. $Arbipup is not ready yet. Check back when the stars align. 🌌
        </p>
      </motion.div>
    </div>
  </div>
);
} 
