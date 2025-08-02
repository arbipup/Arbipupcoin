"use client";
import Link from "next/link";
import { FaTwitter, FaTelegram } from "react-icons/fa";

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 w-full flex justify-between items-center px-4 sm:px-6 py-3 bg-black/60 backdrop-blur-md z-50 text-white">
      
      {/* Logo Section */}
      <div className="flex items-center gap-2 sm:gap-3">
        <img 
          src="https://i.postimg.cc/pV6KqQ53/Main-logo-00.png" 
          alt="ArbiPup Logo" 
          className="w-10 h-10 sm:w-12 sm:h-12"
        />
        <span className="font-extrabold text-lg sm:text-xl">Arbipup</span>
      </div>

      {/* Links & Icons */}
      <div className="flex items-center gap-3 sm:gap-6 text-sm sm:text-base">
        <Link href="/" className="hover:text-arbiblue">Home</Link>
        <Link 
          href="/claim" 
          className="px-2 sm:px-3 py-1 bg-arbiblue rounded-lg font-bold hover:bg-blue-400 transition text-sm sm:text-base"
        >
          Claim
        </Link>
        <a href="https://x.com/arbipupcoin" target="_blank" rel="noopener noreferrer">
          <FaTwitter size={20} className="sm:size-22"/>
        </a>
        <a href="https://t.me/arbipupcoin" target="_blank" rel="noopener noreferrer">
          <FaTelegram size={20} className="sm:size-22"/>
        </a>
      </div>
    </nav>
  );
}
