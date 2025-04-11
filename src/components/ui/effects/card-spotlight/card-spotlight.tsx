'use client'

import { useMotionValue, motion, useMotionTemplate } from 'framer-motion'
import type React from 'react'
import { type MouseEvent as ReactMouseEvent, useState, useEffect } from 'react'
import { CanvasRevealEffect } from './canvas-reveal-effect'
import { cn } from '@/helpers'
import { type ColorScheme, getRandomColorScheme, getColorScheme } from './config'

export const CardSpotlight = ({
    children,
    radius = 350,
    color = '#262626',
    colorScheme,
    colorIndex,
    randomColor = false,
    className,
    ...props
}: {
    radius?: number
    color?: string
    colorScheme?: string
    colorIndex?: number
    randomColor?: boolean
    children: React.ReactNode
} & React.HTMLAttributes<HTMLDivElement>) => {
    const mouseX = useMotionValue(0)
    const mouseY = useMotionValue(0)

    const [selectedColorScheme, setSelectedColorScheme] = useState<ColorScheme | null>(null)

    useEffect(() => {
        if (randomColor) {
            setSelectedColorScheme(getRandomColorScheme())
        } else if (colorScheme) {
            setSelectedColorScheme(getColorScheme(colorScheme))
        } else if (typeof colorIndex === 'number') {
            setSelectedColorScheme(getColorScheme(colorIndex))
        } else {
            // Default color scheme
            setSelectedColorScheme(getColorScheme(0))
        }
    }, [randomColor, colorScheme, colorIndex])

    function handleMouseMove({ currentTarget, clientX, clientY }: ReactMouseEvent<HTMLDivElement>) {
        const { left, top } = currentTarget.getBoundingClientRect()

        mouseX.set(clientX - left)
        mouseY.set(clientY - top)
    }

    const [isHovering, setIsHovering] = useState(false)
    const handleMouseEnter = () => setIsHovering(true)
    const handleMouseLeave = () => setIsHovering(false)

    const bgColor = selectedColorScheme?.bgColor || color

    return (
        <div
            className={cn(
                'group/spotlight p-10 rounded-md relative border border-neutral-800 bg-black dark:border-neutral-800',
                className
            )}
            onMouseMove={handleMouseMove}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            {...props}
        >
            <motion.div
                className="pointer-events-none absolute z-0 -inset-px rounded-md opacity-0 transition-opacity duration-500 ease-in-out group-hover/spotlight:opacity-100"
                style={{
                    backgroundColor: bgColor,
                    maskImage: useMotionTemplate`
            radial-gradient(
              ${radius}px circle at ${mouseX}px ${mouseY}px,
              white,
              transparent 80%
            )
          `
                }}
            >
                {selectedColorScheme && (
                    <CanvasRevealEffect
                        animationSpeed={5}
                        containerClassName={`bg-transparent absolute inset-0 pointer-events-none transition-opacity duration-500 ease-in-out ${
                            isHovering ? 'opacity-100' : 'opacity-0'
                        }`}
                        colors={selectedColorScheme.colors}
                        dotSize={3}
                    />
                )}
            </motion.div>
            {children}
        </div>
    )
}
