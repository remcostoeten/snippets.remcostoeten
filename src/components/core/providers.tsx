import { RootProvider } from 'fumadocs-ui/provider'
import { ThemeProvider } from 'next-themes'
import type { ReactNode } from 'react'
import { TooltipProvider } from '../ui'

type TProps = {
	children: ReactNode
}

export function Providers({ children }: TProps) {
	return (
		<ThemeProvider
			attribute='class'
			defaultTheme='system'
			enableSystem
			disableTransitionOnChange
		>
			<TooltipProvider>
				<RootProvider>{children}</RootProvider>
			</TooltipProvider>
		</ThemeProvider>
	)
}
