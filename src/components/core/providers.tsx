import { ThemeProvider } from "next-themes";
import { type ReactNode } from "react";
import { RootProvider } from 'fumadocs-ui/provider'
import { TooltipProvider } from '../ui'

interface ProvidersProps {
    children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
    return (
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
        >
            <TooltipProvider>
                <RootProvider>{children}</RootProvider>
            </TooltipProvider>
        </ThemeProvider>
    );
}
