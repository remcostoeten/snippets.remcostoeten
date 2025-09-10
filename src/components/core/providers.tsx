import { ThemeProvider } from "next-themes";
import { RootProvider } from 'fumadocs-ui/provider';
import { TooltipProvider } from '../../shared/ui';

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
        >
            <TooltipProvider>
                <RootProvider>{children}</RootProvider>
            </TooltipProvider>
        </ThemeProvider>
    );
}
