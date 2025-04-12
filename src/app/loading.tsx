"use client";

import { motion } from "framer-motion";

export default function Loading() {
  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="relative"
      >
        {/* Outer ring */}
        <motion.div
          className="w-20 h-20 border-4 border-zinc-700 rounded-full"
          animate={{
            rotate: 360,
          }}
          transition={{
            duration: 2,
            ease: "linear",
            repeat: Infinity,
          }}
        />
        {/* Inner gradient ring */}
        <motion.div
          className="absolute top-0 left-0 w-20 h-20 border-4 border-t-transparent border-l-transparent rounded-full"
          style={{
            borderRightColor: "#FF1CF7",
            borderBottomColor: "#6699FF",
          }}
          animate={{
            rotate: -360,
          }}
          transition={{
            duration: 1.5,
            ease: "linear",
            repeat: Infinity,
          }}
        />
        {/* Middle dot */}
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full"
          style={{
            background: "linear-gradient(45deg, #FF1CF7, #6699FF)",
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.8, 1, 0.8],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </motion.div>
    </div>
  );
}
