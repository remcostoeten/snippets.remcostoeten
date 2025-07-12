'use client'
import {
	Database,
	FileCode,
	GitBranch,
	Settings,
	Terminal,
	Zap
} from 'lucide-react'
import { FeatureCard } from './feature-card'
import { AnimatedContainer } from './animated-container'

const features = [
	{
		title: 'macOS Power-User Setup',
		icon: Terminal,
		description:
			'Scripts and configurations to enhance your macOS development environment.'
	},
	{
		title: 'Database Best Practices',
		icon: Database,
		description:
			'Guides on environment validation and scalable schema design with Drizzle ORM.'
	},
	{
		title: 'Dotfiles & Dev Scripts',
		icon: FileCode,
		description:
			'Optimize your workflow with configurations for Neovim, custom shell prompts, and useful scripts.'
	},
	{
		title: 'Git Recipes',
		icon: GitBranch,
		description:
			'Practical solutions for common Git problems, like handling diverged branches.'
	},
	{
		title: 'Frontend Snippets',
		icon: Zap,
		description:
			'Code for Next.js suspense, Electron APIs, and browser-based hardware testers.'
	},
	{
		title: 'System Configurations',
		icon: Settings,
		description:
			'Tips for system-level tweaks, like running sudo commands without a password prompt.'
	}
]

export function FeatureSection() {
	return (
		<section>
			<div className='mx-auto w-full max-w-5xl space-y-8 px-4'>
				<AnimatedContainer className='mx-auto max-w-3xl text-center'>
					<p className='text-muted-foreground mt-4 text-sm tracking-wide text-balance md:text-base'>
						Practical guides and code snippets for everyday
						development challenges.
					</p>
				</AnimatedContainer>

				<AnimatedContainer
					delay={0.4}
					className='grid grid-cols-1 divide-x divide-y divide-dashed border border-dashed sm:grid-cols-2 md:grid-cols-3'
				>
					{features.map((feature, i) => (
						<FeatureCard key={i} feature={feature} />
					))}
				</AnimatedContainer>
			</div>
		</section>
	)
}
