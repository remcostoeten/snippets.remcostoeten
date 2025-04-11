import { Hero } from "@/components/landing/intro-badge";
import { Search } from "@/components/landing/search";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
} from "@/components/ui";
import { ShinyBadge } from "@/components/ui/effects/animated-badge";
import { TextAnimate } from "@/components/ui/effects/blur-in";
import { CardSpotlight } from "@/components/ui/effects/carrd-spotlight-demo";
import { cn } from "@/helpers";
import { motion } from "framer-motion";
import {
  Code,
  FileCode,
  Github,
  Terminal,
  Command,
  ArrowRightIcon,
} from "lucide-react";
import Link from "next/link";

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

const recentSnippets = [
  {
    title: "Sudo Without Password",
    description: "Configure sudo to run without password prompts on macOS",
    href: "/docs/mac-poweruser/sudo-without-password",
    language: "Shell",
    languageColor: "bg-zinc-400",
  },
  {
    title: "VSCode Settings",
    description: "Personal VSCode settings and extensions configuration",
    href: "/docs/dev-setup/vscode-settings",
    language: "JSON",
    languageColor: "bg-zinc-400",
  },
  {
    title: "Terminal Aliases",
    description: "Useful shell aliases for productivity",
    href: "/docs/dev-setup/aliases",
    language: "Shell",
    languageColor: "bg-zinc-400",
  },
];

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-zinc-950 text-zinc-100">
      <section className="container py-20 md:py-32">
        <Hero />
      </section>

      {/* Input Button Card */}
      <section className="container py-12">
        <Card className="bg-zinc-900 border-zinc-800 transition-all duration-300 hover:border-purple-500/50 hover:shadow-xl hover:shadow-purple-500/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
              <TextAnimate as="span" animation="fadeIn">
                Quick Action
              </TextAnimate>
            </CardTitle>
            <CardDescription className="text-zinc-400">
              <TextAnimate as="span" animation="fadeIn" delay={0.1}>
                Enter your command or search query
              </TextAnimate>
            </CardDescription>
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
          <Link
            href="/recent"
            className="text-sm text-zinc-400 hover:text-zinc-300 hover:underline"
          >
            <TextAnimate as="span" animation="fadeIn">
              View all
            </TextAnimate>
          </Link>
        </div>
        <div className="grid gap-4">
          {recentSnippets.map((snippet, index) => (
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
    </div>
  );
}
