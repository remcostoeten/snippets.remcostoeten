import { exec } from 'child_process'
import { promisify } from 'util'

const execAsync = promisify(exec)

async function getDeploymentInfo() {
    try {
        // Get latest commit info
        const { stdout: commitInfo } = await execAsync('git log -1 --pretty=format:"%H|%ct|%s"')
        const [hash, timestamp, message] = commitInfo.split('|')

        // Get total commit count
        const { stdout: commitCount } = await execAsync('git rev-list --count HEAD')

        // Get deployment info from Vercel environment variables
        const deploymentId = process.env.VERCEL_DEPLOYMENT_ID
        const deploymentTime = process.env.VERCEL_DEPLOYMENT_COMPLETED_AT

        return {
            commit: {
                hash,
                timestamp: parseInt(timestamp),
                message,
                count: parseInt(commitCount)
            },
            deployment: {
                id: deploymentId,
                timestamp: deploymentTime ? new Date(deploymentTime).getTime() : null
            }
        }
    } catch (error) {
        console.error('Error fetching deployment info:', error)
        return null
    }
}

function formatTimeAgo(timestamp: number) {
    const seconds = Math.floor((Date.now() - timestamp) / 1000)

    if (seconds < 60) return `${seconds} seconds ago`
    if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`
    return `${Math.floor(seconds / 86400)} days ago`
}

export async function DeploymentInfo() {
    const info = await getDeploymentInfo()

    if (!info) {
        return null
    }

    return (
        <div className="text-sm text-gray-500">
            <p>
                Last commit: {formatTimeAgo(info.commit.timestamp * 1000)} ({info.commit.count} commits)
            </p>
            {info.deployment.timestamp && <p>Last deployment: {formatTimeAgo(info.deployment.timestamp)}</p>}
        </div>
    )
}
