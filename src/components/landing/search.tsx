'use client'
import { useState, useEffect, useRef } from 'react'
import { SearchIcon, FileCode, ChevronRight } from 'lucide-react'
import { useDocsSearch } from 'fumadocs-core/search/client'
import Link from 'next/link'
import { Tooltip, TooltipContent, TooltipTrigger } from '@radix-ui/react-tooltip'

import {
    Input,
} from "ui";

interface SearchResult {
    id: string
    url: string
    content: string
    title?: string
    description?: string
}
interface GroupedResult {
    url: string
    items: SearchResult[]
    primaryItem: SearchResult
}
type TProps = {
    placeholder?: string
    className?: string
    variant?: 'header' | 'main'
}
export function Search({ placeholder = 'Search snippets...', className = '', variant = 'main' }: TProps) {
    const [isOpen, setIsOpen] = useState(false)
    const containerRef = useRef<HTMLDivElement>(null)
    const inputRef = useRef<HTMLInputElement>(null)
    const searchId = useRef<string>(`search-${Math.random().toString(36).substring(2, 9)}`)
    const { search, setSearch, query } = useDocsSearch({
        type: 'fetch',
        api: '/api/search'
    })
    // Group results by URL
    const groupResults = (results: SearchResult[]): GroupedResult[] => {
        const groupedMap = new Map<string, SearchResult[]>()
        results.forEach((result) => {
            // Extract the base path by removing query parameters and anchors
            const basePath = result.url.split('#')[0].split('?')[0]
            // Get the main document path by taking the first two segments
            const mainPath = '/' + basePath.split('/').slice(1, 3).join('/')
            if (!groupedMap.has(mainPath)) {
                groupedMap.set(mainPath, [])
            }
            groupedMap.get(mainPath)?.push(result)
        })
        return Array.from(groupedMap.entries()).map(([url, items]) => ({
            url: items[0].url, // Use the first item's full URL for navigation
            items,
            primaryItem: items[0]
        }))
    }
    useEffect(() => {
        if (typeof document === 'undefined') return
        function handleClickOutside(event: globalThis.MouseEvent) {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [])
    useEffect(() => {
        if (search.trim()) {
            setIsOpen(true)
        } else {
            setIsOpen(false)
        }
    }, [search])
    // Add keyboard shortcut for focusing the search input
    useEffect(() => {
        if (typeof document === 'undefined') return
        function handleKeyDown(event: KeyboardEvent) {
            const activeElement = document.activeElement
            const isInputFocused =
                activeElement instanceof HTMLInputElement || activeElement instanceof HTMLTextAreaElement
            if (event.key === '/' && !isInputFocused) {
                event.preventDefault()
                inputRef.current?.focus()
            }
        }
        document.addEventListener('keydown', handleKeyDown)
        return () => {
            document.removeEventListener('keydown', handleKeyDown)
        }
    }, [])
    // Function to highlight matching text
    const highlightMatch = (text: string, query: string) => {
        if (!query.trim() || !text) return text
        try {
            const regex = new RegExp(`(${query.trim()})`, 'gi')
            return text.replace(regex, '<mark class="bg-purple-500/20 text-purple-200 rounded px-0.5">$1</mark>')
        } catch (e) {
            return text
        }
    }
    // Determine dropdown position based on variant
    const dropdownPosition = variant === 'header' ? 'top-[calc(100%+8px)]' : 'top-full'
    const groupedResults = query.data && query.data !== 'empty' ? groupResults(query.data as SearchResult[]) : []
    return (
        <div className={`relative w-full ${className}`} ref={containerRef}>
            <div className="relative">
                <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
                <Input
                    ref={inputRef}
                    className="w-full bg-zinc-900 border-zinc-800 pl-10 pr-16 text-zinc-100 placeholder:text-zinc-500 focus:border-zinc-700 focus:ring-zinc-700"
                    placeholder={placeholder}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                    <Tooltip>
                        <TooltipTrigger>
                            <kbd className="px-2 py-1 text-xs font-medium text-zinc-400 bg-zinc-800 border border-zinc-700 rounded-md">
                                /
                            </kbd>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>press / to focus search</p>
                        </TooltipContent>
                    </Tooltip>
                </div>
            </div>
            {isOpen && (
                <div
                    className={`absolute ${dropdownPosition} left-0 right-0 z-50 mt-2 max-h-[70vh] overflow-auto rounded-lg border border-zinc-800 bg-zinc-900 shadow-xl shadow-black/20 backdrop-blur-sm`}
                >
                    <div className="sticky top-0 border-b border-zinc-800 bg-zinc-900/95 backdrop-blur-sm px-4 py-2 text-xs font-medium text-zinc-400">
                        {query.isLoading
                            ? 'Searching...'
                            : !groupedResults.length
                              ? 'No results found'
                              : `${groupedResults.length} ${
                                    groupedResults.length === 1 ? 'document' : 'documents'
                                } with matches`}
                    </div>
                    {query.isLoading ? (
                        <div className="flex items-center justify-center p-8">
                            <div className="h-5 w-5 animate-spin rounded-full border-2 border-zinc-400 border-t-transparent"></div>
                        </div>
                    ) : !groupedResults.length ? (
                        <div className="flex flex-col items-center justify-center p-8 text-center">
                            <div className="mb-3 rounded-full bg-zinc-800 p-3">
                                <SearchIcon className="h-6 w-6 text-zinc-400" />
                            </div>
                            <p className="text-zinc-400">No results found for "{search}"</p>
                            <p className="mt-1 text-xs text-zinc-500">Try different keywords or check spelling</p>
                        </div>
                    ) : (
                        <ul className="divide-y divide-zinc-800/70">
                            {groupedResults.map((group) => (
                                <li key={group.url} className="group">
                                    <Link
                                        href={group.url}
                                        className="block p-4 transition-colors hover:bg-zinc-800"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        <div className="flex items-start gap-3">
                                            <div className="mt-0.5 rounded-md bg-zinc-800 p-1.5 text-zinc-400 group-hover:bg-zinc-700 group-hover:text-zinc-300">
                                                <FileCode className="h-4 w-4" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="font-medium text-zinc-200 group-hover:text-white">
                                                    {group.primaryItem.title ? (
                                                        <span
                                                            dangerouslySetInnerHTML={{
                                                                __html: highlightMatch(group.primaryItem.title, search)
                                                            }}
                                                        />
                                                    ) : (
                                                        <span
                                                            dangerouslySetInnerHTML={{
                                                                __html: highlightMatch(
                                                                    group.primaryItem.content,
                                                                    search
                                                                )
                                                            }}
                                                        />
                                                    )}
                                                </div>
                                                {group.primaryItem.description && (
                                                    <div className="mt-1 text-sm text-zinc-400 line-clamp-2 group-hover:text-zinc-300">
                                                        <span
                                                            dangerouslySetInnerHTML={{
                                                                __html: highlightMatch(
                                                                    group.primaryItem.description,
                                                                    search
                                                                )
                                                            }}
                                                        />
                                                    </div>
                                                )}
                                                <div className="mt-1.5 flex items-center justify-between">
                                                    <span className="text-xs text-zinc-500 truncate">
                                                        {group.url.split('/').slice(0, 3).join('/')}
                                                    </span>
                                                    {group.items.length > 1 && (
                                                        <span className="text-xs text-zinc-400 flex items-center gap-1">
                                                            {group.items.length - 1} more{' '}
                                                            {group.items.length - 1 === 1 ? 'match' : 'matches'}
                                                            <ChevronRight className="h-3 w-3" />
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            )}
        </div>
    )
}
