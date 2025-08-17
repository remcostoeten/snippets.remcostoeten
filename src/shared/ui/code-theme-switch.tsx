'use client'

import { useTheme } from 'next-themes';
import { Button } from './button';
import { Moon, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';

export function CodeThemeSwitch() {
    const { theme, setTheme } = useTheme();
    const [isAnimating, setIsAnimating] = useState(false);
    const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; delay: number }>>([]);

    const handleToggle = () => {
        setIsAnimating(true);
        setTheme(theme === 'light' ? 'dark' : 'light');

        // Generate particles for the animation
        const newParticles = Array.from({ length: 8 }, (_, i) => ({
            id: i,
            x: Math.random() * 100,
            y: Math.random() * 100,
            delay: Math.random() * 0.5
        }));
        setParticles(newParticles);

        setTimeout(() => {
            setIsAnimating(false);
            setParticles([]);
        }, 1200);
    };

    return (
        <div className="relative">
        <div className={`
                absolute inset-0 rounded-full transition-all duration-700 ease-out
                ${theme === 'dark'
                    ? 'bg-gradient-to-br from-indigo-500/20 via-purple-500/20 to-pink-500/20 shadow-lg shadow-purple-500/25'
                    : 'bg-gradient-to-br from-yellow-400/20 via-orange-400/20 to-red-400/20 shadow-lg shadow-orange-400/25'
                }
                ${isAnimating ? 'scale-150 opacity-50' : 'scale-100 opacity-100'}
            `} />

            <div className={`
                relative overflow-hidden rounded-full transition-all duration-500 ease-out
                ${isAnimating ? 'animate-pulse' : ''}
            `}>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleToggle}
                    className={`
                        h-9 w-9 px-0 relative z-10 transition-all duration-500 ease-out
                        hover:scale-110 active:scale-95
                        ${theme === 'dark'
                            ? 'hover:bg-purple-500/10 hover:shadow-lg hover:shadow-purple-500/20'
                            : 'hover:bg-orange-400/10 hover:shadow-lg hover:shadow-orange-400/20'
                        }
                    `}
                    disabled={isAnimating}
                >
                    <div className={`
                        absolute inset-0 rounded-full transition-all duration-700 ease-out
                        ${theme === 'dark'
                            ? 'bg-gradient-to-br from-slate-800 via-purple-900 to-indigo-900'
                            : 'bg-gradient-to-br from-yellow-300 via-orange-300 to-amber-300'
                        }
                        ${isAnimating ? 'animate-spin-slow' : ''}
                    `} />

                    <div className={`
                        absolute inset-1 rounded-full transition-all duration-500 ease-out
                        ${theme === 'dark'
                            ? 'bg-gradient-to-br from-purple-600/30 to-indigo-600/30'
                            : 'bg-gradient-to-br from-yellow-400/30 to-orange-400/30'
                        }
                        ${isAnimating ? 'animate-pulse-glow scale-110' : 'scale-100'}
                    `} />

                    <div className="relative z-20 flex items-center justify-center">
                        <Sun className={`
                            h-[1.2rem] w-[1.2rem] absolute transition-all duration-500 ease-out
                            ${theme === 'dark'
                                ? '-rotate-90 scale-0 opacity-0'
                                : 'rotate-0 scale-100 opacity-100'
                            }
                            ${isAnimating ? 'animate-spin' : ''}
                            text-orange-500 dark:text-orange-400
                        `} />
                        <Moon className={`
                            h-[1.2rem] w-[1.2rem] absolute transition-all duration-500 ease-out
                            ${theme === 'dark'
                                ? 'rotate-0 scale-100 opacity-100'
                                : 'rotate-90 scale-0 opacity-0'
                            }
                            ${isAnimating ? 'animate-spin' : ''}
                            text-purple-400 dark:text-purple-300
                        `} />
                    </div>

                    <span className="sr-only">Toggle theme</span>
                </Button>
            </div>
            {isAnimating && particles.map((particle) => (
                <div
                    key={particle.id}
                    className={`
                        absolute w-1 h-1 rounded-full pointer-events-none
                        ${theme === 'dark'
                            ? 'bg-purple-400 shadow-sm shadow-purple-400'
                            : 'bg-orange-400 shadow-sm shadow-orange-400'
                        }
                        animate-ping
                    `}
                    style={{
                        left: `${particle.x}%`,
                        top: `${particle.y}%`,
                        animationDelay: `${particle.delay}s`,
                        animationDuration: '1s'
                    }}
                />
            ))}
            {isAnimating && (
                <div className={`
                    absolute inset-0 rounded-full border-2 animate-ping
                    ${theme === 'dark'
                        ? 'border-purple-400/50'
                        : 'border-orange-400/50'
                    }
                `} />
            )}

                <div className={`
                absolute inset-0 rounded-full blur-xl transition-all duration-700 ease-out -z-10
                ${theme === 'dark'
                    ? 'bg-purple-500/20 shadow-2xl shadow-purple-500/10'
                    : 'bg-orange-400/20 shadow-2xl shadow-orange-400/10'
                }
                ${isAnimating ? 'scale-200 opacity-30' : 'scale-150 opacity-20'}
            `} />
        </div>
    );
}