import { Badge } from '@/components/ui/badge'
import { Clock, Calendar, Book } from 'lucide-react'

type TProps = {
    date: string
    readingTime: number
    wordCount: number
}

export function PostMetadata({ date, readingTime, wordCount }: TProps) {
    return (
        <div className="flex flex-wrap gap-2 mb-6">
            <Badge
                className="
          bg-blue-500/10 text-blue-500 border-blue-500/20
          border rounded-full 
          px-3 py-0.5 
          font-medium 
          transition-all duration-300 ease-in-out
          backdrop-blur-sm
          shadow-[0_0_15px_rgba(0,0,0,0.1)]
          hover:scale-105
          hover:shadow-[0_0_20px_rgba(0,0,0,0.15)]
          hover:bg-blue-500/20
        "
            >
                <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    {new Date(date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                    })}
                </span>
            </Badge>

            <Badge
                className="
          bg-purple-500/10 text-purple-500 border-purple-500/20
          border rounded-full 
          px-3 py-0.5 
          font-medium 
          transition-all duration-300 ease-in-out
          backdrop-blur-sm
          shadow-[0_0_15px_rgba(0,0,0,0.1)]
          hover:scale-105
          hover:shadow-[0_0_20px_rgba(0,0,0,0.15)]
          hover:bg-purple-500/20
        "
            >
                <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    {readingTime} min read
                </span>
            </Badge>

            <Badge
                className="
          bg-green-500/10 text-green-500 border-green-500/20
          border rounded-full 
          px-3 py-0.5 
          font-medium 
          transition-all duration-300 ease-in-out
          backdrop-blur-sm
          shadow-[0_0_15px_rgba(0,0,0,0.1)]
          hover:scale-105
          hover:shadow-[0_0_20px_rgba(0,0,0,0.15)]
          hover:bg-green-500/20
        "
            >
                <span className="flex items-center gap-1.5">
                    <Book className="w-3.5 h-3.5" />
                    {wordCount} words
                </span>
            </Badge>
        </div>
    )
}
