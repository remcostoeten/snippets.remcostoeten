import { cn } from '@/helpers'
import { ReactNode } from 'react'
import { TEmojiMap, getEmoji } from '@/core/emoji-map'

// Component Props
type TProps = {
    children: ReactNode
    className?: string
    before?: string
    after?: string
    emojiCategory?: keyof TEmojiMap
    emojiIndex?: number
}

/**
 * WithEmoji - Wraps content with emojis that appear on hover
 */
export const WithEmoji = ({
    children,
    before,
    after,
    className,
    emojiCategory = 'navigation',
    emojiIndex = 0
}: TProps) => (
    <span className={cn('group inline-flex items-center gap-2', className)}>
        <span className="opacity-0 group-hover:opacity-100 transition-opacity">
            {before || getEmoji(emojiCategory, emojiIndex)}
        </span>
        {children}
        <span className="opacity-0 group-hover:opacity-100 transition-opacity">
            {after || getEmoji(emojiCategory, (emojiIndex + 1) % 5)}
        </span>
    </span>
)

/**
 * BeforeAfter - Shows text/emojis before and after content on hover with animation
 */
export const BeforeAfter = ({ children, before = '→', after = '←', className }: TProps) => (
    <span className={cn('group relative inline-flex items-center gap-2', className)}>
        <span className="absolute -left-6 opacity-0 group-hover:opacity-100 transition-all group-hover:-left-8">
            {before}
        </span>
        {children}
        <span className="absolute -right-6 opacity-0 group-hover:opacity-100 transition-all group-hover:-right-8">
            {after}
        </span>
    </span>
)

/**
 * EmojiBeforeAfter - A BeforeAfter component that uses emojis from the TEmojiMap
 */
export const EmojiBeforeAfter = ({ children, className, emojiCategory = 'navigation', emojiIndex = 0 }: TProps) => (
    <BeforeAfter
        before={getEmoji(emojiCategory, emojiIndex)}
        after={getEmoji(emojiCategory, (emojiIndex + 1) % 5)}
        className={className}
    >
        {children}
    </BeforeAfter>
)
