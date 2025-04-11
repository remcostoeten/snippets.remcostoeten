// Predefined color schemes for the CardSpotlight component
// Each scheme contains two colors for the gradient effect

export type ColorScheme = {
    name: string
    colors: [number[], number[]] // RGB values for the gradient
    bgColor?: string // Optional background color
}

export const SPOTLIGHT_COLORS: ColorScheme[] = [
    {
        name: 'blue-purple',
        colors: [
            [59, 130, 246], // Blue
            [139, 92, 246] // Purple
        ],
        bgColor: '#262626'
    },
    {
        name: 'purple-pink',
        colors: [
            [139, 92, 246], // Purple
            [236, 72, 153] // Pink
        ],
        bgColor: '#262626'
    },
    {
        name: 'cyan-blue',
        colors: [
            [34, 211, 238], // Cyan
            [59, 130, 246] // Blue
        ],
        bgColor: '#262626'
    },
    {
        name: 'emerald-cyan',
        colors: [
            [16, 185, 129], // Emerald
            [34, 211, 238] // Cyan
        ],
        bgColor: '#262626'
    },
    {
        name: 'amber-red',
        colors: [
            [245, 158, 11], // Amber
            [239, 68, 68] // Red
        ],
        bgColor: '#262626'
    }
]

/**
 * Get a random color scheme from the predefined list
 */
export function getRandomColorScheme(): ColorScheme {
    const randomIndex = Math.floor(Math.random() * SPOTLIGHT_COLORS.length)
    return SPOTLIGHT_COLORS[randomIndex]
}

/**
 * Get a specific color scheme by index or name
 */
export function getColorScheme(identifier: number | string): ColorScheme {
    if (typeof identifier === 'number') {
        return SPOTLIGHT_COLORS[identifier % SPOTLIGHT_COLORS.length]
    }

    const scheme = SPOTLIGHT_COLORS.find((s) => s.name === identifier)
    return scheme || SPOTLIGHT_COLORS[0]
}
