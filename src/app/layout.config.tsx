import { siteConfig } from '@/core/site-config'
import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared'
import { ShieldLogo } from '@/components/shield-logo'
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
                <ShieldLogo fill="white" animated animationVariant="scaleUp" />
                {siteConfig.name}
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
