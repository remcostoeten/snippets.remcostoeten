'use client'

import { cn } from '@/helpers'
import { type MotionProps, type Variants, motion, AnimatePresence } from 'framer-motion'
import type { ReactNode } from 'react'

type HeadingLevel = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
type ElementType = HeadingLevel | 'p' | 'span' | 'div' | 'li' | 'blockquote'

type AnimationType = 'text' | 'word' | 'character' | 'line'
type AnimationVariant =
    | 'fadeIn'
    | 'blurIn'
    | 'blurInUp'
    | 'blurInDown'
    | 'slideUp'
    | 'slideDown'
    | 'slideLeft'
    | 'slideRight'
    | 'scaleUp'
    | 'scaleDown'

type FontSize = 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl' | '7xl' | '8xl' | '9xl'

type FontWeight = 'thin' | 'extralight' | 'light' | 'normal' | 'medium' | 'semibold' | 'bold' | 'extrabold' | 'black'

interface TextAnimateProps extends MotionProps {
    /**
     * The text content to animate
     */
    children: string | ReactNode
    /**
     * The class name to be applied to the component
     */
    className?: string
    /**
     * The class name to be applied to each segment
     */
    segmentClassName?: string
    /**
     * The delay before the animation starts
     */
    delay?: number
    /**
     * The duration of the animation
     */
    duration?: number
    /**
     * Custom motion variants for the animation
     */
    variants?: Variants
    /**
     * The element type to render (h1-h6, p, span, etc.)
     */
    as?: ElementType
    /**
     * How to split the text ("text", "word", "character")
     */
    by?: AnimationType
    /**
     * Whether to start animation when component enters viewport
     */
    startOnView?: boolean
    /**
     * Whether to animate only once
     */
    once?: boolean
    /**
     * The animation preset to use
     */
    animation?: AnimationVariant
    /**
     * Custom font size
     */
    fontSize?: FontSize
    /**
     * Custom font weight
     */
    fontWeight?: FontWeight
    /**
     * Custom line height
     */
    lineHeight?: 'none' | 'tight' | 'snug' | 'normal' | 'relaxed' | 'loose'
    /**
     * Custom text color
     */
    textColor?: string
    /**
     * Custom letter spacing
     */
    letterSpacing?: 'tighter' | 'tight' | 'normal' | 'wide' | 'wider' | 'widest'
}

const staggerTimings: Record<AnimationType, number> = {
    text: 0.06,
    word: 0.05,
    character: 0.03,
    line: 0.06
}

const defaultContainerVariants = {
    hidden: { opacity: 1 },
    show: {
        opacity: 1,
        transition: {
            delayChildren: 0,
            staggerChildren: 0.05
        }
    },
    exit: {
        opacity: 0,
        transition: {
            staggerChildren: 0.05,
            staggerDirection: -1
        }
    }
}

const defaultItemVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1
    },
    exit: {
        opacity: 0
    }
}

const defaultItemAnimationVariants: Record<AnimationVariant, { container: Variants; item: Variants }> = {
    fadeIn: {
        container: defaultContainerVariants,
        item: {
            hidden: { opacity: 0, y: 20 },
            show: {
                opacity: 1,
                y: 0,
                transition: {
                    duration: 0.3
                }
            },
            exit: {
                opacity: 0,
                y: 20,
                transition: { duration: 0.3 }
            }
        }
    },
    blurIn: {
        container: defaultContainerVariants,
        item: {
            hidden: { opacity: 0, filter: 'blur(10px)' },
            show: {
                opacity: 1,
                filter: 'blur(0px)',
                transition: {
                    duration: 0.3
                }
            },
            exit: {
                opacity: 0,
                filter: 'blur(10px)',
                transition: { duration: 0.3 }
            }
        }
    },
    blurInUp: {
        container: defaultContainerVariants,
        item: {
            hidden: { opacity: 0, filter: 'blur(10px)', y: 20 },
            show: {
                opacity: 1,
                filter: 'blur(0px)',
                y: 0,
                transition: {
                    y: { duration: 0.3 },
                    opacity: { duration: 0.4 },
                    filter: { duration: 0.3 }
                }
            },
            exit: {
                opacity: 0,
                filter: 'blur(10px)',
                y: 20,
                transition: {
                    y: { duration: 0.3 },
                    opacity: { duration: 0.4 },
                    filter: { duration: 0.3 }
                }
            }
        }
    },
    blurInDown: {
        container: defaultContainerVariants,
        item: {
            hidden: { opacity: 0, filter: 'blur(10px)', y: -20 },
            show: {
                opacity: 1,
                filter: 'blur(0px)',
                y: 0,
                transition: {
                    y: { duration: 0.3 },
                    opacity: { duration: 0.4 },
                    filter: { duration: 0.3 }
                }
            },
            exit: {
                opacity: 0,
                filter: 'blur(10px)',
                y: -20,
                transition: {
                    y: { duration: 0.3 },
                    opacity: { duration: 0.4 },
                    filter: { duration: 0.3 }
                }
            }
        }
    },
    slideUp: {
        container: defaultContainerVariants,
        item: {
            hidden: { y: 20, opacity: 0 },
            show: {
                y: 0,
                opacity: 1,
                transition: {
                    duration: 0.3
                }
            },
            exit: {
                y: -20,
                opacity: 0,
                transition: {
                    duration: 0.3
                }
            }
        }
    },
    slideDown: {
        container: defaultContainerVariants,
        item: {
            hidden: { y: -20, opacity: 0 },
            show: {
                y: 0,
                opacity: 1,
                transition: { duration: 0.3 }
            },
            exit: {
                y: 20,
                opacity: 0,
                transition: { duration: 0.3 }
            }
        }
    },
    slideLeft: {
        container: defaultContainerVariants,
        item: {
            hidden: { x: 20, opacity: 0 },
            show: {
                x: 0,
                opacity: 1,
                transition: { duration: 0.3 }
            },
            exit: {
                x: -20,
                opacity: 0,
                transition: { duration: 0.3 }
            }
        }
    },
    slideRight: {
        container: defaultContainerVariants,
        item: {
            hidden: { x: -20, opacity: 0 },
            show: {
                x: 0,
                opacity: 1,
                transition: { duration: 0.3 }
            },
            exit: {
                x: 20,
                opacity: 0,
                transition: { duration: 0.3 }
            }
        }
    },
    scaleUp: {
        container: defaultContainerVariants,
        item: {
            hidden: { scale: 0.5, opacity: 0 },
            show: {
                scale: 1,
                opacity: 1,
                transition: {
                    duration: 0.3,
                    scale: {
                        type: 'spring',
                        damping: 15,
                        stiffness: 300
                    }
                }
            },
            exit: {
                scale: 0.5,
                opacity: 0,
                transition: { duration: 0.3 }
            }
        }
    },
    scaleDown: {
        container: defaultContainerVariants,
        item: {
            hidden: { scale: 1.5, opacity: 0 },
            show: {
                scale: 1,
                opacity: 1,
                transition: {
                    duration: 0.3,
                    scale: {
                        type: 'spring',
                        damping: 15,
                        stiffness: 300
                    }
                }
            },
            exit: {
                scale: 1.5,
                opacity: 0,
                transition: { duration: 0.3 }
            }
        }
    }
}

// Helper function to generate text styling classes
const getTextStylingClasses = ({
    fontSize,
    fontWeight,
    lineHeight,
    textColor,
    letterSpacing
}: Pick<TextAnimateProps, 'fontSize' | 'fontWeight' | 'lineHeight' | 'textColor' | 'letterSpacing'>) => {
    return cn(
        fontSize && `text-${fontSize}`,
        fontWeight && `font-${fontWeight}`,
        lineHeight && `leading-${lineHeight}`,
        textColor && `text-${textColor}`,
        letterSpacing && `tracking-${letterSpacing}`
    )
}

export function TextAnimate({
    children,
    delay = 0,
    duration = 0.3,
    variants,
    className,
    segmentClassName,
    as = 'p',
    startOnView = true,
    once = false,
    by = 'word',
    animation = 'fadeIn',
    fontSize,
    fontWeight,
    lineHeight,
    textColor,
    letterSpacing,
    ...props
}: TextAnimateProps) {
    const MotionComponent = motion(as as ElementType)

    // If children is not a string, render it directly without animation
    if (typeof children !== 'string') {
        return (
            <MotionComponent
                className={cn(
                    'whitespace-pre-wrap',
                    getTextStylingClasses({
                        fontSize,
                        fontWeight,
                        lineHeight,
                        textColor,
                        letterSpacing
                    }),
                    className
                )}
                {...props}
            >
                {children}
            </MotionComponent>
        )
    }

    let segments: string[] = []
    switch (by) {
        case 'word':
            segments = children.split(/(\s+)/)
            break
        case 'character':
            segments = children.split('')
            break
        case 'line':
            segments = children.split('\n')
            break
        case 'text':
        default:
            segments = [children]
            break
    }

    const finalVariants = variants
        ? {
              container: {
                  hidden: { opacity: 0 },
                  show: {
                      opacity: 1,
                      transition: {
                          opacity: { duration: 0.01, delay },
                          delayChildren: delay,
                          staggerChildren: duration / segments.length
                      }
                  },
                  exit: {
                      opacity: 0,
                      transition: {
                          staggerChildren: duration / segments.length,
                          staggerDirection: -1
                      }
                  }
              },
              item: variants
          }
        : animation
          ? {
                container: {
                    ...defaultItemAnimationVariants[animation].container,
                    show: {
                        ...defaultItemAnimationVariants[animation].container.show,
                        transition: {
                            delayChildren: delay,
                            staggerChildren: duration / segments.length
                        }
                    },
                    exit: {
                        ...defaultItemAnimationVariants[animation].container.exit,
                        transition: {
                            staggerChildren: duration / segments.length,
                            staggerDirection: -1
                        }
                    }
                },
                item: defaultItemAnimationVariants[animation].item
            }
          : { container: defaultContainerVariants, item: defaultItemVariants }

    const textStylingClasses = getTextStylingClasses({
        fontSize,
        fontWeight,
        lineHeight,
        textColor,
        letterSpacing
    })

    return (
        <AnimatePresence mode="popLayout">
            <MotionComponent
                variants={finalVariants.container as Variants}
                initial="hidden"
                whileInView={startOnView ? 'show' : undefined}
                animate={startOnView ? undefined : 'show'}
                exit="exit"
                className={cn('whitespace-pre-wrap', textStylingClasses, className)}
                viewport={{ once }}
                {...props}
            >
                {segments.map((segment, i) => (
                    <motion.span
                        key={`${by}-${segment}-${i}`}
                        variants={finalVariants.item}
                        custom={i * staggerTimings[by]}
                        className={cn(
                            by === 'line' ? 'block' : 'inline-block whitespace-pre',
                            by === 'character' && '',
                            segmentClassName
                        )}
                    >
                        {segment}
                    </motion.span>
                ))}
            </MotionComponent>
        </AnimatePresence>
    )
}
