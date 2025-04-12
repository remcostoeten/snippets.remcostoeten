"use client";

import Link from "next/link";
import { GradientText } from "@/components/ui/effects/gradient-text";
import { FileQuestion } from "lucide-react";
import { motion } from "framer-motion";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{
            type: "spring",
            stiffness: 200,
            damping: 20,
            delay: 0.2,
          }}
          className="mb-8 flex justify-center"
        >
          <div className="relative">
            <FileQuestion className="w-24 h-24 text-zinc-500" />
            <FileQuestion className="animate-pulse w-24 blur-xl h-24 text-indigo-500 absolute top-0 left-0" />
          </div>
        </motion.div>
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          <GradientText variant="chromatic">404 - Not Found</GradientText>
        </h1>
        <p className="text-zinc-400 text-lg mb-8 max-w-md mx-auto">
          Oops! The page you're looking for seems to have vanished into the
          digital void.
        </p>
        <Link
          href="/"
          className="
            inline-flex items-center gap-2 
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
          <span>Return Home</span>
        </Link>
      </motion.div>
    </div>
  );
}
