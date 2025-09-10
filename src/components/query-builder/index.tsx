"use client"

import React, { useState } from 'react'
import {Toaster} from 'sonner'
import { CodeGenerator } from './CodeGenerator'
import { SchemaBrowser } from './SchemaBrowser'
import { SchemaProvider } from './SchemaContext'
import { SchemaParser } from './SchemaParser'
import { QueryBuilder } from './QueryBuilder'
import { Button } from '@/shared/ui/button'
import { Maximize2, Minimize2, Layout, Code } from 'lucide-react'

export default function QueryBuilderPage() {
  const [isCodeExpanded, setIsCodeExpanded] = useState(false)
  const [activeView, setActiveView] = useState<'grid' | 'code'>('grid')

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
      <SchemaProvider>
        <div className="container mx-auto px-4 py-6 max-w-7xl">
          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold mb-2">CRUD Query Builder</h1>
                <p className="text-zinc-600 dark:text-zinc-400 text-lg">
                  Build and test CRUD operations using your custom abstraction layer
                </p>
              </div>
              
              {/* View Controls */}
              <div className="flex items-center gap-2">
                <Button
                  variant={activeView === 'grid' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setActiveView('grid')}
                  className="flex items-center gap-2"
                >
                  <Layout className="w-4 h-4" />
                  <span className="hidden sm:inline">Grid View</span>
                </Button>
                <Button
                  variant={activeView === 'code' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setActiveView('code')}
                  className="flex items-center gap-2"
                >
                  <Code className="w-4 h-4" />
                  <span className="hidden sm:inline">Code Focus</span>
                </Button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          {activeView === 'grid' ? (
            <div className="space-y-6">
              {/* Top Row - Schema Input and Browser */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="min-h-[400px]">
                  <SchemaParser />
                </div>
                <div className="min-h-[400px]">
                  <SchemaBrowser />
                </div>
              </div>

              {/* Bottom Row - Query Builder and Code Generator */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="min-h-[400px]">
                  <QueryBuilder />
                </div>
                <div className="min-h-[400px]">
                  <CodeGenerator 
                    isExpanded={isCodeExpanded}
                    onExpandToggle={setIsCodeExpanded}
                  />
                </div>
              </div>
            </div>
          ) : (
            /* Code Focus View */
            <div className="space-y-6">
              {/* Schema Input - Compact */}
              <div className="max-w-4xl mx-auto">
                <SchemaParser />
              </div>
              
              {/* Code Generator - Expanded */}
              <div className="min-h-[600px]">
                <CodeGenerator 
                  isExpanded={true}
                  onExpandToggle={setIsCodeExpanded}
                />
              </div>
            </div>
          )}
        </div>
        <Toaster />
      </SchemaProvider>
    </div>
  )
}