import { motion } from "motion/react";
import { Coins, Plus } from "lucide-react";
import { useState } from "react";

interface CoinWalletProps {
  coins: number;
}

export function CoinWallet({ coins }: CoinWalletProps) {
  const [showEarning, setShowEarning] = useState(false);

  const handleEarnCoins = () => {
    setShowEarning(true);
    setTimeout(() => setShowEarning(false), 1000);
  };

  return (
    <div className="relative">
      <motion.div
        className="flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-yellow-600/30 to-orange-600/30 border-2 border-yellow-500/50 backdrop-blur-sm cursor-pointer"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleEarnCoins}
        style={{
          boxShadow: "0 0 30px rgba(234,179,8,0.4)",
        }}
      >
        <motion.div
          animate={{
            rotate: [0, 10, -10, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <Coins className="w-8 h-8 text-yellow-400 drop-shadow-[0_0_10px_rgba(234,179,8,0.8)]" />
        </motion.div>
        <div className="text-right">
          <p className="text-xs text-yellow-200/70 uppercase tracking-wider">Coins</p>
          <p className="text-2xl font-black text-yellow-300">{coins.toLocaleString()}</p>
        </div>
      </motion.div>

      {/* Earning animation */}
      {showEarning && (
        <motion.div
          className="absolute -top-8 right-0 flex items-center gap-1 text-green-400 font-bold"
          initial={{ opacity: 0, y: 0 }}
          animate={{ opacity: [0, 1, 1, 0], y: [0, -20, -30, -40] }}
          transition={{ duration: 1 }}
        >
          <Plus className="w-4 h-4" />
          <span>50</span>
        </motion.div>
      )}
    </div>
  );
}
