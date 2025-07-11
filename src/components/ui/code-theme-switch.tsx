'use client'

import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import { Button } from './button'

export function CodeThemeSwitch() {
	const { theme, setTheme } = useTheme()

	function handleToggle() {
		setTheme(theme === 'light' ? 'dark' : 'light')
	}

	return (
		<Button
			variant='ghost'
			size='icon'
			onClick={handleToggle}
			className='h-9 w-9 px-0 rounded-full transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
		>
			<Sun className='h-4 w-4 transition-all rotate-0 scale-100 dark:-rotate-90 dark:scale-0' />
			<Moon className='absolute h-4 w-4 transition-all rotate-90 scale-0 dark:rotate-0 dark:scale-100' />
			<span className='sr-only'>Toggle theme</span>
		</Button>
	)
}
