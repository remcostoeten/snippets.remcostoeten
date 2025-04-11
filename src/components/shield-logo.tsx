'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui'
import { cn } from '@/helpers'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { useAnimationVariant } from '@/hooks/use-animation-variant'
import { AnimationVariant } from '@/core/types'

type LogoSize = 'sm' | 'md' | 'lg'
type SizeConfig = { width: number; height: number }
type SizeMap = Record<LogoSize, SizeConfig>

const sizeMap: SizeMap = {
    sm: { width: 24, height: 25 },
    md: { width: 36, height: 38 },
    lg: { width: 48, height: 50 }
}

export interface ShieldLogoProps {
    className?: string
    size?: LogoSize
    width?: number
    height?: number
    fill?: string
    fillOutline?: string
    fillTop?: string
    fillLeft?: string
    fillRight?: string
    bgFill?: string
    animated?: boolean
    animationVariant?: string
    hasLink?: boolean
    linkTo?: string
    tooltipContent?: string
    hasTooltip?: boolean
}

export function ShieldLogo({
    className,
    size = 'md',
    width,
    height,
    fill,
    fillOutline,
    fillTop,
    fillLeft,
    fillRight,
    bgFill = 'transparent',
    animated = true,
    animationVariant = 'trace',
    hasLink = false,
    linkTo = '/',
    tooltipContent = 'Home',
    hasTooltip = false
}: ShieldLogoProps) {
    const { theme } = useTheme()
    const [mounted, setMounted] = useState(false)
    useEffect(() => {
        setMounted(true)
    }, [])

    const variants = useAnimationVariant(animated ? (animationVariant as AnimationVariant) : 'none')

    if (!mounted) {
        return null
    }

    const { width: defaultWidth, height: defaultHeight } = sizeMap[size] || sizeMap['md']
    const finalWidth = width || defaultWidth
    const finalHeight = height || defaultHeight

    const defaultFill = theme === 'dark' ? '#ffffff' : '#000000'
    const defaultOutline = theme === 'dark' ? '#ffffff' : '#000000'
    const defaultSegmentFill = theme === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)'

    const LogoSVG = (
        <motion.svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 2022 2105"
            width={finalWidth}
            height={finalHeight}
            className={cn(
                'transition-colors duration-300',
                'hover:scale-105',
                'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary',
                variants.className,
                className
            )}
            initial={animated ? 'hidden' : undefined}
            animate={animated ? 'visible' : undefined}
            variants={variants.containerVariants}
            role="img"
            aria-label="Shield Logo"
        >
            <title>Shield Logo</title>
            <desc>A shield-shaped logo representing our brand identity</desc>

            <rect width="100%" height="100%" fill={bgFill} aria-hidden="true" />

            {/* Outline */}
            <motion.path
                d="m1011 2041.4c-547.8-316.2-886.9-897.7-893.9-1528.2v-39.7l893.9-406.5 893.9 406.5v39.7c-7 630.5-346.1 1212-893.9 1528.2zm0-195.4c428.3-282.8 698.1-752.8 725.4-1266.4l-725.4-329.9-725.4 329.9c27.3 513.6 297.1 983.6 725.4 1266.4z"
                fill={fill || defaultFill}
                stroke={fillOutline || defaultOutline}
                strokeWidth="4"
                variants={variants.pathVariants}
                className="transition-colors duration-300"
            />

            {/* Top segment */}
            <motion.path
                d="m373.9 592.4l637.1 289.7 637.1-289.7-637.1-289.7z"
                fill={fillTop || defaultSegmentFill}
                variants={variants.segmentVariants}
                className="transition-colors duration-300"
            />

            {/* Left segment */}
            <motion.path
                d="m986.1 925.4l-648.5-294.9c39.8 456.1 277 872.6 648.5 1139.7z"
                fill={fillLeft || defaultSegmentFill}
                variants={variants.segmentVariants}
                className="transition-colors duration-300"
            />

            {/* Right segment */}
            <motion.path
                d="m1035.9 925.4v844.8c371.5-267.1 608.7-683.6 648.5-1139.7z"
                fill={fillRight || defaultSegmentFill}
                variants={variants.segmentVariants}
                className="transition-colors duration-300"
            />
        </motion.svg>
    )

    // Wrap with tooltip if needed
    const WrappedLogo = hasTooltip ? (
        <TooltipProvider>
            <Tooltip delayDuration={300}>
                <TooltipTrigger asChild>
                    <span className="inline-block">{LogoSVG}</span>
                </TooltipTrigger>
                <TooltipContent>
                    <p>{tooltipContent}</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    ) : (
        LogoSVG
    )

    // Return with optional link wrapper
    return hasLink ? (
        <Link
            href={linkTo}
            className="inline-block focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            title={tooltipContent}
        >
            {WrappedLogo}
        </Link>
    ) : (
        <div className="inline-block">{WrappedLogo}</div>
    )
}
