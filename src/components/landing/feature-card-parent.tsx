'use client'
import { motion, useReducedMotion } from 'framer-motion'
import { Zap, BookOpen, Gauge, Terminal, Search, RefreshCw } from 'lucide-react';
import { FeatureCard } from './feature-card'

const features = [
	{
		title: 'Instant Snippets',
		icon: Zap,
		description: 'Copy-paste solutions for common React & Next.js tasks.',
	},
	{
		title: 'MDX Docs',
		icon: BookOpen,
		description: 'Structured guides powered by Fumadocs for deep dives.',
	},
	{
		title: 'Performance Tips',
		icon: Gauge,
		description: 'SSR, caching, and Drizzle ORM patterns for blazing speed.',
	},
	{
		title: 'Tooling Boost',
		icon: Terminal,
		description: 'Shell configs & CLI tricks to streamline daily workflow.',
	},
	{
		title: 'Searchable Knowledge',
		icon: Search,
		description: 'Find exactly what you need with lightning search.',
	},
	{
		title: 'Always Up-to-Date',
		icon: RefreshCw,
		description: 'Built on Next.js 15 & React 19—stays aligned with modern stacks.',
	},
];

export function FeatureSection() {
    return (
        <section>
            <div className="mx-auto w-full max-w-5xl space-y-8 px-4">
                <AnimatedContainer className="mx-auto max-w-3xl text-center">
                    <p className="text-muted-foreground mt-4 text-sm tracking-wide text-balance md:text-base">
                        Reusable snippets, docs, and best practices in one place.
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
