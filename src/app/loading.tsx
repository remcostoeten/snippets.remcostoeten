'use client'

import { motion } from 'framer-motion'

export default function Loading() {
	return (
		<div className='fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50'>
			<motion.div
				initial={{ opacity: 0, scale: 0.95 }}
				animate={{ opacity: 1, scale: 1 }}
				transition={{ duration: 0.2 }}
				className='flex items-center justify-center'
			>
				<div className='relative'>
					<div className='h-8 w-8'>
						<div className='absolute inset-0 rounded-full border-2 border-muted' />
						<motion.div
							className='absolute inset-0 rounded-full border-2 border-transparent border-t-foreground'
							animate={{ rotate: 360 }}
							transition={{
								duration: 1,
								ease: 'linear',
								repeat: Infinity
							}}
						/>
					</div>
				</div>
			</motion.div>
		</div>
	)
}
