"use client";

import { GradientText } from "@/components/ui/effects/gradient-text";
import { AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <motion.div
          initial={{ scale: 0.8, rotate: -10 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{
            type: "spring",
            stiffness: 200,
            damping: 20,
            delay: 0.2,
          }}
          className="mb-8 flex justify-center"
        >
          <AlertTriangle className="w-24 h-24 text-red-500/80" />
        </motion.div>
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          <GradientText variant="chromatic">Something went wrong!</GradientText>
        </h1>
        <p className="text-zinc-400 text-lg mb-8 max-w-md mx-auto">
          {error.message ||
            "An unexpected error occurred. Please try again later."}
        </p>
        <div className="flex gap-4 justify-center">
          <button
            onClick={() => reset()}
            className="
              px-6 py-3 
              bg-zinc-800 
              text-zinc-100 
              rounded-full
              font-medium
              transition-all
              duration-300
              hover:bg-zinc-700
              hover:scale-105
              hover:shadow-lg
              hover:shadow-zinc-900/20
            "
          >
            Try again
          </button>
          <a
            href="/"
            className="
              px-6 py-3 
              bg-red-500/10 
              text-red-500 
              border border-red-500/20
              rounded-full
              font-medium
              transition-all
              duration-300
              hover:bg-red-500/20
              hover:scale-105
              hover:shadow-lg
              hover:shadow-red-900/20
            "
          >
            Return Home
          </a>
        </div>
      </motion.div>
    </div>
  );
}
