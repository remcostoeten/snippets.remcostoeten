import { FileCode, GitCommit, Rocket } from "lucide-react";
import { Badge } from "./ui/badge";
import { GradientText } from "./ui/effects/gradient-text";
import { AnimatedNumber } from "./ui/effects/number-flow";
import Link from "next/link";
interface FooterProps {
  stats: {
    totalPosts: number;
    totalCommits: {
      v1: number;
      v2: number;
      total: number;
    };
    totalDeployments: number;
    lastCommit: {
      date: string;
      message: string;
    };
    lastDeployment: {
      date: string;
      status: "success" | "failed" | "pending";
    };
    version: {
      current: string;
      startedAt: string;
      date: string;
    };
  };
}

export function Footer({ stats }: FooterProps) {
  return (
    <footer className="mt-auto border-t border-zinc-800 py-8 bg-zinc-950/50 backdrop-blur-sm">
      <div className="container flex flex-col gap-8 md:gap-4">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Posts Stats */}
          <div className="flex items-center gap-3 p-4 rounded-lg bg-zinc-900/50 border border-zinc-800">
            <FileCode className="w-5 h-5 text-zinc-400" />
            <div>
              <GradientText variant="chromatic" className="text-sm font-medium">
                Total Posts
              </GradientText>
              <p className="text-2xl font-bold text-zinc-100">
                <AnimatedNumber value={stats.totalPosts} />
              </p>
            </div>
          </div>

          {/* Commits Stats */}
          <div className="flex items-center gap-3 p-4 rounded-lg bg-zinc-900/50 border border-zinc-800">
            <GitCommit className="w-5 h-5 text-zinc-400" />
            <div>
              <GradientText variant="chromatic" className="text-sm font-medium">
                Total Commits
              </GradientText>
              <div className="flex items-baseline gap-2">
                <p className="text-2xl font-bold text-zinc-100">
                  <AnimatedNumber value={stats.totalCommits.total} />
                </p>
                <span className="text-xs text-zinc-500">
                  (v1: <AnimatedNumber value={stats.totalCommits.v1} />, v2:{" "}
                  <AnimatedNumber value={stats.totalCommits.v2} />)
                </span>
              </div>
            </div>
          </div>

          {/* Deployments Stats */}
          <div className="flex items-center gap-3 p-4 rounded-lg bg-zinc-900/50 border border-zinc-800">
            <Rocket className="w-5 h-5 text-zinc-400" />
            <div>
              <GradientText variant="chromatic" className="text-sm font-medium">
                Total Deployments
              </GradientText>
              <p className="text-2xl font-bold text-zinc-100">
                <AnimatedNumber value={stats.totalDeployments} />
              </p>
            </div>
          </div>
        </div>

        {/* Latest Activity */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <GitCommit className="w-4 h-4 text-zinc-400" />
            <span className="text-zinc-400">Latest commit:</span>
            <span className="text-zinc-300">{stats.lastCommit.message}</span>
            <Badge className="bg-zinc-800/50 text-zinc-300 border-zinc-700/50">
              {new Date(stats.lastCommit.date).toLocaleDateString()}
            </Badge>
          </div>

          <div className="flex items-center gap-2">
            <Rocket className="w-4 h-4 text-zinc-400" />
            <span className="text-zinc-400">Latest deployment:</span>
            <Badge
              className={`
                ${
                  stats.lastDeployment.status === "success"
                    ? "bg-green-500/10 text-green-500 border-green-500/20"
                    : stats.lastDeployment.status === "failed"
                    ? "bg-red-500/10 text-red-500 border-red-500/20"
                    : "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
                }
              `}
            >
              {stats.lastDeployment.status}
            </Badge>
            <Badge className="bg-zinc-800/50 text-zinc-300 border-zinc-700/50">
              {new Date(stats.lastDeployment.date).toLocaleDateString()}
            </Badge>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm border-t border-zinc-800/50 pt-4">
          <div className="flex items-center gap-2">
            <Badge className="bg-indigo-500/10 text-indigo-500 border-indigo-500/20">
              {stats.version.current}
            </Badge>
            <span className="text-zinc-400">
              Started {new Date(stats.version.date).toLocaleDateString()}
            </span>
          </div>
          <div className="text-center md:text-left text-sm text-zinc-500">
            <p>
              Built by{" "}
              <Link
                href="https://github.com/remcostoeten"
                className="underline"
              >
                Remco Stoeten
              </Link>{" "}
              with a little{" "}
              <span
                className="animate-pulse "
                style={{ transform: "rotate(15deg)" }}
              >
                ❤️
              </span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
