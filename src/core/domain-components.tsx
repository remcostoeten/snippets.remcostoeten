import { getEmoji } from '@/core/emoji-map'
import { ReactNode } from 'react'

type TProps = {
    children: ReactNode
}

export function Backend({ children }: TProps) {
    return (
        <div className="flex items-center gap-2">
            <span className="text-lg">{getEmoji('backend')}</span>
            <span>{children}</span>
        </div>
    )
}

export function Database({ children }: TProps) {
    return (
        <div className="flex items-center gap-2">
            <span className="text-lg">{getEmoji('database')}</span>
            <span>{children}</span>
        </div>
    )
}

export function Frontend({ children }: TProps) {
    return (
        <div className="flex items-center gap-2">
            <span className="text-lg">{getEmoji('frontend')}</span>
            <span>{children}</span>
        </div>
    )
}
