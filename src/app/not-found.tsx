'use client'

import Link from 'next/link'

export default function NotFound() {
	return (
		<div className='min-h-screen bg-zinc-950 flex items-center justify-center p-4'>
			<div className='text-center max-w-md'>
				<h1 className='text-8xl font-bold text-zinc-300 mb-4'>404</h1>
				<h2 className='text-2xl font-medium text-zinc-400 mb-4'>
					Page not found
				</h2>
				<p className='text-zinc-500 mb-8'>
					The page you are looking for doesn't exist or has been moved.
				</p>
				<Link
					href='/'
					className='inline-block px-6 py-3 bg-zinc-800 text-zinc-100 rounded-md font-medium transition-colors hover:bg-zinc-700'
				>
					Go back home
				</Link>
			</div>
		</div>
	)
}
