import { motion } from "motion/react";
import { useOutletContext, Link } from "react-router";
import { Home, Search, ArrowLeft } from "lucide-react";

interface LayoutContext {
  isDark: boolean;
}

export function NotFoundPage() {
  const { isDark } = useOutletContext<LayoutContext>();

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-2xl"
      >
        {/* 404 Illustration */}
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, type: "spring" }}
          className="mb-8"
        >
          <div className="relative inline-block">
            <h1
              className={`text-9xl font-black transition-colors duration-300 ${
                isDark
                  ? "text-green-400/20"
                  : "text-green-200"
              }`}
            >
              404
            </h1>
            <Search
              className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 ${
                isDark ? "text-green-500/50" : "text-green-400/50"
              }`}
            />
          </div>
        </motion.div>

        {/* Message */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <h2
            className={`text-4xl font-black mb-4 transition-colors duration-300 ${
              isDark ? "text-white" : "text-gray-900"
            }`}
          >
            Page Not Found
          </h2>
          <p
            className={`text-lg mb-8 transition-colors duration-300 ${
              isDark ? "text-gray-400" : "text-gray-600"
            }`}
          >
            Oops! The page you're looking for doesn't exist. It might have been moved or deleted.
          </p>
        </motion.div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/">
            <motion.button
              className={`px-8 py-4 rounded-lg font-bold text-white transition-all duration-300 ${
                isDark
                  ? "bg-gradient-to-r from-green-600 to-green-700 hover:shadow-[0_0_30px_rgba(34,197,94,0.4)]"
                  : "bg-gradient-to-r from-green-500 to-green-600 hover:shadow-lg"
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Home className="w-5 h-5 inline mr-2" />
              Back to Home
            </motion.button>
          </Link>
          
          <Link to="/lectures">
            <motion.button
              className={`px-8 py-4 rounded-lg font-bold transition-all duration-300 ${
                isDark
                  ? "bg-gray-800 text-white hover:bg-gray-700"
                  : "bg-gray-200 text-gray-900 hover:bg-gray-300"
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowLeft className="w-5 h-5 inline mr-2" />
              Browse Lectures
            </motion.button>
          </Link>
        </div>

        {/* Floating Elements */}
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className={`absolute w-3 h-3 rounded-full ${
              isDark ? "bg-green-400/30" : "bg-green-500/20"
            }`}
            style={{
              left: `${20 + i * 30}%`,
              top: `${40 + i * 15}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: i * 0.3,
            }}
          />
        ))}
      </motion.div>
    </div>
  );
}
