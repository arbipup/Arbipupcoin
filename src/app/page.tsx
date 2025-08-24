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

      {/* Animated Gradient Background (blue/yellow/white) */}
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-blue-900 via-yellow-700 to-blue-500 animate-gradient-move"></div>

      {/* Floating Particles */}
      <div className="pointer-events-none fixed inset-0 z-0">
        {Array.from({ length: 40 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-gradient-to-r from-blue-400 via-yellow-300 to-white opacity-30 blur-xl"
            style={{
              width: `${Math.random() * 80 + 30}px`,
              height: `${Math.random() * 80 + 30}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
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
        {/* Hero Section */}
        <section className="flex flex-col justify-center items-center min-h-screen text-center px-6">
          <motion.h1
            className="text-5xl sm:text-6xl md:text-7xl font-extrabold bg-gradient-to-r from-blue-300 via-yellow-200 to-white bg-clip-text text-transparent drop-shadow-xl"
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
            Welcome to <span className="text-blue-300 font-extrabold">$Arbipup</span>, the wild puppy
            let loose on <span className="text-yellow-300 font-extrabold">Arbitrum</span>.
            <br />
            <span className="text-blue-200 font-extrabold">Born from pure chaos.</span> Fueled by bad ideas and good vibes.
            <br />
            <span className="italic text-gray-300">No roadmap. No promises. Just vibes and woofs.</span>
            <span className="block mt-6 text-sm text-gray-400 italic border-t border-gray-700 pt-4">
              Disclaimer: $Arbipup is for memes only. no guarantees. Just internet dog energy.
            </span>
          </motion.p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
            <motion.a
              href="/claim"
              whileHover={{ scale: 1.1 }}
              className="bg-gradient-to-r from-blue-500 to-yellow-300 text-black font-bold py-3 px-8 rounded-xl shadow-lg animate-pulse"
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

        {/* Airdrop Details Section */}
        <section className="max-w-3xl mx-auto mt-16 mb-20 bg-black/60 backdrop-blur-md border border-blue-400 rounded-2xl p-8 shadow-2xl space-y-6">
          <h2 className="text-3xl font-extrabold text-center bg-gradient-to-r from-blue-300 via-yellow-200 to-white bg-clip-text text-transparent">
            🎉 Arbipup Airdrop Details
          </h2>

          <p className="text-gray-200 text-base leading-relaxed">
  The Arbipup Airdrop is our way of celebrating the vibrant{" "}
  <strong className="text-yellow-300">Arbitrum community</strong>. 
  Instead of limiting rewards only to past activity, we have opened registration 
  to everyone, whether you are new to Arbitrum or already part of it. 
  Arbipup is about inclusivity, fun, and giving everyone a fair chance to join in. 
  All you need to do is register your wallet before the deadline and you’ll be set 
  for the claim.
</p>

<h3 className="text-yellow-300 font-semibold mt-4">📜 How It Works:</h3>
<ul className="list-disc list-inside space-y-1 text-gray-200">
  <li>Anyone can register a wallet, no prior Arbitrum history required</li>
  <li>Simply submit your wallet address on Airdrop page to be included</li>
  <li>Wallet registration is required before claiming</li>
  <li>
    For security best practices, we recommend using a{" "}
    <strong className="text-yellow-300">newly created wallet</strong> 
    instead of one linked to your main assets
  </li>
  <li>🚨 Registration closes soon, so make sure to register in time</li>
</ul>


        {/* Tokenomics */}
        <section className="max-w-3xl mx-auto bg-black/80 p-8 rounded-2xl shadow-2xl border-4 border-yellow-300 my-20 text-center">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-200 to-yellow-200 bg-clip-text text-transparent mb-4 animate-pulse">
            Tokenomics
          </h2>
          <p className="text-gray-300 mb-4">
            Total Supply: <span className="font-bold text-blue-200">2,000,000,000 $Arbipup</span>
          </p>
          <ul className="space-y-3 text-left text-lg inline-block">
            <li>🔵 <strong>Community:</strong> 60%</li>
            <li>🟡 <strong>Liquidity:</strong> 30%</li>
            <li>⚪ <strong>Team / Marketing:</strong> 10%</li>
          </ul>
          <p className="mt-6 italic text-yellow-200">2 Billion unleashed for memes, madness & chaos.</p>
        </section>

        {/* Chaos GIFs */}
        <section className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center bg-gradient-to-r from-blue-300 via-yellow-200 to-white bg-clip-text text-transparent mb-6">
            Absolute Chaos Season
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {chaosGifs.map((gif, i) => (
              <motion.div
                key={i}
                className="overflow-hidden rounded-xl border-2 border-blue-400 shadow-xl bg-black/50"
                whileHover={{ scale: 1.08 }}
              >
                <img src={gif} alt={`gif-${i}`} className="w-full h-48 object-cover" />
              </motion.div>
            ))}
          </div>
        </section>

        {/* Chaotic Pup Carnival */}
        <section className="max-w-6xl mx-auto mt-20 px-6">
          <div className="bg-gradient-to-br from-blue-900 via-black to-yellow-900 p-10 rounded-2xl border-4 border-blue-500 shadow-2xl">
            <h2 className="text-4xl font-extrabold text-center bg-gradient-to-r from-blue-200 via-yellow-200 to-white bg-clip-text text-transparent mb-8">
              🌀 Chaotic Pup Carnival
            </h2>
            <div className="grid sm:grid-cols-3 gap-6 text-gray-200">
              <div className="bg-black/70 p-5 rounded-xl border border-blue-400 hover:border-yellow-300 transition-colors">
                <h3 className="text-lg font-bold text-yellow-300 mb-2">🚀 Rug Pull Rodeo</h3>
                <p>Bulls ride the charts until gravity wins. Last one holding the candle wins bragging rights.</p>
              </div>
              <div className="bg-black/70 p-5 rounded-xl border border-blue-400 hover:border-yellow-300 transition-colors">
                <h3 className="text-lg font-bold text-yellow-300 mb-2">🎭 Meme Mask Parade</h3>
                <p>Pups swap avatars and bark cryptic alpha while spinning in meme masks.</p>
              </div>
              <div className="bg-black/70 p-5 rounded-xl border border-blue-400 hover:border-yellow-300 transition-colors">
                <h3 className="text-lg font-bold text-yellow-300 mb-2">💣 FOMO Fireworks</h3>
                <p>Fireworks made of on-chain transactions, lighting up wallets and burning gas.</p>
              </div>
            </div>
          </div>
          </section>
          </main>
          {/* ✅ Footer properly placed inside the return */}
          <Footer />
        </div>
      );
    }
