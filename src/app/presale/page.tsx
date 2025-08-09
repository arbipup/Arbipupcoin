"use client";

import React, { useEffect, useMemo, useState, useRef } from "react";
import { useAccount, useChainId } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabaseClient";
import {
  BrowserProvider,
  Contract,
  parseUnits,
  formatUnits,
} from "ethers";



const PRESALE_ADDRESS = "0x0553B6c290b7978Fb44154aCC7B89085F129929b";
const TOKEN_ADDRESS = "0x51a84b1675586e52034e76c66a5A6d25724beaa8";
const USDT_ADDRESS = "0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9";
const USDC_ADDRESS = "0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8";
const ARB_SCAN_TX_PREFIX = "https://arbiscan.io/tx/";

const PRICE_MICRO = 1000n;
const STABLE_DECIMALS = 6;
const TOKEN_DECIMALS = 18;
const MIN_USD = 1;
const MAX_USD = 250;

const ERC20_MIN_ABI = [
  "function allowance(address owner, address spender) view returns (uint256)",
  "function approve(address spender, uint256 amount) external returns (bool)",
];
const PRESALE_ABI = [
  "function buyWithUSDT(uint256 amount) external",
  "function buyWithUSDC(uint256 amount) external",
  "function purchasedAmount(address) view returns (uint256)",
  "function tokensSold() view returns (uint256)",
  "function PRESALE_CAP() view returns (uint256)",
];

export default function PresalePage() {
  const { address, isConnected } = useAccount();
  const termsRef = useRef<HTMLDivElement>(null);
  const chainId = useChainId();
  // Map common chain IDs to readable names
 const [hasMounted, setHasMounted] = useState(false); // 👈 NEW
 useEffect(() => {
  setHasMounted(true);
}, []);

  const [stable, setStable] = useState<"USDT" | "USDC">("USDT");
  const [inputAmount, setInputAmount] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [showCongrats, setShowCongrats] = useState(false);
  const [userPurchasedRaw, setUserPurchasedRaw] = useState<bigint | null>(null);
  const [tokensSoldRaw, setTokensSoldRaw] = useState<bigint | null>(null);
  const [presaleCapRaw, setPresaleCapRaw] = useState<bigint | null>(null);
  const [tokenTotalSupplyRaw, setTokenTotalSupplyRaw] = useState<bigint | null>(null);
  const [supabasePurchased, setSupabasePurchased] = useState<number>(0);

  const presaleContractRead = useMemo(() => {
    if (typeof window === "undefined" || !("ethereum" in window)) return null;
    try {
      const provider = new BrowserProvider(window.ethereum as any);
      return new Contract(PRESALE_ADDRESS, PRESALE_ABI, provider);
    } catch {
      return null;
    }
  }, []);

  const tokenContractRead = useMemo(() => {
    if (typeof window === "undefined" || !("ethereum" in window)) return null;
    try {
      const provider = new BrowserProvider(window.ethereum as any);
      return new Contract(TOKEN_ADDRESS, ["function totalSupply() view returns (uint256)"], provider);
    } catch {
      return null;
    }
  }, []);

  const calcTokenUnitsFromUSD = (usdStr: string) => {
    if (!usdStr) return 0n;
    const n = Number(usdStr);
    if (Number.isNaN(n) || n <= 0) return 0n;
    const stableUnits = BigInt(Math.round(n * 10 ** STABLE_DECIMALS));
    return (stableUnits * (10n ** BigInt(TOKEN_DECIMALS))) / PRICE_MICRO;
  };

  const receiveString = useMemo(() => {
    try {
      const units = calcTokenUnitsFromUSD(inputAmount);
      return units === 0n ? "0" : formatUnits(units, TOKEN_DECIMALS);
    } catch {
      return "0";
    }
  }, [inputAmount]);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      if (!presaleContractRead) return;
      try {
        if (address) {
          const bought: bigint = await presaleContractRead.purchasedAmount(address);
          if (mounted) setUserPurchasedRaw(bought);
        }
        const sold: bigint = await presaleContractRead.tokensSold();
        const cap: bigint = await presaleContractRead.PRESALE_CAP();
        if (mounted) {
          setTokensSoldRaw(sold);
          setPresaleCapRaw(cap);
        }
        if (tokenContractRead) {
          const ts: bigint = await tokenContractRead.totalSupply();
          if (mounted) setTokenTotalSupplyRaw(ts);
        }
      } catch (err) {
        console.error("read error", err);
      }
    };
    load();
    const interval = setInterval(load, 10_000);
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, [presaleContractRead, tokenContractRead, address]);

  useEffect(() => {
    const fetchSupabasePurchases = async () => {
      if (!address) return;
      const { data, error } = await supabase
        .from("purchases")
        .select("usd_amount")
        .eq("wallet_address", address);
      if (!error && data) {
        const total = data.reduce((sum, p) => sum + Number(p.usd_amount), 0);
        setSupabasePurchased(total);
      }
    };
    fetchSupabasePurchases();
  }, [address, txHash]);

  const userPurchasedDisplay = userPurchasedRaw ? formatUnits(userPurchasedRaw, TOKEN_DECIMALS) : "0";
  const tokensSoldDisplay = tokensSoldRaw ? formatUnits(tokensSoldRaw, TOKEN_DECIMALS) : "0";
  const presaleCapDisplay = presaleCapRaw ? formatUnits(presaleCapRaw, TOKEN_DECIMALS) : "0";
  const tokenSupplyDisplay = tokenTotalSupplyRaw ? formatUnits(tokenTotalSupplyRaw, TOKEN_DECIMALS) : "0";

  const usdRaised = tokensSoldRaw ? Number(formatUnits(tokensSoldRaw, TOKEN_DECIMALS)) * 0.001 : 0;
  const progressPercent = Math.min(Math.max(((usdRaised - 200000) / (400000 - 200000)) * 100, 0), 100);

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
      setStatus("No web3 provider found.");
      return;
    }

    try {
      setLoading(true);
      const provider = new BrowserProvider(window.ethereum as any);
      const signer = await provider.getSigner();
      const stableAddr = stable === "USDT" ? USDT_ADDRESS : USDC_ADDRESS;
      const stableContract = new Contract(stableAddr, ERC20_MIN_ABI, signer);
      const presaleContract = new Contract(PRESALE_ADDRESS, PRESALE_ABI, signer);
      const amountInSmallest = parseUnits(inputAmount || "0", STABLE_DECIMALS);

      const allowance: bigint = await stableContract.allowance(address, PRESALE_ADDRESS);
      if (allowance < amountInSmallest) {
        const approveTx = await stableContract.approve(PRESALE_ADDRESS, amountInSmallest);
        await approveTx.wait();
      }

      let tx;
      if (stable === "USDT") {
        tx = await presaleContract.buyWithUSDT(amountInSmallest);
      } else {
        tx = await presaleContract.buyWithUSDC(amountInSmallest);
      }
      const receipt = await tx.wait();
      const hash = receipt.transactionHash || tx.hash;
      setTxHash(hash);
      setShowCongrats(true);

      await supabase.from("purchases").insert([{
        wallet_address: address,
        tokens_bought: Number(receiveString),
        stable_used: stable,
        usd_amount: Number(inputAmount),
        tx_hash: hash,
      }]);

      const bought: bigint = await presaleContractRead!.purchasedAmount(address);
      setUserPurchasedRaw(bought);
      const sold: bigint = await presaleContractRead!.tokensSold();
      setTokensSoldRaw(sold);

    } catch (err: any) {
      setStatus(err?.message || "Transaction failed");
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
          className="max-w-4xl mx-auto bg-black/60 border border-purple-700 rounded-2xl p-8"
        >
          <h1 className="text-3xl sm:text-4xl font-extrabold text-center mb-4">🐶 Arbipup Presale</h1>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4 p-4 bg-gray-900/60 rounded-xl">
              <h2 className="text-lg font-semibold">Presale Details</h2>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div><span className="text-gray-400">Total Token Supply</span><div className="font-bold">{tokenSupplyDisplay}</div></div>
                <div><span className="text-gray-400">Presale Supply</span><div className="font-bold">{presaleCapDisplay}</div></div>
                <div><span className="text-gray-400">Valuation (FDV)</span><div className="font-bold">$2,000,000</div></div>
                <div><span className="text-gray-400">Price per Token</span><div className="font-bold">$0.001</div></div>
                <div><span className="text-gray-400">Pair</span><div className="font-bold">USDT / USDC</div></div>
                <div><span className="text-gray-400">Tokens Sold</span><div className="font-bold">{tokensSoldDisplay}</div></div>
              </div>
              {/* Progress Bar */}
              <div className="mt-6">
                <div className="flex justify-between text-sm font-bold mb-1">
                  <span>Min $200k</span>
                  <span>${usdRaised.toLocaleString()} Raised</span>
                  <span>Max $400k</span>
                </div>
                <div className="w-full bg-gray-800 rounded-full h-4">
                  <div
                    className="bg-green-500 h-4 rounded-full"
                    style={{ width: `${progressPercent}%` }}
                  ></div>
                </div>
              </div>
              <div className="mt-4 text-sm text-gray-300">
                <p><strong>Your on-chain purchases:</strong> {userPurchasedDisplay} Arbipup</p>
                <p><strong>Your on-chain purchase:</strong> ${supabasePurchased} USDT/USDC</p>
                <p className="mt-2">Min per wallet: <strong>${MIN_USD}</strong> — Max per wallet: <strong>${MAX_USD}</strong></p>
              </div>
            </div>
            <div className="p-4 bg-gradient-to-br from-gray-900/40 to-black/40 rounded-xl">
              <label className="block mb-2 text-sm">Connect Wallet</label>
              <div className="mb-4"><ConnectButton /></div>
              {hasMounted && isConnected && (
  <p className="text-xs text-gray-400 mb-4">
    Connected Network: Arbitrum
  </p>
)}

              {/* Terms Section */}
              <div ref={termsRef} className="mb-4 bg-gray-800 p-3 rounded text-sm">
                <h3 className="font-bold mb-2">Terms & Conditions</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>No refunds after purchase.</li>
                  <li>Tokens distributed after presale ends.</li>
                  <li>Purchase limits apply per wallet.</li>
                  <li>Participation restricted to eligible countries.</li>
                  <li>By purchasing, you agree to our policies.</li>
                </ul>
              </div>
              {hasMounted && isConnected ? (
                <>
                  <div className="mb-3">
                    <label className="block mb-1 text-sm">Choose stable</label>
                    <div className="flex gap-2">
                      <button onClick={() => setStable("USDT")} className={`px-3 py-2 rounded ${stable === "USDT" ? "bg-purple-600" : "bg-gray-800"}`}>USDT</button>
                      <button onClick={() => setStable("USDC")} className={`px-3 py-2 rounded ${stable === "USDC" ? "bg-purple-600" : "bg-gray-800"}`}>USDC</button>
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
                        I agree to the <a className="text-arbiblue underline cursor-pointer" onClick={() => termsRef.current?.scrollIntoView({ behavior: "smooth" })}>Terms & Conditions</a>.
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
                      <p>View transaction: <a className="text-arbiblue underline" href={`${ARB_SCAN_TX_PREFIX}${txHash}`} target="_blank" rel="noreferrer">{txHash.slice(0, 10)}...{txHash.slice(-8)}</a></p>
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
                
               hasMounted && (
    <p className="text-sm text-gray-400">
      Please connect your wallet to participate in the presale.
    </p>
  )
)}
            </div>
          </div>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
}

