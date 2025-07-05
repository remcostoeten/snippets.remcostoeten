import { PostMetadata } from '@/components/ui/post-metadata'
import { Tab, Tabs } from 'fumadocs-ui/components/tabs'
import defaultMdxComponents from 'fumadocs-ui/mdx'
import matter from 'gray-matter'
import type { MDXComponents } from 'mdx/types'

export function getMDXComponents(components?: MDXComponents): MDXComponents {
    return {
        ...defaultMdxComponents,
        ...components,
        Tab,
        Tabs,
        wrapper: ({ children }) => {
            const content = children?.toString() || ''
            const { data: frontmatter, content: mdxContent } = matter(content)

            const wordCount = mdxContent.trim().split(/\s+/).length
            const readingTime = Math.ceil(wordCount / 200)
            return (
                <div>
                    <PostMetadata date={frontmatter.lastModified || new Date().toISOString()} />
                    {children}
                </div>
            )
        }
    }
}
