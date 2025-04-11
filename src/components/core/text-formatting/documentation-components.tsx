import { getEmoji } from '@/core/emoji-map'
import { ReactNode } from 'react'

interface DocumentationComponentProps {
    children: ReactNode
}

export const CodeNote = ({ children }: DocumentationComponentProps) => (
    <div className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg">
        <span className="text-lg">{getEmoji('note')}</span>
        <div className="text-sm text-blue-800">{children}</div>
    </div>
)

export const Example = ({ children }: DocumentationComponentProps) => (
    <div className="flex items-start gap-2 p-3 bg-purple-50 rounded-lg">
        <span className="text-lg">{getEmoji('example')}</span>
        <div className="text-sm text-purple-800">{children}</div>
    </div>
)

export const Important = ({ children }: DocumentationComponentProps) => (
    <div className="flex items-start gap-2 p-3 bg-yellow-50 rounded-lg">
        <span className="text-lg">{getEmoji('important')}</span>
        <div className="text-sm text-yellow-800">{children}</div>
    </div>
)

export const Tip = ({ children }: DocumentationComponentProps) => (
    <div className="flex items-start gap-2 p-3 bg-green-50 rounded-lg">
        <span className="text-lg">{getEmoji('tip')}</span>
        <div className="text-sm text-green-800">{children}</div>
    </div>
)

export const Warning = ({ children }: DocumentationComponentProps) => (
    <div className="flex items-start gap-2 p-3 bg-red-50 rounded-lg">
        <span className="text-lg">{getEmoji('warning')}</span>
        <div className="text-sm text-red-800">{children}</div>
    </div>
)
