'use client'

import { motion, useReducedMotion } from 'framer-motion'
import React from 'react'

type TProps = {
	delay?: number
	className?: React.ComponentProps<typeof motion.div>['className']
	children: React.ReactNode
}

export function AnimatedContainer({
	className,
	delay = 0.1,
	children
}: TProps) {
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
