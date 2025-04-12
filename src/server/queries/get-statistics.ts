import { exec } from "child_process";
import { promisify } from "util";
import { cache } from "react";

const execAsync = promisify(exec);

// V2 started at this commit
const V2_START_COMMIT = "551cad00fbdc49cf544afb0248109b4bdc990d67";
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

let cachedInfo: any = null;
let lastCacheTime: number = 0;

const getGitInfo = cache(async () => {
  const now = Date.now();

  // Return cached data if it's still fresh
  if (cachedInfo && now - lastCacheTime < CACHE_DURATION) {
    return cachedInfo;
  }

  try {
    // Get total number of commits for v2
    const { stdout: v2CommitCount } = await execAsync(
      `git rev-list --count HEAD ^${V2_START_COMMIT}`
    );

    // Get total number of commits for v1
    const { stdout: v1CommitCount } = await execAsync(
      `git rev-list --count ${V2_START_COMMIT}^`
    );

    // Get latest commit info
    const { stdout: lastCommitInfo } = await execAsync(
      'git log -1 --pretty=format:"%H|%ct|%s"'
    );
    const [hash, timestamp, message] = lastCommitInfo.split("|");

    // Get total number of posts (MDX files)
    const { stdout: postCount } = await execAsync(
      'find content/docs -type f -name "*.mdx" | wc -l'
    );

    // Get deployment info from Vercel environment variables
    const deploymentId = process.env.VERCEL_DEPLOYMENT_ID;
    const deploymentTime = process.env.VERCEL_DEPLOYMENT_COMPLETED_AT;
    const buildTime = process.env.VERCEL_BUILD_COMPLETED_AT;

    // Get total deployments (this is a placeholder as Vercel doesn't expose this directly)
    const totalDeployments =
      process.env.VERCEL_ENV === "production"
        ? parseInt(process.env.VERCEL_DEPLOYMENT_COUNT || "1")
        : 1;

    const info = {
      totalPosts: parseInt(postCount.trim()),
      totalCommits: {
        v1: parseInt(v1CommitCount.trim()),
        v2: parseInt(v2CommitCount.trim()),
        total: parseInt(v1CommitCount.trim()) + parseInt(v2CommitCount.trim()),
      },
      totalDeployments,
      lastCommit: {
        hash,
        date: new Date(parseInt(timestamp) * 1000).toISOString(),
        message,
      },
      lastDeployment: {
        date: deploymentTime || buildTime || new Date().toISOString(),
        status: "success" as const,
      },
      version: {
        current: "v2",
        startedAt: V2_START_COMMIT,
        date: new Date(parseInt(timestamp) * 1000).toISOString(),
      },
    };

    // Update cache
    cachedInfo = info;
    lastCacheTime = now;

    return info;
  } catch (error) {
    console.error("Error fetching git info:", error);
    return {
      totalPosts: 0,
      totalCommits: {
        v1: 0,
        v2: 0,
        total: 0,
      },
      totalDeployments: 0,
      lastCommit: {
        hash: "",
        date: new Date().toISOString(),
        message: "Unable to fetch commit info",
      },
      lastDeployment: {
        date: new Date().toISOString(),
        status: "pending" as const,
      },
      version: {
        current: "v2",
        startedAt: V2_START_COMMIT,
        date: new Date().toISOString(),
      },
    };
  }
});

export const getGitAndDeploymentInfo = getGitInfo;
