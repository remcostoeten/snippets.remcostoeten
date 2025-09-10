'use client';
import { Zap, Cpu, Fingerprint, Pencil, Settings2, Sparkles, Database, Code } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import { FeatureCard } from './feature-card';
import React, { useMemo } from 'react';

const features = [
	{
		title: 'Query Builder',
		icon: Database,
		description: 'Interactive playground for building CRUD operations with visual schema parsing and code generation.',
		href: '/query-builder',
		highlight: true,
	},
	{
		title: 'Fast',
		icon: Zap,
		description: 'Lightning-fast snippets with instant search and optimized performance.',
	},
	{
		title: 'Type Safe',
		icon: Cpu,
		description: 'Full TypeScript support with strong typing and intelligent autocomplete.',
	},
	{
		title: 'Secure',
		icon: Fingerprint,
		description: 'Built with security best practices and modern authentication.',
	},
	{
		title: 'Customizable',
		icon: Pencil,
		description: 'Tailor the experience with themes, layouts, and personal preferences.',
	},
	{
		title: 'AI Ready',
		icon: Sparkles,
		description: 'Optimized for AI assistance with structured data and clear documentation.',
	},
] as const;

export default function FeatureSection() {
	// Memoize the feature cards to prevent unnecessary re-renders
	const featureCards = useMemo(() => 
		features.map((feature) => (
			<FeatureCard key={feature.title} feature={feature} />
		)), []
	);

	return (
		<section className="py-16 md:py-32">
			<div className="mx-auto w-full max-w-5xl space-y-8 px-4">
				<AnimatedContainer className="mx-auto max-w-3xl text-center">
					<h2 className="text-3xl font-bold tracking-wide text-balance md:text-4xl lg:text-5xl xl:font-extrabold">
						Power. Speed. Control.
					</h2>
					<p className="text-muted-foreground mt-4 text-sm tracking-wide text-balance md:text-base">
						Everything you need to build fast, secure, scalable apps.
					</p>
				</AnimatedContainer>

				<AnimatedContainer
					delay={0.4}
					className="grid grid-cols-1 divide-x divide-y divide-dashed border border-dashed sm:grid-cols-2 md:grid-cols-3"
				>
					{featureCards}
				</AnimatedContainer>
			</div>
		</section>
	);
}

type ViewAnimationProps = {
	delay?: number;
	className?: React.ComponentProps<typeof motion.div>['className'];
	children: React.ReactNode;
};

const AnimatedContainer = React.memo<ViewAnimationProps>(({ className, delay = 0.1, children }) => {
	const shouldReduceMotion = useReducedMotion();

	// Memoize animation variants to prevent recreation
	const animationVariants = useMemo(() => ({
		initial: { filter: 'blur(4px)', translateY: -8, opacity: 0 },
		animate: { filter: 'blur(0px)', translateY: 0, opacity: 1 },
		transition: { delay, duration: 0.8 }
	}), [delay]);

	if (shouldReduceMotion) {
		return <div className={className}>{children}</div>;
	}

	return (
		<motion.div
			initial={animationVariants.initial}
			whileInView={animationVariants.animate}
			viewport={{ once: true }}
			transition={animationVariants.transition}
			className={className}
		>
			{children}
		</motion.div>
	);
});