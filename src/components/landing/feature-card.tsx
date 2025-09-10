import { cn } from '@/lib/utils';
import React, { useRef, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

type FeatureType = {
	title: string;
	icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
	description: string;
	href?: string;
	highlight?: boolean;
};

type FeatureCardProps = React.ComponentProps<'div'> & {
	feature: FeatureType;
};

export const FeatureCard = React.memo<FeatureCardProps>(({ feature, className, ...props }) => {
	const p = useMemo(() => genRandomPattern(), []);

	const CardContent = useCallback(() => (
		<div className={cn('relative overflow-hidden p-6', className)} {...props}>
			<div className="pointer-events-none absolute top-0 left-1/2 -mt-2 -ml-20 h-full w-full [mask-image:linear-gradient(white,transparent)]">
				<div className="from-foreground/5 to-foreground/1 absolute inset-0 bg-gradient-to-r [mask-image:radial-gradient(farthest-side_at_top,white,transparent)] opacity-100">
					<GridPattern
						width={20}
						height={20}
						x="-12"
						y="4"
						squares={p}
						className="fill-foreground/5 stroke-foreground/25 absolute inset-0 h-full w-full mix-blend-overlay"
					/>
				</div>
			</div>
			<feature.icon className="text-foreground/75 size-6" strokeWidth={1} aria-hidden="true" />
			<h3 className="mt-10 text-sm md:text-base">{feature.title}</h3>
			<p className="text-muted-foreground relative z-20 mt-2 text-xs font-light">{feature.description}</p>
			{feature.highlight && (
				<div className="absolute top-2 right-2">
					<div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
				</div>
			)}
		</div>
	), [feature, className, p, props]);

	if (feature.href) {
		return (
			<Link href={feature.href} className="group block">
				<CardContent />
			</Link>
		);
	}

	return <CardContent />;
});

const GridPattern = React.memo<React.ComponentProps<'svg'> & { width: number; height: number; x: string; y: string; squares?: number[][] }>(({
	width,
	height,
	x,
	y,
	squares,
	...props
}) => {
	const patternId = React.useId();

	// Memoize the expensive squares rendering
	const memoizedSquares = useMemo(() => {
		if (!squares) return null;
		
		return squares.map(([squareX, squareY], index) => {
			// Pre-calculate animation properties to avoid random() calls on every render
			const delay = (index * 0.1) % 4; // More predictable than Math.random()
			const duration = 0.2 + (index % 3);
			const initialOpacity = 0.1 + (index % 3) * 0.1;
			const maxOpacity = 1 + (index % 2) * 0.2;

			return (
				<AnimatedSquare
					key={`${squareX}-${squareY}-${index}`}
					squareX={squareX}
					squareY={squareY}
					delay={delay}
					duration={duration}
					initialOpacity={initialOpacity}
					maxOpacity={maxOpacity}
				/>
			);
		});
	}, [squares]);

	return (
		<svg aria-hidden="true" {...props}>
			<defs>
				<pattern id={patternId} width={width} height={height} patternUnits="userSpaceOnUse" x={x} y={y}>
					<path d={`M.5 ${height}V.5H${width}`} fill="none" />
				</pattern>
			</defs>
			<rect width="100%" height="100%" strokeWidth={0} fill={`url(#${patternId})`} />
			{squares && (
				<svg x={x} y={y} className="overflow-visible">
					{memoizedSquares}
				</svg>
			)}
		</svg>
	);
});

// Separate component for individual animated squares to optimize re-renders
const AnimatedSquare = React.memo<{
	squareX: number;
	squareY: number;
	delay: number;
	duration: number;
	initialOpacity: number;
	maxOpacity: number;
}>(({ squareX, squareY, delay, duration, initialOpacity, maxOpacity }) => {
	const [trackMouse, setTrackMouse] = React.useState(false);
	const [mouseX, setMouseX] = React.useState(0);
	const [mouseY, setMouseY] = React.useState(0);
	const ref = useRef<SVGRectElement>(null);

	const increaseEffectOnHover = useCallback(() => {
		setTrackMouse(true);
	}, []);

	const decreaseEffectOnLeave = useCallback(() => {
		setTrackMouse(false);
	}, []);

	const handleMouseMove = useCallback((event: React.MouseEvent<SVGRectElement>) => {
		if (ref.current) {
			const rect = ref.current.getBoundingClientRect();
			const x = event.clientX - rect.left;
			const y = event.clientY - rect.top;
			setMouseX(x);
			setMouseY(y);
		}
	}, []);

	// Memoize animation variants to prevent recreation on every render
	const animationVariants = useMemo(() => ({
		initial: { opacity: initialOpacity },
		animate: {
			opacity: [initialOpacity, maxOpacity, initialOpacity],
			scale: [1, 1.02, 1],
		},
		transition: {
			duration,
			delay,
			repeat: Number.POSITIVE_INFINITY,
			ease: "easeInOut" as const,
			repeatDelay: delay * 0.5, // More predictable than Math.random()
		}
	}), [initialOpacity, maxOpacity, duration, delay]);

	return (
		<motion.rect
			ref={ref}
			onMouseEnter={increaseEffectOnHover}
			onMouseLeave={decreaseEffectOnLeave}
			onMouseMove={handleMouseMove}
			strokeWidth="0"
			width={20 + 1} // Use fixed width instead of variable
			height={20 + 1} // Use fixed height instead of variable
			x={squareX * 20}
			y={squareY * 20}
			initial={animationVariants.initial}
			animate={animationVariants.animate}
			transition={animationVariants.transition}
			className="fill-current"
		/>
	);
});

function genRandomPattern(patternLength?: number): number[][] {
	const finalLength = patternLength ?? 8; // Increased from 5 to 8 for more squares
	return Array.from({ length: finalLength }, () => [
		Math.floor(Math.random() * 6) + 5, // random x between 5 and 10
		Math.floor(Math.random() * 8) + 1, // random y between 1 and 8
	]);
}