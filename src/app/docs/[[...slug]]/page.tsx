import { source } from '@/lib/source'
import { getMDXComponents } from '@/mdx-components'
import {
	DocsBody,
	DocsDescription,
	DocsPage,
	DocsTitle
} from 'fumadocs-ui/page'
import { notFound } from 'next/navigation'

export default async function Page(props: {
	params: Promise<{ slug?: string[] }>
}) {
	const params = await props.params
	const page = source.getPage(params.slug) || ([] as any)
	if (!page) notFound()

	const MDX = page.data.body

	return (
		<DocsPage toc={page.data.toc} full={page.data.full}>
			<DocsTitle>{page.data.title}</DocsTitle>
			<DocsDescription>{page.data.description}</DocsDescription>
			<DocsBody>
				<MDX components={getMDXComponents()} />
			</DocsBody>
		</DocsPage>
	)
}
