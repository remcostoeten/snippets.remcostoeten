import { cn } from '@/lib/utils';
import React, { useRef } from 'react';
import { motion } from 'framer-motion';

type FeatureType = {
	title: string;
	icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
	description: string;
};

type FeatureCardProps = React.ComponentProps<'div'> & {
	feature: FeatureType;
};

export function FeatureCard({ feature, className, ...props }: FeatureCardProps) {
	const p = genRandomPattern();

	return (
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
			<feature.icon className="text-foreground/75 size-6" strokeWidth={1} aria-hidden />
			<h3 className="mt-10 text-sm md:text-base">{feature.title}</h3>
			<p className="text-muted-foreground relative z-20 mt-2 text-xs font-light">{feature.description}</p>
		</div>
	);
}

function GridPattern({
	width,
	height,
	x,
	y,
	squares,
	...props
}: React.ComponentProps<'svg'> & { width: number; height: number; x: string; y: string; squares?: number[][] }) {
	const patternId = React.useId();

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
					{squares.map(([squareX, squareY], index) => {
						// Generate random animation properties for each square
						const delay = Math.random() * 4; // Random delay between 0-4 seconds
						const duration = .2 + Math.random() * 3; // initial = 2
						const initialOpacity = 0.1 + Math.random() * 0.3; // Random opacity between 0.1-0.4
						const maxOpacity = 1 + Math.random() * 0.4; // initial is .4
						const  [trackMouse, setTrackMouse] = React.useState(false);
						const [mouseX, setMouseX] = React.useState(0);
						const [mouseY, setMouseY] = React.useState(0);
						const ref = useRef<SVGRectElement>(null);


						function increaseEffectOnHover() {
							setTrackMouse(true);
						}

						function decreaseEffectOnLeave() {
							setTrackMouse(false);
						}

						function handleMouseMove(event: React.MouseEvent<SVGRectElement>) {
							if (ref.current) {
								const rect = ref.current.getBoundingClientRect();
								const x = event.clientX - rect.left;
								const y = event.clientY - rect.top;
								setMouseX(x);
								setMouseY(y);
							}
						}


						return (
							<motion.rect
							ref={ref}
									onMouseEnter={increaseEffectOnHover}
									onMouseLeave={decreaseEffectOnLeave}
									onMouseMove={handleMouseMove}
								key={index}
								strokeWidth="0"
								width={width + 1}
								height={height + 1}
								x={squareX * width}
								y={squareY * height}
								initial={{ opacity: initialOpacity }}
								animate={{
									opacity: [initialOpacity, maxOpacity, initialOpacity],
									scale: [1, 1.02, 1],
								}}
								transition={{
									duration,
									delay,
									repeat: Infinity,
									ease: "easeInOut",
									repeatDelay: Math.random() * 2, // Random pause between cycles
								}}
								className="fill-current"
							/>
						);
					})}
				</svg>
			)}
		</svg>
	);
}

function genRandomPattern(length?: number): number[][] {
	length = length ?? 8; // Increased from 5 to 8 for more squares
	return Array.from({ length }, () => [
		Math.floor(Math.random() * 6) + 5, // random x between 5 and 10
		Math.floor(Math.random() * 8) + 1, // random y between 1 and 8
	]);
}