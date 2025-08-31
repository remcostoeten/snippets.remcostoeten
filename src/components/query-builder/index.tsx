"use client"

import React, { useState } from 'react'
import {Toaster} from 'sonner'
import { CodeGenerator } from './CodeGenerator'
import { SchemaBrowser } from './SchemaBrowser'
import { SchemaProvider } from './SchemaContext'
import { SchemaParser } from './SchemaParser'
import { QueryBuilder } from './QueryBuilder'

export default function QueryBuilderPage() {
  const [isCodeExpanded, setIsCodeExpanded] = useState(false)

  return (
    <div className="dark text-foreground"
         style={{ colorScheme: 'dark' }}>
      <SchemaProvider>
        <div className="container mx-auto p-4 lg:p-6 max-w-full">
          <div className="mb-6 lg:mb-8">
            <h1 className="mb-2">CRUD Abstraction Playground</h1>
            <p className="text-muted-foreground">
              Build and test CRUD operations using your custom abstraction layer
            </p>
          </div>
          
          <div className={`grid gap-4 lg:gap-6 h-[calc(100vh-180px)] lg:h-[calc(100vh-200px)] transition-all duration-700 ease-out ${
            isCodeExpanded 
              ? 'grid-cols-1 lg:grid-cols-6' 
              : 'grid-cols-1 md:grid-cols-2 xl:grid-cols-4'
          }`}>
            {/* Schema Input */}
            <div className={`transition-all duration-700 ease-out ${
              isCodeExpanded 
                ? 'lg:col-span-1 transform scale-95 opacity-75' 
                : 'xl:col-span-1'
            }`}>
              <SchemaParser />
            </div>
            
            {/* Schema Browser */}
            <div className={`transition-all duration-700 ease-out ${
              isCodeExpanded 
                ? 'lg:col-span-1 transform scale-95 opacity-75' 
                : 'xl:col-span-1'
            }`}>
              <SchemaBrowser />
            </div>
            
            {/* Query Builder */}
            <div className={`transition-all duration-700 ease-out ${
              isCodeExpanded 
                ? 'lg:col-span-1 transform scale-95 opacity-75' 
                : 'xl:col-span-1'
            }`}>
              <QueryBuilder />
            </div>
            
            {/* Code Generator */}
            <div className={`transition-all duration-700 ease-out ${
              isCodeExpanded 
                ? 'lg:col-span-3 transform scale-105' 
                : 'xl:col-span-1'
            }`}>
              <CodeGenerator 
                isExpanded={isCodeExpanded}
                onExpandToggle={setIsCodeExpanded}
              />
            </div>
          </div>
        </div>
        <Toaster />
      </SchemaProvider>
    </div>
  )
}