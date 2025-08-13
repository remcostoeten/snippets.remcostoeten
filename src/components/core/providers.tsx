import { ThemeProvider } from "next-themes";
import { RootProvider } from 'fumadocs-ui/provider';
import { TooltipProvider } from '../ui';

type TProps = {
    children: React.ReactNode;
}

export function Providers({ children }: TProps) {
    return (
        <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
            forcedTheme="dark"
        >
            <TooltipProvider>
                <RootProvider>{children}</RootProvider>
            </TooltipProvider>
        </ThemeProvider>
    );
}
