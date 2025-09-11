import React, { useEffect, useState, useCallback, useMemo, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card'
import { Button } from '@/shared/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/tabs'
import { CodeBlock } from '@/components/code-block'
import { SchemaBuilder } from './SchemaBuilder'
import { useSchema, ParsedTable, ParsedField } from './SchemaContext'
import { FileCode, RefreshCw, Sparkles, Code, Settings, Edit3 } from 'lucide-react'
import { QueryBuilderSkeleton } from './QueryBuilderSkeleton'

function parseSchema(schemaText: string): ParsedTable[] {
  const tables: ParsedTable[] = []
  
  try {
    // Improved regex patterns for Drizzle schema parsing
    // Use a more robust approach to handle nested braces
    const tableRegex = /export\s+const\s+(\w+)\s*=\s*(?:mysqlTable|pgTable|sqliteTable|table)\s*\(\s*["']([^"']+)["']\s*,\s*\{/g
    
    let tableMatch
    while ((tableMatch = tableRegex.exec(schemaText)) !== null) {
      const [, tableName, dbTableName] = tableMatch
      const startIndex = tableMatch.index + tableMatch[0].length
      
      // Find the matching closing brace by counting braces
      let braceCount = 1
      let endIndex = startIndex
      
      while (endIndex < schemaText.length && braceCount > 0) {
        if (schemaText[endIndex] === '{') braceCount++
        else if (schemaText[endIndex] === '}') braceCount--
        endIndex++
      }
      
      if (braceCount === 0) {
        const fieldsBlock = schemaText.substring(startIndex, endIndex - 1)
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
          
          // Type extraction - look for direct type patterns (not t.type())
          if (fieldDef.includes('text(')) type = 'text'
          else if (fieldDef.includes('varchar(')) type = 'varchar'
          else if (fieldDef.includes('serial(')) type = 'serial'
          else if (fieldDef.includes('int(')) type = 'int'
          else if (fieldDef.includes('timestamp(')) type = 'timestamp'
          else if (fieldDef.includes('boolean(')) type = 'boolean'
          else if (fieldDef.includes('bigint(')) type = 'bigint'
          else if (fieldDef.includes('decimal(')) type = 'decimal'
          else if (fieldDef.includes('date(')) type = 'date'
          else if (fieldDef.includes('json(')) type = 'json'
          else if (fieldDef.includes('uuid(')) type = 'uuid'
          else if (fieldDef.includes('real(')) type = 'real'
          else if (fieldDef.includes('blob(')) type = 'blob'
          else if (fieldDef.includes('pgEnum(')) {
            // Handle enum types - extract the enum name
            const enumMatch = fieldDef.match(/(\w+)\s*\(/)
            if (enumMatch) {
              type = enumMatch[1]
            }
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
    }
  } catch (error) {
    console.error('Schema parsing error:', error)
    // Return empty array on parsing error instead of throwing
    return []
  }
  
  return tables
}

// Schema Editor Component using CodeBlock
const SchemaEditor = React.memo(({ 
  value, 
  onChange, 
  placeholder 
}: { 
  value: string
  onChange: (value: string) => void
  placeholder: string 
}) => {
  const [isEditing, setIsEditing] = useState(false)
  const [editValue, setEditValue] = useState(value)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  
  useEffect(() => {
    setEditValue(value)
  }, [value])
  
  const handleSave = () => {
    onChange(editValue)
    setIsEditing(false)
  }
  
  const handleCancel = () => {
    setEditValue(value)
    setIsEditing(false)
  }
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      handleCancel()
    } else if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      handleSave()
    }
  }
  
  if (isEditing) {
    return (
      <div className="relative flex-1">
        <textarea
          ref={textareaRef}
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="w-full h-full font-mono resize-none bg-zinc-50 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 placeholder-zinc-500 dark:placeholder-zinc-500 p-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          style={{
            fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace',
            fontSize: '14px',
            lineHeight: '1.5',
            minHeight: '300px'
          }}
          autoFocus
        />
        <div className="absolute top-2 right-2 flex gap-2">
          <Button size="sm" onClick={handleSave} className="bg-green-600 hover:bg-green-700">
            Save
          </Button>
          <Button size="sm" variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
        </div>
      </div>
    )
  }
  
  return (
    <div className="relative flex-1">
      <CodeBlock
        code={value || placeholder}
        language="typescript"
        showLineNumbers={true}
        showMetaInfo={false}
        maxHeight="400px"
        className="h-full"
        showIcon={true}
        enableLineHover={true}
        onCopy={() => {}}
      />
      <Button
        onClick={() => setIsEditing(true)}
        className="absolute top-2 right-2 bg-blue-600 hover:bg-blue-700"
        size="sm"
      >
        <Edit3 className="w-4 h-4 mr-1" />
        Edit
      </Button>
    </div>
  )
})

export const SchemaParser = React.memo(() => {
  const { schemaText, setSchemaText, setParsedTables, setSelectedTable } = useSchema()
  const [activeTab, setActiveTab] = useState('input')
  const [parseError, setParseError] = useState<string | null>(null)
  const [isParsing, setIsParsing] = useState(false)
  
  const handleParse = useCallback(() => {
    setIsParsing(true)
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
    } finally {
      setIsParsing(false)
    }
  }, [schemaText, setParsedTables, setSelectedTable])
  
  // Real-time syntax highlighting is now handled by SyntaxEditor component
  
  useEffect(() => {
    if (schemaText.trim()) {
      handleParse()
    } else {
      setParsedTables([])
      setParseError(null)
    }
  }, [schemaText, handleParse, setParsedTables])
  
  const handlePaste = useCallback(() => {
    navigator.clipboard.readText().then(text => {
      setSchemaText(text)
    }).catch(error => {
      console.error('Failed to paste:', error)
    })
  }, [setSchemaText])
  
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
    <Card className="h-full flex flex-col bg-zinc-100 dark:bg-zinc-900/50 border-zinc-300 dark:border-zinc-800">
      <CardHeader className="flex-shrink-0 pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-2">
            <FileCode className="w-5 h-5 text-zinc-700 dark:text-zinc-300" />
            <CardTitle className="text-zinc-900 dark:text-zinc-100 text-lg">Schema Input</CardTitle>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={loadDemo} className="flex items-center gap-1">
              <Sparkles className="w-4 h-4" />
              <span className="hidden sm:inline">Demo</span>
            </Button>
            {activeTab === 'input' && (
              <>
                <Button variant="outline" size="sm" onClick={handlePaste}>
                  <span className="hidden sm:inline">Paste</span>
                  <span className="sm:hidden">📋</span>
                </Button>
                <Button variant="outline" size="sm" onClick={handleParse} className="flex items-center gap-1">
                  <RefreshCw className="w-4 h-4" />
                  <span className="hidden sm:inline">Parse</span>
                </Button>
              </>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col min-h-0">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col min-h-0">
          <TabsList className="w-full bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-400 flex h-10 items-center justify-center rounded-lg p-1 flex-shrink-0 mb-4">
            <TabsTrigger 
              value="input" 
              className="flex items-center gap-1 sm:gap-2 flex-1 data-[state=active]:bg-zinc-300 dark:data-[state=active]:bg-zinc-700 data-[state=active]:text-zinc-900 dark:data-[state=active]:text-zinc-100 data-[state=active]:shadow-sm rounded-md px-2 sm:px-3 py-2 text-sm font-medium transition-all"
            >
              <Code className="w-4 h-4" />
              <span className="hidden sm:inline">Text Input</span>
              <span className="sm:hidden">Input</span>
            </TabsTrigger>
            <TabsTrigger 
              value="builder" 
              className="flex items-center gap-1 sm:gap-2 flex-1 data-[state=active]:bg-zinc-300 dark:data-[state=active]:bg-zinc-700 data-[state=active]:text-zinc-900 dark:data-[state=active]:text-zinc-100 data-[state=active]:shadow-sm rounded-md px-2 sm:px-3 py-2 text-sm font-medium transition-all"
            >
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline">Visual Builder</span>
              <span className="sm:hidden">Builder</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="input" className="flex-1 flex flex-col min-h-0 mt-0">
            <div className="flex-1 flex flex-col">
              {isParsing ? (
                <QueryBuilderSkeleton variant="schema" />
              ) : (
                <SchemaEditor
                  value={schemaText}
                  onChange={setSchemaText}
                  placeholder="📝 Paste your Drizzle schema here...

💡 Example Schema:
import { pgTable } from 'drizzle-orm/pg-core';
import * as t from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: t.int().primaryKey(),
  name: t.text().notNull(),
  email: t.text().unique(),
  age: t.int(),
  isActive: t.boolean().default(true),
  createdAt: t.timestamp().defaultNow()
});

export const posts = pgTable('posts', {
  id: t.int().primaryKey(),
  title: t.text().notNull(),
  content: t.text(),
  authorId: t.int().references(() => users.id),
  published: t.boolean().default(false)
});

✨ Supported dialects: PostgreSQL, MySQL, SQLite
🔧 Auto-detects: table names, field types, constraints
⚡ Beautiful syntax highlighting with your CodeBlock!"
                />
              )}
              
              {/* Parse Error Display */}
              {parseError && (
                <div className="mt-4 p-3 bg-red-100 dark:bg-red-900/20 border border-red-300 dark:border-red-800 rounded-md">
                  <div className="text-sm text-red-800 dark:text-red-400 font-medium">Parse Error:</div>
                  <div className="text-xs text-red-700 dark:text-red-300 mt-1">{parseError}</div>
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
});