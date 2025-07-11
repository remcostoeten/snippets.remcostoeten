import { getEmoji } from '@/core/emoji-map'
import type { ReactNode } from 'react'

type TProps = {
	children: ReactNode
}

export const Backend = ({ children }: TProps) => (
	<div className='flex items-center gap-2'>
		<span className='text-lg'>{getEmoji('backend')}</span>
		<span>{children}</span>
	</div>
)

export const Database = ({ children }: TProps) => (
	<div className='flex items-center gap-2'>
		<span className='text-lg'>{getEmoji('database')}</span>
		<span>{children}</span>
	</div>
)

export const Frontend = ({ children }: TProps) => (
	<div className='flex items-center gap-2'>
		<span className='text-lg'>{getEmoji('frontend')}</span>
		<span>{children}</span>
	</div>
)
