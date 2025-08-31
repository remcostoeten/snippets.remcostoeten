import React, { useState, useEffect } from 'react'
import { Card, CardContent } from '@/shared/ui/card'
import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'
import { Label } from '@/shared/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select'
import { Checkbox } from '@/shared/ui/checkbox'
import { Plus, Trash2, Database } from 'lucide-react'
import { useSchema } from './SchemaContext'
import { codeToHtml } from 'shiki'

export type DatabaseDialect = 'postgresql' | 'mysql' | 'sqlite' | 'turso'

interface Column {
  id: string
  name: string
  type: string
  length?: number
  notNull: boolean
  primaryKey: boolean
  unique: boolean
  autoIncrement: boolean
  defaultValue?: string
}

interface Table {
  id: string
  name: string
  columns: Column[]
}

const dialectConfig = {
  postgresql: {
    tableFunction: 'pgTable',
    module: 'drizzle-orm/pg-core',
    prefix: 't',
    types: ['varchar', 'text', 'int', 'bigint', 'boolean', 'timestamp', 'date', 'decimal', 'json', 'jsonb', 'uuid'],
    imports: [
      'import { pgTable } from "drizzle-orm/pg-core";',
      'import * as t from "drizzle-orm/pg-core";'
    ]
  },
  mysql: {
    tableFunction: 'mysqlTable',
    module: 'drizzle-orm/mysql-core',
    prefix: 't',
    types: ['varchar', 'text', 'int', 'bigint', 'boolean', 'timestamp', 'date', 'decimal', 'json'],
    imports: [
      'import { mysqlTable } from "drizzle-orm/mysql-core";',
      'import * as t from "drizzle-orm/mysql-core";'
    ]
  },
  sqlite: {
    tableFunction: 'sqliteTable as table',
    module: 'drizzle-orm/sqlite-core',
    prefix: 't',
    types: ['text', 'int', 'real', 'blob'],
    imports: [
      'import { sqliteTable as table } from "drizzle-orm/sqlite-core";',
      'import * as t from "drizzle-orm/sqlite-core";',
      'import { AnySQLiteColumn } from "drizzle-orm/sqlite-core";'
    ]
  },
  turso: {
    tableFunction: 'sqliteTable as table',
    module: 'drizzle-orm/sqlite-core',
    prefix: 't',
    types: ['text', 'int', 'real', 'blob'],
    imports: [
      'import { sqliteTable as table } from "drizzle-orm/sqlite-core";',
      'import * as t from "drizzle-orm/sqlite-core";',
      'import { AnySQLiteColumn } from "drizzle-orm/sqlite-core";'
    ]
  }
}

export function SchemaBuilder() {
  const { setSchemaText } = useSchema()
  const [dialect, setDialect] = useState<DatabaseDialect>('postgresql')
  const [tables, setTables] = useState<Table[]>([])
  const [highlightedPreview, setHighlightedPreview] = useState<string>('')
  const [isHighlighting, setIsHighlighting] = useState(false)

  const addTable = () => {
    const newTable: Table = {
      id: `table_${Date.now()}`,
      name: '',
      columns: [{
        id: `col_${Date.now()}`,
        name: 'id',
        type: 'int',
        notNull: true,
        primaryKey: true,
        unique: false,
        autoIncrement: true
      }]
    }
    setTables([...tables, newTable])
  }

  const removeTable = (tableId: string) => {
    setTables(tables.filter(t => t.id !== tableId))
  }

  const updateTable = (tableId: string, updates: Partial<Table>) => {
    setTables(tables.map(t => t.id === tableId ? { ...t, ...updates } : t))
  }

  const addColumn = (tableId: string) => {
    const newColumn: Column = {
      id: `col_${Date.now()}`,
      name: '',
      type: dialectConfig[dialect].types[0],
      notNull: false,
      primaryKey: false,
      unique: false,
      autoIncrement: false
    }
    setTables(tables.map(t => 
      t.id === tableId 
        ? { ...t, columns: [...t.columns, newColumn] }
        : t
    ))
  }

  const removeColumn = (tableId: string, columnId: string) => {
    setTables(tables.map(t => 
      t.id === tableId 
        ? { ...t, columns: t.columns.filter(c => c.id !== columnId) }
        : t
    ))
  }

  const updateColumn = (tableId: string, columnId: string, updates: Partial<Column>) => {
    setTables(tables.map(t => 
      t.id === tableId 
        ? { 
            ...t, 
            columns: t.columns.map(c => 
              c.id === columnId ? { ...c, ...updates } : c
            ) 
          }
        : t
    ))
  }

  const generateSchema = () => {
    const config = dialectConfig[dialect]
    const imports = config.imports.join('\n')
    
    const tablesCode = tables.map(table => {
      if (!table.name || table.columns.length === 0) return ''
      
      const columnsCode = table.columns.map(col => {
        if (!col.name) return ''
        
        let columnDef = `  ${col.name}: ${config.prefix}.${col.type}("${col.name}"`
        
        // Add length for varchar
        if (col.type === 'varchar' && col.length) {
          columnDef += `, { length: ${col.length} }`
        }
        
        columnDef += ')'
        
        // Add modifiers in the correct order
        if (col.primaryKey) {
          if (dialect === 'sqlite' || dialect === 'turso') {
            columnDef += `.primaryKey(${col.autoIncrement ? '{ autoIncrement: true }' : ''})`
          } else {
            columnDef += '.primaryKey()'
            if (col.autoIncrement && (dialect === 'mysql')) {
              columnDef += '.autoincrement()'
            }
          }
        }
        if (col.notNull && !col.primaryKey) {
          columnDef += '.notNull()'
        }
        if (col.unique && !col.primaryKey) {
          columnDef += '.unique()'
        }
        if (col.defaultValue && col.defaultValue.trim()) {
          if (col.type === 'boolean') {
            columnDef += `.default(${col.defaultValue})`
          } else if (col.type === 'text' || col.type === 'varchar') {
            columnDef += `.default("${col.defaultValue}")`
          } else {
            columnDef += `.default(${col.defaultValue})`
          }
        }
        
        return columnDef
      }).filter(Boolean).join(',\n')
      
      const tableFunction = dialect === 'sqlite' || dialect === 'turso' ? 'table' : config.tableFunction
      
      return `export const ${table.name} = ${tableFunction}("${table.name}", {
${columnsCode}
});`
    }).filter(Boolean).join('\n\n')
    
    const fullSchema = `${imports}\n\n${tablesCode}`
    setSchemaText(fullSchema)
  }

  // Update the preview when tables or dialect changes
  useEffect(() => {
    if (tables.length > 0) {
      const previewCode = previewSchema()
      if (previewCode.trim()) {
        setIsHighlighting(true)
        codeToHtml(previewCode, {
          lang: 'typescript',
          theme: 'dark-plus'
        }).then(html => {
          setHighlightedPreview(html)
          setIsHighlighting(false)
        }).catch(error => {
          console.error('Shiki highlighting error:', error)
          setHighlightedPreview(`<pre><code>${previewCode}</code></pre>`)
          setIsHighlighting(false)
        })
      } else {
        setHighlightedPreview('')
      }
    } else {
      setHighlightedPreview('')
    }
  }, [tables, dialect])

  const previewSchema = () => {
    const config = dialectConfig[dialect]
    const imports = config.imports.join('\n')
    
    const tablesCode = tables.map(table => {
      if (!table.name || table.columns.length === 0) return ''
      
      const columnsCode = table.columns.map(col => {
        if (!col.name) return ''
        
        let columnDef = `  ${col.name}: ${config.prefix}.${col.type}("${col.name}"`
        
        if (col.type === 'varchar' && col.length) {
          columnDef += `, { length: ${col.length} }`
        }
        
        columnDef += ')'
        
        if (col.primaryKey) {
          if (dialect === 'sqlite' || dialect === 'turso') {
            columnDef += `.primaryKey(${col.autoIncrement ? '{ autoIncrement: true }' : ''})`
          } else {
            columnDef += '.primaryKey()'
            if (col.autoIncrement && (dialect === 'mysql')) {
              columnDef += '.autoincrement()'
            }
          }
        }
        if (col.notNull && !col.primaryKey) {
          columnDef += '.notNull()'
        }
        if (col.unique && !col.primaryKey) {
          columnDef += '.unique()'
        }
        if (col.defaultValue && col.defaultValue.trim()) {
          if (col.type === 'boolean') {
            columnDef += `.default(${col.defaultValue})`
          } else if (col.type === 'text' || col.type === 'varchar') {
            columnDef += `.default("${col.defaultValue}")`
          } else {
            columnDef += `.default(${col.defaultValue})`
          }
        }
        
        return columnDef
      }).filter(Boolean).join(',\n')
      
      const tableFunction = dialect === 'sqlite' || dialect === 'turso' ? 'table' : config.tableFunction
      
      return `export const ${table.name} = ${tableFunction}("${table.name}", {
${columnsCode}
});`
    }).filter(Boolean).join('\n\n')
    
    return `${imports}\n\n${tablesCode}`
  }

  return (
    <div className="h-full flex flex-col space-y-4">
      {/* Dialect Selection */}
      <div className="space-y-2">
        <Label>Database Dialect</Label>
        <Select value={dialect} onValueChange={(value: DatabaseDialect) => setDialect(value)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="postgresql">PostgreSQL</SelectItem>
            <SelectItem value="mysql">MySQL</SelectItem>
            <SelectItem value="sqlite">SQLite</SelectItem>
            <SelectItem value="turso">Turso</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Tables */}
      <div className="flex-1 flex flex-col min-h-0">
        <div className="flex items-center justify-between mb-4">
          <Label>Tables</Label>
          <Button size="sm" onClick={addTable}>
            <Plus className="w-4 h-4 mr-2" />
            Add Table
          </Button>
        </div>

        <div className="flex-1 overflow-auto space-y-4">
          {tables.map((table) => (
            <Card key={table.id} className="p-4">
              <div className="space-y-4">
                {/* Table Name */}
                <div className="flex items-center gap-2">
                  <div className="flex-1">
                    <Input
                      placeholder="Table name"
                      value={table.name}
                      onChange={(e) => updateTable(table.id, { name: e.target.value })}
                    />
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeTable(table.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>

                {/* Columns */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm">Columns</Label>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => addColumn(table.id)}
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Column
                    </Button>
                  </div>

                  {table.columns.map((column) => (
                    <div key={column.id} className="grid grid-cols-12 gap-2 items-center p-3 bg-muted/20 rounded-md">
                      {/* Column Name */}
                      <div className="col-span-3">
                        <Input
                          placeholder="Column name"
                          value={column.name}
                          onChange={(e) => updateColumn(table.id, column.id, { name: e.target.value })}
                          className="text-xs"
                        />
                      </div>

                      {/* Type */}
                      <div className="col-span-2">
                        <Select
                          value={column.type}
                          onValueChange={(value) => updateColumn(table.id, column.id, { type: value })}
                        >
                          <SelectTrigger className="text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {dialectConfig[dialect].types.map((type) => (
                              <SelectItem key={type} value={type}>{type}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Length (for varchar) */}
                      {column.type === 'varchar' ? (
                        <div className="col-span-1">
                          <Input
                            type="number"
                            placeholder="255"
                            value={column.length || ''}
                            onChange={(e) => updateColumn(table.id, column.id, { length: parseInt(e.target.value) || undefined })}
                            className="text-xs"
                          />
                        </div>
                      ) : (
                        <div className="col-span-1"></div>
                      )}

                      {/* Options */}
                      <div className="col-span-4 flex gap-1 text-xs">
                        <div className="flex items-center space-x-1">
                          <Checkbox
                            id={`pk-${column.id}`}
                            checked={column.primaryKey}
                            onCheckedChange={(checked) => updateColumn(table.id, column.id, { primaryKey: !!checked })}
                          />
                          <label htmlFor={`pk-${column.id}`} className="text-xs">PK</label>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Checkbox
                            id={`nn-${column.id}`}
                            checked={column.notNull}
                            onCheckedChange={(checked) => updateColumn(table.id, column.id, { notNull: !!checked })}
                          />
                          <label htmlFor={`nn-${column.id}`} className="text-xs">NN</label>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Checkbox
                            id={`uq-${column.id}`}
                            checked={column.unique}
                            onCheckedChange={(checked) => updateColumn(table.id, column.id, { unique: !!checked })}
                          />
                          <label htmlFor={`uq-${column.id}`} className="text-xs">UQ</label>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Checkbox
                            id={`ai-${column.id}`}
                            checked={column.autoIncrement}
                            onCheckedChange={(checked) => updateColumn(table.id, column.id, { autoIncrement: !!checked })}
                          />
                          <label htmlFor={`ai-${column.id}`} className="text-xs">AI</label>
                        </div>
                      </div>

                      {/* Default Value */}
                      <div className="col-span-1">
                        <Input
                          placeholder="Default"
                          value={column.defaultValue || ''}
                          onChange={(e) => updateColumn(table.id, column.id, { defaultValue: e.target.value || undefined })}
                          className="text-xs"
                        />
                      </div>

                      {/* Remove Column */}
                      <div className="col-span-1">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeColumn(table.id, column.id)}
                          className="h-8 w-8 p-0"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Preview */}
      {tables.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Label>Preview</Label>
            {isHighlighting && (
              <div className="w-3 h-3 border-2 border-muted-foreground border-t-transparent rounded-full animate-spin"></div>
            )}
          </div>
          <div className="bg-muted/20 rounded-md overflow-auto border border-muted max-h-32">
            {highlightedPreview ? (
              <div 
                className="text-xs leading-relaxed"
                dangerouslySetInnerHTML={{ __html: highlightedPreview }}
              />
            ) : (
              <pre className="p-3 font-mono text-xs leading-relaxed">
                <code>{previewSchema()}</code>
              </pre>
            )}
          </div>
        </div>
      )}

      {/* Generate Button */}
      <Button onClick={generateSchema} className="w-full" disabled={tables.length === 0}>
        <Database className="w-4 h-4 mr-2" />
        Generate Schema
      </Button>
    </div>
  )
}