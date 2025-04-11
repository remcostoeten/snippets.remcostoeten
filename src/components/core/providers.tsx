import { RootProvider } from 'fumadocs-ui/provider'
import { TooltipProvider } from '../ui'

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <TooltipProvider>
            <RootProvider>{children}</RootProvider>
        </TooltipProvider>
    )
}
