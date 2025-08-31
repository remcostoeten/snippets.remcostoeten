import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card'
import { Button } from '@/shared/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/tabs'
import { useSchema } from './SchemaContext'
import { Code, Copy, Check, FileText, Download, Braces, Layout, Server, Maximize2, Minimize2 } from 'lucide-react'
import { toast } from 'sonner'
import { codeToHtml } from 'shiki'

interface CodeGeneratorProps {
  isExpanded?: boolean
  onExpandToggle?: (expanded: boolean) => void
}

export function CodeGenerator({ isExpanded = false, onExpandToggle }: CodeGeneratorProps) {
  const { generatedCode, setGeneratedCode, selectedTable, queryConfig, parsedTables } = useSchema()
  const [copied, setCopied] = useState('')
  const [activeTab, setActiveTab] = useState('function')
  const [highlightedCode, setHighlightedCode] = useState<{[key: string]: string}>({})
  const [isHighlighting, setIsHighlighting] = useState(false)
  
  const selectedTableSchema = parsedTables.find(t => t.name === selectedTable)
  
  useEffect(() => {
    generateAllCode()
  }, [queryConfig, selectedTableSchema])

  // Highlight code with Shiki when it changes
  useEffect(() => {
    const highlightAllCode = async () => {
      if (!selectedTableSchema || !queryConfig.table) return

      setIsHighlighting(true)
      const functionCode = generateFunctionCode()
      const serverCode = generateServerActionCode()
      const pageCode = generatePageCode()

      try {
        const [functionHtml, serverHtml, pageHtml] = await Promise.all([
          codeToHtml(functionCode, { lang: 'typescript', theme: 'dark-plus' }),
          codeToHtml(serverCode, { lang: 'typescript', theme: 'dark-plus' }),
          codeToHtml(pageCode, { lang: 'typescript', theme: 'dark-plus' })
        ])

        setHighlightedCode({
          function: functionHtml,
          server: serverHtml,
          page: pageHtml
        })
      } catch (error) {
        console.error('Shiki highlighting error:', error)
        // Fallback to plain text
        setHighlightedCode({
          function: `<pre><code>${functionCode}</code></pre>`,
          server: `<pre><code>${serverCode}</code></pre>`,
          page: `<pre><code>${pageCode}</code></pre>`
        })
      }
      setIsHighlighting(false)
    }

    highlightAllCode()
  }, [queryConfig, selectedTableSchema])
  
  const generateAllCode = () => {
    if (!selectedTableSchema || !queryConfig.table) {
      return
    }
    
    const functionCode = generateFunctionCode()
    const serverCode = generateServerActionCode()
    const pageCode = generatePageCode()
    
    setGeneratedCode(functionCode) // Default to function code
  }
  
  const generateFunctionCode = () => {
    if (!selectedTableSchema || !queryConfig.table) return ''
    
    let code = `// CRUD Function\n`
    
    const functionName = `${queryConfig.operation}${selectedTable.charAt(0).toUpperCase() + selectedTable.slice(1)}`
    
    switch (queryConfig.operation) {
      case 'create':
        const createFields = selectedTableSchema.fields
          .filter(f => !f.isPrimary)
          .map(f => `${f.name}${f.isNotNull ? '' : '?'}: ${getTypeScriptType(f.type)}`)
          .join(', ')
        
        code += `async function ${functionName}(data: { ${createFields} }) {\n`
        code += `  const ${queryConfig.table}Crud = CrudAbstractions(${queryConfig.table})\n\n`
        code += `  const newRecord = await ${queryConfig.table}Crud.create()\n`
        code += `    .run(data)\n\n`
        code += `  return newRecord\n`
        code += `}`
        break
        
      case 'get':
        const whereParam = queryConfig.whereClause?.column 
          ? `${queryConfig.whereClause.column}: ${getTypeScriptType(selectedTableSchema.fields.find(f => f.name === queryConfig.whereClause?.column)?.type || 'string')}`
          : null
        
        code += `async function ${functionName}(`
        if (whereParam) code += `${whereParam}`
        code += `) {\n`
        code += `  const ${queryConfig.table}Crud = CrudAbstractions(${queryConfig.table})\n\n`
        code += `  const records = await ${queryConfig.table}Crud.get("${queryConfig.quantity || 'All'}")\n`
        if (queryConfig.whereClause?.column) {
          code += `    .Where("${queryConfig.whereClause.column}", ${queryConfig.whereClause.column})\n`
        }
        if (queryConfig.orderBy?.column) {
          code += `    .Order("${queryConfig.orderBy.column}", "${queryConfig.orderBy.direction}")\n`
        }
        if (queryConfig.limit && queryConfig.limit > 0) {
          code += `    .Limit(${queryConfig.limit})\n`
        }
        code += `    .run()\n\n`
        code += `  return records\n`
        code += `}`
        break
        
      case 'update':
        const updateFields = selectedTableSchema.fields
          .filter(f => !f.isPrimary)
          .map(f => `${f.name}?: ${getTypeScriptType(f.type)}`)
          .join(', ')
        
        const updateWhereParam = queryConfig.whereClause?.column 
          ? `${queryConfig.whereClause.column}: ${getTypeScriptType(selectedTableSchema.fields.find(f => f.name === queryConfig.whereClause?.column)?.type || 'string')}`
          : 'id: number'
        
        code += `async function ${functionName}(${updateWhereParam}, updates: { ${updateFields} }) {\n`
        code += `  const ${queryConfig.table}Crud = CrudAbstractions(${queryConfig.table})\n\n`
        code += `  const updatedRecords = await ${queryConfig.table}Crud.update()\n`
        const whereCol = queryConfig.whereClause?.column || 'id'
        code += `    .Where("${whereCol}", ${whereCol})\n`
        code += `    .Set(updates)\n`
        code += `    .run()\n\n`
        code += `  return updatedRecords\n`
        code += `}`
        break
        
      case 'destroy':
        const deleteWhereParam = queryConfig.whereClause?.column 
          ? `${queryConfig.whereClause.column}: ${getTypeScriptType(selectedTableSchema.fields.find(f => f.name === queryConfig.whereClause?.column)?.type || 'string')}`
          : 'id: number'
        
        code += `async function ${functionName}(${deleteWhereParam}) {\n`
        code += `  const ${queryConfig.table}Crud = CrudAbstractions(${queryConfig.table})\n\n`
        const deleteWhereCol = queryConfig.whereClause?.column || 'id'
        code += `  const deletedRecords = await ${queryConfig.table}Crud.destroy()\n`
        code += `    .Where("${deleteWhereCol}", ${deleteWhereCol})\n`
        code += `    .run()\n\n`
        code += `  return deletedRecords\n`
        code += `}`
        break
    }
    
    return code
  }
  
  const generateServerActionCode = () => {
    if (!selectedTableSchema || !queryConfig.table) return ''
    
    const functionCode = generateFunctionCode()
    
    return `'use server'

import { db } from '@/lib/db'
import { ${queryConfig.table} } from '@/lib/schema'
import { CrudAbstractions } from '@/lib/crud-abstractions'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

${functionCode}

// Usage in Server Action
export async function handle${queryConfig.operation.charAt(0).toUpperCase() + queryConfig.operation.slice(1)}${selectedTable.charAt(0).toUpperCase() + selectedTable.slice(1)}(formData: FormData) {
  try {
    ${queryConfig.operation === 'create' ? `
    const data = {
      ${selectedTableSchema.fields.filter(f => !f.isPrimary).map(f => 
        `${f.name}: formData.get('${f.name}') as string`
      ).join(',\n      ')}
    }
    
    const result = await ${queryConfig.operation}${selectedTable.charAt(0).toUpperCase() + selectedTable.slice(1)}(data)
    ` : queryConfig.operation === 'get' ? `
    const result = await ${queryConfig.operation}${selectedTable.charAt(0).toUpperCase() + selectedTable.slice(1)}()
    return result
    ` : `
    const ${queryConfig.whereClause?.column || 'id'} = formData.get('${queryConfig.whereClause?.column || 'id'}') as string
    const result = await ${queryConfig.operation}${selectedTable.charAt(0).toUpperCase() + selectedTable.slice(1)}(${queryConfig.operation === 'update' ? `${queryConfig.whereClause?.column || 'id'}, data` : queryConfig.whereClause?.column || 'id'})
    `}
    
    revalidatePath('/${queryConfig.table}')
    return { success: true, data: result }
  } catch (error) {
    console.error('Server action error:', error)
    return { success: false, error: 'Failed to ${queryConfig.operation} ${queryConfig.table}' }
  }
}`
  }
  
  const generatePageCode = () => {
    if (!selectedTableSchema || !queryConfig.table) return ''
    
    const componentName = `${selectedTable.charAt(0).toUpperCase() + selectedTable.slice(1)}Page`
    
    return `import React from 'react'
import { ${queryConfig.table} } from '@/lib/schema'
import { handle${queryConfig.operation.charAt(0).toUpperCase() + queryConfig.operation.slice(1)}${selectedTable.charAt(0).toUpperCase() + selectedTable.slice(1)} } from '@/app/actions'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function ${componentName}() {
  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>${queryConfig.operation.charAt(0).toUpperCase() + queryConfig.operation.slice(1)} ${selectedTable.charAt(0).toUpperCase() + selectedTable.slice(1)}</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={handle${queryConfig.operation.charAt(0).toUpperCase() + queryConfig.operation.slice(1)}${selectedTable.charAt(0).toUpperCase() + selectedTable.slice(1)}}>
            ${queryConfig.operation === 'create' ? 
              selectedTableSchema.fields
                .filter(f => !f.isPrimary)
                .map(f => `
            <div className="space-y-2">
              <Label htmlFor="${f.name}">${f.name.charAt(0).toUpperCase() + f.name.slice(1)}</Label>
              <Input
                id="${f.name}"
                name="${f.name}"
                type="${getInputType(f.type)}"
                ${f.isNotNull ? 'required' : ''}
              />
            </div>`).join('\n') :
              queryConfig.operation === 'update' ? `
            <div className="space-y-2">
              <Label htmlFor="${queryConfig.whereClause?.column || 'id'}">${(queryConfig.whereClause?.column || 'ID').charAt(0).toUpperCase() + (queryConfig.whereClause?.column || 'id').slice(1)}</Label>
              <Input
                id="${queryConfig.whereClause?.column || 'id'}"
                name="${queryConfig.whereClause?.column || 'id'}"
                type="${getInputType(selectedTableSchema.fields.find(f => f.name === (queryConfig.whereClause?.column || 'id'))?.type || 'number')}"
                required
              />
            </div>
            ${selectedTableSchema.fields
              .filter(f => !f.isPrimary)
              .map(f => `
            <div className="space-y-2">
              <Label htmlFor="${f.name}">${f.name.charAt(0).toUpperCase() + f.name.slice(1)}</Label>
              <Input
                id="${f.name}"
                name="${f.name}"
                type="${getInputType(f.type)}"
              />
            </div>`).join('\n')}` :
              queryConfig.operation === 'destroy' ? `
            <div className="space-y-2">
              <Label htmlFor="${queryConfig.whereClause?.column || 'id'}">${(queryConfig.whereClause?.column || 'ID').charAt(0).toUpperCase() + (queryConfig.whereClause?.column || 'id').slice(1)}</Label>
              <Input
                id="${queryConfig.whereClause?.column || 'id'}"
                name="${queryConfig.whereClause?.column || 'id'}"
                type="${getInputType(selectedTableSchema.fields.find(f => f.name === (queryConfig.whereClause?.column || 'id'))?.type || 'number')}"
                required
              />
            </div>` : ''
            }
            
            <Button type="submit" className="mt-4">
              ${queryConfig.operation.charAt(0).toUpperCase() + queryConfig.operation.slice(1)} ${selectedTable.charAt(0).toUpperCase() + selectedTable.slice(1)}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

// Type definitions
type ${selectedTable.charAt(0).toUpperCase() + selectedTable.slice(1)}Type = typeof ${queryConfig.table}.$inferSelect`
  }
  
  const getTypeScriptType = (drizzleType: string): string => {
    switch (drizzleType.toLowerCase()) {
      case 'int': return 'number'
      case 'varchar': return 'string'
      case 'text': return 'string'
      case 'boolean': return 'boolean'
      case 'timestamp': return 'Date'
      default: return 'string'
    }
  }
  
  const getInputType = (drizzleType: string): string => {
    switch (drizzleType.toLowerCase()) {
      case 'int': return 'number'
      case 'boolean': return 'checkbox'
      case 'timestamp': return 'datetime-local'
      case 'varchar': return 'text'
      case 'text': return 'textarea'
      default: return 'text'
    }
  }
  

  
  const copyToClipboard = async (code: string, type: string) => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(type)
      toast.success(`${type} code copied to clipboard!`)
      setTimeout(() => setCopied(''), 2000)
    } catch (err) {
      toast.error('Failed to copy code')
    }
  }
  
  const downloadCode = (code: string, filename: string) => {
    const blob = new Blob([code], { type: 'text/typescript' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    toast.success(`${filename} downloaded!`)
  }

  const handleExpandToggle = () => {
    if (onExpandToggle) {
      onExpandToggle(!isExpanded)
    }
  }
  
  if (!selectedTableSchema || !queryConfig.table) {
    return (
      <Card className="h-full bg-card border-border">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Code className="w-4 h-4" />
            <CardTitle>Generated Code</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="flex items-center justify-center text-muted-foreground">
          <div className="text-center">
            <FileText className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>Configure a query to see generated code</p>
          </div>
        </CardContent>
      </Card>
    )
  }
  
  const functionCode = generateFunctionCode()
  const serverCode = generateServerActionCode()
  const pageCode = generatePageCode()
  
  return (
    <Card className="h-full bg-card border-border">
      <CardHeader className="flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Code className="w-4 h-4" />
            <CardTitle>Generated Code</CardTitle>
          </div>
          {onExpandToggle && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleExpandToggle}
              className="h-8 w-8 p-0"
            >
              {isExpanded ? (
                <Minimize2 className="w-4 h-4" />
              ) : (
                <Maximize2 className="w-4 h-4" />
              )}
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col min-h-0">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col min-h-0">
          <TabsList className="w-full bg-muted text-muted-foreground flex h-9 items-center justify-center rounded-lg p-1 flex-shrink-0">
            <TabsTrigger 
              value="function" 
              className="flex items-center gap-2 flex-1 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm rounded-md px-3 py-1.5 text-sm font-medium transition-all"
            >
              <Braces className="w-4 h-4" />
              Function
            </TabsTrigger>
            <TabsTrigger 
              value="server" 
              className="flex items-center gap-2 flex-1 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm rounded-md px-3 py-1.5 text-sm font-medium transition-all"
            >
              <Server className="w-4 h-4" />
              Server Action
            </TabsTrigger>
            <TabsTrigger 
              value="page" 
              className="flex items-center gap-2 flex-1 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm rounded-md px-3 py-1.5 text-sm font-medium transition-all"
            >
              <Layout className="w-4 h-4" />
              Page Component
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="function" className="flex-1 flex flex-col mt-4 min-h-0">
            <div className="flex items-center justify-between mb-3 flex-shrink-0">
              <p className="text-sm text-muted-foreground">Reusable CRUD function</p>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => downloadCode(functionCode, `${queryConfig.operation}-${selectedTable}.ts`)}
                >
                  <Download className="w-4 h-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => copyToClipboard(functionCode, 'Function')}
                >
                  {copied === 'Function' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </Button>
              </div>
            </div>
            <div className="flex-1 min-h-0">
              <div className="bg-muted/20 rounded-md overflow-auto border border-muted h-full">
                {isHighlighting ? (
                  <div className="flex items-center justify-center h-32">
                    <div className="w-6 h-6 border-2 border-muted-foreground border-t-transparent rounded-full animate-spin"></div>
                  </div>
                ) : highlightedCode.function ? (
                  <div 
                    className="text-sm leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: highlightedCode.function }}
                  />
                ) : (
                  <pre className="p-4 font-mono text-sm leading-relaxed h-full whitespace-pre-wrap break-words">
                    <code>{functionCode}</code>
                  </pre>
                )}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="server" className="flex-1 flex flex-col mt-4 min-h-0">
            <div className="flex items-center justify-between mb-3 flex-shrink-0">
              <p className="text-sm text-muted-foreground">Next.js Server Action with form handling</p>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => downloadCode(serverCode, `${queryConfig.operation}-${selectedTable}-action.ts`)}
                >
                  <Download className="w-4 h-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => copyToClipboard(serverCode, 'Server')}
                >
                  {copied === 'Server' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </Button>
              </div>
            </div>
            <div className="flex-1 min-h-0">
              <div className="bg-muted/20 rounded-md overflow-auto border border-muted h-full">
                {isHighlighting ? (
                  <div className="flex items-center justify-center h-32">
                    <div className="w-6 h-6 border-2 border-muted-foreground border-t-transparent rounded-full animate-spin"></div>
                  </div>
                ) : highlightedCode.server ? (
                  <div 
                    className="text-sm leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: highlightedCode.server }}
                  />
                ) : (
                  <pre className="p-4 font-mono text-sm leading-relaxed h-full whitespace-pre-wrap break-words">
                    <code>{serverCode}</code>
                  </pre>
                )}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="page" className="flex-1 flex flex-col mt-4 min-h-0">
            <div className="flex items-center justify-between mb-3 flex-shrink-0">
              <p className="text-sm text-muted-foreground">React page component with form</p>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => downloadCode(pageCode, `${queryConfig.operation}-${selectedTable}-page.tsx`)}
                >
                  <Download className="w-4 h-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => copyToClipboard(pageCode, 'Page')}
                >
                  {copied === 'Page' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </Button>
              </div>
            </div>
            <div className="flex-1 min-h-0">
              <div className="bg-muted/20 rounded-md overflow-auto border border-muted h-full">
                {isHighlighting ? (
                  <div className="flex items-center justify-center h-32">
                    <div className="w-6 h-6 border-2 border-muted-foreground border-t-transparent rounded-full animate-spin"></div>
                  </div>
                ) : highlightedCode.page ? (
                  <div 
                    className="text-sm leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: highlightedCode.page }}
                  />
                ) : (
                  <pre className="p-4 font-mono text-sm leading-relaxed h-full whitespace-pre-wrap break-words">
                    <code>{pageCode}</code>
                  </pre>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
        {/* Usage Instructions */}
        <div className="mt-4 p-4 bg-muted/10 rounded-md border border-muted flex-shrink-0">
          <h4 className="font-medium mb-2">Usage Instructions</h4>
          <div className="text-sm text-muted-foreground space-y-1">
            <p>• <strong>Function:</strong> Copy into your utilities or services directory</p>
            <p>• <strong>Server Action:</strong> Place in <code className="bg-muted px-1 rounded">app/actions.ts</code> for Next.js</p>
            <p>• <strong>Page Component:</strong> Use as <code className="bg-muted px-1 rounded">app/{selectedTable}/page.tsx</code></p>
            <p>• Import your schema: <code className="bg-muted px-1 rounded">import {`{${selectedTable}}`} from '@/lib/schema'</code></p>
            <p>• Import CRUD abstractions: <code className="bg-muted px-1 rounded">import {`{CrudAbstractions}`} from '@/lib/crud-abstractions'</code></p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}