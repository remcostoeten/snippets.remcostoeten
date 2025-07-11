'use client'

import { motion } from 'framer-motion'

export default function Loading() {
	return (
		<div className='min-h-screen bg-neutral-50 dark:bg-neutral-950 flex items-center justify-center'>
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ duration: 0.5 }}
				className='flex flex-col items-center space-y-6'
			>
				{/* Minimalist spinner */}
				<div className='relative'>
					{/* Base circle */}
					<div className='w-8 h-8 border border-neutral-200 dark:border-neutral-800 rounded-full' />
					{/* Animated arc */}
					<motion.div
						className='absolute top-0 left-0 w-8 h-8 border border-transparent border-t-neutral-900 dark:border-t-neutral-100 rounded-full'
						animate={{
							rotate: 360
						}}
						transition={{
							duration: 1.2,
							ease: 'linear',
							repeat: Number.POSITIVE_INFINITY
						}}
					/>
				</div>

				{/* Minimalist dots */}
				<div className='flex space-x-1'>
					{[0, 1, 2].map(i => (
						<motion.div
							key={i}
							className='w-1 h-1 bg-neutral-400 dark:bg-neutral-600 rounded-full'
							animate={{
								opacity: [0.3, 1, 0.3]
							}}
							transition={{
								duration: 1.2,
								repeat: Number.POSITIVE_INFINITY,
								ease: 'easeInOut',
								delay: i * 0.15
							}}
						/>
					))}
				</div>
			</motion.div>
		</div>
	)
}
