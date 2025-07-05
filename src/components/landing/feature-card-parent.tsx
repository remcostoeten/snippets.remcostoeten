'use client'
import { motion, useReducedMotion } from 'framer-motion'
import { Database, FileCode, GitBranch, Settings, Terminal, Zap } from 'lucide-react'
import { FeatureCard } from './feature-card'

const features = [
    {
        title: 'macOS Power-User Setup',
        icon: Terminal,
        description: 'Scripts and configurations to enhance your macOS development environment.'
    },
    {
        title: 'Database Best Practices',
        icon: Database,
        description: 'Guides on environment validation and scalable schema design with Drizzle ORM.'
    },
    {
        title: 'Dotfiles & Dev Scripts',
        icon: FileCode,
        description: 'Optimize your workflow with configurations for Neovim, custom shell prompts, and useful scripts.'
    },
    {
        title: 'Git Recipes',
        icon: GitBranch,
        description: 'Practical solutions for common Git problems, like handling diverged branches.'
    },
    {
        title: 'Frontend Snippets',
        icon: Zap,
        description: 'Code for Next.js suspense, Electron APIs, and browser-based hardware testers.'
    },
    {
        title: 'System Configurations',
        icon: Settings,
        description: 'Tips for system-level tweaks, like running sudo commands without a password prompt.'
    }
]

export function FeatureSection() {
    return (
        <section>
            <div className="mx-auto w-full max-w-5xl space-y-8 px-4">
                <AnimatedContainer className="mx-auto max-w-3xl text-center">
                    <p className="text-muted-foreground mt-4 text-sm tracking-wide text-balance md:text-base">
                        Practical guides and code snippets for everyday development challenges.
                    </p>
                </AnimatedContainer>

                <AnimatedContainer
                    delay={0.4}
                    className="grid grid-cols-1 divide-x divide-y divide-dashed border border-dashed sm:grid-cols-2 md:grid-cols-3"
                >
                    {features.map((feature, i) => (
                        <FeatureCard key={i} feature={feature} />
                    ))}
                </AnimatedContainer>
            </div>
        </section>
    )
}

type TViewAnimationProps = {
    delay?: number
    className?: React.ComponentProps<typeof motion.div>['className']
    children: React.ReactNode
}

function AnimatedContainer({ className, delay = 0.1, children }: TViewAnimationProps) {
    const shouldReduceMotion = useReducedMotion()

    if (shouldReduceMotion) {
        return <div className={className}>{children}</div>
    }

    return (
        <motion.div
            initial={{ filter: 'blur(4px)', translateY: -8, opacity: 0 }}
            whileInView={{ filter: 'blur(0px)', translateY: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay, duration: 0.8 }}
            className={className}
        >
            {children}
        </motion.div>
    )
}
