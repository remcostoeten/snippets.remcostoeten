import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card'
import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'
import { Label } from '@/shared/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select'
import { Checkbox } from '@/shared/ui/checkbox'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/tabs'
import { Badge } from '@/shared/ui/badge'
import { Plus, Trash2, Database, Settings, Eye, Download, Upload, Copy, AlertCircle, CheckCircle, Info } from 'lucide-react'
import { useSchema } from './SchemaContext'
import { codeToHtml } from 'shiki'
import { SyntaxHighlightingSkeleton } from './QueryBuilderSkeleton'

export type DatabaseDialect = 'postgresql' | 'mysql' | 'sqlite' | 'turso'

interface Enum {
  id: string
  name: string
  values: string[]
}

interface Column {
  id: string
  name: string
  type: string
  length?: number
  precision?: number
  scale?: number
  notNull: boolean
  primaryKey: boolean
  unique: boolean
  autoIncrement: boolean
  defaultValue?: string
  comment?: string
  enumId?: string
  arrayType?: boolean
  generated?: boolean
  generatedExpression?: string
}

interface Table {
  id: string
  name: string
  columns: Column[]
  comment?: string
}

interface SchemaValidation {
  isValid: boolean
  errors: string[]
  warnings: string[]
}

const dialectConfig = {
  postgresql: {
    tableFunction: 'pgTable',
    module: 'drizzle-orm/pg-core',
    prefix: 't',
    types: [
      { name: 'text', category: 'text', description: 'Variable-length text' },
      { name: 'varchar', category: 'text', description: 'Variable-length string with length limit', hasLength: true },
      { name: 'char', category: 'text', description: 'Fixed-length string', hasLength: true },
      { name: 'int', category: 'numeric', description: '32-bit integer' },
      { name: 'bigint', category: 'numeric', description: '64-bit integer' },
      { name: 'smallint', category: 'numeric', description: '16-bit integer' },
      { name: 'decimal', category: 'numeric', description: 'Exact decimal number', hasPrecision: true, hasScale: true },
      { name: 'numeric', category: 'numeric', description: 'Exact numeric number', hasPrecision: true, hasScale: true },
      { name: 'real', category: 'numeric', description: 'Single precision floating point' },
      { name: 'doublePrecision', category: 'numeric', description: 'Double precision floating point' },
      { name: 'boolean', category: 'boolean', description: 'True/false value' },
      { name: 'timestamp', category: 'datetime', description: 'Date and time with timezone' },
      { name: 'timestamptz', category: 'datetime', description: 'Timestamp with timezone' },
      { name: 'date', category: 'datetime', description: 'Date only' },
      { name: 'time', category: 'datetime', description: 'Time only' },
      { name: 'interval', category: 'datetime', description: 'Time interval' },
      { name: 'json', category: 'json', description: 'JSON data' },
      { name: 'jsonb', category: 'json', description: 'Binary JSON data' },
      { name: 'uuid', category: 'uuid', description: 'Universally unique identifier' },
      { name: 'bytea', category: 'binary', description: 'Binary data' },
      { name: 'inet', category: 'network', description: 'IP address' },
      { name: 'cidr', category: 'network', description: 'Network address' },
      { name: 'macaddr', category: 'network', description: 'MAC address' },
      { name: 'point', category: 'geometric', description: '2D point' },
      { name: 'line', category: 'geometric', description: 'Infinite line' },
      { name: 'lseg', category: 'geometric', description: 'Line segment' },
      { name: 'box', category: 'geometric', description: 'Rectangular box' },
      { name: 'path', category: 'geometric', description: 'Geometric path' },
      { name: 'polygon', category: 'geometric', description: 'Closed geometric path' },
      { name: 'circle', category: 'geometric', description: 'Circle' },
      { name: 'pgEnum', category: 'enum', description: 'Custom enumeration', isEnum: true }
    ],
    imports: [
      'import { pgTable, pgEnum } from "drizzle-orm/pg-core";',
      'import * as t from "drizzle-orm/pg-core";'
    ]
  },
  mysql: {
    tableFunction: 'mysqlTable',
    module: 'drizzle-orm/mysql-core',
    prefix: 't',
    types: [
      { name: 'text', category: 'text', description: 'Variable-length text' },
      { name: 'varchar', category: 'text', description: 'Variable-length string with length limit', hasLength: true },
      { name: 'char', category: 'text', description: 'Fixed-length string', hasLength: true },
      { name: 'tinytext', category: 'text', description: 'Very small text' },
      { name: 'mediumtext', category: 'text', description: 'Medium-length text' },
      { name: 'longtext', category: 'text', description: 'Long text' },
      { name: 'int', category: 'numeric', description: '32-bit integer' },
      { name: 'bigint', category: 'numeric', description: '64-bit integer' },
      { name: 'smallint', category: 'numeric', description: '16-bit integer' },
      { name: 'tinyint', category: 'numeric', description: '8-bit integer' },
      { name: 'mediumint', category: 'numeric', description: '24-bit integer' },
      { name: 'decimal', category: 'numeric', description: 'Exact decimal number', hasPrecision: true, hasScale: true },
      { name: 'float', category: 'numeric', description: 'Single precision floating point' },
      { name: 'double', category: 'numeric', description: 'Double precision floating point' },
      { name: 'boolean', category: 'boolean', description: 'True/false value' },
      { name: 'timestamp', category: 'datetime', description: 'Date and time' },
      { name: 'datetime', category: 'datetime', description: 'Date and time' },
      { name: 'date', category: 'datetime', description: 'Date only' },
      { name: 'time', category: 'datetime', description: 'Time only' },
      { name: 'year', category: 'datetime', description: 'Year' },
      { name: 'json', category: 'json', description: 'JSON data' },
      { name: 'binary', category: 'binary', description: 'Binary data' },
      { name: 'varbinary', category: 'binary', description: 'Variable binary data', hasLength: true },
      { name: 'blob', category: 'binary', description: 'Binary large object' },
      { name: 'tinyblob', category: 'binary', description: 'Very small binary object' },
      { name: 'mediumblob', category: 'binary', description: 'Medium binary object' },
      { name: 'longblob', category: 'binary', description: 'Long binary object' },
      { name: 'enum', category: 'enum', description: 'Custom enumeration', isEnum: true },
      { name: 'set', category: 'enum', description: 'Set of values', isEnum: true }
    ],
    imports: [
      'import { mysqlTable, mysqlEnum } from "drizzle-orm/mysql-core";',
      'import * as t from "drizzle-orm/mysql-core";'
    ]
  },
  sqlite: {
    tableFunction: 'sqliteTable as table',
    module: 'drizzle-orm/sqlite-core',
    prefix: 't',
    types: [
      { name: 'text', category: 'text', description: 'Variable-length text' },
      { name: 'int', category: 'numeric', description: 'Integer' },
      { name: 'real', category: 'numeric', description: 'Floating point number' },
      { name: 'blob', category: 'binary', description: 'Binary data' },
      { name: 'integer', category: 'numeric', description: 'Integer (auto-increment capable)' }
    ],
    imports: [
      'import { sqliteTable } from "drizzle-orm/sqlite-core";',
      'import * as t from "drizzle-orm/sqlite-core";'
    ]
  },
  turso: {
    tableFunction: 'sqliteTable as table',
    module: 'drizzle-orm/sqlite-core',
    prefix: 't',
    types: [
      { name: 'text', category: 'text', description: 'Variable-length text' },
      { name: 'int', category: 'numeric', description: 'Integer' },
      { name: 'real', category: 'numeric', description: 'Floating point number' },
      { name: 'blob', category: 'binary', description: 'Binary data' },
      { name: 'integer', category: 'numeric', description: 'Integer (auto-increment capable)' }
    ],
    imports: [
      'import { sqliteTable } from "drizzle-orm/sqlite-core";',
      'import * as t from "drizzle-orm/sqlite-core";'
    ]
  }
}

export function SchemaBuilder() {
  const { setSchemaText } = useSchema()
  const [dialect, setDialect] = useState<DatabaseDialect>('postgresql')
  const [tables, setTables] = useState<Table[]>([])
  const [enums, setEnums] = useState<Enum[]>([])
  const [highlightedPreview, setHighlightedPreview] = useState<string>('')
  const [isHighlighting, setIsHighlighting] = useState(false)
  const [validation, setValidation] = useState<SchemaValidation>({ isValid: true, errors: [], warnings: [] })
  const [activeTab, setActiveTab] = useState<'builder' | 'preview' | 'validation'>('builder')

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

  const addEnum = () => {
    const newEnum: Enum = {
      id: `enum_${Date.now()}`,
      name: '',
      values: ['value1', 'value2']
    }
    setEnums([...enums, newEnum])
  }

  const removeEnum = (enumId: string) => {
    setEnums(enums.filter(e => e.id !== enumId))
    // Remove enum references from columns
    setTables(tables.map(table => ({
      ...table,
      columns: table.columns.map(col => 
        col.enumId === enumId ? { ...col, enumId: undefined, type: 'text' } : col
      )
    })))
  }

  const updateEnum = (enumId: string, updates: Partial<Enum>) => {
    setEnums(enums.map(e => e.id === enumId ? { ...e, ...updates } : e))
  }

  const addEnumValue = (enumId: string) => {
    setEnums(enums.map(e => 
      e.id === enumId ? { ...e, values: [...e.values, `value${e.values.length + 1}`] } : e
    ))
  }

  const removeEnumValue = (enumId: string, valueIndex: number) => {
    setEnums(enums.map(e => 
      e.id === enumId ? { ...e, values: e.values.filter((_, i) => i !== valueIndex) } : e
    ))
  }

  const updateEnumValue = (enumId: string, valueIndex: number, value: string) => {
    setEnums(enums.map(e => 
      e.id === enumId ? { 
        ...e, 
        values: e.values.map((v, i) => i === valueIndex ? value : v) 
      } : e
    ))
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

  const validateSchema = (): SchemaValidation => {
    const errors: string[] = []
    const warnings: string[] = []

    // Validate tables
    tables.forEach(table => {
      if (!table.name.trim()) {
        errors.push(`Table "${table.id}" has no name`)
      }
      
      if (table.columns.length === 0) {
        errors.push(`Table "${table.name || table.id}" has no columns`)
      }

      // Check for duplicate column names
      const columnNames = table.columns.map(c => c.name).filter(Boolean)
      const duplicates = columnNames.filter((name, index) => columnNames.indexOf(name) !== index)
      if (duplicates.length > 0) {
        errors.push(`Table "${table.name}" has duplicate column names: ${duplicates.join(', ')}`)
      }

      // Check for primary key
      const primaryKeys = table.columns.filter(c => c.primaryKey)
      if (primaryKeys.length === 0) {
        warnings.push(`Table "${table.name}" has no primary key`)
      } else if (primaryKeys.length > 1) {
        errors.push(`Table "${table.name}" has multiple primary keys`)
      }

      // Validate columns
      table.columns.forEach(column => {
        if (!column.name.trim()) {
          errors.push(`Table "${table.name}" has column with no name`)
        }

        if (column.type === 'varchar' && (!column.length || column.length <= 0)) {
          warnings.push(`Column "${column.name}" in table "${table.name}" has varchar type but no length specified`)
        }

        if (column.type === 'decimal' && (!column.precision || !column.scale)) {
          warnings.push(`Column "${column.name}" in table "${table.name}" has decimal type but no precision/scale specified`)
        }

        if (column.enumId && !enums.find(e => e.id === column.enumId)) {
          errors.push(`Column "${column.name}" in table "${table.name}" references non-existent enum`)
        }
      })
    })

    // Validate enums
    enums.forEach(enumDef => {
      if (!enumDef.name.trim()) {
        errors.push(`Enum "${enumDef.id}" has no name`)
      }

      if (enumDef.values.length === 0) {
        errors.push(`Enum "${enumDef.name}" has no values`)
      }

      const duplicateValues = enumDef.values.filter((value, index) => enumDef.values.indexOf(value) !== index)
      if (duplicateValues.length > 0) {
        errors.push(`Enum "${enumDef.name}" has duplicate values: ${duplicateValues.join(', ')}`)
      }
    })

    // Check for duplicate table names
    const tableNames = tables.map(t => t.name).filter(Boolean)
    const duplicateTables = tableNames.filter((name, index) => tableNames.indexOf(name) !== index)
    if (duplicateTables.length > 0) {
      errors.push(`Duplicate table names: ${duplicateTables.join(', ')}`)
    }

    // Check for duplicate enum names
    const enumNames = enums.map(e => e.name).filter(Boolean)
    const duplicateEnums = enumNames.filter((name, index) => enumNames.indexOf(name) !== index)
    if (duplicateEnums.length > 0) {
      errors.push(`Duplicate enum names: ${duplicateEnums.join(', ')}`)
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    }
  }

  const generateSchema = () => {
    const config = dialectConfig[dialect]
    const imports = config.imports.join('\n')
    
    // Generate enums first
    const enumsCode = enums.map(enumDef => {
      if (!enumDef.name || enumDef.values.length === 0) return ''
      
      const enumFunction = dialect === 'postgresql' ? 'pgEnum' : dialect === 'mysql' ? 'mysqlEnum' : null
      if (!enumFunction) return ''
      
      const valuesString = enumDef.values.map(v => `"${v}"`).join(', ')
      return `export const ${enumDef.name} = ${enumFunction}("${enumDef.name}", [${valuesString}]);`
    }).filter(Boolean).join('\n')
    
    const tablesCode = tables.map(table => {
      if (!table.name || table.columns.length === 0) return ''
      
      const columnsCode = table.columns.map(col => {
        if (!col.name) return ''
        
        let columnDef = `  ${col.name}: `
        
        // Handle enum types
        if (col.enumId) {
          const enumDef = enums.find(e => e.id === col.enumId)
          if (enumDef) {
            columnDef += `${enumDef.name}("${col.name}")`
          } else {
            columnDef += `${config.prefix}.text("${col.name}")`
          }
        } else {
          columnDef += `${config.prefix}.${col.type}("${col.name}"`
          
          // Add length for varchar/char
          if ((col.type === 'varchar' || col.type === 'char') && col.length) {
            columnDef += `, { length: ${col.length} }`
          }
          
          // Add precision and scale for decimal/numeric
          if ((col.type === 'decimal' || col.type === 'numeric') && col.precision && col.scale) {
            columnDef += `, { precision: ${col.precision}, scale: ${col.scale} }`
          }
          
          columnDef += ')'
        }
        
        // Add modifiers in the correct order
        if (col.primaryKey) {
          if (dialect === 'sqlite' || dialect === 'turso') {
            columnDef += `.primaryKey(${col.autoIncrement ? '{ autoIncrement: true }' : ''})`
          } else {
            columnDef += '.primaryKey()'
            if (col.autoIncrement && dialect === 'mysql') {
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
    
    const fullSchema = `${imports}\n\n${enumsCode}${enumsCode ? '\n\n' : ''}${tablesCode}`
    setSchemaText(fullSchema)
  }

  // Update validation when schema changes
  useEffect(() => {
    const validationResult = validateSchema()
    setValidation(validationResult)
  }, [tables, enums])

  // Update the preview when tables, enums, or dialect changes
  useEffect(() => {
    if (tables.length > 0 || enums.length > 0) {
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
  }, [tables, enums, dialect])

  const previewSchema = () => {
    const config = dialectConfig[dialect]
    const imports = config.imports.join('\n')
    
    // Generate enums first
    const enumsCode = enums.map(enumDef => {
      if (!enumDef.name || enumDef.values.length === 0) return ''
      
      const enumFunction = dialect === 'postgresql' ? 'pgEnum' : dialect === 'mysql' ? 'mysqlEnum' : null
      if (!enumFunction) return ''
      
      const valuesString = enumDef.values.map(v => `"${v}"`).join(', ')
      return `export const ${enumDef.name} = ${enumFunction}("${enumDef.name}", [${valuesString}]);`
    }).filter(Boolean).join('\n')
    
    const tablesCode = tables.map(table => {
      if (!table.name || table.columns.length === 0) return ''
      
      const columnsCode = table.columns.map(col => {
        if (!col.name) return ''
        
        let columnDef = `  ${col.name}: `
        
        // Handle enum types
        if (col.enumId) {
          const enumDef = enums.find(e => e.id === col.enumId)
          if (enumDef) {
            columnDef += `${enumDef.name}("${col.name}")`
          } else {
            columnDef += `${config.prefix}.text("${col.name}")`
          }
        } else {
          columnDef += `${config.prefix}.${col.type}("${col.name}"`
          
          // Add length for varchar/char
          if ((col.type === 'varchar' || col.type === 'char') && col.length) {
            columnDef += `, { length: ${col.length} }`
          }
          
          // Add precision and scale for decimal/numeric
          if ((col.type === 'decimal' || col.type === 'numeric') && col.precision && col.scale) {
            columnDef += `, { precision: ${col.precision}, scale: ${col.scale} }`
          }
          
          columnDef += ')'
        }
        
        if (col.primaryKey) {
          if (dialect === 'sqlite' || dialect === 'turso') {
            columnDef += `.primaryKey(${col.autoIncrement ? '{ autoIncrement: true }' : ''})`
          } else {
            columnDef += '.primaryKey()'
            if (col.autoIncrement && dialect === 'mysql') {
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
    
    return `${imports}\n\n${enumsCode}${enumsCode ? '\n\n' : ''}${tablesCode}`
  }

  return (
    <div className="h-full flex flex-col space-y-4">
      {/* Header with Dialect Selection and Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="space-y-1">
            <Label className="text-sm font-medium">Database Dialect</Label>
            <Select value={dialect} onValueChange={(value: DatabaseDialect) => setDialect(value)}>
              <SelectTrigger className="w-40">
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
          <Badge variant={validation.isValid ? "default" : "destructive"} className="flex items-center gap-1">
            {validation.isValid ? <CheckCircle className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
            {validation.errors.length + validation.warnings.length} issues
          </Badge>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={() => setActiveTab('validation')}>
            <AlertCircle className="w-4 h-4 mr-1" />
            Validate
          </Button>
          <Button variant="outline" size="sm" onClick={() => setActiveTab('preview')}>
            <Eye className="w-4 h-4 mr-1" />
            Preview
          </Button>
          <Button onClick={generateSchema} disabled={tables.length === 0}>
            <Database className="w-4 h-4 mr-2" />
            Generate Schema
          </Button>
        </div>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={(value: 'builder' | 'preview' | 'validation') => setActiveTab(value)} className="flex-1 flex flex-col min-h-0">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="builder">Schema Builder</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
          <TabsTrigger value="validation">Validation</TabsTrigger>
        </TabsList>

        <TabsContent value="builder" className="flex-1 flex flex-col min-h-0 space-y-4">
          {/* Enums Section */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Enums</CardTitle>
                <Button size="sm" onClick={addEnum}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Enum
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {enums.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Settings className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>No enums defined. Add an enum to create custom data types.</p>
                </div>
              ) : (
                enums.map((enumDef) => (
                  <div key={enumDef.id} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-center gap-2">
                      <Input
                        placeholder="Enum name (e.g., userRole)"
                        value={enumDef.name}
                        onChange={(e) => updateEnum(enumDef.id, { name: e.target.value })}
                        className="flex-1"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeEnum(enumDef.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label className="text-sm">Values</Label>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => addEnumValue(enumDef.id)}
                        >
                          <Plus className="w-3 h-3 mr-1" />
                          Add Value
                        </Button>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        {enumDef.values.map((value, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <Input
                              placeholder={`Value ${index + 1}`}
                              value={value}
                              onChange={(e) => updateEnumValue(enumDef.id, index, e.target.value)}
                              className="flex-1"
                            />
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => removeEnumValue(enumDef.id, index)}
                              disabled={enumDef.values.length <= 1}
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* Tables Section */}
          <Card className="flex-1 flex flex-col min-h-0">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Tables</CardTitle>
                <Button size="sm" onClick={addTable}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Table
                </Button>
              </div>
            </CardHeader>
            <CardContent className="flex-1 overflow-auto space-y-4">
              {tables.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Database className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>No tables defined. Add a table to start building your schema.</p>
                </div>
              ) : (
                tables.map((table) => (
                  <Card key={table.id} className="border">
                    <CardHeader className="pb-3">
                      <div className="flex items-center gap-2">
                        <Input
                          placeholder="Table name (e.g., users)"
                          value={table.name}
                          onChange={(e) => updateTable(table.id, { name: e.target.value })}
                          className="flex-1 font-medium"
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeTable(table.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label className="text-sm font-medium">Columns</Label>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => addColumn(table.id)}
                        >
                          <Plus className="w-4 h-4 mr-1" />
                          Add Column
                        </Button>
                      </div>

                      <div className="space-y-2">
                        {table.columns.map((column) => (
                          <div key={column.id} className="grid grid-cols-12 gap-2 items-center p-3 bg-muted/20 rounded-md">
                            {/* Column Name */}
                            <div className="col-span-2">
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
                                    <SelectItem key={type.name} value={type.name}>
                                      <div className="flex flex-col">
                                        <span>{type.name}</span>
                                        <span className="text-xs text-muted-foreground">{type.description}</span>
                                      </div>
                                    </SelectItem>
                                  ))}
                                  {enums.map((enumDef) => (
                                    <SelectItem key={enumDef.id} value={`enum_${enumDef.id}`}>
                                      <div className="flex flex-col">
                                        <span>{enumDef.name}</span>
                                        <span className="text-xs text-muted-foreground">Custom enum</span>
                                      </div>
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>

                            {/* Length/Precision/Scale */}
                            <div className="col-span-2 flex gap-1">
                              {(column.type === 'varchar' || column.type === 'char') && (
                                <Input
                                  type="number"
                                  placeholder="Length"
                                  value={column.length || ''}
                                  onChange={(e) => updateColumn(table.id, column.id, { length: parseInt(e.target.value) || undefined })}
                                  className="text-xs"
                                />
                              )}
                              {(column.type === 'decimal' || column.type === 'numeric') && (
                                <>
                                  <Input
                                    type="number"
                                    placeholder="Precision"
                                    value={column.precision || ''}
                                    onChange={(e) => updateColumn(table.id, column.id, { precision: parseInt(e.target.value) || undefined })}
                                    className="text-xs"
                                  />
                                  <Input
                                    type="number"
                                    placeholder="Scale"
                                    value={column.scale || ''}
                                    onChange={(e) => updateColumn(table.id, column.id, { scale: parseInt(e.target.value) || undefined })}
                                    className="text-xs"
                                  />
                                </>
                              )}
                            </div>

                            {/* Constraints */}
                            <div className="col-span-3 flex gap-1 text-xs">
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
                            <div className="col-span-2">
                              <Input
                                placeholder="Default value"
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
                    </CardContent>
                  </Card>
                ))
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preview" className="flex-1 flex flex-col min-h-0">
          <Card className="flex-1 flex flex-col min-h-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="w-5 h-5" />
                Schema Preview
                {isHighlighting && <SyntaxHighlightingSkeleton />}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 overflow-auto">
              <div className="bg-muted/20 rounded-md overflow-auto border border-muted h-full">
                {highlightedPreview ? (
                  <div 
                    className="text-sm leading-relaxed p-4"
                    dangerouslySetInnerHTML={{ __html: highlightedPreview }}
                  />
                ) : (
                  <pre className="p-4 font-mono text-sm leading-relaxed">
                    <code>{previewSchema()}</code>
                  </pre>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="validation" className="flex-1 flex flex-col min-h-0">
          <Card className="flex-1 flex flex-col min-h-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5" />
                Schema Validation
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 overflow-auto space-y-4">
              {validation.errors.length === 0 && validation.warnings.length === 0 ? (
                <div className="text-center py-8">
                  <CheckCircle className="w-12 h-12 mx-auto mb-4 text-green-500" />
                  <h3 className="text-lg font-semibold mb-2">Schema is Valid!</h3>
                  <p className="text-muted-foreground">No errors or warnings found.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {validation.errors.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold text-red-600 mb-2 flex items-center gap-2">
                        <AlertCircle className="w-5 h-5" />
                        Errors ({validation.errors.length})
                      </h3>
                      <div className="space-y-2">
                        {validation.errors.map((error, index) => (
                          <div key={index} className="p-3 bg-red-50 border border-red-200 rounded-md">
                            <p className="text-sm text-red-800">{error}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {validation.warnings.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold text-yellow-600 mb-2 flex items-center gap-2">
                        <Info className="w-5 h-5" />
                        Warnings ({validation.warnings.length})
                      </h3>
                      <div className="space-y-2">
                        {validation.warnings.map((warning, index) => (
                          <div key={index} className="p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                            <p className="text-sm text-yellow-800">{warning}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}