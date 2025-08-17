import { Hero } from "@/components/landing/intro-badge";
import { Badge } from "@/shared/ui/badge";
import { TextAnimate } from "@/components/ui/effects/blur-in";
import { CardSpotlight } from "@/components/ui/effects/card-spotlight/card-spotlight-demo";
import { ExternalLink } from "lucide-react";
import Link from "next/link";
import { getRecentSnippets } from "@/server/queries/snippets";
import { GradientText } from "@/components/ui/effects/gradient-text";
import { AnimatedNumber } from "@/components/ui/effects/number-flow";
import FeatureCards from "@/components/landing/feature-card-parent";

function formatDescription(description: string) {
  return description.split(/(`[^`]+`)/).map((part, index) => {
    if (part.startsWith("`") && part.endsWith("`")) {
      return (
        <code
          key={index}
          className="px-1.5 py-0.5 rounded bg-zinc-800 font-mono text-xs text-zinc-300"
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
    <div className="flex  flex-col bg-zinc-950 text-zinc-100">
 
      <main className="flex-1">
        <section className="container py-20 md:py-32">
          <Hero />
        </section>

        <section className="container py-12">
          <div className="flex items-center justify-between mb-8">
            <TextAnimate
              as="h2"
              fontSize="2xl"
              fontWeight="bold"
              animation="blurInUp"
              className="font-mono"
              delay={0.6}
            >
              <GradientText variant="subtle">Recent Snippets</GradientText>
              </TextAnimate>
            <div className="flex items-center gap-4">
              {remainingCount > 0 && (
                <TextAnimate
                  as="span"
                  animation="fadeIn"
                  delay={0.7}
                  className="text-sm text-zinc-400"
                >
                  <AnimatedNumber
                    value={remainingCount}
                    suffix=" more snippets"
                  />
                </TextAnimate>
              )}
              <TextAnimate
                as="span"
                animation="fadeIn"
                delay={0.8}
                className="text-zinc-400"
              >
                /
              </TextAnimate>
              <Link
                href="/snippets"
                className="text-sm text-zinc-400 hover:text-zinc-300 hover:underline inline-flex items-center gap-1"
              >
                <TextAnimate as="span" animation="fadeIn" delay={0.9}>
                  View all
                </TextAnimate>
                <ExternalLink className="h-3 w-3" />
              </Link>
            </div>
          </div>
          <div className="grid gap-4">
            {snippets.map((snippet, index) => (
              <TextAnimate
                key={snippet.title}
                as="div"
                animation="fadeIn"
                delay={0.6 + 0.1 * index}
              >
                <Link href={snippet.href} className="group">
                  <CardSpotlight
                    className="p-4 bg-zinc-900/50"
                    radius={600}
                    color="rgba(59, 130, 246, 0.05)"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-grow">
                        <div className="flex items-center gap-2">
                          <TextAnimate
                            as="h3"
                            fontSize="base"
                            fontWeight="medium"
                            animation="blurInUp"
                            delay={0.6 + 0.1 * index + 0.1}
                            className="group-hover:text-zinc-300"
                          >
                            <GradientText
                              variant="subtle"
                              className="bg-gradient-to-r from-zinc-300 via-zinc-400 to-zinc-500"
                            >
                              {snippet.title}
                            </GradientText>
                          </TextAnimate>
                          <ExternalLink className="h-3.5 w-3.5 text-zinc-500 opacity-0 transition-opacity group-hover:opacity-100" />
                        </div>
                        <TextAnimate
                          as="p"
                          fontSize="sm"
                          textColor="zinc-400"
                          animation="fadeIn"
                          delay={0.6 + 0.1 * index + 0.2}
                          className="mt-1"
                        >
                          {formatDescription(snippet.description)}
                        </TextAnimate>
                        <TextAnimate
                          as="div"
                          animation="fadeIn"
                          delay={0.6 + 0.1 * index + 0.3}
                          className="mt-2 flex items-center gap-4 text-xs text-zinc-500"
                        >
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
                        </TextAnimate>
                      </div>
                      <TextAnimate
                        as="div"
                        animation="fadeIn"
                        delay={0.6 + 0.1 * index + 0.4}
                        className="flex items-center gap-2"
                      >
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
                      </TextAnimate>
                    </div>
                  </CardSpotlight>
                </Link>
              </TextAnimate>
            ))}
          </div>
          <FeatureCards/>
        </section>
      </main>
    </div>
  );
}
