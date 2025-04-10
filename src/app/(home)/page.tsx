// import Link from 'next/link'

import { Button, Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, Input } from '@/components/ui'
import { Bookmark, Code, ExternalLink, FileCode, Github, Search } from 'lucide-react'
// export default function HomePage() {
//     return (
//         <main className="flex flex-1 flex-col justify-center text-center">
//             <h1 className="mb-4 text-2xl font-bold">Hello World</h1>
//             <p className="text-fd-muted-foreground">
//                 You can open{' '}
//                 <Link href="/docs" className="text-fd-foreground font-semibold underline">
//                     /docs
//                 </Link>{' '}
//                 and see the documentation.
//             </p>
//         </main>
//     )
// }
import Link from 'next/link'

export default function HomePage() {
    return (
        <div className="flex min-h-screen flex-col bg-black text-white">
            {/* Header */}
            <header className="sticky top-0 z-10 border-b border-zinc-800 bg-black/80 backdrop-blur-sm">
                <div className="container flex h-16 items-center justify-between">
                    <div className="flex items-center gap-2">
                        <FileCode className="h-6 w-6 text-purple-500" />
                        <span className="text-lg font-bold">snippets.remcostoeten.com</span>
                    </div>
                    <div className="hidden md:flex items-center space-x-1">
                        <Link href="/docs" className="px-3 py-2 text-sm hover:text-purple-400 transition-colors">
                            Documentation
                        </Link>
                        <Link href="/categories" className="px-3 py-2 text-sm hover:text-purple-400 transition-colors">
                            Categories
                        </Link>
                        <Link href="/recent" className="px-3 py-2 text-sm hover:text-purple-400 transition-colors">
                            Recent
                        </Link>
                    </div>
                    <div className="flex items-center gap-2">
                        <Link
                            href="https://github.com/remcostoeten/docs-remcostoeten"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <Button variant="ghost" size="icon" className="text-zinc-400 hover:text-white">
                                <Github className="h-5 w-5" />
                                <span className="sr-only">GitHub</span>
                            </Button>
                        </Link>
                        <Button variant="ghost" size="icon" className="text-zinc-400 hover:text-white">
                            <Search className="h-5 w-5" />
                            <span className="sr-only">Search</span>
                        </Button>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <section className="container py-20 md:py-32">
                <div className="mx-auto max-w-3xl text-center">
                    <div className="mb-6 inline-block rounded-full bg-purple-500/10 px-3 py-1 text-sm text-purple-500">
                        Personal Code Snippets & Notes
                    </div>
                    <h1 className="mb-6 text-4xl font-bold tracking-tight md:text-6xl">
                        Your <span className="text-purple-500">Code Snippets</span> Library
                    </h1>
                    <p className="mb-8 text-lg text-zinc-400">
                        A collection of reusable code snippets, notes, and documentation for web development. Organized
                        and searchable for quick reference.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link href="/docs">
                            <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                                Browse Documentation
                            </Button>
                        </Link>
                        <div className="relative w-full max-w-sm">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
                            <Input
                                className="w-full bg-zinc-900 border-zinc-800 pl-10 text-white placeholder:text-zinc-500 focus:border-purple-500 focus:ring-purple-500"
                                placeholder="Search snippets..."
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Input Button Card */}
            <section className="container py-12">
                <Card className="bg-zinc-900 border-zinc-800 transition-all duration-300 hover:border-purple-500/50 hover:shadow-xl hover:shadow-purple-500/10">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <span className="inline-block w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
                            Quick Action
                        </CardTitle>
                        <CardDescription className="text-zinc-400">Enter your command or search query</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex gap-2 group">
                            <Input
                                className="flex-1 bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500 transition-all duration-300 
                focus:border-purple-500 focus:ring-purple-500 focus:ring-opacity-50 focus:shadow-[0_0_0_4px_rgba(168,85,247,0.1)]
                group-hover:border-purple-500/30"
                                placeholder="Type your command..."
                            />
                            <Button className="bg-purple-600 hover:bg-purple-700 text-white transition-all duration-300 hover:shadow-lg hover:shadow-purple-600/20 hover:translate-y-[-1px]">
                                Execute
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </section>

            {/* Featured Categories */}
            <section className="container py-12">
                <h2 className="mb-8 text-2xl font-bold">Featured Categories</h2>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {categories.map((category) => (
                        <Link href={category.href} key={category.name} className="group">
                            <Card className="bg-zinc-900 border-zinc-800 transition-all hover:border-purple-500/50 hover:shadow-md hover:shadow-purple-500/10">
                                <CardHeader>
                                    <div className="flex items-center gap-2">
                                        {category.icon}
                                        <CardTitle>{category.name}</CardTitle>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <CardDescription className="text-zinc-400">{category.description}</CardDescription>
                                </CardContent>
                                <CardFooter className="text-sm text-zinc-500">{category.count} snippets</CardFooter>
                            </Card>
                        </Link>
                    ))}
                </div>
            </section>

            {/* Recent Snippets */}
            <section className="container py-12">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-bold">Recent Snippets</h2>
                    <Link href="/recent" className="text-sm text-purple-500 hover:underline">
                        View all
                    </Link>
                </div>
                <div className="grid gap-4">
                    {recentSnippets.map((snippet) => (
                        <Link href={snippet.href} key={snippet.title} className="group">
                            <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-4 transition-all hover:border-purple-500/50 hover:shadow-md hover:shadow-purple-500/10">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <h3 className="font-medium group-hover:text-purple-400">{snippet.title}</h3>
                                        <p className="mt-1 text-sm text-zinc-400">{snippet.description}</p>
                                    </div>
                                    <div className="flex items-center gap-2 text-zinc-500">
                                        <span className="text-xs">{snippet.language}</span>
                                        <div className={`h-2 w-2 rounded-full ${snippet.languageColor}`} />
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>

            {/* Footer */}
            <footer className="mt-auto border-t border-zinc-800 py-6">
                <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
                    <div className="flex items-center gap-2">
                        <FileCode className="h-5 w-5 text-purple-500" />
                        <span className="text-sm font-medium">snippets.remcostoeten.com</span>
                    </div>
                    <p className="text-center text-sm text-zinc-500">
                        © {new Date().getFullYear()} Remco Stoeten. All rights reserved.
                    </p>
                    <div className="flex items-center gap-4">
                        <Link href="https://github.com/remcostoeten" className="text-zinc-400 hover:text-white">
                            <Github className="h-5 w-5" />
                            <span className="sr-only">GitHub</span>
                        </Link>
                        <Link href="https://remcostoeten.com" className="text-zinc-400 hover:text-white">
                            <ExternalLink className="h-5 w-5" />
                            <span className="sr-only">Website</span>
                        </Link>
                    </div>
                </div>
            </footer>
        </div>
    )
}

// Sample data
const categories = [
    {
        name: 'React',
        description: 'Hooks, components, and patterns for React applications',
        count: 24,
        href: '/category/react',
        icon: <Code className="h-5 w-5 text-blue-500" />
    },
    {
        name: 'Next.js',
        description: 'Server components, routing, and data fetching in Next.js',
        count: 18,
        href: '/category/nextjs',
        icon: <Code className="h-5 w-5 text-white" />
    },
    {
        name: 'CSS & Tailwind',
        description: 'Styling solutions, animations, and layout techniques',
        count: 15,
        href: '/category/css',
        icon: <Code className="h-5 w-5 text-sky-500" />
    }
]

const recentSnippets = [
    {
        title: 'useLocalStorage Hook',
        description: 'A custom React hook for persisting state in localStorage with type safety',
        language: 'TypeScript',
        languageColor: 'bg-blue-500',
        href: '/snippet/use-local-storage'
    },
    {
        title: 'Next.js Server Actions Form',
        description: 'Form handling with Server Actions and client-side validation',
        language: 'TypeScript',
        languageColor: 'bg-blue-500',
        href: '/snippet/nextjs-server-actions-form'
    },
    {
        title: 'Tailwind CSS Grid Layout',
        description: 'Responsive grid layout with Tailwind CSS for dashboard interfaces',
        language: 'CSS',
        languageColor: 'bg-sky-500',
        href: '/snippet/tailwind-grid-layout'
    },
    {
        title: 'Framer Motion Page Transitions',
        description: 'Smooth page transitions with Framer Motion in Next.js',
        language: 'TypeScript',
        languageColor: 'bg-blue-500',
        href: '/snippet/framer-motion-transitions'
    }
]
