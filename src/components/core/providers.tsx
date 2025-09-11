import { ThemeProvider } from "next-themes";
import { RootProvider } from 'fumadocs-ui/provider';
import { TooltipProvider } from '../../shared/ui';
import { Analytics } from "@vercel/analytics/next"

type TProps = {
  children: React.ReactNode;
}

export function Providers({ children }: TProps) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem={false}
      disableTransitionOnChange
    >
      <TooltipProvider>
        <RootProvider>{children}
          <Analytics />
        </RootProvider>
      </TooltipProvider>

    </ThemeProvider>

  );
}
