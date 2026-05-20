import { useState } from "react";
import { motion } from "motion/react";
import { Play, RotateCcw, Copy, Check } from "lucide-react";

interface CodeEditorProps {
  initialCode: string;
  isDark: boolean;
  onRunCode?: (code: string) => void;
}

export function CodeEditor({ initialCode, isDark, onRunCode }: CodeEditorProps) {
  const [code, setCode] = useState(initialCode);
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);

  const handleRunCode = () => {
    if (onRunCode) {
      onRunCode(code);
    }
    // Simulate code execution
    setOutput("Code executed successfully!\nNote: This is a mock output. Connect to a real compiler for actual execution.");
  };

  const handleReset = () => {
    setCode(initialCode);
    setOutput("");
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4">
      {/* Code Editor Toolbar */}
      <div
        className={`flex items-center justify-between px-4 py-2 rounded-t-lg border-b transition-all duration-300 ${
          isDark
            ? "bg-gray-800/50 border-green-500/30"
            : "bg-gray-100 border-green-200"
        }`}
      >
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${isDark ? "bg-red-500" : "bg-red-400"}`} />
          <div className={`w-3 h-3 rounded-full ${isDark ? "bg-yellow-500" : "bg-yellow-400"}`} />
          <div className={`w-3 h-3 rounded-full ${isDark ? "bg-green-500" : "bg-green-400"}`} />
          <span className={`ml-4 text-sm font-mono ${isDark ? "text-gray-400" : "text-gray-600"}`}>
            code.txt
          </span>
        </div>
        <div className="flex gap-2">
          <motion.button
            onClick={handleCopy}
            className={`p-2 rounded-lg transition-all duration-300 ${
              isDark
                ? "bg-gray-700 hover:bg-gray-600 text-gray-300"
                : "bg-gray-200 hover:bg-gray-300 text-gray-700"
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            title="Copy code"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          </motion.button>
          <motion.button
            onClick={handleReset}
            className={`p-2 rounded-lg transition-all duration-300 ${
              isDark
                ? "bg-gray-700 hover:bg-gray-600 text-gray-300"
                : "bg-gray-200 hover:bg-gray-300 text-gray-700"
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            title="Reset code"
          >
            <RotateCcw className="w-4 h-4" />
          </motion.button>
        </div>
      </div>

      {/* Code Editor Area */}
      <div className="relative">
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className={`w-full h-96 p-4 font-mono text-sm rounded-b-lg border resize-none transition-all duration-300 ${
            isDark
              ? "bg-gray-900 text-green-400 border-green-500/30 focus:border-green-500/50"
              : "bg-white text-gray-900 border-green-200 focus:border-green-400"
          } focus:outline-none focus:ring-2 ${
            isDark ? "focus:ring-green-500/20" : "focus:ring-green-400/20"
          }`}
          spellCheck={false}
          placeholder="// Write your code here..."
        />
        {/* Line numbers would go here in production */}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <motion.button
          onClick={handleRunCode}
          className={`flex-1 py-3 px-6 rounded-lg font-bold text-white transition-all duration-300 ${
            isDark
              ? "bg-gradient-to-r from-green-600 to-green-700 hover:shadow-[0_0_20px_rgba(34,197,94,0.4)]"
              : "bg-gradient-to-r from-green-500 to-green-600 hover:shadow-lg"
          }`}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Play className="w-5 h-5 inline mr-2" />
          Run Code
        </motion.button>
      </div>

      {/* Output Console */}
      {output && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-4 rounded-lg border transition-all duration-300 ${
            isDark
              ? "bg-gray-900 border-green-500/30"
              : "bg-gray-50 border-green-200"
          }`}
        >
          <div className="flex items-center gap-2 mb-2">
            <div className={`w-2 h-2 rounded-full bg-green-500 animate-pulse`} />
            <span className={`text-sm font-bold ${isDark ? "text-gray-400" : "text-gray-600"}`}>
              Output:
            </span>
          </div>
          <pre
            className={`font-mono text-sm whitespace-pre-wrap ${
              isDark ? "text-green-400" : "text-gray-900"
            }`}
          >
            {output}
          </pre>
        </motion.div>
      )}
    </div>
  );
}
