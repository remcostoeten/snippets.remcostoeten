import { Badge } from '@/components/ui/badge'
import { getRecentSnippets } from '@/server/queries/snippets'
import { Book, Calendar, Clock } from 'lucide-react'

type TProps = {
    date: string
}

export async function PostMetadata({ date }: TProps) {
    const { snippets, remainingCount } = await getRecentSnippets()
    const wordCount = snippets[0].metrics.wordCount
    const readingTime = snippets[0].metrics.estimatedReadTime
    return (
        <div className="flex flex-wrap gap-2 mb-6">
            <Badge
                className="
          bg-neutral-100/50 text-neutral-700 border-neutral-200/50 dark:bg-neutral-800/50 dark:text-neutral-300 dark:border-neutral-700/50
          border rounded-full 
          px-3 py-0.5 
          font-medium 
          transition-all duration-300 ease-in-out
          backdrop-blur-sm
          shadow-[0_0_15px_rgba(0,0,0,0.1)]
          hover:scale-105
          hover:shadow-[0_0_20px_rgba(0,0,0,0.15)]
          hover:bg-neutral-200/50 dark:hover:bg-neutral-700/50
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
          bg-neutral-100/50 text-neutral-700 border-neutral-200/50 dark:bg-neutral-800/50 dark:text-neutral-300 dark:border-neutral-700/50
          border rounded-full 
          px-3 py-0.5 
          font-medium 
          transition-all duration-300 ease-in-out
          backdrop-blur-sm
          shadow-[0_0_15px_rgba(0,0,0,0.1)]
          hover:scale-105
          hover:shadow-[0_0_20px_rgba(0,0,0,0.15)]
          hover:bg-neutral-200/50 dark:hover:bg-neutral-700/50
        "
            >
                <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    {readingTime} min read
                </span>
            </Badge>

            <Badge
                className="
          bg-neutral-100/50 text-neutral-700 border-neutral-200/50 dark:bg-neutral-800/50 dark:text-neutral-300 dark:border-neutral-700/50
          border rounded-full 
          px-3 py-0.5 
          font-medium 
          transition-all duration-300 ease-in-out
          backdrop-blur-sm
          shadow-[0_0_15px_rgba(0,0,0,0.1)]
          hover:scale-105
          hover:shadow-[0_0_20px_rgba(0,0,0,0.15)]
          hover:bg-neutral-200/50 dark:hover:bg-neutral-700/50
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
