import { Hero } from "@/components/landing/intro-badge";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
} from "@/components/ui";
import { TextAnimate } from "@/components/ui/effects/blur-in";
import { CardSpotlight } from "@/components/ui/effects/card-spotlight/card-spotlight";
import { Code, FileCode, Github, Terminal, Command } from "lucide-react";
import Link from "next/link";
import { getRecentSnippets } from "@/lib/actions/snippets";

const categories = [
  {
    name: "Mac Power User",
    description:
      "Advanced macOS configurations, shortcuts, and productivity hacks",
    href: "/docs/mac-poweruser",
    icon: <Command className="h-5 w-5 text-zinc-400" />,
    count: 5,
  },
  {
    name: "Development Setup",
    description: "IDE configurations, terminal setups, and development tools",
    href: "/docs/dev-setup",
    icon: <Terminal className="h-5 w-5 text-zinc-400" />,
    count: 8,
  },
  {
    name: "Code Snippets",
    description: "Reusable code snippets for various programming languages",
    href: "/docs/snippets",
    icon: <Code className="h-5 w-5 text-zinc-400" />,
    count: 12,
  },
];

function Todo() {
  return (
    <ul>
      <li>Make quick actions do something</li>
      <li>Make the card spotlight allow the text to be readable</li>
      <li>
        Make featured categorries actually show the snippets and dynamically
        update
      </li>
      <li>Create snippets index.mdx</li>
      <li>Make "nothing really to see here" gradient</li>
      <li>
        Make rrecent snippets actually show the snippets and dynamically update
      </li>
      <li>Add feedback sqlite drizzle</li>
      <li>Add custom analytics</li>
    </ul>
  );
}

export default async function HomePage() {
  const { snippets, remainingCount } = await getRecentSnippets();

  return (
    <div className="flex min-h-screen flex-col bg-zinc-950 text-zinc-100">
      <Todo />
      <main className="flex-1">
        <section className="container py-20 md:py-32">
          <Hero />
        </section>

        {/* Featured Categories */}
        <section className="container py-12">
          <TextAnimate
            as="h2"
            className="mb-8"
            fontSize="2xl"
            fontWeight="bold"
            animation="blurInUp"
          >
            Featured Categories
          </TextAnimate>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {categories.map((category, index) => (
              <Link href={category.href} key={category.name} className="group">
                <CardSpotlight className="h-full bg-zinc-900 border-zinc-800">
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-4">
                      {category.icon}
                      <h3 className="text-lg font-medium text-white">
                        <TextAnimate
                          as="span"
                          animation="blurInUp"
                          delay={0.1 * index}
                        >
                          {category.name}
                        </TextAnimate>
                      </h3>
                    </div>
                    <div className="mb-4">
                      <p className="text-zinc-400">
                        <TextAnimate
                          as="span"
                          animation="fadeIn"
                          delay={0.2 * index}
                        >
                          {category.description}
                        </TextAnimate>
                      </p>
                    </div>
                    <div className="text-sm text-zinc-500">
                      <TextAnimate
                        as="span"
                        animation="fadeIn"
                        delay={0.3 * index}
                      >
                        {category.count} snippets
                      </TextAnimate>
                    </div>
                  </div>
                </CardSpotlight>
              </Link>
            ))}
          </div>
        </section>

        {/* Recent Snippets */}
        <section className="container py-12">
          <div className="flex items-center justify-between mb-8">
            <TextAnimate
              as="h2"
              fontSize="2xl"
              fontWeight="bold"
              animation="blurInUp"
            >
              Recent Snippets
            </TextAnimate>
            <div className="flex items-center gap-4">
              {remainingCount > 0 && (
                <TextAnimate
                  as="span"
                  animation="fadeIn"
                  className="text-sm text-zinc-400"
                >
                  {remainingCount} more snippets
                </TextAnimate>
              )}
              <Link
                href="/docs"
                className="text-sm text-zinc-400 hover:text-zinc-300 hover:underline"
              >
                <TextAnimate as="span" animation="fadeIn">
                  View all
                </TextAnimate>
              </Link>
            </div>
          </div>
          <div className="grid gap-4">
            {snippets.map((snippet, index) => (
              <Link href={snippet.href} key={snippet.title} className="group">
                <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-4 transition-all hover:border-zinc-600 hover:shadow-md hover:shadow-zinc-900/20">
                  <div className="flex items-start justify-between">
                    <div>
                      <TextAnimate
                        as="h3"
                        fontSize="base"
                        fontWeight="medium"
                        animation="blurInUp"
                        delay={0.1 * index}
                        className="group-hover:text-zinc-300"
                      >
                        {snippet.title}
                      </TextAnimate>
                      <TextAnimate
                        as="p"
                        fontSize="sm"
                        textColor="zinc-400"
                        animation="fadeIn"
                        delay={0.2 * index}
                        className="mt-1"
                      >
                        {snippet.description}
                      </TextAnimate>
                    </div>
                    <div className="flex items-center gap-2 text-zinc-500">
                      <span className="text-xs">{snippet.language}</span>
                      <div
                        className={`h-2 w-2 rounded-full ${snippet.languageColor}`}
                      />
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
              <FileCode className="h-5 w-5 text-zinc-400" />
              <TextAnimate
                as="span"
                fontSize="sm"
                fontWeight="medium"
                animation="fadeIn"
              >
                snippets.remcostoeten.com
              </TextAnimate>
            </div>
            <TextAnimate
              as="p"
              fontSize="sm"
              textColor="zinc-500"
              animation="fadeIn"
              className="text-center"
            >
              © {new Date().getFullYear()} Remco Stoeten. All rights reserved.
            </TextAnimate>
            <div className="flex items-center gap-4">
              <Link
                href="https://github.com/remcostoeten"
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-400 hover:text-zinc-300"
              >
                <Github className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
