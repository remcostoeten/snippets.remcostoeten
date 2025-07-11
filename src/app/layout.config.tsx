import { Logo } from '@/components/logo'
import { CodeThemeSwitch } from '@/components/ui/code-theme-switch'
import { siteConfig } from '@/core/site-config'
import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared'

/**
 * Shared layout configurations
 *
 * you can customise layouts individually from:
 * Home Layout: app/(home)/layout.tsx
 * Docs Layout: app/docs/layout.tsx
 */
export const baseOptions: BaseLayoutProps = {
	nav: {
		title: (
			<>
				<Logo />
				{siteConfig.name}
			</>
		)
	},
	themeSwitch: {
		enabled: true,
		component: (
			<>
				<CodeThemeSwitch />
			</>
		)
	},
	links: [
		{
			text: 'Snippets',
			url: '/docs',
			active: 'nested-url'
		}
	]
}
