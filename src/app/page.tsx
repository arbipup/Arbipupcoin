"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AudioPlayer from "@/components/AudioPlayer";
import { motion } from "framer-motion";

const chaosGifs = [
  "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNDZhY3pnajFwaTl6NjBqeXVwNXptMTc0aG9wY2kyemJxcWRrdmJ4ZSZlcD12MV9naWZzX3NlYXJjaCZjdD1n/fDuWkkOeLHXxsteAcE/giphy.gif",
  "https://media.giphy.com/media/v1.Y2lkPWVjZjA1ZTQ3dWVkaHZzNjcwYzUxOHA2dHQ5aTgybzV2OXVuOWgyZTM3cWd1eGh4YyZlcD12MV9naWZzX3NlYXJjaCZjdD1n/IRzab7wKChY7DjGmlj/giphy.gif",
  "https://media.giphy.com/media/v1.Y2lkPWVjZjA1ZTQ3aXRna3J5aGt1YWhmeW1tZHhzdzFnNm9hemhtbGxhd2hqdDgxaXdzcyZlcD12MV9naWZzX3NlYXJjaCZjdD1n/jC1zKGLmfVYXDEgUii/giphy.gif",
  "https://media.giphy.com/media/7C0wCAyx9qoKPIeToi/giphy.gif",
  "https://media.giphy.com/media/v1.Y2lkPWVjZjA1ZTQ3ODN1dHJxajI4dWZrMXNsZDZ6ejdrNGN6dmJjdGUwOTU3aXdtdmFsZSZlcD12MV9naWZzX3NlYXJjaCZjdD1n/AhC404o1telGIDToPC/giphy.gif",
  "https://media.giphy.com/media/VzH4jP7ppWF8dgCxcg/giphy.gif",
  "https://media.giphy.com/media/l0Exk8EUzSLsrErEQ/giphy.gif",
  "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNDZhY3pnajFwaTl6NjBqeXVwNXptMTc0aG9wY2kyemJxcWRrdmJ4ZSZlcD12MV9naWZzX3NlYXJjaCZjdD1n/VpysUTI25mTlK/giphy.gif",
  "https://media.giphy.com/media/wW95fEq09hOI8/giphy.gif",
  "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNDZhY3pnajFwaTl6NjBqeXVwNXptMTc0aG9wY2kyemJxcWRrdmJ4ZSZlcD12MV9naWZzX3NlYXJjaCZjdD1n/gFW9rRpOkMRBY2KF6s/giphy.gif",
];

export default function Home() {
  return (
    <div className="relative min-h-screen text-white bg-black flex flex-col overflow-hidden">
      <Navbar />
      <AudioPlayer />

      {/* 🔥 CHAOS Grid Background */}
      <div className="fixed inset-0 -z-10 grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 gap-2 opacity-20 animate-color-cycle blur-sm">
        {Array.from({ length: 70 }).map((_, i) => (
          <motion.img
            key={i}
            src="https://media.giphy.com/media/GDC2INSW9bAwFGwyK8/giphy.gif"
            alt="bg"
            className="w-full h-full object-cover rounded-md"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.015 }}
          />
        ))}
      </div>

      <main className="flex-grow text-center pt-28 px-6 space-y-24 relative z-10">
        {/* 🎯 Hero */}
        <motion.section
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl mx-auto"
        >
          <motion.h1
            className="text-6xl sm:text-7xl font-extrabold bg-gradient-to-r from-blue-400 via-cyan-300 to-purple-500 bg-clip-text text-transparent drop-shadow-xl"
            animate={{ scale: [1, 1.05, 1], rotate: [0, 1, -1, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
          >
            Absolute Chaos
          </motion.h1>

          <motion.p
            className="bg-black/60 p-6 mt-6 rounded-2xl shadow-xl text-white text-lg leading-relaxed max-w-xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Welcome to <span className="text-blue-400 font-extrabold">$Arbipup</span>, the unhinged memecoin born from <span className="text-pink-400 font-extrabold">pure chaos</span>, unleashed on <span className="text-cyan-300 font-extrabold">Arbitrum</span>.
            <br />
            <span className="italic text-gray-300">
              No roadmap. No promises. Just absolute chaos, feral, tail-wagging mayhem.
            </span>
            <span className="block mt-6 text-sm text-gray-400 italic border-t border-gray-700 pt-4">
              Disclaimer: $Arbipup is a memecoin with no intrinsic value, no roadmap, and no expectation of profit.
            </span>
          </motion.p>

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

        {/* 💰 Tokenomics */}
        <motion.section
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="max-w-3xl mx-auto bg-black/80 p-8 rounded-2xl shadow-2xl border-4 border-cyan-400"
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
            2 Billion unleashed for memes, madness & chaos.
          </p>
        </motion.section>

        {/* 🐶 GIF Chaos */}
        <section className="max-w-6xl mx-auto">
          <motion.h2
            className="text-3xl font-bold text-pink-400 mb-6"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.7 }}
          >
            Absolute Chaos Season
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
          <motion.p
            className="mt-8 text-lg font-bold text-white bg-black/80 px-4 py-2 rounded-lg inline-block border border-pink-400 shadow-lg whitespace-pre-line"
            animate={{ scale: [1, 1.05, 1], color: ["#fff", "#ff69b4", "#00ffff", "#fff"] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            😵‍💫 404: Roadmap not found.
            $Arbipup.exe has gone rogue.
            Meme core overload detected.
            Brace for absolute chaos. 🐕💣🌀
          </motion.p>
        </section>

        {/* 🧪 Rituals */}
        <motion.section
          className="max-w-5xl mx-auto mt-24 bg-black/80 p-10 rounded-2xl border border-cyan-500 shadow-2xl"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl font-extrabold text-cyan-300 mb-6 animate-pulse">
            🧪 Forbidden Pup Rituals
          </h2>
          <div className="grid sm:grid-cols-2 gap-6 text-left text-sm text-gray-300">
            <div className="bg-black/60 p-5 rounded-xl border border-cyan-400">
              <h3 className="text-lg font-bold text-cyan-300 mb-2">🔥 Howl of the Moon Market</h3>
              <p>Traders gather at midnight to bark at charts. No TA, just instincts.</p>
            </div>
            <div className="bg-black/60 p-5 rounded-xl border border-cyan-400">
              <h3 className="text-lg font-bold text-cyan-300 mb-2">💀 Bonepile Betting</h3>
              <p>Guess which rug pulls next. Winner gets bones. Losers get… bone too.</p>
            </div>
          </div>
        </motion.section>

        {/* 🎮 Game Teaser */}
        <motion.section
          className="max-w-4xl mx-auto mt-24 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <h2 className="text-4xl text-pink-400 font-extrabold mb-4">🎮 Enter the Chaos Arena</h2>
          <p className="text-gray-300 mb-6">
            A web mini-game is coming. You will dodge regulators, meme bombs, and rug pulls to survive.
          </p>
          <motion.div
            className="mx-auto w-full max-w-lg rounded-xl overflow-hidden border-2 border-pink-500 shadow-lg"
            whileHover={{ scale: 1.05 }}
          >
            <img
              src="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExMm43ZDBlOGE0eHZhbG1hdmdtcHhrY3U4MXNsNGVra3NydnczMmF1eSZlcD12MV9naWZzX3NlYXJjaCZjdD1n/Sr7vO6XP6Y9PPrdsTg/giphy.gif"
              alt="Game Teaser"
              className="w-full h-64 object-cover"
            />
          </motion.div>
        </motion.section>

        {/* 🧠 Meme Wisdom */}
        <motion.section
          className="max-w-3xl mx-auto mt-24 bg-gradient-to-r from-cyan-700 to-blue-900 p-8 rounded-xl shadow-2xl border border-blue-400"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <h2 className="text-3xl font-bold text-white mb-4">🧠 Meme Wisdom of the Day</h2>
          <p className="text-white italic text-lg" id="memeWisdom">
            "If it is too based to be true, it probably pumps."
          </p>
        </motion.section>

        {/* 📜 Legend */}
        <motion.section
          className="max-w-4xl mx-auto mt-24 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1.2 }}
        >
          <h2 className="text-4xl font-bold text-yellow-300 mb-4">📜 Legend of Arbipup</h2>
          <motion.p
            className="bg-black/70 p-6 rounded-lg text-white text-lg leading-relaxed border border-yellow-500 shadow-xl"
            animate={{ opacity: [1, 0.9, 1], scale: [1, 1.02, 1] }}
            transition={{ duration: 4, repeat: Infinity }}
          >
            Once, in the shadows of Arbitrum, a lone pup howled into the void...
            The void howled back, and chaos was born. $Arbipup now roams freely,
            gnawing cables, chasing charts, and disrupting economies.
          </motion.p>
        </motion.section>
      </main>

      <Footer />
    </div>
  );
}