import { baseOptions } from '@/app/layout.config'
import { HomeLayout } from 'fumadocs-ui/layouts/home'
import type { ReactNode } from 'react'

export default function Layout({ children }: { children: ReactNode }) {
    return (
        <div className="mt-6">
            <HomeLayout {...baseOptions}>{children}</HomeLayout>
        </div>
    )
}
