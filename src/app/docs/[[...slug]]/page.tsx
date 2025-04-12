import { source } from "@/lib/source";
import {
  DocsPage,
  DocsBody,
  DocsTitle,
  DocsDescription,
} from "fumadocs-ui/page";
import { notFound } from "next/navigation";
import { getMDXComponents } from "@/mdx-components";
import { Card, Cards } from "fumadocs-ui/components/card";
import Link from "next/link";
import { CardSpotlight } from "@/components/ui/effects/card-spotlight/card-spotlight-demo";

export default async function Page(props: {
  params: Promise<{ slug?: string[] }>;
}) {
  const params = await props.params;

  // If no slug is provided, show the index page
  if (!params.slug) {
    const categories = (source.pageTree.children || [])
      .filter((node) => node.type === "folder")
      .map((node) => ({
        name: node.name,
        description: "description" in node ? node.description : undefined,
      }));

    return (
      <DocsPage>
        <DocsTitle>Documentation</DocsTitle>
        <DocsDescription>
          Browse through our collection of code snippets, guides, and
          documentation.
        </DocsDescription>
        <DocsBody>
          <div className="grid gap-4">
            {categories.map((category) => (
              <Link key={String(category.name)} href={`/docs/${category.name}`}>
                <CardSpotlight
                  className="p-6 bg-zinc-900/50"
                  radius={600}
                  color="rgba(59, 130, 246, 0.05)"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-grow">
                      <h3 className="text-lg font-medium text-zinc-100 group-hover:text-zinc-300">
                        {category.name}
                      </h3>
                      <p className="mt-1 text-sm text-zinc-400">
                        {category.description ||
                          `Explore ${category.name} documentation`}
                      </p>
                    </div>
                  </div>
                </CardSpotlight>
              </Link>
            ))}
          </div>
        </DocsBody>
      </DocsPage>
    );
  }

  // Handle specific doc pages
  const page = source.getPage(params.slug);
  if (!page) notFound();

  const MDX = page.data.body;

  return (
    <DocsPage toc={page.data.toc} full={page.data.full}>
      <DocsTitle>{page.data.title}</DocsTitle>
      <DocsDescription>{page.data.description}</DocsDescription>
      <DocsBody>
        <MDX components={getMDXComponents()} />
      </DocsBody>
    </DocsPage>
  );
}
