'use client'

import { cn } from '@/helpers'
import type { ReactNode } from 'react'
import { Copy, Check, SeparatorHorizontal } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { OptimizedTextAnimate } from '../effects/blur-in-optimized'

/**
 * EmojiMap - A comprehensive mapping of categories to relevant emojis
 * Use this to easily access commonly used emojis by semantic category
 */
export type EmojiMap = {
    // Web Development Categories
    frontend: '🖥️' | '🎨' | '🖌️' | '📱' | '⚛️'
    backend: '🔌' | '⚙️' | '🗄️' | '🛠️' | '🧮'
    database: '💾' | '🗃️' | '📊' | '📁' | '📋'
    deployment: '🚀' | '☁️' | '🌐' | '🔄' | '📤'
    security: '🔒' | '🛡️' | '🔐' | '🔑' | '⚠️'
    performance: '⚡' | '🏎️' | '⏱️' | '📈' | '🚄'

    // UI/UX Categories
    ui: '🎯' | '👁️' | '📐' | '✨' | '🎭'
    design: '🎨' | '🖌️' | '🧩' | '🔍' | '🖼️'
    animation: '🎬' | '✨' | '💫' | '🌟' | '🎭'

    code: '👨‍💻' | '💻' | '📝' | '🧠' | '🔣'
    debug: '🐛' | '🔍' | '🧪' | '🔧' | '🔬'
    testing: '✅' | '🧪' | '📋' | '🔄' | '✔️'

    // Documentation
    note: '📝' | '📌' | '📒' | '📑' | '🔖'
    tip: '💡' | '✨' | '📌' | '🔍' | '🎯'
    warning: '⚠️' | '🚨' | '⛔' | '🔔' | '❗'
    important: '🔑' | '💯' | '❗' | '‼️' | '📢'
    example: '🔍' | '👉' | '🧪' | '📋' | '🔎'

    // General Purpose
    success: '✅' | '🎉' | '👍' | '🏆' | '💯'
    error: '❌' | '💔' | '🛑' | '🚫' | '⛔'
    info: 'ℹ️' | '📝' | '📌' | '📊' | '📢'
    progress: '🔄' | '⏳' | '📊' | '📈' | '🚧'
    navigation: '👉' | '👈' | '👆' | '👇' | '🔍'
}

/**
 * Get a specific emoji from the map
 * @param category - Category from the EmojiMap
 * @param index - Index of the emoji in the array (0-4)
 * @returns A single emoji string
 */
export const getEmoji = (category: keyof EmojiMap, index = 0): string => {
    const emojiOptions: Record<keyof EmojiMap, string[]> = {
        frontend: ['🖥️', '🎨', '🖌️', '📱', '⚛️'],
        backend: ['🔌', '⚙️', '🗄️', '🛠️', '🧮'],
        database: ['💾', '🗃️', '📊', '📁', '📋'],
        deployment: ['🚀', '☁️', '🌐', '🔄', '📤'],
        security: ['🔒', '🛡️', '🔐', '🔑', '⚠️'],
        performance: ['⚡', '🏎️', '⏱️', '📈', '🚄'],

        ui: ['🎯', '👁️', '📐', '✨', '🎭'],
        design: ['🎨', '🖌️', '🧩', '🔍', '🖼️'],
        animation: ['🎬', '✨', '💫', '🌟', '🎭'],

        code: ['👨‍💻', '💻', '📝', '🧠', '🔣'],
        debug: ['🐛', '🔍', '🧪', '🔧', '🔬'],
        testing: ['✅', '🧪', '📋', '🔄', '✔️'],

        note: ['📝', '📌', '📒', '📑', '🔖'],
        tip: ['💡', '✨', '📌', '🔍', '🎯'],
        warning: ['⚠️', '🚨', '⛔', '🔔', '❗'],
        important: ['🔑', '💯', '❗', '‼️', '📢'],
        example: ['🔍', '👉', '🧪', '📋', '🔎'],

        success: ['✅', '🎉', '👍', '🏆', '💯'],
        error: ['❌', '💔', '🛑', '🚫', '⛔'],
        info: ['ℹ️', '📝', '📌', '📊', '📢'],
        progress: ['🔄', '⏳', '📊', '📈', '🚧'],
        navigation: ['👉', '👈', '👆', '👇', '🔍']
    }

    return emojiOptions[category][index % emojiOptions[category].length]
}

// Component Props
type TProps = {
    children: ReactNode
    className?: string
    before?: string
    after?: string
    emojiCategory?: keyof EmojiMap
    title?: string
    emojiIndex?: number
}

/**
 * Basic text formatting components
 */
export const I = ({ children, className }: TProps) => <span className={cn('italic', className)}>{children}</span>

export const U = ({ children, className }: TProps) => (
    <span className={cn('underline underline-offset-4', className)}>{children}</span>
)

export const B = ({ children, className }: TProps) => <span className={cn('font-bold', className)}>{children}</span>

export const Pulse = ({ children, className }: TProps) => (
    <span className={cn('animate-pulse', className)}>{children}</span>
)

export const Ping = ({ children, className }: TProps) => (
    <span className={cn('animate-ping', className)}>{children}</span>
)

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
 * EmojiBeforeAfter - A BeforeAfter component that uses emojis from the EmojiMap
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

/**
 * Documentation-specific components for your web dev site
 */
export const CodeNote = ({ children, className, emojiIndex = 0 }: TProps) => {
    const [copied, setCopied] = useState(false)
    const text = typeof children === 'string' ? children : ''

    const copyToClipboard = () => {
        if (text) {
            navigator.clipboard.writeText(text)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        }
    }

    return (
        <div
            className={cn(
                'relative flex items-center w-full max-w-3xl',
                'rounded-lg border border-border',
                'bg-background/50 backdrop-blur-sm',
                className
            )}
        >
            <div className="min-w-0 flex-1 p-3 font-mono">
                <div className="flex items-center gap-2">
                    <span className="flex-shrink-0">{getEmoji('code', emojiIndex)}</span>
                    <span className="flex-1 truncate text-sm text-foreground/90">{children}</span>
                </div>
            </div>
            <Button
                variant="ghost"
                size="icon"
                className="relative mr-1 h-8 w-8 shrink-0 rounded-md"
                onClick={copyToClipboard}
                disabled={!text}
            >
                <span className="sr-only">{copied ? 'Copied' : 'Copy'}</span>
                <Copy className={cn('h-4 w-4 transition-all duration-300', copied ? 'scale-0' : 'scale-100')} />
                <Check
                    className={cn(
                        'absolute inset-0 m-auto h-4 w-4 transition-all duration-300',
                        copied ? 'scale-100' : 'scale-0'
                    )}
                />
            </Button>
        </div>
    )
}

export const Tip = ({ children, className, emojiIndex = 0 }: TProps) => {
    const [copied, setCopied] = useState(false)
    const text = typeof children === 'string' ? children : ''

    const copyToClipboard = () => {
        if (text) {
            navigator.clipboard.writeText(text)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        }
    }

    return (
        <div
            className={cn(
                'relative flex items-center w-full max-w-3xl',
                'rounded-lg border border-border',
                'bg-green-50/50 backdrop-blur-sm dark:bg-green-950/10',
                className
            )}
        >
            <div className="min-w-0 flex-1 p-3">
                <div className="flex items-center gap-2">
                    <span className="flex-shrink-0">{getEmoji('tip', emojiIndex)}</span>
                    <span className="flex-1 truncate text-sm text-green-700 dark:text-green-300">{children}</span>
                </div>
            </div>
            <Button
                variant="ghost"
                size="icon"
                className="relative mr-1 h-8 w-8 shrink-0 rounded-md text-green-700 dark:text-green-300 hover:bg-green-100 dark:hover:bg-green-900/20"
                onClick={copyToClipboard}
                disabled={!text}
            >
                <span className="sr-only">{copied ? 'Copied' : 'Copy'}</span>
                <Copy className={cn('h-4 w-4 transition-all duration-300', copied ? 'scale-0' : 'scale-100')} />
                <Check
                    className={cn(
                        'absolute inset-0 m-auto h-4 w-4 transition-all duration-300',
                        copied ? 'scale-100' : 'scale-0'
                    )}
                />
            </Button>
        </div>
    )
}

export const Warning = ({ children, className, emojiIndex = 0 }: TProps) => {
    const [copied, setCopied] = useState(false)
    const text = typeof children === 'string' ? children : ''

    const copyToClipboard = () => {
        if (text) {
            navigator.clipboard.writeText(text)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        }
    }

    return (
        <div
            className={cn(
                'relative flex items-center w-full max-w-3xl',
                'rounded-lg border border-border',
                'bg-amber-50/50 backdrop-blur-sm dark:bg-amber-950/10',
                className
            )}
        >
            <div className="min-w-0 flex-1 p-3">
                <div className="flex items-center gap-2">
                    <span className="flex-shrink-0">{getEmoji('warning', emojiIndex)}</span>
                    <span className="flex-1 truncate text-sm font-medium text-amber-700 dark:text-amber-300">
                        {children}
                    </span>
                </div>
            </div>
            <Button
                variant="ghost"
                size="icon"
                className="relative mr-1 h-8 w-8 shrink-0 rounded-md text-amber-700 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-900/20"
                onClick={copyToClipboard}
                disabled={!text}
            >
                <span className="sr-only">{copied ? 'Copied' : 'Copy'}</span>
                <Copy className={cn('h-4 w-4 transition-all duration-300', copied ? 'scale-0' : 'scale-100')} />
                <Check
                    className={cn(
                        'absolute inset-0 m-auto h-4 w-4 transition-all duration-300',
                        copied ? 'scale-100' : 'scale-0'
                    )}
                />
            </Button>
        </div>
    )
}

export const Important = ({ children, className, emojiIndex = 0 }: TProps) => {
    const [copied, setCopied] = useState(false)
    const text = typeof children === 'string' ? children : ''

    const copyToClipboard = () => {
        if (text) {
            navigator.clipboard.writeText(text)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        }
    }

    return (
        <div
            className={cn(
                'relative flex items-center w-full max-w-3xl',
                'rounded-lg border border-border',
                'bg-red-50/50 backdrop-blur-sm dark:bg-red-950/10',
                className
            )}
        >
            <div className="min-w-0 flex-1 p-3">
                <div className="flex items-center gap-2">
                    <span className="flex-shrink-0">{getEmoji('important', emojiIndex)}</span>
                    <span className="flex-1 truncate text-sm font-semibold text-red-700 dark:text-red-300">
                        {children}
                    </span>
                </div>
            </div>
            <Button
                variant="ghost"
                size="icon"
                className="relative mr-1 h-8 w-8 shrink-0 rounded-md text-red-700 dark:text-red-300 hover:bg-red-100 dark:hover:bg-red-900/20"
                onClick={copyToClipboard}
                disabled={!text}
            >
                <span className="sr-only">{copied ? 'Copied' : 'Copy'}</span>
                <Copy className={cn('h-4 w-4 transition-all duration-300', copied ? 'scale-0' : 'scale-100')} />
                <Check
                    className={cn(
                        'absolute inset-0 m-auto h-4 w-4 transition-all duration-300',
                        copied ? 'scale-100' : 'scale-0'
                    )}
                />
            </Button>
        </div>
    )
}

export const Example = ({ children, className, emojiIndex = 0 }: TProps) => {
    const [copied, setCopied] = useState(false)
    const text = typeof children === 'string' ? children : ''

    const copyToClipboard = () => {
        if (text) {
            navigator.clipboard.writeText(text)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        }
    }

    return (
        <div
            className={cn(
                'relative flex items-center w-full max-w-3xl',
                'rounded-lg border border-border',
                'bg-purple-50/50 backdrop-blur-sm dark:bg-purple-950/10',
                className
            )}
        >
            <div className="min-w-0 flex-1 p-3">
                <div className="flex items-center gap-2">
                    <span className="flex-shrink-0">{getEmoji('example', emojiIndex)}</span>
                    <span className="flex-1 truncate text-sm text-purple-700 dark:text-purple-300">{children}</span>
                </div>
            </div>
            <Button
                variant="ghost"
                size="icon"
                className="relative mr-1 h-8 w-8 shrink-0 rounded-md text-purple-700 dark:text-purple-300 hover:bg-purple-100 dark:hover:bg-purple-900/20"
                onClick={copyToClipboard}
                disabled={!text}
            >
                <span className="sr-only">{copied ? 'Copied' : 'Copy'}</span>
                <Copy className={cn('h-4 w-4 transition-all duration-300', copied ? 'scale-0' : 'scale-100')} />
                <Check
                    className={cn(
                        'absolute inset-0 m-auto h-4 w-4 transition-all duration-300',
                        copied ? 'scale-100' : 'scale-0'
                    )}
                />
            </Button>
        </div>
    )
}

export const Frontend = ({ children, className, emojiIndex = 0 }: TProps) => (
    <WithEmoji emojiCategory="frontend" emojiIndex={emojiIndex} className={cn('text-indigo-600', className)}>
        {children}
    </WithEmoji>
)

export const Backend = ({ children, className, emojiIndex = 0 }: TProps) => (
    <WithEmoji emojiCategory="backend" emojiIndex={emojiIndex} className={cn('text-emerald-600', className)}>
        {children}
    </WithEmoji>
)

export const Database = ({ children, className, emojiIndex = 0 }: TProps) => (
    <WithEmoji emojiCategory="database" emojiIndex={emojiIndex} className={cn('text-cyan-600', className)}>
        {children}
    </WithEmoji>
)

// Composite components
export const PulseBold = ({ children, className }: TProps) => (
    <Pulse>
        <B className={className}>{children}</B>
    </Pulse>
)

export const EmojiItalic = ({ children, className, emojiCategory = 'code', emojiIndex = 0 }: TProps) => (
    <WithEmoji emojiCategory={emojiCategory} emojiIndex={emojiIndex}>
        <I className={className}>{children}</I>
    </WithEmoji>
)

/**
 * Demo component for documentation
 */
export const TextWrappersDemo = () => (
    <div className="space-y-6 p-4 bg-gray-50 rounded-lg">
        <h2 className="text-xl font-bold mb-4">Text Formatting Components</h2>

        <section className="space-y-2">
            <h3 className="font-medium text-gray-700">Basic Formatting</h3>
            <p>
                <I>Italic text</I> - Use for emphasis
            </p>
            <p>
                <U>Underlined text</U> - Use for links or highlighting
            </p>
            <p>
                <B>Bold text</B> - Use for important terms
            </p>
        </section>

        <section className="space-y-2">
            <h3 className="font-medium text-gray-700">Animations</h3>
            <p>
                <Pulse>Pulsing text</Pulse> - Draws attention with subtle animation
            </p>
            <p>
                <Ping>Pinging text</Ping> - Creates a more pronounced effect
            </p>
        </section>

        <section className="space-y-2">
            <h3 className="font-medium text-gray-700">Emoji Components</h3>
            <p>
                <WithEmoji>Navigation emojis (default)</WithEmoji>
            </p>
            <p>
                <WithEmoji emojiCategory="frontend">Frontend development</WithEmoji>
            </p>
            <p>
                <WithEmoji emojiCategory="backend">Backend development</WithEmoji>
            </p>
            <p>
                <WithEmoji emojiCategory="database">Database concepts</WithEmoji>
            </p>
        </section>

        <section className="space-y-2">
            <h3 className="font-medium text-gray-700">Documentation Elements</h3>
            <p>
                <CodeNote>Code notes stand out with code-related emojis</CodeNote>
            </p>
            <p>
                <Tip>Tips help guide users with lightbulb emojis</Tip>
            </p>
            <p>
                <Warning>Warnings alert users to potential issues</Warning>
            </p>
            <p>
                <Important>Important information gets extra emphasis</Important>
            </p>
            <p>
                <Example>Examples help illustrate concepts</Example>
            </p>
        </section>

        <section className="space-y-2">
            <h3 className="font-medium text-gray-700">Composite Components</h3>
            <p>
                <PulseBold>Bold and pulsing for extreme emphasis</PulseBold>
            </p>
            <p>
                <EmojiItalic>Italic text with relevant code emojis</EmojiItalic>
            </p>
            <p>
                <EmojiBeforeAfter>Animated emojis that move outward on hover</EmojiBeforeAfter>
            </p>
        </section>
    </div>
)

export const DemoSection = ({ title, children, className }: TProps) => {
    return (
        <section className={className}>
            <div className="font-medium text-gray-700 dark:text-gray-300 ">
                <OptimizedTextAnimate animation="blurInUp" fontSize="xl" fontWeight="medium">
                    {title}{' '}
                </OptimizedTextAnimate>
            </div>
            <div className="space-y-2">{children}</div>
            <hr className="w-full " />
        </section>
    )
}
