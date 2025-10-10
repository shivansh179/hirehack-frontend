"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Phone, User, Mail, ArrowRight } from "lucide-react";

// Mock theme context for standalone component
const useTheme = () => ({ isDarkMode: true });

// ==============================
// Animated Background Component
// ==============================
const AnimatedBackground = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-blue-500/10 to-pink-500/10" />
  </div>
);

// ==============================
// Reusable Form Input Component
// ==============================
const FormInput = ({
  icon: Icon,
  type,
  placeholder,
  isDarkMode,
}: {
  icon: React.ElementType;
  type: string;
  placeholder: string;
  isDarkMode: boolean;
}) => (
  <motion.div
    className="relative w-full"
    variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
    transition={{ type: "spring", stiffness: 200, damping: 20 }}
  >
    <div className="absolute left-3 top-1/2 -translate-y-1/2 z-10">
      <Icon
        className={`h-5 w-5 ${
          isDarkMode ? "text-gray-500" : "text-gray-400"
        }`}
      />
    </div>
    <motion.input
      whileFocus={{ scale: 1.02 }}
      type={type}
      placeholder={placeholder}
      className={`relative w-full rounded-lg border py-3 pl-10 pr-4 transition-colors duration-300 focus:outline-none focus:ring-2 ${
        isDarkMode
          ? "bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:ring-white"
          : "bg-gray-100 border-gray-300 text-black placeholder-gray-500 focus:ring-black"
      }`}
    />
  </motion.div>
);

// ==============================
// Login & Signup Forms
// ==============================
const formContainerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};
const formItemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const LoginForm = ({ isDarkMode }: { isDarkMode: boolean }) => (
  <motion.div
    variants={formContainerVariants}
    initial="hidden"
    animate="visible"
    className="space-y-6 w-full max-w-sm mx-auto"
  >
    <motion.h2
      variants={formItemVariants}
      className={`text-3xl font-bold mb-2 ${
        isDarkMode ? "text-white" : "text-black"
      }`}
    >
      Welcome Back!
    </motion.h2>
    <motion.p
      variants={formItemVariants}
      className={`mb-8 ${
        isDarkMode ? "text-gray-400" : "text-gray-600"
      }`}
    >
      Sign in to continue.
    </motion.p>
    <FormInput
      icon={Phone}
      type="tel"
      placeholder="Phone Number"
      isDarkMode={isDarkMode}
    />
    <motion.button
      variants={formItemVariants}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`group w-full flex items-center justify-center gap-2 rounded-lg py-3 font-semibold transition-all duration-300 shadow-lg ${
        isDarkMode ? "bg-white text-black" : "bg-black text-white"
      }`}
    >
      Sign In{" "}
      <span className="transition-transform duration-300 group-hover:translate-x-1">
        <ArrowRight className="h-4 w-4" />
      </span>
    </motion.button>
  </motion.div>
);

const SignUpForm = ({ isDarkMode }: { isDarkMode: boolean }) => (
  <motion.div
    variants={formContainerVariants}
    initial="hidden"
    animate="visible"
    className="space-y-6 w-full max-w-sm mx-auto"
  >
    <motion.h2
      variants={formItemVariants}
      className={`text-3xl font-bold mb-2 ${
        isDarkMode ? "text-white" : "text-black"
      }`}
    >
      Join Us Today
    </motion.h2>
    <motion.p
      variants={formItemVariants}
      className={`mb-8 ${
        isDarkMode ? "text-gray-400" : "text-gray-600"
      }`}
    >
      Create an account to get started.
    </motion.p>
    <FormInput
      icon={User}
      type="text"
      placeholder="Full Name"
      isDarkMode={isDarkMode}
    />
    <FormInput
      icon={Mail}
      type="email"
      placeholder="Email Address"
      isDarkMode={isDarkMode}
    />
    <FormInput
      icon={Phone}
      type="tel"
      placeholder="Phone Number"
      isDarkMode={isDarkMode}
    />
    <motion.button
      variants={formItemVariants}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`group w-full flex items-center justify-center gap-2 rounded-lg py-3 font-semibold transition-all duration-300 shadow-lg ${
        isDarkMode ? "bg-white text-black" : "bg-black text-white"
      }`}
    >
      Create Account{" "}
      <span className="transition-transform duration-300 group-hover:translate-x-1">
        <ArrowRight className="h-4 w-4" />
      </span>
    </motion.button>
  </motion.div>
);

// ==============================
// AI Agent Creature
// ==============================
const motivationalMessages = [
  "We will achieve it!",
  "You've got this!",
  "Success is near!",
  "Keep pushing forward!",
  "Believe in yourself!",
  "One step at a time!",
  "You're doing great!",
  "Almost there!"
];

const AIAgentCreature = ({ isVisible }: { isVisible: boolean }) => {
  const [pupilOffset, setPupilOffset] = useState({ x: 0, y: 0 });
  const [message, setMessage] = useState(() => motivationalMessages[0]);
  const creatureRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number | null>(null);

  const handleMouseMove = (e: MouseEvent) => {
    if (creatureRef.current && isVisible) {
      const rect = creatureRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const maxOffset = 5;
      const x = ((e.clientX - centerX) / (rect.width / 2)) * maxOffset;
      
      // Clamp the value
      const clampedX = Math.max(-maxOffset, Math.min(maxOffset, x));
      
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      
      animationFrameRef.current = requestAnimationFrame(() => {
        setPupilOffset({ x: clampedX, y: 0 });
      });
    }
  };

  useEffect(() => {
    if (isVisible) {
      // Pick a random message when becoming visible
      const randomMessage = motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)];
      setMessage(randomMessage);
      
      window.addEventListener("mousemove", handleMouseMove);
    } else {
      setPupilOffset({ x: 0, y: 0 });
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isVisible]);

  return (
    <motion.div
      ref={creatureRef}
      animate={{ y: [0, -6, 0] }}
      transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
      className="w-48 h-48 cursor-pointer"
    >
      <svg viewBox="0 0 160 160" xmlns="http://www.w3.org/2000/svg">
        {/* Hanging rod */}
        <rect x="0" y="10" width="160" height="5" fill="#a0aec0" rx="3" />
        
        {/* Body */}
        <path
          d="M30 50 Q80 10 130 50 Q120 100 80 100 Q40 100 30 50 Z"
          fill="url(#aiBody)"
          stroke="#4f46e5"
          strokeWidth="2"
        />
        
        {/* Gradients */}
        <defs>
          <linearGradient id="aiBody" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#6366f1" />
            <stop offset="100%" stopColor="#3b82f6" />
          </linearGradient>
        </defs>
        
        {/* Eyes */}
        <circle cx="60" cy="60" r="10" fill="white" />
        <circle cx="100" cy="60" r="10" fill="white" />
        
        {/* Pupils with smooth transition */}
        <motion.g
          animate={{ x: pupilOffset.x }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          <circle cx="60" cy="60" r="5" fill="#111827" />
          <circle cx="100" cy="60" r="5" fill="#111827" />
        </motion.g>
        
        {/* Mouth with smooth transition - only one path at a time */}
        <AnimatePresence mode="wait" initial={false}>
          {isVisible ? (
            <>
            <motion.path
              key="smile"
              d="M60 85 Q80 100 100 85"
              stroke="#111827"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
              initial={{ opacity: 0, pathLength: 0 }}
              animate={{ opacity: 1, pathLength: 1 }}
              exit={{ opacity: 0, pathLength: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            />
          <motion.g
              key="sad"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
           
              {/* Speech Bubble */}
              <path
                d="M15 115 Q15 105 25 105 H135 Q145 105 145 115 V135 Q145 145 135 145 H25 Q15 145 15 135 Z M75 105 L80 95 L85 105 Z"
                fill="#e5e7eb"
                stroke="#9ca3af"
                strokeWidth="1.5"
              />
              <text
                x="80"
                y="128"
                textAnchor="middle"
                fill="#1f2937"
                fontSize="12"
                fontFamily="sans-serif"
                fontWeight="500"
              >
                Let's do it!
              </text>
            </motion.g>
            </>
            
          ) : (
            <motion.g
              key="sad"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              {/* Frown */}
              <path
                d="M60 90 Q80 75 100 90"
                stroke="#111827"
                strokeWidth="2"
                fill="none"
                strokeLinecap="round"
              />
              
              {/* Speech Bubble */}
              <path
                d="M15 115 Q15 105 25 105 H135 Q145 105 145 115 V135 Q145 145 135 145 H25 Q15 145 15 135 Z M75 105 L80 95 L85 105 Z"
                fill="#e5e7eb"
                stroke="#9ca3af"
                strokeWidth="1.5"
              />
              <text
                x="80"
                y="128"
                textAnchor="middle"
                fill="#1f2937"
                fontSize="12"
                fontFamily="sans-serif"
                fontWeight="500"
              >
                I can't see you...
              </text>
            </motion.g>
          )}
        </AnimatePresence>
      </svg>
    </motion.div>
  );
};

// ==============================
// Main Auth Page Component
// ==============================
export default function AuthPage() {
  const [isLoginView, setIsLoginView] = useState(true);
  const { isDarkMode } = useTheme();
  const [isMouseInBox, setIsMouseInBox] = useState(true);

  return (
    <>
      <style jsx global>{`
        @keyframes animated-gradient {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
      `}</style>

      <div
        className={`relative flex min-h-screen items-center justify-center p-4 overflow-hidden ${
          isDarkMode ? "bg-black" : "bg-white"
        }`}
      >
        <AnimatedBackground />

        <motion.div
          onMouseEnter={() => setIsMouseInBox(true)}
          onMouseLeave={() => setIsMouseInBox(false)}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{
            opacity: 1,
            scale: 1,
            transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
          }}
          className={`relative w-full max-w-4xl min-h-[650px] rounded-2xl shadow-2xl overflow-hidden border ${
            isDarkMode
              ? "border-gray-800 bg-gray-900/50"
              : "border-gray-200 bg-white"
          }`}
        >
          {/* Signup & Login sections */}
          <div className="w-1/2 h-full absolute top-0 left-0 flex items-center justify-center p-8">
            <SignUpForm isDarkMode={isDarkMode} />
          </div>
          <div className="w-1/2 h-full absolute top-0 right-0 flex items-center justify-center p-8">
            <LoginForm isDarkMode={isDarkMode} />
          </div>

          {/* Sliding AI Panel */}
          <motion.div
            className="absolute w-1/2 h-full z-10 flex flex-col items-center justify-center text-center text-white"
            style={{
              background:
                "linear-gradient(120deg, #1f2937, #111827, #000000)",
              backgroundSize: "200% 200%",
              animation: "animated-gradient 15s ease infinite",
            }}
            variants={{ signup: { x: "0%" }, login: { x: "100%" } }}
            animate={isLoginView ? "signup" : "login"}
            transition={{
              type: "spring",
              stiffness: 100,
              damping: 20,
              duration: 0.8,
            }}
          >
            <div className="relative w-full h-full flex flex-col justify-center items-center">
              <AIAgentCreature isVisible={isMouseInBox} />
              <AnimatePresence mode="wait">
                <motion.div
                  key={isLoginView ? "loginText" : "signupText"}
                  variants={{
                    hidden: { opacity: 0 },
                    visible: {
                      opacity: 1,
                      transition: {
                        staggerChildren: 0.1,
                        delayChildren: 0.2,
                      },
                    },
                  }}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  className="flex flex-col items-center mt-6"
                >
                  <motion.h2
                    variants={formItemVariants}
                    className="text-4xl font-bold mb-4"
                  >
                    {isLoginView ? "New Here?" : "Already with Us?"}
                  </motion.h2>
                  <motion.p
                    variants={formItemVariants}
                    className="mb-8 max-w-sm"
                  >
                    {isLoginView
                      ? "Create an account and start your journey to ace your next interview."
                      : "Sign in to access your dashboard and continue your practice."}
                  </motion.p>
                  <motion.button
                    variants={formItemVariants}
                    onClick={() => setIsLoginView(!isLoginView)}
                    whileHover={{
                      scale: 1.1,
                      boxShadow: "0px 0px 15px rgba(255, 255, 255, 0.3)",
                    }}
                    whileTap={{ scale: 0.9 }}
                    className="w-48 py-3 px-4 rounded-full font-semibold bg-transparent border-2 border-white transition-all duration-300"
                  >
                    {isLoginView ? "Sign Up" : "Sign In"}
                  </motion.button>
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </>
  );
}