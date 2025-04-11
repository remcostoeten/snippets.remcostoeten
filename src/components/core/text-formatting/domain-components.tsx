import { getEmoji } from '@/core/emoji-map'
import { ReactNode } from 'react'

interface DomainComponentProps {
    children: ReactNode
}

export const Backend = ({ children }: DomainComponentProps) => (
    <div className="flex items-center gap-2">
        <span className="text-lg">{getEmoji('backend')}</span>
        <span>{children}</span>
    </div>
)

export const Database = ({ children }: DomainComponentProps) => (
    <div className="flex items-center gap-2">
        <span className="text-lg">{getEmoji('database')}</span>
        <span>{children}</span>
    </div>
)

export const Frontend = ({ children }: DomainComponentProps) => (
    <div className="flex items-center gap-2">
        <span className="text-lg">{getEmoji('frontend')}</span>
        <span>{children}</span>
    </div>
)
