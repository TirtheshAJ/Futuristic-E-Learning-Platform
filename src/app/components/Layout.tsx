import { useState } from "react";
import { Outlet, Link, useLocation } from "react-router";
import { motion } from "motion/react";
import { Code2, Sparkles, Home, BookOpen, FileQuestion, Trophy, ShoppingBag } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { DualThemeCoinWallet } from "./DualThemeCoinWallet";
import { useUser } from "../context/UserContext";

export function Layout() {
  const [isDark, setIsDark] = useState(true);
  const location = useLocation();
  const { userData } = useUser();

  const navItems = [
    { path: "/", label: "Home", icon: Home },
    { path: "/lectures", label: "Lectures", icon: BookOpen },
    { path: "/quizzes", label: "Quizzes", icon: FileQuestion },
    { path: "/streak-rewards", label: "Rewards", icon: Trophy },
    { path: "/store", label: "Store", icon: ShoppingBag },
  ];

  return (
    <div
      className={`min-h-screen overflow-x-hidden transition-colors duration-300 ${
        isDark ? "bg-[#0D0D0D] text-white" : "bg-gray-50 text-gray-900"
      }`}
    >
      {/* Background effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {isDark ? (
          <>
            <div
              className="absolute inset-0 opacity-10"
              style={{
                backgroundImage: `linear-gradient(rgba(34, 197, 94, 0.1) 1px, transparent 1px),
                                  linear-gradient(90deg, rgba(34, 197, 94, 0.1) 1px, transparent 1px)`,
                backgroundSize: "50px 50px",
              }}
            />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-green-950/20 via-black to-black" />
          </>
        ) : (
          <div
            className="absolute inset-0 opacity-5"
            style={{
              backgroundImage: `linear-gradient(rgba(22, 163, 74, 0.05) 1px, transparent 1px),
                                linear-gradient(90deg, rgba(22, 163, 74, 0.05) 1px, transparent 1px)`,
              backgroundSize: "60px 60px",
            }}
          />
        )}
      </div>

      {/* Navigation */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`relative z-20 border-b backdrop-blur-xl transition-all duration-300 ${
          isDark
            ? "border-green-500/20 bg-black/50"
            : "border-green-200/30 bg-white/70 shadow-sm"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3">
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              >
                <Code2 className={isDark ? "w-8 h-8 text-green-400" : "w-8 h-8 text-green-600"} />
              </motion.div>
              <h1
                className={`text-2xl font-black transition-colors duration-300 ${
                  isDark ? "text-green-400" : "text-green-600"
                }`}
              >
                CodeStreak Academy
              </h1>
            </Link>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center gap-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                
                return (
                  <Link key={item.path} to={item.path}>
                    <motion.div
                      className={`px-4 py-2 rounded-lg font-bold transition-all duration-300 flex items-center gap-2 ${
                        isActive
                          ? isDark
                            ? "bg-green-500/20 text-green-400"
                            : "bg-green-100 text-green-700"
                          : isDark
                          ? "text-gray-300 hover:bg-green-500/10 hover:text-green-400"
                          : "text-gray-700 hover:bg-green-50 hover:text-green-600"
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Icon className="w-4 h-4" />
                      {item.label}
                    </motion.div>
                  </Link>
                );
              })}
            </div>

            {/* Right Side */}
            <div className="flex items-center gap-1.5">
              <ThemeToggle isDark={isDark} onToggle={() => setIsDark(!isDark)} />
              <DualThemeCoinWallet coins={userData.coins} isDark={isDark} />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-3 py-1 text-xs rounded-full font-bold transition-all duration-300 ${
                  isDark
                    ? "bg-gradient-to-r from-green-600 to-green-700 shadow-[0_0_15px_rgba(34,197,94,0.3)] text-white"
                    : "bg-gradient-to-r from-green-500 to-green-600 shadow-md text-white"
                }`}
              >
                <Sparkles className="w-3 h-3 inline mr-1" />
                Pro
              </motion.button>
            </div>
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden flex items-center gap-2 mt-4 overflow-x-auto pb-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <Link key={item.path} to={item.path}>
                  <div
                    className={`px-4 py-2 rounded-lg font-bold whitespace-nowrap flex items-center gap-2 transition-all duration-300 ${
                      isActive
                        ? isDark
                          ? "bg-green-500/20 text-green-400"
                          : "bg-green-100 text-green-700"
                        : isDark
                        ? "bg-gray-800/50 text-gray-300"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {item.label}
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </motion.nav>

      {/* Main Content */}
      <div className="relative z-10">
        <Outlet context={{ isDark, setIsDark }} />
      </div>

      {/* Footer */}
      <footer
        className={`relative z-10 border-t backdrop-blur-xl mt-20 transition-all duration-300 ${
          isDark
            ? "border-green-500/20 bg-black/50"
            : "border-green-200/50 bg-white/80"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 py-8 text-center">
          <p className={isDark ? "text-gray-400" : "text-gray-600"}>
            © 2026 CodeStreak Academy. Turning learning into an addictive gaming experience.
          </p>
          <div className="mt-4 flex justify-center gap-2">
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                  isDark ? "bg-green-400/50" : "bg-green-500/30"
                }`}
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
              />
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}