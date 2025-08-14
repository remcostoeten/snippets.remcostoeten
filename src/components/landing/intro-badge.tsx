"use client";

import { ArrowRightIcon } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/helpers";
import { OptimizedTextAnimate } from "@/components/ui/effects/blur-in-optimized";
import { ShinyBadge } from "@/components/ui/effects/animated-badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Search } from "./search";
import { GradientText } from "../ui/effects/gradient-text";

export function Hero() {
  return (
    <div className="mx-auto max-w-3xl text-center">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="z-10 flex mb-2 items-center justify-center"
      >
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className={cn(
            "group rounded-full border border-black/5 bg-neutral-100 text-xs text-white transition-all ease-in hover:cursor-pointer hover:bg-neutral-200 dark:border-white/5 dark:bg-neutral-900 dark:hover:bg-neutral-800"
          )}
        >
          <ShinyBadge className="inline-flex items-center justify-center px-4 py-1 transition ease-out hover:text-neutral-600 hover:duration-300 hover:dark:text-neutral-400">
            <span><span className='animate-pulse duration-500'>✨</span> Personal Code Snippets & Notes</span>
            <ArrowRightIcon className="ml-1 size-3 transition-transform duration-300 ease-in-out group-hover:translate-x-0.5" />
          </ShinyBadge>
        </motion.div>
      </motion.div>

      <OptimizedTextAnimate
        animation="blurInUp"
        className="mb-6"
        fontSize="4xl"
        fontWeight="bold"
        letterSpacing="tight"
        delay={0.1}
      >
        <GradientText variant='subtle'>
          
        Nothing really to see here
        </GradientText>
      </OptimizedTextAnimate>

      <OptimizedTextAnimate
        animation="blurInUp"
        className="mb-8"
        fontSize="lg"
        textColor="zinc-400"
        delay={0.2}
      >
        A collection of reusable code snippets, notes, and documentation for web
        development with subjects like (git)-tooling, database helpers, work
        snippets or reusable code. Mostly because I like writing and can't
        remember the things I learned.
      </OptimizedTextAnimate>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.5 }}
        className="flex flex-col sm:flex-row items-center justify-center gap-4"
      >
        <Link href="/snippets">
          <Button className="bg-zinc-800 hover:bg-zinc-700 text-zinc-100">
            Browse Documentation
          </Button>
        </Link>
        <div className="relative w-full max-w-sm">
          <Search
            variant="header"
            placeholder="Search..."
            className="max-w-[200px] md:max-w-xs"
          />
        </div>
      </motion.div>
    </div>
  );
}
