
export type TAnimationVariant =
    | 'light'
    | 'dark'
    | 'stroke'
    | 'glassmorphic'
    | 'neon'
    | 'rainbow'
    | 'crystal'
    | 'trace'
    | 'fade'
    | 'segment'
    | 'stagger'
    | 'retro'
    | 'morph'
    | '3d'
    | 'glitch'
    | 'liquid'
    | 'magnetic'
    | 'stagger-triangles'
    | 'rotate-segments'
    | 'wave'
    | 'pulse'
    | 'hover-lift'
    | 'hover-glow'
    | 'hover-rotate'
    | 'tooltip-fade'
    | 'tooltip-scale'
    | 'tooltip-slide'
    | 'none'

type _TLogo = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

export const sizeMap: Record<_TLogo, { width: number; height: number }> = {
    xs: { width: 32, height: 32 },
    sm: { width: 48, height: 48 },
    md: { width: 64, height: 64 },
    lg: { width: 96, height: 96 },
    xl: { width: 128, height: 128 }
} as const
