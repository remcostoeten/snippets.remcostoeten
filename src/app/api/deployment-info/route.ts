import { NextResponse } from 'next/server'
import { exec } from 'child_process'
import { promisify } from 'util'

const execAsync = promisify(exec)

export async function GET() {
    try {
        // Get latest commit info
        const { stdout: commitInfo } = await execAsync('git log -1 --pretty=format:"%H|%ct|%s"')
        const [hash, timestamp, message] = commitInfo.split('|')

        // Get total commit count
        const { stdout: commitCount } = await execAsync('git rev-list --count HEAD')

        // Get deployment info from Vercel environment variables
        const deploymentId = process.env.VERCEL_DEPLOYMENT_ID
        const deploymentTime = process.env.VERCEL_DEPLOYMENT_COMPLETED_AT

        return NextResponse.json({
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
        })
    } catch (error) {
        console.error('Error fetching deployment info:', error)
        return NextResponse.json({ error: 'Failed to fetch deployment information' }, { status: 500 })
    }
}
