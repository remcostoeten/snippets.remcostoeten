'use client'

import { cn } from '@/helpers'
import { type PanInfo, motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import type React from 'react'
import { type TColorScheme, getColorScheme, getRandomColorScheme } from './config'

type TProps = React.HTMLAttributes<HTMLDivElement> & {
    children: React.ReactNode
    radius?: number
    color?: string
    colorSchemeIdentifier?: string | number
    delay?: number
}

function CardSpotlight({
    children,
    radius = 350,
    color,
    className,
    colorSchemeIdentifier,
    delay = 0,
    ...props
}: TProps) {
    const [position, setPosition] = useState({ x: 0, y: 0 })
    const [isHovering, setIsHovering] = useState(false)
    const divRef = useRef<HTMLDivElement | null>(null)

    const colorScheme: TColorScheme =
        colorSchemeIdentifier === 'random' ? getRandomColorScheme() : getColorScheme(colorSchemeIdentifier || 0)

    const [spotlightColor, setSpotlightColor] = useState(
        color || `rgba(${colorScheme.colors[0][0]}, ${colorScheme.colors[0][1]}, ${colorScheme.colors[0][2]}, 0.7)`
    )

    useEffect(() => {
        setSpotlightColor(
            color || `rgba(${colorScheme.colors[0][0]}, ${colorScheme.colors[0][1]}, ${colorScheme.colors[0][2]}, 0.7)`
        )
    }, [color, colorScheme])

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const div = divRef.current
        if (div) {
            const rect = div.getBoundingClientRect()
            setPosition({
                x: e.clientX - rect.left,
                y: e.clientY - rect.top
            })
        }
    }

    const handleMouseEnter = () => setIsHovering(true)
    const handleMouseLeave = () => setIsHovering(false)

    const fadeInVariants = {
        hidden: {
            opacity: 0,
            y: 20
        },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.5,
                delay: delay,
                staggerChildren: 0.1,
                delayChildren: delay
            }
        }
    }

    const childVariants = {
        hidden: {
            opacity: 0,
            y: 20
        },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.5
            }
        }
    }

    //Optional function if you want to do something while panning/dragging
    const handlePan = (event: any, info: PanInfo) => {
        console.log(event)
        console.log(info.offset.x, info.offset.y)
    }

    return (
        // @ts-ignore
        <motion.div
            ref={divRef}
            initial="hidden"
            animate="visible"
            variants={fadeInVariants}
            className={cn(
                'group/spotlight rounded-md relative border border-neutral-800 bg-black dark:border-neutral-800 overflow-hidden',
                className
            )}
            onPan={handlePan} //Optional handler function while panning
            onMouseMove={handleMouseMove}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            {...props}
        >
            <div
                className="pointer-events-none absolute z-0 transition-all duration-500"
                style={{
                    opacity: isHovering ? 1 : 0,
                    background: `radial-gradient(${radius}px circle at ${position.x}px ${position.y}px, ${spotlightColor}, transparent 100%)`,
                    inset: '-1px',
                    borderRadius: '0.375rem',
                    transform: `scale(${isHovering ? 1 : 0.9})`
                }}
            >
                <div className="absolute inset-0 pointer-events-none">
                    <SimpleDotPattern
                        colors={[
                            [...colorScheme.colors[0], 0.15], // blue with low opacity
                            [...colorScheme.colors[1], 0.15] // purple with low opacity
                        ]}
                        dotSize={2}
                    />
                </div>
            </div>
            <motion.div variants={childVariants}>{children}</motion.div>
        </motion.div>
    )
}

type TSimpleDotPatternProps = {
    colors: number[][]
    dotSize?: number
}

function SimpleDotPattern({ colors, dotSize = 2 }: TSimpleDotPatternProps) {
    return (
        <div
            className="absolute inset-0 opacity-30"
            style={{
                backgroundImage: `radial-gradient(circle, rgba(${colors[0][0]}, ${colors[0][1]}, ${colors[0][2]}, ${colors[0][3]}) 1px, transparent 1px), 
                          radial-gradient(circle, rgba(${colors[1][0]}, ${colors[1][1]}, ${colors[1][2]}, ${colors[1][3]}) 1px, transparent 1px)`,
                backgroundSize: `${dotSize * 4}px ${dotSize * 4}px, ${dotSize * 6}px ${dotSize * 6}px`,
                backgroundPosition: '0 0, 10px 10px'
            }}
        />
    )
}

export { CardSpotlight }
