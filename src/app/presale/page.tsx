"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useAccount } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabaseClient";

import axios from 'axios';

import {
  BrowserProvider,
  Contract,
  parseUnits,
  formatUnits,
} from "ethers";



// ====== CONFIG ======
const PRESALE_ADDRESS = "0x0553B6c290b7978Fb44154aCC7B89085F129929b";
const TOKEN_ADDRESS = "0x51a84b1675586e52034e76c66a5A6d25724beaa8"; // your Arbipup (test) token — change if needed
const USDT_ADDRESS = "0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9";
const USDC_ADDRESS = "0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8";
const ARB_SCAN_TX_PREFIX = "https://arbiscan.io/tx/";

// Pricing constants (must match contract)
const PRICE_MICRO = 1000n; // 0.001 USDT per token => 0.001 * 10^6 = 1000 micro-units
const STABLE_DECIMALS = 6;
const TOKEN_DECIMALS = 18;
const MIN_USD = 1;
const MAX_USD = 250;

// ====== ABIs ======
const ERC20_MIN_ABI = [
  "function decimals() view returns (uint8)",
  "function totalSupply() view returns (uint256)",
  "function allowance(address owner, address spender) view returns (uint256)",
  "function approve(address spender, uint256 amount) external returns (bool)",
  "function balanceOf(address owner) view returns (uint256)",
];

const PRESALE_ABI = [
  "function buyWithUSDT(uint256 amount) external",
  "function buyWithUSDC(uint256 amount) external",
  "function purchasedAmount(address) view returns (uint256)",
  "function tokensSold() view returns (uint256)",
  "function PRESALE_CAP() view returns (uint256)",
];

// ====== Component ======
export default function PresalePage() {
  const { address, isConnected } = useAccount();

  // UI state
  const [stable, setStable] = useState<"USDT" | "USDC">("USDT");
  const [inputAmount, setInputAmount] = useState(""); // USD numeric string
  const [agreed, setAgreed] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [showCongrats, setShowCongrats] = useState(false);

  // On-chain read state
  const [userPurchasedRaw, setUserPurchasedRaw] = useState<bigint | null>(null);
  const [tokensSoldRaw, setTokensSoldRaw] = useState<bigint | null>(null);
  const [presaleCapRaw, setPresaleCapRaw] = useState<bigint | null>(null);
  const [tokenTotalSupplyRaw, setTokenTotalSupplyRaw] = useState<bigint | null>(null);

  // Contracts
  const presaleContractRead = useMemo(() => {
  if (typeof window === "undefined") return null; // ✅ guard for SSR

  if (!("ethereum" in window)) return null;

  try {
    const provider = new BrowserProvider(window.ethereum as any);
    return new Contract(PRESALE_ADDRESS, PRESALE_ABI, provider);
  } catch (error) {
    console.error("Failed to create contract instance:", error);
    return null;
  }
}, []);

  const tokenContractRead = useMemo(() => {
  if (typeof window === "undefined") return null; // ✅ SSR-safe
  if (!("ethereum" in window)) return null;

  try {
    const provider = new BrowserProvider(window.ethereum as any);
    return new Contract(TOKEN_ADDRESS, ERC20_MIN_ABI, provider);
  } catch (error) {
    console.error("Failed to create token contract instance:", error);
    return null;
  }
}, []);

  // Helper: convert stable USD amount (string) -> token units (bigint, 18 decimals)
  const calcTokenUnitsFromUSD = (usdStr: string) => {
    if (!usdStr) return 0n;
    const n = Number(usdStr);
    if (Number.isNaN(n) || n <= 0) return 0n;

    // stableUnits = usd * 10^6
    const stableUnits = BigInt(Math.round(n * 10 ** STABLE_DECIMALS));
    // tokenUnits = stableUnits * 1e18 / PRICE_MICRO
    const tokenUnits = (stableUnits * (10n ** BigInt(TOKEN_DECIMALS))) / PRICE_MICRO;
    return tokenUnits;
  };

  // Human readable receive string
  const receiveString = useMemo(() => {
    try {
      const units = calcTokenUnitsFromUSD(inputAmount);
      if (units === 0n) return "0";
      return formatUnits(units, TOKEN_DECIMALS);
    } catch (e) {
      return "0";
    }
  }, [inputAmount]);

  // Load on-chain data: user's purchasedAmount, tokensSold, presaleCap, token totalSupply
  useEffect(() => {
    let mounted = true;
    const load = async () => {
      if (!presaleContractRead) return;
      try {
        if (address) {
          const bought: bigint = (await presaleContractRead.purchasedAmount(address)) as bigint;
          if (mounted) setUserPurchasedRaw(bought);
        }
        const sold: bigint = (await presaleContractRead.tokensSold()) as bigint;
        const cap: bigint = (await presaleContractRead.PRESALE_CAP()) as bigint;
        if (mounted) {
          setTokensSoldRaw(sold);
          setPresaleCapRaw(cap);
        }
        if (tokenContractRead) {
          const ts: bigint = (await tokenContractRead.totalSupply()) as bigint;
          if (mounted) setTokenTotalSupplyRaw(ts);
        }
      } catch (err) {
        console.error("read error", err);
      }
    };

    load();
    // simple poll to keep UI fresh
    const interval = setInterval(load, 10_000);
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, [presaleContractRead, tokenContractRead, address]);

  // Helper to format stable purchased (since purchasedAmount stored in stable's smallest units)
  const userPurchasedDisplay = userPurchasedRaw ? formatUnits(userPurchasedRaw, STABLE_DECIMALS) : "0";
  const tokensSoldDisplay = tokensSoldRaw ? formatUnits(tokensSoldRaw, TOKEN_DECIMALS) : "0";
  const presaleCapDisplay = presaleCapRaw ? formatUnits(presaleCapRaw, TOKEN_DECIMALS) : "0";
  const tokenSupplyDisplay = tokenTotalSupplyRaw ? formatUnits(tokenTotalSupplyRaw, TOKEN_DECIMALS) : "0";

  // Approve + buy flow
  const handleBuy = async () => {
    setStatus(null);
    setTxHash(null);
    setShowCongrats(false);

    if (!agreed) {
      setStatus("You must agree to the presale terms to proceed.");
      return;
    }

    const n = Number(inputAmount);
    if (Number.isNaN(n) || n < MIN_USD || n > MAX_USD) {
      setStatus(`Amount must be between $${MIN_USD} and $${MAX_USD}.`);
      return;
    }

    if (!("ethereum" in window)) {
      setStatus("No web3 provider found. Install MetaMask or use RainbowKit.");
      return;
    }

    try {
      setLoading(true);
      setStatus("Preparing transaction...");

      const provider = new BrowserProvider(window.ethereum as any);
      const signer = await provider.getSigner();

      // pick stable contract address
      const stableAddr = stable === "USDT" ? USDT_ADDRESS : USDC_ADDRESS;
      const stableContract = new Contract(stableAddr, ERC20_MIN_ABI, signer);
      const presaleContract = new Contract(PRESALE_ADDRESS, PRESALE_ABI, signer);

      // compute amount in stable smallest units
      const amountInSmallest = parseUnits(inputAmount || "0", STABLE_DECIMALS);

      // check per-wallet cumulative max (contract stores purchasedAmount)
      const existing = address && presaleContractRead ? (await presaleContractRead.purchasedAmount(address)) : 0n;
      const newTotal = (existing ?? 0n) + BigInt(amountInSmallest.toString ? amountInSmallest.toString() : amountInSmallest);
      const maxAllowed = parseUnits(String(MAX_USD), STABLE_DECIMALS);
      if (BigInt(newTotal.toString ? newTotal.toString() : newTotal) > BigInt(maxAllowed.toString())) {
        setStatus("Max purchase exceeded for this wallet.");
        setLoading(false);
        return;
      }

      // allowance
      setStatus("Checking allowance...");
      const allowance: bigint = (await stableContract.allowance(address, PRESALE_ADDRESS)) as bigint;

      if (allowance < BigInt(amountInSmallest.toString())) {
        setStatus("Approving stable token...");
        const approveTx = await stableContract.approve(PRESALE_ADDRESS, amountInSmallest);
        const approveReceipt = await approveTx.wait();
        if (approveReceipt.status !== 1n && approveReceipt.status !== 1) {
          throw new Error("Approve failed");
        }
      }

      // call buy function
      setStatus("Sending purchase tx...");
      let tx;
      if (stable === "USDT") {
        tx = await presaleContract.buyWithUSDT(amountInSmallest);
      } else {
        tx = await presaleContract.buyWithUSDC(amountInSmallest);
      }

      setStatus("Waiting for confirmation...");
      const receipt = await tx.wait();
      setTxHash(receipt.transactionHash || receipt.hash || tx.hash);
      setStatus("Purchase confirmed!");

      // refresh on-chain reads
      if (presaleContractRead && address) {
        const bought: bigint = (await presaleContractRead.purchasedAmount(address)) as bigint;
        setUserPurchasedRaw(bought);
      }
      if (presaleContractRead) {
        const sold: bigint = (await presaleContractRead.tokensSold()) as bigint;
        setTokensSoldRaw(sold);
      }

  

      // congrats
      setShowCongrats(true);
    } catch (err: any) {
      console.error(err);
      setStatus(err?.message ? String(err.message) : "Transaction failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-black via-[#100417] to-[#0c0c0c] text-white">
      <Navbar />

      <main className="flex-grow container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto bg-black/60 backdrop-blur-md border border-purple-700 rounded-2xl p-8 shadow-2xl"
        >
          <h1 className="text-3xl sm:text-4xl font-extrabold text-center mb-4">🐶 Arbipup Presale</h1>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Left: Info / Stats */}
            <div className="space-y-4 p-4 bg-gray-900/60 rounded-xl">
              <h2 className="text-lg font-semibold">Presale Details</h2>

              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="py-2"><span className="text-gray-400">Total Token Supply</span><div className="font-bold">{tokenSupplyDisplay}</div></div>
                <div className="py-2"><span className="text-gray-400">Presale Supply</span><div className="font-bold">{presaleCapDisplay}</div></div>
                <div className="py-2"><span className="text-gray-400">Valuation (FDV)</span><div className="font-bold">$2,000,000</div></div>
                <div className="py-2"><span className="text-gray-400">Price per Token</span><div className="font-bold">$0.001</div></div>
                <div className="py-2"><span className="text-gray-400">Pair</span><div className="font-bold">USDT / USDC</div></div>
                <div className="py-2"><span className="text-gray-400">Tokens Sold</span><div className="font-bold">{tokensSoldDisplay}</div></div>
              </div>

              <div className="mt-4 text-sm text-gray-300">
                <p><strong>Your purchases:</strong> {userPurchasedDisplay} USDT/USDC</p>
                <p className="mt-2">Min per wallet: <strong>${MIN_USD}</strong> — Max per wallet: <strong>${MAX_USD}</strong></p>
              </div>
            </div>

            {/* Right: Buy form */}
            <div className="p-4 bg-gradient-to-br from-gray-900/40 to-black/40 rounded-xl">
              <label className="block mb-2 text-sm">Connect Wallet</label>
              <div className="mb-4">
                <ConnectButton />
              </div>

              {isConnected ? (
                <>
                  <div className="mb-3">
                    <label className="block mb-1 text-sm">Choose stable</label>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setStable("USDT")}
                        className={`px-3 py-2 rounded ${stable === "USDT" ? "bg-purple-600" : "bg-gray-800"}`}
                      >
                        USDT
                      </button>
                      <button
                        onClick={() => setStable("USDC")}
                        className={`px-3 py-2 rounded ${stable === "USDC" ? "bg-purple-600" : "bg-gray-800"}`}
                      >
                        USDC
                      </button>
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="block mb-1 text-sm">Amount (USD)</label>
                    <input
                      type="number"
                      min={MIN_USD}
                      max={MAX_USD}
                      step="0.01"
                      value={inputAmount}
                      onChange={(e) => setInputAmount(e.target.value)}
                      placeholder={`${MIN_USD} - ${MAX_USD}`}
                      className="w-full p-3 rounded bg-gray-800 text-black"
                    />
                    <p className="text-xs text-gray-400 mt-2">Receive: <span className="font-bold">{receiveString} Arbipup</span></p>
                  </div>

                  <div className="mb-4">
                    <label className="flex items-start space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={agreed}
                        onChange={(e) => setAgreed(e.target.checked)}
                        className="mt-1 w-5 h-5 accent-purple-500"
                      />
                      <span className="text-sm">
                        I agree to the <a className="text-arbiblue underline" href="/terms" target="_blank">Terms & Conditions</a> for this presale.
                      </span>
                    </label>
                  </div>

                  <button
                    onClick={handleBuy}
                    disabled={!agreed || loading}
                    className={`w-full py-3 font-bold rounded ${(!agreed || loading) ? "bg-gray-600 cursor-not-allowed" : "bg-green-500 hover:bg-green-400"}`}
                  >
                    {loading ? "Processing..." : "Approve & Buy"}
                  </button>

                  {status && <p className="mt-3 text-sm text-yellow-300">{status}</p>}

                  {txHash && (
                    <div className="mt-4 text-sm bg-gray-900 p-3 rounded">
                      <p className="font-semibold text-green-300">Success 🎉</p>
                      <p>View your transaction: <a className="text-arbiblue underline" href={`${ARB_SCAN_TX_PREFIX}${txHash}`} target="_blank" rel="noreferrer">{txHash.slice(0, 10)}...{txHash.slice(-8)}</a></p>
                      <p className="mt-2">You received <strong>{receiveString}</strong> Arbipup for <strong>${inputAmount}</strong>.</p>
                    </div>
                  )}

                  {showCongrats && (
                    <div className="mt-6 p-4 bg-gradient-to-r from-pink-500 to-purple-600 text-black rounded-lg text-center">
                      <h3 className="text-lg font-bold">🎉 Congratulations!</h3>
                      <p className="mt-2">Your purchase was successful. Tokens should be in your wallet shortly.</p>
                    </div>
                  )}
                </>
              ) : (
                <p className="text-sm text-gray-400">Please connect your wallet to participate in the presale.</p>
              )}
            </div>
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
