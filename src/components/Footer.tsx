export default function Footer() {
  return (
    <footer className="w-full bg-black/60 backdrop-blur-md text-white py-6 mt-20">
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row justify-between items-center px-6 gap-3 text-sm">
        <p className="text-gray-300">&copy; {new Date().getFullYear()} ArbiPup. All rights reserved.</p>
        <p className="text-gray-400">Absolute Chaos on Arbitrum</p>
      </div>
    </footer>
  );
}
