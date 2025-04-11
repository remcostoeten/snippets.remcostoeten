import { AnimationVariant } from '@/core/types'
import { Variants } from 'framer-motion'

export function useAnimationVariant(variant: AnimationVariant = 'trace') {
    // Define base variants that can be reused
    const baseContainerVariants: Variants = {
        hidden: {
            opacity: 0,
            scale: 0.8
        },
        visible: {
            opacity: 1,
            scale: 1,
            transition: {
                duration: 0.5,
                ease: 'easeOut'
            }
        }
    }

    const basePathVariants: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { duration: 0.5 }
        }
    }

    const baseSegmentVariants: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { duration: 0.5 }
        }
    }

    // Define all variants
    const allVariants: Record<
        AnimationVariant,
        {
            containerVariants: Variants
            pathVariants: Variants
            segmentVariants: Variants
            className?: string
        }
    > = {
        light: {
            containerVariants: baseContainerVariants,
            pathVariants: basePathVariants,
            segmentVariants: baseSegmentVariants,
            className: 'drop-shadow-sm'
        },
        dark: {
            containerVariants: baseContainerVariants,
            pathVariants: basePathVariants,
            segmentVariants: baseSegmentVariants,
            className: 'dark:drop-shadow-[0_0_15px_rgba(0,0,0,0.3)]'
        },
        stroke: {
            containerVariants: baseContainerVariants,
            pathVariants: {
                hidden: { pathLength: 0 },
                visible: {
                    pathLength: 1,
                    transition: { duration: 1, ease: 'easeInOut' }
                }
            },
            segmentVariants: baseSegmentVariants
        },
        glassmorphic: {
            containerVariants: {
                hidden: { opacity: 0, scale: 0.9 },
                visible: {
                    opacity: 1,
                    scale: 1,
                    transition: { duration: 0.5 }
                }
            },
            pathVariants: basePathVariants,
            segmentVariants: baseSegmentVariants,
            className: 'backdrop-blur-md bg-opacity-20 dark:bg-opacity-10'
        },
        neon: {
            containerVariants: {
                hidden: { opacity: 0 },
                visible: {
                    opacity: 1,
                    transition: { staggerChildren: 0.1 }
                }
            },
            pathVariants: {
                hidden: { opacity: 0, filter: 'brightness(1)' },
                visible: {
                    opacity: 1,
                    filter: 'brightness(1.5)',
                    transition: {
                        repeat: Infinity,
                        repeatType: 'reverse'
                    }
                }
            },
            segmentVariants: baseSegmentVariants,
            className: 'filter drop-shadow-[0_0_10px_rgba(0,255,0,0.5)]'
        },
        rainbow: {
            containerVariants: baseContainerVariants,
            pathVariants: basePathVariants,
            segmentVariants: baseSegmentVariants,
            className: 'animate-rainbow'
        },
        crystal: {
            containerVariants: {
                hidden: { opacity: 0 },
                visible: {
                    opacity: 1,
                    filter: 'brightness(1.2) contrast(1.1)'
                }
            },
            pathVariants: {
                hidden: { opacity: 0 },
                visible: {
                    opacity: [0.5, 1, 0.5],
                    transition: {
                        repeat: Infinity,
                        duration: 3,
                        ease: 'easeInOut'
                    }
                }
            },
            segmentVariants: baseSegmentVariants,
            className: 'backdrop-blur-sm drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]'
        },
        trace: {
            containerVariants: baseContainerVariants,
            pathVariants: {
                hidden: { pathLength: 0 },
                visible: {
                    pathLength: 1,
                    transition: { duration: 1.5, ease: 'easeInOut' }
                }
            },
            segmentVariants: baseSegmentVariants
        },
        fade: {
            containerVariants: baseContainerVariants,
            pathVariants: basePathVariants,
            segmentVariants: baseSegmentVariants
        },
        segment: {
            containerVariants: baseContainerVariants,
            pathVariants: basePathVariants,
            segmentVariants: {
                hidden: { scale: 0 },
                visible: {
                    scale: 1,
                    transition: { type: 'spring', stiffness: 200 }
                }
            }
        },
        stagger: {
            containerVariants: {
                hidden: { opacity: 0 },
                visible: {
                    opacity: 1,
                    transition: { staggerChildren: 0.1 }
                }
            },
            pathVariants: basePathVariants,
            segmentVariants: {
                hidden: { y: 20, opacity: 0 },
                visible: {
                    y: 0,
                    opacity: 1,
                    transition: { duration: 0.5 }
                }
            }
        },
        retro: {
            containerVariants: baseContainerVariants,
            pathVariants: basePathVariants,
            segmentVariants: baseSegmentVariants,
            className: 'pixelated'
        },
        morph: {
            containerVariants: {
                hidden: { scale: 0.8, rotate: -180 },
                visible: {
                    scale: 1,
                    rotate: 0,
                    transition: { type: 'spring', damping: 10 }
                }
            },
            pathVariants: basePathVariants,
            segmentVariants: baseSegmentVariants
        },
        '3d': {
            containerVariants: baseContainerVariants,
            pathVariants: basePathVariants,
            segmentVariants: baseSegmentVariants,
            className: 'preserve-3d'
        },
        glitch: {
            containerVariants: {
                hidden: { opacity: 0 },
                visible: {
                    opacity: 1,
                    x: [0, -2, 2, -2, 0],
                    transition: {
                        x: {
                            repeat: Infinity,
                            duration: 0.5,
                            ease: 'steps(5)'
                        }
                    }
                }
            },
            pathVariants: basePathVariants,
            segmentVariants: baseSegmentVariants,
            className:
                'relative before:absolute before:inset-0 before:bg-current before:opacity-50 before:mix-blend-multiply before:animate-glitch'
        },
        liquid: {
            containerVariants: {
                hidden: { opacity: 0 },
                visible: {
                    opacity: 1,
                    scale: [1, 1.05, 0.95, 1],
                    transition: {
                        scale: {
                            repeat: Infinity,
                            duration: 4,
                            ease: 'easeInOut'
                        }
                    }
                }
            },
            pathVariants: {
                hidden: { pathLength: 0 },
                visible: {
                    pathLength: [0, 1, 0],
                    transition: {
                        repeat: Infinity,
                        duration: 6,
                        ease: 'easeInOut'
                    }
                }
            },
            segmentVariants: baseSegmentVariants,
            className: 'filter blur-[0.3px]'
        },
        magnetic: {
            containerVariants: {
                hidden: { opacity: 0 },
                visible: {
                    opacity: 1,
                    rotate: [0, 5, -5, 0],
                    scale: [1, 1.02, 0.98, 1],
                    transition: {
                        rotate: {
                            repeat: Infinity,
                            duration: 2,
                            ease: 'easeInOut'
                        },
                        scale: {
                            repeat: Infinity,
                            duration: 2,
                            ease: 'easeInOut'
                        }
                    }
                }
            },
            pathVariants: basePathVariants,
            segmentVariants: baseSegmentVariants,
            className: 'hover:scale-110 transition-transform duration-300'
        },
        'stagger-triangles': {
            containerVariants: {
                hidden: { opacity: 0 },
                visible: {
                    opacity: 1,
                    transition: { staggerChildren: 0.2 }
                }
            },
            pathVariants: basePathVariants,
            segmentVariants: {
                hidden: { y: 20, opacity: 0 },
                visible: {
                    y: 0,
                    opacity: 1,
                    transition: { duration: 0.5, ease: 'backOut' }
                }
            }
        },
        'rotate-segments': {
            containerVariants: {
                hidden: { opacity: 0 },
                visible: {
                    opacity: 1,
                    transition: { staggerChildren: 0.2 }
                }
            },
            pathVariants: basePathVariants,
            segmentVariants: {
                hidden: { rotate: -180, opacity: 0 },
                visible: {
                    rotate: 0,
                    opacity: 1,
                    transition: { type: 'spring', damping: 10 }
                }
            }
        },
        wave: {
            containerVariants: {
                hidden: { opacity: 0 },
                visible: {
                    opacity: 1,
                    transition: { staggerChildren: 0.1 }
                }
            },
            pathVariants: basePathVariants,
            segmentVariants: {
                hidden: { y: 50, opacity: 0 },
                visible: {
                    y: [0, -20, 0],
                    opacity: 1,
                    transition: {
                        y: {
                            repeat: Infinity,
                            repeatType: 'reverse',
                            duration: 2,
                            ease: 'easeInOut'
                        }
                    }
                }
            }
        },
        pulse: {
            containerVariants: {
                hidden: { opacity: 0, scale: 0.8 },
                visible: {
                    opacity: 1,
                    scale: [1, 1.1, 1],
                    transition: {
                        scale: {
                            repeat: Infinity,
                            repeatType: 'reverse',
                            duration: 2,
                            ease: 'easeInOut'
                        }
                    }
                }
            },
            pathVariants: basePathVariants,
            segmentVariants: baseSegmentVariants
        },
        'hover-lift': {
            containerVariants: {
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
                hover: {
                    y: -10,
                    transition: { duration: 0.3 }
                }
            },
            pathVariants: basePathVariants,
            segmentVariants: baseSegmentVariants,
            className: 'hover:drop-shadow-xl'
        },
        'hover-glow': {
            containerVariants: {
                hidden: { opacity: 0 },
                visible: { opacity: 1 },
                hover: {
                    filter: 'brightness(1.2)',
                    scale: 1.05,
                    transition: { duration: 0.2 }
                }
            },
            pathVariants: basePathVariants,
            segmentVariants: baseSegmentVariants,
            className: 'cursor-pointer'
        },
        'hover-rotate': {
            containerVariants: {
                hidden: { opacity: 0, rotate: -180 },
                visible: { opacity: 1, rotate: 0 },
                hover: {
                    rotate: 360,
                    transition: { duration: 0.8 }
                }
            },
            pathVariants: basePathVariants,
            segmentVariants: baseSegmentVariants,
            className: 'cursor-pointer'
        },
        'tooltip-fade': {
            containerVariants: baseContainerVariants,
            pathVariants: basePathVariants,
            segmentVariants: baseSegmentVariants,
            className: 'group'
        },
        'tooltip-scale': {
            containerVariants: baseContainerVariants,
            pathVariants: basePathVariants,
            segmentVariants: baseSegmentVariants,
            className: 'group'
        },
        'tooltip-slide': {
            containerVariants: baseContainerVariants,
            pathVariants: basePathVariants,
            segmentVariants: baseSegmentVariants,
            className: 'group'
        },
        none: {
            containerVariants: {},
            pathVariants: {},
            segmentVariants: {}
        }
    }

    return allVariants[variant] || allVariants.none
}
