import { getRecentSnippets } from '@/server/queries/snippets'
import { SnippetPreviewCard } from './snippet-preview-card'
import { AnimatedContainer } from './animated-container'

export async function SnippetPreviewSection() {
	const { topSnippets } = await getRecentSnippets()

	return (
		<section>
			<div className='mx-auto w-full max-w-5xl space-y-8 px-4'>
				<AnimatedContainer className='mx-auto max-w-3xl text-center'>
					<h2 className='text-2xl font-bold mb-4'>Recent Snippets</h2>
					<p className='text-muted-foreground mt-4 text-sm tracking-wide text-balance md:text-base'>
						Browse the most recently updated code snippets and guides.
					</p>
				</AnimatedContainer>

				<AnimatedContainer
					delay={0.4}
					className='grid grid-cols-1 divide-x divide-y divide-dashed border border-dashed sm:grid-cols-2 md:grid-cols-3'
				>
					{topSnippets.map((snippet, i) => (
						<SnippetPreviewCard key={i} snippet={snippet} />
					))}
				</AnimatedContainer>
			</div>
		</section>
	)
}
