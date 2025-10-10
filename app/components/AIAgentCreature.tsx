import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const texts = [
  "👋 Hi there!",
  "I'm your AI Guide 🤖",
  "Let's get started!",
  "Ready to ace your next interview?",
];

export default function AIAgentCreature() {
  const [cursorX, setCursorX] = useState(0);
  const [textIndex, setTextIndex] = useState(0);

  useEffect(() => {
    // Track cursor X position for head movement
    const handleMouseMove = (e: { clientX: number; }) => setCursorX(e.clientX / window.innerWidth - 0.5);
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useEffect(() => {
    // Rotate through texts
    const interval = setInterval(() => {
      setTextIndex((prev) => (prev + 1) % texts.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const headTilt = cursorX * 15; // tilt based on cursor position

  return (
    <div className="flex flex-col items-center justify-center relative mt-4">
      <motion.svg
        viewBox="0 0 160 120"
        xmlns="http://www.w3.org/2000/svg"
        className="w-32 h-24"
        animate={{ y: [0, -6, 0], rotate: headTilt }}
        transition={{ y: { repeat: Infinity, duration: 3, ease: "easeInOut" }, rotate: { duration: 0.3 } }}
      >
        <defs>
          <linearGradient id="aiBody" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#6366f1" />
            <stop offset="100%" stopColor="#3b82f6" />
          </linearGradient>
        </defs>

        {/* Rod */}
        <rect x="40" y="10" width="80" height="6" rx="3" fill="#cbd5e1" />
        {/* Rope */}
        <rect x="77" y="16" width="6" height="10" fill="#cbd5e1" />
        {/* Head */}
        <circle cx="80" cy="55" r="30" fill="url(#aiBody)" />
        {/* Eyes */}
        <circle cx="68" cy="50" r="8" fill="white" />
        <circle cx="92" cy="50" r="8" fill="white" />
        {/* Pupils */}
        <motion.circle
          cx="68"
          cy="50"
          r="4"
          fill="black"
          animate={{ cx: 68 + cursorX * 5 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
        />
        <motion.circle
          cx="92"
          cy="50"
          r="4"
          fill="black"
          animate={{ cx: 92 + cursorX * 5 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
        />
        {/* Smile */}
        <path
          d="M68 65 Q80 75 92 65"
          stroke="black"
          strokeWidth="2"
          fill="transparent"
          strokeLinecap="round"
        />
      </motion.svg>

      {/* Animated Text */}
      <AnimatePresence mode="wait">
        <motion.div
          key={textIndex}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.6 }}
          className="text-sm mt-2 text-blue-200 font-medium"
        >
          {texts[textIndex]}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
