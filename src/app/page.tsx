"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AudioPlayer from "@/components/AudioPlayer";
import { motion } from "framer-motion";

const chaosGifs = [
  "https://media.giphy.com/media/fDuWkkOeLHXxsteAcE/giphy.gif",
  "https://media.giphy.com/media/IRzab7wKChY7DjGmlj/giphy.gif",
  "https://media.giphy.com/media/jC1zKGLmfVYXDEgUii/giphy.gif",
  "https://media.giphy.com/media/7C0wCAyx9qoKPIeToi/giphy.gif",
  "https://media.giphy.com/media/AhC404o1telGIDToPC/giphy.gif",
  "https://media.giphy.com/media/VzH4jP7ppWF8dgCxcg/giphy.gif",
  "https://media.giphy.com/media/l0Exk8EUzSLsrErEQ/giphy.gif",
  "https://media.giphy.com/media/VpysUTI25mTlK/giphy.gif",
  "https://media.giphy.com/media/wW95fEq09hOI8/giphy.gif",
  "https://media.giphy.com/media/gFW9rRpOkMRBY2KF6s/giphy.gif",
];

export default function Home() {
  return (
    <div className="relative min-h-screen text-white bg-black flex flex-col overflow-hidden">
      <Navbar />
      <AudioPlayer />

      {/* Animated Gradient Chaos Background */}
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-black via-pink-950 to-cyan-900 animate-gradient-move"></div>

      {/* Floating Chaos Particles */}
      <div className="pointer-events-none fixed inset-0 z-0">
        {Array.from({ length: 40 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-gradient-to-r from-pink-500 via-yellow-400 to-cyan-500 opacity-30 blur-xl"
            style={{
              width: Math.random() * 80 + 30 + "px",
              height: Math.random() * 80 + 30 + "px",
              top: Math.random() * 100 + "%",
              left: Math.random() * 100 + "%",
            }}
            animate={{
              x: [0, Math.random() * 100 - 50],
              y: [0, Math.random() * 100 - 50],
              rotate: [0, 360],
            }}
            transition={{
              duration: 8 + Math.random() * 8,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        ))}
      </div>

      <main className="flex-grow relative z-10">
        {/* Hero Section Full Screen */}
        <section className="flex flex-col justify-center items-center min-h-screen text-center px-6">
          <motion.h1
            className="text-5xl sm:text-6xl md:text-7xl font-extrabold bg-gradient-to-r from-blue-400 via-cyan-300 to-purple-500 bg-clip-text text-transparent drop-shadow-xl"
            animate={{ scale: [1, 1.05, 1], rotate: [0, 1, -1, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
          >
            Absolute Chaos
          </motion.h1>

          <motion.p
  className="bg-black/60 p-6 mt-6 rounded-2xl shadow-xl text-white text-lg leading-relaxed max-w-2xl"
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ delay: 0.4 }}
>
  Welcome to <span className="text-blue-400 font-extrabold">$Arbipup</span> , the wild puppy 
  let loose on <span className="text-cyan-300 font-extrabold">Arbitrum</span>.  
  <br />
  <span className="text-pink-400 font-extrabold">Born from pure chaos.</span> 
  Fueled by bad ideas and good vibes.  
  <br />
  <span className="italic text-gray-300">
    No roadmap. No promises. Just vibes and woofs.
  </span>
  <span className="block mt-6 text-sm text-gray-400 italic border-t border-gray-700 pt-4">
    Disclaimer: $Arbipup is for memes only. No value, no guarantees. Just internet dog energy.
  </span>
</motion.p>


          {/* Buttons */}
          <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
            {/* Disabled Claim button */}
<motion.a
  href="/claim"
  whileHover={{ scale: 1.1 }}
  className="bg-gradient-to-r from-blue-500 to-cyan-400 text-white font-bold py-3 px-8 rounded-xl shadow-lg animate-pulse"
>
  🎁 Claim $Arbipup
</motion.a>

            <motion.a
  href="#"
  onClick={(e) => e.preventDefault()}
  whileHover={{ scale: 1 }}
  className="bg-gray-600 text-gray-300 font-bold py-3 px-8 rounded-xl shadow-lg opacity-50 cursor-not-allowed"
>
  🛒 Buy $Arbipup (Coming Soon)
</motion.a>

          </div>
        </section>

        {/* Tokenomics */}
        <section className="max-w-3xl mx-auto bg-black/80 p-8 rounded-2xl shadow-2xl border-4 border-cyan-400 my-20 text-center">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-300 to-cyan-400 bg-clip-text text-transparent mb-4 animate-pulse">
            Tokenomics
          </h2>
          <p className="text-gray-300 mb-4">
            Total Supply: <span className="font-bold text-blue-300">2,000,000,000 $Arbipup</span>
          </p>
          <ul className="space-y-3 text-left text-lg inline-block">
            <li>🔵 <strong>Community:</strong> 60%</li>
            <li>🟢 <strong>Liquidity:</strong> 30%</li>
            <li>🟣 <strong>Team / Marketing:</strong> 10%</li>
          </ul>
          <p className="mt-6 italic text-cyan-300">
            2 Billion unleashed for memes, madness & chaos.
          </p>
        </section>

{/* Airdrop Details Section */}
<section className="max-w-3xl mx-auto mt-16 bg-black/60 backdrop-blur-md border border-purple-700 rounded-2xl p-8 shadow-2xl space-y-6">
  <h2 className="text-3xl font-extrabold text-center bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent">
    🎉 Arbipup Airdrop Details
  </h2>

  <p className="text-gray-300 text-base leading-relaxed">
    The Arbipup Airdrop is our way of celebrating the vibrant <strong>Arbitrum community</strong>.  
    Arbitrum launched its mainnet on <strong>August 31, 2021</strong> and has thrived ever since, becoming a home for builders, degens, and NFT lovers.  
    Arbipup is here to honor that spirit — rewarding active users and bringing more life to the chain.
  </p>

  <h3 className="text-purple-400 font-semibold mt-4">📜 Eligibility Criteria:</h3>
  <ul className="list-disc list-inside space-y-1 text-gray-300">
    <li>On-chain activity on Arbitrum between <strong>Apr 11, 2024 – Apr 11, 2025</strong></li>
    <li>Volume & transaction count considered</li>
    <li>Other activity metrics (NFT trades, DeFi interactions, etc.)</li>
    <li>Wallet registration required before claiming</li>
    <li>Snapshot taken: <strong>Apr 11, 2025 – 00:00 AM UTC</strong></li>
  </ul>

  <h3 className="text-purple-400 font-semibold mt-4">📊 Tokenomics:</h3>
  <ul className="list-disc list-inside space-y-1 text-gray-300">
    <li>Total Supply: <strong>2,000,000,000</strong> $ARBIPUP</li>
    <li>60% — Community Airdrop</li>
    <li>30% — Liquidity (burned on Day 1)</li>
    <li>10% — Team & Marketing</li>
    <li>All allocations locked for 3 weeks</li>
  </ul>

  <p className="text-xs text-center text-gray-500 mt-6">
    Disclaimer: This is <strong>not</strong> in affiliation with Arbitrum core team members.
  </p>
</section>


        {/* Chaos GIFs */}
        <section className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-pink-400 mb-6 text-center">Absolute Chaos Season</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {chaosGifs.map((gif, i) => (
              <motion.div
                key={i}
                className="overflow-hidden rounded-xl border-2 border-pink-400 shadow-xl bg-black/50"
                whileHover={{ scale: 1.1 }}
              >
                <img src={gif} alt={`gif-${i}`} className="w-full h-48 object-cover" />
              </motion.div>
            ))}
          </div>
        </section>

        {/* New Chaotic Content */}
        <section className="max-w-6xl mx-auto mt-20 px-6">
          <div className="bg-gradient-to-br from-pink-900 via-black to-cyan-900 p-10 rounded-2xl border-4 border-pink-500 shadow-2xl">
            <h2 className="text-4xl font-extrabold text-center text-pink-300 mb-8">
              🌀 Chaotic Pup Carnival
            </h2>
            <div className="grid sm:grid-cols-3 gap-6 text-gray-300">
              <div className="bg-black/70 p-5 rounded-xl border border-pink-400 hover:border-yellow-300">
                <h3 className="text-lg font-bold text-yellow-300 mb-2">🚀 Rug Pull Rodeo</h3>
                <p>Bulls ride the charts until gravity wins. Last one holding the candle wins bragging rights.</p>
              </div>
              <div className="bg-black/70 p-5 rounded-xl border border-pink-400 hover:border-yellow-300">
                <h3 className="text-lg font-bold text-yellow-300 mb-2">🎭 Meme Mask Parade</h3>
                <p>Pups swap avatars and bark cryptic alpha while spinning in meme masks.</p>
              </div>
              <div className="bg-black/70 p-5 rounded-xl border border-pink-400 hover:border-yellow-300">
                <h3 className="text-lg font-bold text-yellow-300 mb-2">💣 FOMO Fireworks</h3>
                <p>Fireworks made of on-chain transactions, lighting up wallets and burning gas.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
