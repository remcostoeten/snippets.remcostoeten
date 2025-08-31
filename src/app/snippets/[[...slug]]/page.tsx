import { source } from "@/lib/source";
import {
  DocsPage,
  DocsBody,
  DocsTitle,
  DocsDescription,
} from "fumadocs-ui/page";
import { notFound } from "next/navigation";
import { getMDXComponents } from "@/mdx-components";
import { CopyLLMVersion } from "@/components/core/copy-llm-version";

export default async function Page(props: {
  params: Promise<{ slug?: string[] }>;
}) {
  const params = await props.params;
  const page = source.getPage(params.slug);
  
  if (!page) notFound();

  const MDX = page.data.body;
  
  // Construct the MDX file path
  const mdxPath = `content/docs/${params.slug?.join('/') || 'index'}.mdx`;

  return (
    <DocsPage toc={page.data.toc} full={page.data.full}>
      <DocsTitle>{page.data.title}</DocsTitle>
      <DocsDescription>{page.data.description}</DocsDescription>
      <DocsBody>
        <div className="mb-6">
          <CopyLLMVersion mdxPath={mdxPath} />
        </div>
        <MDX components={getMDXComponents()} />
      </DocsBody>
    </DocsPage>
  );
}
