'use client'

import React from 'react'
import { Skeleton, TextSkeleton, CodeSkeleton } from '@/components/skeleton'
import { cn } from '@/lib/utils'

type TProps = {
  className?: string
}

export function DocsSkeleton({ className }: TProps) {
  return (
    <div className={cn("min-h-screen bg-background", className)}>
      {/* Header Skeleton */}
      <div className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <Skeleton width="32px" height="32px" className="rounded-lg" />
              <Skeleton width="80px" height="20px" />
            </div>

            {/* Navigation */}
            <div className="hidden md:flex items-center space-x-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex items-center space-x-1">
                  <Skeleton width="16px" height="16px" className="rounded" />
                  <Skeleton width="60px" height="16px" />
                </div>
              ))}
            </div>

            {/* Search and Theme */}
            <div className="flex items-center space-x-4">
              <div className="hidden sm:block">
                <Skeleton width="256px" height="36px" className="rounded-md" />
              </div>
              <Skeleton width="120px" height="32px" className="rounded-lg" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Layout */}
      <div className="flex">
        {/* Sidebar Skeleton */}
        <div className="hidden lg:block w-64 border-r bg-muted/10">
          <div className="p-4 space-y-4">
            {/* Sidebar Header */}
            <div className="space-y-2">
              <Skeleton width="120px" height="20px" />
              <Skeleton width="80px" height="16px" />
            </div>

            {/* Navigation Items */}
            <div className="space-y-2">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="flex items-center space-x-2 py-1">
                  <Skeleton width="16px" height="16px" className="rounded" />
                  <Skeleton width={i % 3 === 0 ? "140px" : "100px"} height="16px" />
                </div>
              ))}
            </div>

            {/* Sub Navigation */}
            <div className="ml-4 space-y-1">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="flex items-center space-x-2 py-1">
                  <Skeleton width="12px" height="12px" className="rounded" />
                  <Skeleton width="80px" height="14px" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <div className="max-w-4xl mx-auto p-6">
            {/* Page Header */}
            <div className="mb-8 space-y-4">
              <Skeleton width="60%" height="32px" />
              <Skeleton width="40%" height="20px" />
            </div>

            {/* Copy Button */}
            <div className="mb-6">
              <Skeleton width="120px" height="32px" className="rounded-md" />
            </div>

            {/* Content */}
            <div className="space-y-6">
              {/* Introduction */}
              <div className="space-y-3">
                <TextSkeleton />
                <TextSkeleton />
                <TextSkeleton />
              </div>

              {/* Code Block */}
              <div className="space-y-2">
                <Skeleton width="80px" height="16px" />
                <CodeSkeleton />
              </div>

              {/* More Content */}
              <div className="space-y-3">
                <TextSkeleton />
                <TextSkeleton />
                <TextSkeleton />
              </div>

              {/* Another Code Block */}
              <div className="space-y-2">
                <Skeleton width="100px" height="16px" />
                <CodeSkeleton />
              </div>

              {/* Final Content */}
              <div className="space-y-3">
                <TextSkeleton />
                <TextSkeleton />
              </div>
            </div>

            {/* Table of Contents */}
            <div className="hidden xl:block fixed right-8 top-32 w-64">
              <div className="space-y-2">
                <Skeleton width="120px" height="20px" />
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="ml-2">
                    <Skeleton width="100px" height="16px" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export function DocsPageSkeleton({ className }: TProps) {
  return (
    <div className={cn("max-w-4xl mx-auto p-6", className)}>
      {/* Page Header */}
      <div className="mb-8 space-y-4">
        <Skeleton width="60%" height="32px" />
        <Skeleton width="40%" height="20px" />
      </div>

      {/* Copy Button */}
      <div className="mb-6">
        <Skeleton width="120px" height="32px" className="rounded-md" />
      </div>

      {/* Content */}
      <div className="space-y-6">
        {/* Introduction */}
        <div className="space-y-3">
          <TextSkeleton />
          <TextSkeleton />
          <TextSkeleton />
        </div>

        {/* Code Block */}
        <div className="space-y-2">
          <Skeleton width="80px" height="16px" />
          <CodeSkeleton />
        </div>

        {/* More Content */}
        <div className="space-y-3">
          <TextSkeleton />
          <TextSkeleton />
          <TextSkeleton />
        </div>

        {/* Another Code Block */}
        <div className="space-y-2">
          <Skeleton width="100px" height="16px" />
          <CodeSkeleton />
        </div>

        {/* Final Content */}
        <div className="space-y-3">
          <TextSkeleton />
          <TextSkeleton />
        </div>
      </div>
    </div>
  )
}

export function SidebarSkeleton({ className }: TProps) {
  return (
    <div className={cn("hidden lg:block w-64 border-r bg-muted/10", className)}>
      <div className="p-4 space-y-4">
        {/* Sidebar Header */}
        <div className="space-y-2">
          <Skeleton width="120px" height="20px" />
          <Skeleton width="80px" height="16px" />
        </div>

        {/* Navigation Items */}
        <div className="space-y-2">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="flex items-center space-x-2 py-1">
              <Skeleton width="16px" height="16px" className="rounded" />
              <Skeleton width={i % 3 === 0 ? "140px" : "100px"} height="16px" />
            </div>
          ))}
        </div>

        {/* Sub Navigation */}
        <div className="ml-4 space-y-1">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex items-center space-x-2 py-1">
              <Skeleton width="12px" height="12px" className="rounded" />
              <Skeleton width="80px" height="14px" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
