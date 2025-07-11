import { type EmojiMap, getEmoji } from '@/core/emoji-map'
import type { ReactNode } from 'react'

type TProps = {
	children: ReactNode
	emojiCategory?: keyof EmojiMap
}

export const WithEmoji = ({
	children,
	emojiCategory = 'navigation'
}: TProps) => (
	<div className='flex items-center gap-2'>
		<span className='text-lg'>{getEmoji(emojiCategory)}</span>
		<span>{children}</span>
	</div>
)

export const EmojiBeforeAfter = ({ children }: { children: ReactNode }) => (
	<div className='group flex items-center gap-2'>
		<span className='text-lg transition-transform group-hover:-translate-x-1'>
			{getEmoji('navigation')}
		</span>
		<span>{children}</span>
		<span className='text-lg transition-transform group-hover:translate-x-1'>
			{getEmoji('navigation')}
		</span>
	</div>
)
