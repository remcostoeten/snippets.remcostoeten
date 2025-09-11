'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Search, Menu, X, Home, FileText, Database, BookOpen } from 'lucide-react'
import { Search as SearchComponent } from '@/components/landing/search'
import { CleanThemeSwitcher } from '@/components/ui/clean-theme-switcher'
import { Button } from '@/shared/ui/button'
import { cn } from '@/lib/utils'

type TProps = {
  className?: string
}

export function Header({ className }: TProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const navigation = [
    {
      name: 'Home',
      href: '/',
      icon: Home,
      active: 'url'
    },
    {
      name: 'Snippets',
      href: '/snippets',
      icon: FileText,
      active: 'nested-url'
    },
    {
      name: 'Query Builder',
      href: '/query-builder',
      icon: Database,
      active: 'url'
    },
    {
      name: 'Documentation',
      href: '/docs',
      icon: BookOpen,
      active: 'nested-url'
    }
  ]

  return (
    <header className={cn("sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60", className)}>
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
              <span className="text-primary font-bold text-sm">RS</span>
            </div>
            <span className="font-semibold text-foreground">Snippets</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="flex items-center space-x-1 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                <item.icon className="h-4 w-4" />
                <span>{item.name}</span>
              </Link>
            ))}
          </nav>

          {/* Search and Theme Controls */}
          <div className="flex items-center space-x-4">
            {/* Search */}
            <div className="hidden sm:block">
              <SearchComponent 
                placeholder="Search snippets..." 
                variant="header"
                className="w-64"
              />
            </div>

            {/* Theme Controls */}
            <CleanThemeSwitcher />

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t bg-background/95 backdrop-blur">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {/* Mobile Search */}
              <div className="px-3 py-2">
                <SearchComponent 
                  placeholder="Search snippets..." 
                  variant="header"
                  className="w-full"
                />
              </div>
              
              {/* Mobile Navigation */}
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-md transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
