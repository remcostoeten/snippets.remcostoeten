import React from 'react'
import { Skeleton } from '@/components/skeleton'
import { Card, CardContent, CardHeader } from '@/shared/ui/card'

type TQueryBuilderSkeletonProps = {
  variant?: 'schema' | 'query' | 'code' | 'browser'
}

export function QueryBuilderSkeleton({ variant = 'schema' }: TQueryBuilderSkeletonProps) {
  if (variant === 'schema') {
    return (
      <Card className="h-full flex flex-col bg-zinc-100 dark:bg-zinc-900/50 border-zinc-300 dark:border-zinc-800">
        <CardHeader className="flex-shrink-0 pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-2">
              <Skeleton width="20px" height="20px" className="rounded" />
              <Skeleton width="120px" height="24px" />
            </div>
            <div className="flex flex-wrap gap-2">
              <Skeleton width="60px" height="32px" className="rounded-md" />
              <Skeleton width="50px" height="32px" className="rounded-md" />
              <Skeleton width="60px" height="32px" className="rounded-md" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col min-h-0">
          <div className="flex-1 flex flex-col">
            <div className="flex-1 relative bg-zinc-100 dark:bg-zinc-800/50 border border-zinc-300 dark:border-zinc-700 rounded-md overflow-hidden">
              <div className="p-4 space-y-3">
                <Skeleton width="100%" height="16px" />
                <Skeleton width="95%" height="16px" />
                <Skeleton width="90%" height="16px" />
                <Skeleton width="85%" height="16px" />
                <Skeleton width="100%" height="16px" />
                <Skeleton width="80%" height="16px" />
                <Skeleton width="95%" height="16px" />
                <Skeleton width="88%" height="16px" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (variant === 'query') {
    return (
      <Card className="h-full bg-zinc-100 dark:bg-zinc-900/50 border-zinc-300 dark:border-zinc-800">
        <CardHeader className="flex-shrink-0 pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-2">
              <Skeleton width="20px" height="20px" className="rounded" />
              <Skeleton width="140px" height="24px" />
            </div>
            <Skeleton width="16px" height="16px" className="rounded" />
          </div>
          <div className="flex items-center gap-2 mt-2">
            <Skeleton width="80px" height="24px" className="rounded-full" />
            <Skeleton width="60px" height="20px" className="rounded-full" />
            <Skeleton width="70px" height="20px" className="rounded-full" />
          </div>
        </CardHeader>
        <CardContent className="flex-1 overflow-auto space-y-4">
          {/* Operation Type */}
          <div className="space-y-2">
            <Skeleton width="100px" height="16px" />
            <div className="flex gap-2">
              <Skeleton width="80px" height="36px" className="rounded-md" />
              <Skeleton width="80px" height="36px" className="rounded-md" />
              <Skeleton width="80px" height="36px" className="rounded-md" />
              <Skeleton width="80px" height="36px" className="rounded-md" />
            </div>
          </div>

          {/* Quantity */}
          <div className="space-y-2">
            <Skeleton width="60px" height="16px" />
            <Skeleton width="120px" height="40px" className="rounded-md" />
          </div>

          {/* Where Clause */}
          <div className="space-y-2">
            <Skeleton width="80px" height="16px" />
            <div className="space-y-2">
              <div className="flex gap-2">
                <Skeleton width="100px" height="40px" className="rounded-md" />
                <Skeleton width="80px" height="40px" className="rounded-md" />
                <Skeleton width="120px" height="40px" className="rounded-md" />
              </div>
              <div className="flex gap-2">
                <Skeleton width="100px" height="40px" className="rounded-md" />
                <Skeleton width="80px" height="40px" className="rounded-md" />
                <Skeleton width="120px" height="40px" className="rounded-md" />
              </div>
            </div>
          </div>

          {/* Order By */}
          <div className="space-y-2">
            <Skeleton width="70px" height="16px" />
            <div className="flex gap-2">
              <Skeleton width="100px" height="40px" className="rounded-md" />
              <Skeleton width="80px" height="40px" className="rounded-md" />
            </div>
          </div>

          {/* Limit */}
          <div className="space-y-2">
            <Skeleton width="40px" height="16px" />
            <Skeleton width="80px" height="40px" className="rounded-md" />
          </div>
        </CardContent>
      </Card>
    )
  }

  if (variant === 'code') {
    return (
      <Card className="h-full flex flex-col bg-zinc-100 dark:bg-zinc-900/50 border-zinc-300 dark:border-zinc-800">
        <CardHeader className="flex-shrink-0 pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-2">
              <Skeleton width="20px" height="20px" className="rounded" />
              <Skeleton width="160px" height="24px" />
            </div>
            <div className="flex gap-2">
              <Skeleton width="32px" height="32px" className="rounded-md" />
              <Skeleton width="32px" height="32px" className="rounded-md" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col min-h-0">
          <div className="flex-1 flex flex-col">
            <div className="flex-1 relative bg-zinc-100 dark:bg-zinc-800/50 border border-zinc-300 dark:border-zinc-700 rounded-md overflow-hidden">
              <div className="p-4 space-y-3">
                <Skeleton width="100%" height="16px" />
                <Skeleton width="95%" height="16px" />
                <Skeleton width="90%" height="16px" />
                <Skeleton width="85%" height="16px" />
                <Skeleton width="100%" height="16px" />
                <Skeleton width="80%" height="16px" />
                <Skeleton width="95%" height="16px" />
                <Skeleton width="88%" height="16px" />
                <Skeleton width="92%" height="16px" />
                <Skeleton width="85%" height="16px" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (variant === 'browser') {
    return (
      <Card className="h-full flex flex-col bg-zinc-100 dark:bg-zinc-900/50 border-zinc-300 dark:border-zinc-800">
        <CardHeader className="flex-shrink-0 pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-2">
              <Skeleton width="20px" height="20px" className="rounded" />
              <Skeleton width="140px" height="24px" />
            </div>
            <Skeleton width="80px" height="32px" className="rounded-md" />
          </div>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col min-h-0">
          <div className="flex-1 flex flex-col">
            <div className="space-y-3">
              {/* Table cards */}
              {Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="p-4 border border-zinc-300 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-800/50">
                  <div className="flex items-center justify-between mb-3">
                    <Skeleton width="100px" height="20px" />
                    <Skeleton width="60px" height="20px" className="rounded-full" />
                  </div>
                  <div className="space-y-2">
                    {Array.from({ length: 4 }).map((_, j) => (
                      <div key={j} className="flex items-center gap-2">
                        <Skeleton width="80px" height="16px" />
                        <Skeleton width="60px" height="16px" className="rounded-full" />
                        <Skeleton width="40px" height="16px" className="rounded-full" />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return null
}

// Specific skeleton for syntax highlighting loading
export function SyntaxHighlightingSkeleton() {
  return (
    <div className="flex items-center justify-center h-32">
      <div className="flex items-center gap-3">
        <div className="relative">
          <div className="w-6 h-6 border-2 border-zinc-300 dark:border-zinc-600 rounded-full animate-spin border-t-transparent"></div>
        </div>
        <Skeleton width="120px" height="16px" />
      </div>
    </div>
  )
}

// Skeleton for the entire query builder page
export function QueryBuilderPageSkeleton() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          {/* Header */}
          <div className="text-center space-y-4">
            <Skeleton width="300px" height="32px" className="mx-auto" />
            <Skeleton width="200px" height="20px" className="mx-auto" />
          </div>

          {/* Main Content Grid */}
          <div className="space-y-6">
            {/* Top Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <QueryBuilderSkeleton variant="schema" />
              <QueryBuilderSkeleton variant="browser" />
            </div>

            {/* Bottom Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <QueryBuilderSkeleton variant="query" />
              <QueryBuilderSkeleton variant="code" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
