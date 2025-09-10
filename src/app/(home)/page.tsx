import { Hero } from "@/components/landing/intro-badge";
import { TextAnimate } from "@/components/ui/effects/blur-in";
import { CardSpotlight } from "@/components/ui/effects/card-spotlight/card-spotlight-demo";
import { ExternalLink, Database, Code } from "lucide-react";
import Link from "next/link";
import { getRecentSnippets } from "@/server/queries/snippets";
import { GradientText } from "@/components/ui/effects/gradient-text";
import { AnimatedNumber } from "@/components/ui/effects/number-flow";
import FeatureCards from "@/components/landing/feature-card-parent";

import {
    Badge,
} from "ui";

function formatDescription(description: string) {
  return description.split(/(`[^`]+`)/).map((part, index) => {
    if (part.startsWith("`") && part.endsWith("`")) {
      return (
        <code
          key={index}
          className="px-1.5 py-0.5 rounded bg-zinc-200 dark:bg-zinc-800 font-mono text-xs text-zinc-800 dark:text-zinc-300"
        >
          {part.slice(1, -1)}
        </code>
      );
    }
    return part;
  });
}
export default async function HomePage() {
  const { snippets, remainingCount } = await getRecentSnippets();
  return (
    <div className="flex flex-col bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
      <main className="flex-1">
        <section className="container py-8">
          <Hero />
        </section>
        <section className="container py-12">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold font-mono">
              <GradientText variant="subtle">Recent Snippets</GradientText>
            </h2>
            <div className="flex items-center gap-4">
              {remainingCount > 0 && (
                <span className="text-sm text-zinc-400">
                  <AnimatedNumber
                    value={remainingCount}
                    suffix=" more snippets"
                  />
                </span>
              )}
              <span className="text-zinc-400">
                /
              </span>
              <Link
                href="/snippets"
                className="text-sm text-zinc-400 hover:text-zinc-300 hover:underline inline-flex items-center gap-1"
              >
                <span>View all</span>
                <ExternalLink className="h-3 w-3" />
              </Link>
            </div>
          </div>
          <div className="grid gap-4">
            {snippets.map((snippet, index) => (
              <div key={`snippet-${index}`}>
                <Link href={snippet.href} className="group">
                  <CardSpotlight
                    className="p-4 bg-zinc-100 dark:bg-zinc-900/50"
                    radius={600}
                    color="rgba(59, 130, 246, 0.05)"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-grow">
                        <div className="flex items-center gap-2">
                          <h3 className="text-base font-medium group-hover:text-zinc-600 dark:group-hover:text-zinc-300">
                            <GradientText
                              variant="subtle"
                              className="bg-gradient-to-r from-zinc-300 via-zinc-400 to-zinc-500"
                            >
                              {snippet.title}
                            </GradientText>
                          </h3>
                          <ExternalLink className="h-3.5 w-3.5 text-zinc-500 opacity-0 transition-opacity group-hover:opacity-100" />
                        </div>
                        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                          {formatDescription(snippet.description)}
                        </p>
                        <div className="mt-2 flex items-center gap-4 text-xs text-zinc-500 dark:text-zinc-500">
                          <span>
                            {new Date(
                              snippet.lastModified
                            ).toLocaleDateString()}
                          </span>
                          <span>•</span>
                          <AnimatedNumber
                            value={snippet.metrics.wordCount}
                            suffix=" words"
                          />
                          <span>•</span>
                          <AnimatedNumber
                            value={snippet.metrics.codeBlocks}
                            suffix=" code blocks"
                          />
                          <span>•</span>
                          <AnimatedNumber
                            value={snippet.metrics.estimatedReadTime}
                            suffix=" min read"
                          />
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge
                          className={`
                            ${snippet.languageColor}
                            inline-flex items-center
                            px-2.5 py-0.5
                            text-xs font-medium
                            rounded-full
                            transition-all duration-300 ease-in-out
                            backdrop-blur-sm
                            shadow-sm
                            hover:shadow-md
                            group-hover:scale-105
                          `}
                        >
                          {snippet.language}
                        </Badge>
                      </div>
                    </div>
                  </CardSpotlight>
                </Link>
              </div>
            ))}
          </div>
          
          {/* Query Builder CTA */}
          <div className="mt-16 mb-8">
            <div className="relative overflow-hidden rounded-2xl bg-zinc-100 dark:bg-zinc-900/50 border border-zinc-300 dark:border-zinc-800">
              <div className="relative z-10 p-8 md:p-12">
                <div className="max-w-4xl mx-auto">
                  {/* Header */}
                  <div className="text-center mb-8">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-200 dark:bg-zinc-800/50 border border-zinc-300 dark:border-zinc-700 mb-4">
                      <div className="w-2 h-2 bg-zinc-600 dark:bg-zinc-400 rounded-full animate-pulse" />
                      <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">New Interactive Tool</span>
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                      <GradientText variant="subtle">
                        CRUD . Query . Build
                      </GradientText>
                    </h2>
                    <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto leading-relaxed">
                      Build and test CRUD operations with our interactive playground. Paste your Drizzle schema, 
                      use the visual builder, and generate production-ready TypeScript code instantly.
                    </p>
                  </div>

                  {/* Features Grid */}
                  <div className="grid md:grid-cols-3 gap-6 mb-8">
                    <div className="flex items-start gap-3 p-4 rounded-xl bg-zinc-200 dark:bg-zinc-800/50 border border-zinc-300 dark:border-zinc-700/50">
                      <div className="w-8 h-8 rounded-lg bg-zinc-300 dark:bg-zinc-700/50 flex items-center justify-center flex-shrink-0">
                        <Database className="w-4 h-4 text-zinc-700 dark:text-zinc-300" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-zinc-800 dark:text-zinc-200 mb-1">Schema Import</h3>
                        <p className="text-sm text-zinc-600 dark:text-zinc-400">Paste your Drizzle schema and get instant table visualization</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-4 rounded-xl bg-zinc-200 dark:bg-zinc-800/50 border border-zinc-300 dark:border-zinc-700/50">
                      <div className="w-8 h-8 rounded-lg bg-zinc-300 dark:bg-zinc-700/50 flex items-center justify-center flex-shrink-0">
                        <Code className="w-4 h-4 text-zinc-700 dark:text-zinc-300" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-zinc-800 dark:text-zinc-200 mb-1">Visual Builder</h3>
                        <p className="text-sm text-zinc-600 dark:text-zinc-400">Build queries with an intuitive drag-and-drop interface</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-4 rounded-xl bg-zinc-200 dark:bg-zinc-800/50 border border-zinc-300 dark:border-zinc-700/50">
                      <div className="w-8 h-8 rounded-lg bg-zinc-300 dark:bg-zinc-700/50 flex items-center justify-center flex-shrink-0">
                        <ExternalLink className="w-4 h-4 text-zinc-700 dark:text-zinc-300" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-zinc-800 dark:text-zinc-200 mb-1">Code Export</h3>
                        <p className="text-sm text-zinc-600 dark:text-zinc-400">Generate production-ready TypeScript code instantly</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                      href="/query-builder"
                      className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-zinc-600 dark:bg-zinc-800 hover:bg-zinc-700 dark:hover:bg-zinc-700 text-zinc-100 dark:text-zinc-100 rounded-xl font-semibold transition-all duration-300 border border-zinc-500 dark:border-zinc-700 hover:border-zinc-600 dark:hover:border-zinc-600"
                    >
                      <Database className="w-5 h-5 group-hover:scale-110 transition-transform" />
                      Open Query Builder
                    </Link>
                    <Link
                      href="/snippets/databases/drizzle-orm/server-function-abstractions"
                      className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-zinc-200 dark:bg-zinc-800 hover:bg-zinc-300 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white rounded-xl font-semibold transition-all duration-300 border border-zinc-400 dark:border-zinc-700 hover:border-zinc-500 dark:hover:border-zinc-600"
                    >
                      <Code className="w-5 h-5 group-hover:scale-110 transition-transform" />
                      View Documentation
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <FeatureCards/>
        </section>
      </main>
    </div>
  );
}
