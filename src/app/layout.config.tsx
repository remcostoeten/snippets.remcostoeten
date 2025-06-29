import { siteConfig } from '@/core/site-config'
import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared'
import { Logo } from '@/components/logo'
import { CodeThemeSwitch } from '@/components/ui/code-theme-switch'
import { ThemeSwitcher } from '@/components/ui/theme-switcher'

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
