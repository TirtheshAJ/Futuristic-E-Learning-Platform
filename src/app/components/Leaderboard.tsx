import { motion } from "motion/react";
import { Trophy, Medal, Award, TrendingUp } from "lucide-react";
import { GlassCard } from "./GlassCard";

interface LeaderboardEntry {
  rank: number;
  name: string;
  avatar: string;
  xp: number;
  streak: number;
  level: number;
}

export function Leaderboard() {
  const leaderboard: LeaderboardEntry[] = [
    { rank: 1, name: "CodeMaster_X", avatar: "🏆", xp: 15420, streak: 45, level: 28 },
    { rank: 2, name: "PyThon_Queen", avatar: "👑", xp: 14230, streak: 38, level: 26 },
    { rank: 3, name: "JavaWarrior", avatar: "⚔️", xp: 13890, streak: 42, level: 25 },
    { rank: 4, name: "CppNinja", avatar: "🥷", xp: 12450, streak: 30, level: 23 },
    { rank: 5, name: "WebWizard", avatar: "🧙", xp: 11820, streak: 28, level: 22 },
  ];

  const getRankColor = (rank: number) => {
    if (rank === 1) return "from-yellow-400 to-orange-500";
    if (rank === 2) return "from-gray-300 to-gray-400";
    if (rank === 3) return "from-orange-400 to-orange-600";
    return "from-cyan-500 to-purple-500";
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="w-6 h-6 text-yellow-400" />;
    if (rank === 2) return <Medal className="w-6 h-6 text-gray-300" />;
    if (rank === 3) return <Award className="w-6 h-6 text-orange-400" />;
    return null;
  };

  return (
    <GlassCard>
      <div className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-black text-white flex items-center gap-2">
            <Trophy className="w-7 h-7 text-yellow-400" />
            Global Leaderboard
          </h3>
          <div className="flex items-center gap-2 text-green-400 text-sm">
            <TrendingUp className="w-4 h-4" />
            <span>Live</span>
          </div>
        </div>

        <div className="space-y-3">
          {leaderboard.map((entry, index) => (
            <motion.div
              key={entry.rank}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              whileHover={{ scale: 1.02, x: 5 }}
              className={`flex items-center gap-4 p-4 rounded-xl ${
                entry.rank <= 3
                  ? "bg-gradient-to-r from-slate-800/80 to-slate-900/80 border-2"
                  : "bg-slate-800/40"
              } ${
                entry.rank === 1
                  ? "border-yellow-500/50"
                  : entry.rank === 2
                  ? "border-gray-400/50"
                  : entry.rank === 3
                  ? "border-orange-500/50"
                  : ""
              }`}
            >
              {/* Rank */}
              <div className="flex-shrink-0 w-12">
                {entry.rank <= 3 ? (
                  <div
                    className={`w-10 h-10 rounded-full bg-gradient-to-br ${getRankColor(
                      entry.rank
                    )} flex items-center justify-center font-black text-white shadow-lg`}
                  >
                    {entry.rank}
                  </div>
                ) : (
                  <div className="w-10 h-10 rounded-full bg-slate-700/50 flex items-center justify-center font-bold text-slate-400">
                    {entry.rank}
                  </div>
                )}
              </div>

              {/* Avatar */}
              <div className="text-3xl">{entry.avatar}</div>

              {/* Info */}
              <div className="flex-1">
                <p className="font-bold text-white">{entry.name}</p>
                <div className="flex items-center gap-3 text-xs text-slate-400">
                  <span>Level {entry.level}</span>
                  <span>•</span>
                  <span>{entry.streak}🔥</span>
                </div>
              </div>

              {/* XP */}
              <div className="text-right">
                <p className="font-black text-cyan-400 text-lg">
                  {entry.xp.toLocaleString()}
                </p>
                <p className="text-xs text-slate-400">XP</p>
              </div>

              {/* Rank icon */}
              {entry.rank <= 3 && <div className="flex-shrink-0">{getRankIcon(entry.rank)}</div>}
            </motion.div>
          ))}
        </div>

        {/* User's rank (example) */}
        <div className="pt-4 border-t border-slate-700">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-cyan-900/30 to-purple-900/30 border-2 border-cyan-500/50"
          >
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-purple-500 flex items-center justify-center font-black text-white">
              42
            </div>
            <div className="text-2xl">👤</div>
            <div className="flex-1">
              <p className="font-bold text-white">You</p>
              <div className="flex items-center gap-3 text-xs text-slate-400">
                <span>Level 15</span>
                <span>•</span>
                <span>7🔥</span>
              </div>
            </div>
            <div className="text-right">
              <p className="font-black text-cyan-400 text-lg">8,420</p>
              <p className="text-xs text-slate-400">XP</p>
            </div>
          </motion.div>
        </div>
      </div>
    </GlassCard>
  );
}
