import { motion } from "motion/react";
import { Coins, Plus } from "lucide-react";
import { useState } from "react";

interface DualThemeCoinWalletProps {
  coins: number;
  isDark: boolean;
}

export function DualThemeCoinWallet({ coins, isDark }: DualThemeCoinWalletProps) {
  const [showEarning, setShowEarning] = useState(false);

  const handleEarnCoins = () => {
    setShowEarning(true);
    setTimeout(() => setShowEarning(false), 1000);
  };

  return (
    <div className="relative">
      <motion.div
        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border backdrop-blur-sm cursor-pointer transition-all duration-300 ${
          isDark
            ? "bg-gradient-to-r from-yellow-600/30 to-orange-600/30 border-yellow-500/50 shadow-[0_0_15px_rgba(234,179,8,0.3)]"
            : "bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-400/50 shadow-md"
        }`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleEarnCoins}
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
          <Coins
            className={`w-4 h-4 transition-all duration-300 ${
              isDark
                ? "text-yellow-400 drop-shadow-[0_0_8px_rgba(234,179,8,0.6)]"
                : "text-yellow-600"
            }`}
          />
        </motion.div>
        <p
          className={`text-xs font-black transition-colors duration-300 ${
            isDark ? "text-yellow-300" : "text-yellow-700"
          }`}
        >
          {coins.toLocaleString()}
        </p>
      </motion.div>

      {/* Earning animation */}
      {showEarning && (
        <motion.div
          className="absolute -top-8 right-0 flex items-center gap-1 text-green-400 font-bold text-xs"
          initial={{ opacity: 0, y: 0 }}
          animate={{ opacity: [0, 1, 1, 0], y: [0, -20, -30, -40] }}
          transition={{ duration: 1 }}
        >
          <Plus className="w-3 h-3" />
          <span>50</span>
        </motion.div>
      )}
    </div>
  );
}