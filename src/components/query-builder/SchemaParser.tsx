import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card'
import { Textarea } from '@/shared/ui/textarea'
import { Button } from '@/shared/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/tabs'
import { SchemaBuilder } from './SchemaBuilder'
import { useSchema, ParsedTable, ParsedField } from './SchemaContext'
import { FileCode, RefreshCw, Sparkles, Code, Settings } from 'lucide-react'
import { codeToHtml } from 'shiki'

function parseSchema(schemaText: string): ParsedTable[] {
  const tables: ParsedTable[] = []
  
  try {
    // Improved regex patterns for Drizzle schema parsing
    // First, extract table blocks more robustly
    const tableBlockPattern = /export\s+const\s+(\w+)\s*=\s*(?:mysqlTable|pgTable|sqliteTable|table)\s*\(\s*["']([^"']+)["']\s*,\s*\{([^}]*)\}/g
    
    let tableMatch
    while ((tableMatch = tableBlockPattern.exec(schemaText)) !== null) {
      const [, tableName, dbTableName, fieldsBlock] = tableMatch
      const fields: ParsedField[] = []
      
      // Parse individual fields within the table block
      // Split by commas but be careful about nested objects/functions
      const fieldLines = fieldsBlock.split('\n').map(line => line.trim()).filter(line => line.length > 0)
      
      for (const line of fieldLines) {
        // Skip comments and empty lines
        if (line.startsWith('//') || line.startsWith('/*') || !line.includes(':')) {
          continue
        }
        
        // Extract field name and definition
        const colonIndex = line.indexOf(':')
        if (colonIndex === -1) continue
        
        const fieldName = line.substring(0, colonIndex).trim()
        const fieldDef = line.substring(colonIndex + 1).trim().replace(/,$/, '') // Remove trailing comma
        
        if (!fieldName || !fieldDef) continue
        
        const constraints: string[] = []
        
        // Extract basic type info with improved pattern
        let type = 'text' // default fallback
        
        // Type extraction - look for t.type() patterns
        const typeMatch = fieldDef.match(/t\.(\w+)\s*\(/)
        if (typeMatch) {
          type = typeMatch[1]
        } else {
          // Fallback for other patterns
          if (fieldDef.includes('varchar')) type = 'varchar'
          else if (fieldDef.includes('int')) type = 'int'
          else if (fieldDef.includes('text')) type = 'text'
          else if (fieldDef.includes('timestamp')) type = 'timestamp'
          else if (fieldDef.includes('boolean')) type = 'boolean'
          else if (fieldDef.includes('bigint')) type = 'bigint'
          else if (fieldDef.includes('decimal')) type = 'decimal'
          else if (fieldDef.includes('date')) type = 'date'
          else if (fieldDef.includes('json')) type = 'json'
          else if (fieldDef.includes('uuid')) type = 'uuid'
          else if (fieldDef.includes('real')) type = 'real'
          else if (fieldDef.includes('blob')) type = 'blob'
        }
        
        // Check for common modifiers with improved patterns
        if (fieldDef.includes('.primaryKey(')) constraints.push('PRIMARY KEY')
        if (fieldDef.includes('.notNull(')) constraints.push('NOT NULL')
        if (fieldDef.includes('.unique(')) constraints.push('UNIQUE')
        
        fields.push({
          name: fieldName,
          type,
          constraints,
          isPrimary: constraints.includes('PRIMARY KEY'),
          isUnique: constraints.includes('UNIQUE'),
          isNotNull: constraints.includes('NOT NULL')
        })
      }
      
      if (fields.length > 0) {
        tables.push({
          name: tableName,
          fields
        })
      }
    }
  } catch (error) {
    console.error('Schema parsing error:', error)
    // Return empty array on parsing error instead of throwing
    return []
  }
  
  return tables
}

export function SchemaParser() {
  const { schemaText, setSchemaText, setParsedTables, setSelectedTable } = useSchema()
  const [activeTab, setActiveTab] = useState('input')
  const [parseError, setParseError] = useState<string | null>(null)
  const [highlightedCode, setHighlightedCode] = useState<string>('')
  const [isHighlighting, setIsHighlighting] = useState(false)
  
  const handleParse = () => {
    try {
      setParseError(null)
      const parsed = parseSchema(schemaText)
      setParsedTables(parsed)
      if (parsed.length > 0) {
        setSelectedTable(parsed[0].name)
      } else if (schemaText.trim()) {
        setParseError('No valid tables found in schema. Please check the syntax.')
      }
    } catch (error) {
      console.error('Parse error:', error)
      setParseError('Failed to parse schema. Please check the syntax.')
      setParsedTables([])
    }
  }
  
  // Highlight code with Shiki
  useEffect(() => {
    if (schemaText.trim() && !parseError) {
      setIsHighlighting(true)
      codeToHtml(schemaText, {
        lang: 'typescript',
        theme: 'dark-plus'
      }).then(html => {
        setHighlightedCode(html)
        setIsHighlighting(false)
      }).catch(error => {
        console.error('Shiki highlighting error:', error)
        setHighlightedCode(`<pre><code>${schemaText}</code></pre>`)
        setIsHighlighting(false)
      })
    } else {
      setHighlightedCode('')
    }
  }, [schemaText, parseError])
  
  useEffect(() => {
    if (schemaText.trim()) {
      handleParse()
    } else {
      setParsedTables([])
      setParseError(null)
    }
  }, [schemaText])
  
  const handlePaste = () => {
    navigator.clipboard.readText().then(text => {
      setSchemaText(text)
    }).catch(error => {
      console.error('Failed to paste:', error)
    })
  }
  
  const loadDemo = () => {
    const demoSchema = `import { pgTable } from "drizzle-orm/pg-core";
import * as t from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: t.int().primaryKey(),
  firstName: t.text("first_name").notNull(),
  lastName: t.text("last_name").notNull(),
  email: t.text().notNull().unique(),
  age: t.int(),
  isActive: t.boolean("is_active").default(true),
  createdAt: t.timestamp("created_at").defaultNow(),
  updatedAt: t.timestamp("updated_at").defaultNow()
});

export const posts = pgTable("posts", {
  id: t.int().primaryKey(),
  title: t.text().notNull(),
  content: t.text(),
  slug: t.text().unique(),
  authorId: t.int("author_id").notNull().references(() => users.id),
  published: t.boolean().default(false),
  createdAt: t.timestamp("created_at").defaultNow()
});

export const comments = pgTable("comments", {
  id: t.int().primaryKey(),
  text: t.text({ length: 256 }),
  postId: t.int("post_id").references(() => posts.id),
  authorId: t.int("author_id").references(() => users.id),
  createdAt: t.timestamp("created_at").defaultNow()
});`
    setSchemaText(demoSchema)
  }
  
  return (
    <Card className="h-full flex flex-col bg-card border-border">
      <CardHeader className="flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileCode className="w-4 h-4" />
            <CardTitle>Schema Input</CardTitle>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={loadDemo}>
              <Sparkles className="w-4 h-4 mr-1" />
              Demo
            </Button>
            {activeTab === 'input' && (
              <>
                <Button variant="outline" size="sm" onClick={handlePaste}>
                  Paste
                </Button>
                <Button variant="outline" size="sm" onClick={handleParse}>
                  <RefreshCw className="w-4 h-4" />
                </Button>
              </>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col min-h-0">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col min-h-0">
          <TabsList className="w-full bg-muted text-muted-foreground flex h-9 items-center justify-center rounded-lg p-1 flex-shrink-0 mb-4">
            <TabsTrigger 
              value="input" 
              className="flex items-center gap-2 flex-1 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm rounded-md px-3 py-1.5 text-sm font-medium transition-all"
            >
              <Code className="w-4 h-4" />
              Text Input
            </TabsTrigger>
            <TabsTrigger 
              value="builder" 
              className="flex items-center gap-2 flex-1 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm rounded-md px-3 py-1.5 text-sm font-medium transition-all"
            >
              <Settings className="w-4 h-4" />
              Visual Builder
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="input" className="flex-1 flex flex-col min-h-0 mt-0">
            <div className="flex-1 flex flex-col">
              <div className="flex-1 relative">
                <Textarea
                  value={schemaText}
                  onChange={(e) => setSchemaText(e.target.value)}
                  placeholder="Paste your Drizzle schema here...

Example:
import { pgTable } from 'drizzle-orm/pg-core';
import * as t from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: t.int().primaryKey(),
  name: t.text().notNull(),
  email: t.text().unique(),
  age: t.int(),
  isActive: t.boolean().default(true),
  createdAt: t.timestamp().defaultNow()
})

export const posts = pgTable('posts', {
  id: t.int().primaryKey(),
  title: t.text().notNull(),
  content: t.text(),
  authorId: t.int().references(() => users.id),
  published: t.boolean().default(false)
})"
                  className="flex-1 font-mono resize-none bg-muted/20 border-muted h-full absolute inset-0"
                />
              </div>
              
              {/* Parse Error Display */}
              {parseError && (
                <div className="mt-4 p-3 bg-destructive/10 border border-destructive/20 rounded-md">
                  <div className="text-sm text-destructive font-medium">Parse Error:</div>
                  <div className="text-xs text-destructive/80 mt-1">{parseError}</div>
                </div>
              )}
              
              {/* Shiki Highlighted Preview */}
              {highlightedCode && !parseError && (
                <div className="mt-4 border-t border-muted pt-4">
                  <div className="text-sm text-muted-foreground mb-2 flex items-center gap-2">
                    Syntax Preview:
                    {isHighlighting && (
                      <div className="w-3 h-3 border-2 border-muted-foreground border-t-transparent rounded-full animate-spin"></div>
                    )}
                  </div>
                  <div className="bg-muted/10 rounded-md overflow-auto border border-muted/50 max-h-32">
                    <div 
                      className="text-xs leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: highlightedCode }}
                    />
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="builder" className="flex-1 flex flex-col min-h-0 mt-0">
            <SchemaBuilder />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}