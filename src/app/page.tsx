"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AudioPlayer from "@/components/AudioPlayer";
import { motion } from "framer-motion";

const chaosGifs = [
  "https://media.giphy.com/media/v1.Y2lkPWVjZjA1ZTQ3bzNkeTBxcGlkb3ZnNTFlZm5iNTV1aXYxbTI5OHpqdzdoZ2Vqam1seCZlcD12MV9naWZzX3NlYXJjaCZjdD1n/UDK35aduhiZD12eCi2/giphy.gif",
  "https://media.giphy.com/media/v1.Y2lkPWVjZjA1ZTQ3dWVkaHZzNjcwYzUxOHA2dHQ5aTgybzV2OXVuOWgyZTM3cWd1eGh4YyZlcD12MV9naWZzX3NlYXJjaCZjdD1n/IRzab7wKChY7DjGmlj/giphy.gif",
  "https://media.giphy.com/media/8lgqAbycBjosxjfi9k/giphy.gif",
  "https://media.giphy.com/media/7C0wCAyx9qoKPIeToi/giphy.gif",
  "https://media.giphy.com/media/l3vRmiPDHYMxn9Eys/giphy.gif",
  "https://media.giphy.com/media/VzH4jP7ppWF8dgCxcg/giphy.gif",
  "https://media.giphy.com/media/l0Exk8EUzSLsrErEQ/giphy.gif",
  "https://media.giphy.com/media/7ZKpmNlwNnHWM/giphy.gif",
  "https://media.giphy.com/media/wW95fEq09hOI8/giphy.gif",
  "https://media.giphy.com/media/v1.Y2lkPWVjZjA1ZTQ3dWVkaHZzNjcwYzUxOHA2dHQ5aTgybzV2OXVuOWgyZTM3cWd1eGh4YyZlcD12MV9naWZzX3NlYXJjaCZjdD1n/xT1XGxEsybgh3WxhOE/giphy.gif",
];

export default function Home() {
  return (
    <div className="relative min-h-screen text-white flex flex-col overflow-hidden">
      <Navbar />
      <AudioPlayer />

      {/* 🔥 Dynamic Arbitrum-Colored Background */}
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

      <main className="flex-grow text-center pt-28 px-6 space-y-24 relative z-10">
        {/* 🎯 Hero Section */}
        <motion.section
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl mx-auto"
        >
          <motion.h1
            className="text-6xl sm:text-7xl font-extrabold drop-shadow-xl bg-gradient-to-r from-blue-400 via-cyan-300 to-purple-500 bg-clip-text text-transparent"
            animate={{ scale: [1, 1.05, 1], rotate: [0, 1, -1, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
          >
            Absolute Chaos
          </motion.h1>

          <motion.p
  className="bg-black/60 p-6 rounded-2xl shadow-xl text-white text-lg leading-relaxed max-w-xl mx-auto"
>
  This is, <span className="text-blue-400 font-extrabold">$Arbipup</span>,      
  the memecoin of <span className="text-pink-400 font-extrabold">pure chaos</span> on 
  <span className="text-cyan-300 font-extrabold"> Arbitrum</span>.
  <br />
  <span className="italic text-gray-300">
    This is not a promise. This is not a plan. This is just chaos.
  </span>

  <span className="block mt-6 text-sm text-gray-400 italic border-t border-gray-700 pt-4">
    Disclaimer: $Arbipup is a memecoin with no intrinsic value, no roadmap, and no expectation of profit.
    It is for entertainment purposes only. Nothing here is financial advice.
  </span>
</motion.p>

          {/* 🎁 Claim + Buy Buttons */}
          <div className="flex justify-center gap-6 mt-8">
            <motion.a
              href="/claim"
              whileHover={{ scale: 1.1 }}
              className="bg-gradient-to-r from-blue-500 to-cyan-400 text-white font-bold py-3 px-6 rounded-xl shadow-lg animate-pulse"
            >
              🎁 Claim $Arbipup
            </motion.a>
            <motion.a
              href="https://dexscreener.com"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.1 }}
              className="bg-gradient-to-r from-green-400 to-lime-400 text-black font-bold py-3 px-6 rounded-xl shadow-lg animate-pulse"
            >
              🛒 Buy $Arbipup
            </motion.a>
          </div>
        </motion.section>

        {/* 💰 Tokenomics Section */}
        <motion.section
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="max-w-3xl mx-auto bg-black/80 p-8 rounded-2xl shadow-2xl border-4 border-gradient-to-r from-blue-400 to-cyan-300"
        >
          <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-300 to-cyan-400 bg-clip-text text-transparent mb-4 animate-pulse">
            Tokenomics
          </h2>
          <p className="text-gray-300 mb-4">
            Total Supply: <span className="font-bold text-blue-300">2,000,000,000 $ArbiPup</span>
          </p>
          <ul className="space-y-3 text-left text-lg">
            <motion.li whileHover={{ scale: 1.05 }}>🔵 <strong>Community:</strong> 60%</motion.li>
            <motion.li whileHover={{ scale: 1.05 }}>🟢 <strong>Liquidity:</strong> 30%</motion.li>
            <motion.li whileHover={{ scale: 1.05 }}>🟣 <strong>Team / Marketing:</strong> 10%</motion.li>
          </ul>
          <p className="mt-6 italic text-cyan-300 text-center">
            2 Billion unleashed for memes, madness & Arbitrum chaos.
          </p>
        </motion.section>

        {/* 🐶 Dog GIFs Section */}
        <section className="max-w-6xl mx-auto">
          <motion.h2
            className="text-3xl font-bold text-pink-400 mb-6"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.7 }}
          >
            Absolute Chaos Gallery
          </motion.h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {chaosGifs.map((gif, i) => (
              <motion.div
                key={i}
                className="overflow-hidden rounded-xl border-2 border-pink-400 shadow-xl bg-black/50"
                whileHover={{ scale: 1.1, rotate: [0, 3, -3, 0] }}
                animate={{ y: [0, -6, 6, 0] }}
                transition={{ duration: 3.5, repeat: Infinity, delay: i * 0.08 }}
              >
                <img src={gif} alt={`gif-${i}`} className="w-full h-48 object-cover" />
              </motion.div>
            ))}
          </div>

          {/* 🔥 Animated Meme Text */}
          <motion.p
            className="mt-8 text-lg font-bold text-white bg-black/80 px-4 py-2 rounded-lg inline-block border border-pink-400 shadow-lg"
            animate={{ scale: [1, 1.05, 1], color: ["#fff", "#ff69b4", "#00ffff", "#fff"] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            $Arbipup thrives in memes. If you expected a roadmap, you are already lost. 🐶💥
          </motion.p>
        </section>
      </main>

      <Footer />
    </div>
  );
}
