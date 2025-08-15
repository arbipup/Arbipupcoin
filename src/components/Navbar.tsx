"use client";
import Link from "next/link";
import { FaTwitter, FaTelegram } from "react-icons/fa";

export default function Navbar() {
  const presaleActive = false; // change to true when you want Presale visible
  const claimActive = true;   // change to true when you want Airdrop visible

  return (
    <nav className="fixed top-0 left-0 w-full flex flex-wrap justify-between items-center px-3 sm:px-6 py-2 bg-black/60 backdrop-blur-md z-50 text-white">
      
      {/* Logo Section */}
      <div className="flex items-center gap-2 sm:gap-3">
        <img 
          src="https://i.postimg.cc/PqLdTJCR/favicon.png" 
          alt="ArbiPup Logo" 
          className="w-8 h-8 sm:w-10 sm:h-10"
        />
        <span className="font-extrabold text-base sm:text-xl leading-tight">Arbipup</span>
      </div>

      {/* Links & Icons */}
      <div className="flex items-center gap-2 sm:gap-6 text-xs sm:text-base mt-2 sm:mt-0">
        <Link href="/" className="hover:text-arbiblue">Home</Link>

        {claimActive && (
          <Link 
            href="/claim" 
            className="px-2 sm:px-3 py-1 bg-arbiblue rounded-lg font-bold hover:bg-blue-400 transition text-xs sm:text-base"
          >
            Airdrop
          </Link>
        )}

        {presaleActive && (
          <Link 
            href="/presale" 
            className="px-2 sm:px-3 py-1 bg-green-500 rounded-lg font-bold hover:bg-green-400 transition text-xs sm:text-base"
          >
            Presale
          </Link>
        )}

        <a 
          href="https://x.com/arbipupcoin" 
          target="_blank" 
          rel="noopener noreferrer"
          className="w-4 h-4 sm:w-6 sm:h-6 flex items-center justify-center"
        >
          <FaTwitter className="w-full h-full" />
        </a>
        <a 
          href="https://t.me/arbipupcoin" 
          target="_blank" 
          rel="noopener noreferrer"
          className="w-4 h-4 sm:w-6 sm:h-6 flex items-center justify-center"
        >
          <FaTelegram className="w-full h-full" />
        </a>
      </div>
    </nav>
  );
}
