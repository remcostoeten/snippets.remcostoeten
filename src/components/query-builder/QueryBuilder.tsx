import React, { useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card'
import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'
import { Label } from '@/shared/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select'
import { useSchema, CRUDOperation } from './SchemaContext'
import { Settings, Plus, Search, Edit, Trash, HelpCircle, Info } from 'lucide-react'
import { Badge } from '@/shared/ui/badge'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/shared/ui/tooltip'
import { Separator } from '@/shared/ui/separator'
import { Switch } from '@/shared/ui/switch'

export function QueryBuilder() {
  const { 
    parsedTables, 
    selectedTable, 
    queryConfig, 
    setQueryConfig,
    setGeneratedCode 
  } = useSchema()
  
  const selectedTableSchema = parsedTables.find(t => t.name === selectedTable)
  
  useEffect(() => {
    generateCode()
  }, [queryConfig, selectedTableSchema])
  
  const generateCode = () => {
    if (!selectedTableSchema || !queryConfig.table) {
      setGeneratedCode('')
      return
    }
    
    let code = `// Generated CRUD operation\nconst ${queryConfig.table}Crud = CrudAbstractions(${queryConfig.table})\n\n`
    
    switch (queryConfig.operation) {
      case 'create':
        code += `// Create new record\nconst newRecord = await ${queryConfig.table}Crud.create()\n  .run({\n`
        if (queryConfig.createData) {
          Object.entries(queryConfig.createData).forEach(([key, value]) => {
            if (value.trim()) {
              code += `    ${key}: ${isNaN(Number(value)) ? `"${value}"` : value},\n`
            }
          })
        }
        code += `  })`
        break
        
      case 'get':
        code += `// Read records\nconst records = await ${queryConfig.table}Crud.get("${queryConfig.quantity || 'All'}")\n`
        if (queryConfig.whereClause?.column && queryConfig.whereClause?.value) {
          const value = isNaN(Number(queryConfig.whereClause.value)) 
            ? `"${queryConfig.whereClause.value}"` 
            : queryConfig.whereClause.value
          code += `  .Where("${queryConfig.whereClause.column}", ${value})\n`
        }
        if (queryConfig.orderBy?.column) {
          code += `  .Order("${queryConfig.orderBy.column}", "${queryConfig.orderBy.direction}")\n`
        }
        if (queryConfig.limit && queryConfig.limit > 0) {
          code += `  .Limit(${queryConfig.limit})\n`
        }
        code += `  .run()`
        break
        
      case 'update':
        code += `// Update records\nconst updatedRecords = await ${queryConfig.table}Crud.update()\n`
        if (queryConfig.whereClause?.column && queryConfig.whereClause?.value) {
          const value = isNaN(Number(queryConfig.whereClause.value)) 
            ? `"${queryConfig.whereClause.value}"` 
            : queryConfig.whereClause.value
          code += `  .Where("${queryConfig.whereClause.column}", ${value})\n`
        }
        code += `  .Set({\n`
        if (queryConfig.updateData) {
          Object.entries(queryConfig.updateData).forEach(([key, value]) => {
            if (value.trim()) {
              code += `    ${key}: ${isNaN(Number(value)) ? `"${value}"` : value},\n`
            }
          })
        }
        code += `  })\n  .run()`
        break
        
      case 'destroy':
        code += `// Delete records\nconst deletedRecords = await ${queryConfig.table}Crud.destroy()\n`
        if (queryConfig.whereClause?.column && queryConfig.whereClause?.value) {
          const value = isNaN(Number(queryConfig.whereClause.value)) 
            ? `"${queryConfig.whereClause.value}"` 
            : queryConfig.whereClause.value
          code += `  .Where("${queryConfig.whereClause.column}", ${value})\n`
        }
        code += `  .run()`
        break
    }
    
    setGeneratedCode(code)
  }
  
  const updateQueryConfig = (updates: Partial<typeof queryConfig>) => {
    setQueryConfig({ ...queryConfig, ...updates })
  }
  
  const updateWhereClause = (column: string, value: string) => {
    updateQueryConfig({
      whereClause: { column, value }
    })
  }
  
  const updateOrderBy = (column: string, direction: 'Asc' | 'Desc') => {
    updateQueryConfig({
      orderBy: { column, direction }
    })
  }
  
  const updateCreateData = (field: string, value: string) => {
    updateQueryConfig({
      createData: {
        ...queryConfig.createData,
        [field]: value
      }
    })
  }
  
  const updateUpdateData = (field: string, value: string) => {
    updateQueryConfig({
      updateData: {
        ...queryConfig.updateData,
        [field]: value
      }
    })
  }
  
  if (!selectedTableSchema) {
    return (
      <Card className="h-full bg-zinc-100 dark:bg-zinc-900/50 border-zinc-300 dark:border-zinc-800">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Settings className="w-4 h-4 text-zinc-300" />
            <CardTitle className="text-zinc-900 dark:text-zinc-100">Query Builder</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="flex items-center justify-center text-zinc-400">
          <div className="text-center">
            <Settings className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>Select a table to build queries</p>
          </div>
        </CardContent>
      </Card>
    )
  }
  
  return (
    <TooltipProvider>
      <Card className="h-full bg-zinc-100 dark:bg-zinc-900/50 border-zinc-300 dark:border-zinc-800">
        <CardHeader className="flex-shrink-0 pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-2">
              <Settings className="w-5 h-5 text-zinc-700 dark:text-zinc-300" />
              <CardTitle className="text-zinc-900 dark:text-zinc-100 text-lg">Query Builder</CardTitle>
            </div>
            <Tooltip>
              <TooltipTrigger>
                <Info className="w-4 h-4 text-zinc-600 dark:text-zinc-400" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Configure your CRUD operations using the abstraction layer</p>
              </TooltipContent>
            </Tooltip>
          </div>
          <div className="flex items-center gap-2 mt-2">
            <Badge variant="outline" className="font-mono bg-zinc-200 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border-zinc-300 dark:border-zinc-700">
              📊 {selectedTable}
            </Badge>
            <Badge variant="secondary" className="text-xs">
              {selectedTableSchema.fields.length} fields
            </Badge>
            <Badge variant="outline" className="text-xs text-green-700 dark:text-green-400 border-green-300 dark:border-green-700">
              ✓ Schema loaded
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="flex-1 overflow-auto space-y-4">
        {/* Operation Type */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Label className="text-base font-semibold text-zinc-800 dark:text-zinc-200">🔧 Operation Type</Label>
            <Tooltip>
              <TooltipTrigger>
                <HelpCircle className="w-3 h-3 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Choose which CRUD operation to generate</p>
              </TooltipContent>
            </Tooltip>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              { 
                op: 'create', 
                icon: Plus, 
                label: 'Create', 
                tooltip: 'Insert new records',
                gradient: 'from-emerald-500 to-green-600',
                hoverGradient: 'from-emerald-600 to-green-700',
                iconColor: 'text-emerald-600 dark:text-emerald-400'
              },
              { 
                op: 'get', 
                icon: Search, 
                label: 'Read', 
                tooltip: 'Query existing records',
                gradient: 'from-blue-500 to-indigo-600',
                hoverGradient: 'from-blue-600 to-indigo-700',
                iconColor: 'text-blue-600 dark:text-blue-400'
              },
              { 
                op: 'update', 
                icon: Edit, 
                label: 'Update', 
                tooltip: 'Modify existing records',
                gradient: 'from-amber-500 to-orange-600',
                hoverGradient: 'from-amber-600 to-orange-700',
                iconColor: 'text-amber-600 dark:text-amber-400'
              },
              { 
                op: 'destroy', 
                icon: Trash, 
                label: 'Delete', 
                tooltip: 'Remove records',
                gradient: 'from-red-500 to-rose-600',
                hoverGradient: 'from-red-600 to-rose-700',
                iconColor: 'text-red-600 dark:text-red-400'
              }
            ].map(({ op, icon: Icon, label, tooltip, gradient, hoverGradient, iconColor }) => (
              <Tooltip key={op}>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => updateQueryConfig({ operation: op as CRUDOperation })}
                    className={`group relative flex items-center gap-2 transition-all duration-300 overflow-hidden ${
                      queryConfig.operation === op 
                        ? `bg-gradient-to-r ${gradient} text-white border-transparent shadow-lg shadow-${gradient.split('-')[1]}-500/25 hover:shadow-xl hover:shadow-${gradient.split('-')[1]}-500/30` 
                        : `bg-zinc-50 dark:bg-zinc-800/50 border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-600`
                    }`}
                  >
                    {/* Subtle gradient overlay for inactive state */}
                    {queryConfig.operation !== op && (
                      <div className={`absolute inset-0 bg-gradient-to-r ${gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
                    )}
                    
                    <Icon className={`w-4 h-4 relative z-10 ${
                      queryConfig.operation === op 
                        ? 'text-white' 
                        : iconColor
                    }`} />
                    <span className="relative z-10 font-medium">{label}</span>
                    
                    {/* Active state indicator */}
                    {queryConfig.operation === op && (
                      <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent" />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{tooltip}</p>
                </TooltipContent>
              </Tooltip>
            ))}
          </div>
        </div>

        <Separator />
        
        {/* Quantity for Read operations */}
        {queryConfig.operation === 'get' && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Label className="text-base font-semibold text-zinc-800 dark:text-zinc-200">📊 Quantity</Label>
              <Tooltip>
                <TooltipTrigger>
                  <HelpCircle className="w-3 h-3 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Choose whether to return one record or all matching records</p>
                </TooltipContent>
              </Tooltip>
            </div>
            <Select
              value={queryConfig.quantity || 'All'}
              onValueChange={(value: 'One' | 'All') => updateQueryConfig({ quantity: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Records</SelectItem>
                <SelectItem value="One">Single Record (findFirst)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
        
        {/* Where Clause */}
        {(queryConfig.operation === 'get' || queryConfig.operation === 'update' || queryConfig.operation === 'destroy') && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Label className="text-base font-semibold text-zinc-800 dark:text-zinc-200">🔍 Where Clause</Label>
              <Tooltip>
                <TooltipTrigger>
                  <HelpCircle className="w-3 h-3 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Filter records by column value. Required for update and delete operations.</p>
                </TooltipContent>
              </Tooltip>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="w-full">
                    <Select
                      value={queryConfig.whereClause?.column || ''}
                      onValueChange={(column) => updateWhereClause(column, queryConfig.whereClause?.value || '')}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select column" />
                      </SelectTrigger>
                      <SelectContent>
                        {selectedTableSchema.fields.map(field => (
                          <SelectItem key={field.name} value={field.name}>
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{field.name}</span>
                              <Badge 
                                variant="secondary" 
                                className={`text-xs font-mono ${
                                  field.type.toLowerCase().includes('int') ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                                  field.type.toLowerCase().includes('text') || field.type.toLowerCase().includes('varchar') ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                                  field.type.toLowerCase().includes('bool') ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' :
                                  field.type.toLowerCase().includes('timestamp') || field.type.toLowerCase().includes('date') ? 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200' :
                                  'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                                }`}
                              >
                                {field.type}
                              </Badge>
                              {field.isPrimary && (
                                <Badge variant="destructive" className="text-xs">
                                  PK
                                </Badge>
                              )}
                              {field.isNotNull && !field.isPrimary && (
                                <Badge variant="outline" className="text-xs border-red-300 text-red-700 dark:border-red-700 dark:text-red-300">
                                  Required
                                </Badge>
                              )}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Choose which column to filter by</p>
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Input
                    placeholder="Filter value"
                    value={queryConfig.whereClause?.value || ''}
                    onChange={(e) => updateWhereClause(queryConfig.whereClause?.column || '', e.target.value)}
                  />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Enter the value to match (strings will be auto-quoted)</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
        )}
        
        {/* Order By for Read operations */}
        {queryConfig.operation === 'get' && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Label className="text-base font-semibold text-zinc-800 dark:text-zinc-200">📈 Order By</Label>
              <Tooltip>
                <TooltipTrigger>
                  <HelpCircle className="w-3 h-3 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Sort records by a specific column in ascending or descending order</p>
                </TooltipContent>
              </Tooltip>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="w-full">
                    <Select
                      value={queryConfig.orderBy?.column || ''}
                      onValueChange={(column) => updateOrderBy(column, queryConfig.orderBy?.direction || 'Asc')}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sort column" />
                      </SelectTrigger>
                      <SelectContent>
                        {selectedTableSchema.fields.map(field => (
                          <SelectItem key={field.name} value={field.name}>
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{field.name}</span>
                              <Badge 
                                variant="secondary" 
                                className={`text-xs font-mono ${
                                  field.type.toLowerCase().includes('int') ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                                  field.type.toLowerCase().includes('text') || field.type.toLowerCase().includes('varchar') ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                                  field.type.toLowerCase().includes('bool') ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' :
                                  field.type.toLowerCase().includes('timestamp') || field.type.toLowerCase().includes('date') ? 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200' :
                                  'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                                }`}
                              >
                                {field.type}
                              </Badge>
                              {field.isPrimary && (
                                <Badge variant="destructive" className="text-xs">
                                  PK
                                </Badge>
                              )}
                              {field.isNotNull && !field.isPrimary && (
                                <Badge variant="outline" className="text-xs border-red-300 text-red-700 dark:border-red-700 dark:text-red-300">
                                  Required
                                </Badge>
                              )}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Choose which column to sort by</p>
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Select
                    value={queryConfig.orderBy?.direction || 'Asc'}
                    onValueChange={(direction: 'Asc' | 'Desc') => updateOrderBy(queryConfig.orderBy?.column || '', direction)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Asc">↑ Ascending (A-Z, 1-9)</SelectItem>
                      <SelectItem value="Desc">↓ Descending (Z-A, 9-1)</SelectItem>
                    </SelectContent>
                  </Select>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Choose sort direction</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
        )}
        
        {/* Limit for Read operations */}
        {queryConfig.operation === 'get' && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Label className="text-base font-semibold text-zinc-800 dark:text-zinc-200">🔢 Limit</Label>
              <Tooltip>
                <TooltipTrigger>
                  <HelpCircle className="w-3 h-3 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Limit the number of records returned (leave empty for no limit)</p>
                </TooltipContent>
              </Tooltip>
            </div>
            <Tooltip>
              <TooltipTrigger asChild>
                <Input
                  type="number"
                  placeholder="No limit (leave empty)"
                  value={queryConfig.limit || ''}
                  onChange={(e) => updateQueryConfig({ limit: parseInt(e.target.value) || undefined })}
                  min="1"
                />
              </TooltipTrigger>
              <TooltipContent>
                <p>Enter a number to limit results (e.g., 10 for top 10)</p>
              </TooltipContent>
            </Tooltip>
          </div>
        )}
        
        {/* Create Data */}
        {queryConfig.operation === 'create' && (
          <>
            <Separator />
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Label className="text-base font-semibold text-zinc-800 dark:text-zinc-200">✨ Create Data</Label>
                <Tooltip>
                  <TooltipTrigger>
                    <HelpCircle className="w-3 h-3 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Set values for the new record (primary key is auto-generated)</p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <div className="space-y-3">
                {selectedTableSchema.fields.filter(f => !f.isPrimary).map(field => (
                  <div key={field.name} className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Label className="font-mono text-sm font-semibold text-zinc-800 dark:text-zinc-200">{field.name}</Label>
                      <Badge 
                        variant="secondary" 
                        className={`text-xs font-mono ${
                          field.type.toLowerCase().includes('int') ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                          field.type.toLowerCase().includes('text') || field.type.toLowerCase().includes('varchar') ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                          field.type.toLowerCase().includes('bool') ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' :
                          field.type.toLowerCase().includes('timestamp') || field.type.toLowerCase().includes('date') ? 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200' :
                          'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                        }`}
                      >
                        {field.type}
                      </Badge>
                      {field.isPrimary && (
                        <Badge variant="destructive" className="text-xs">
                          PK
                        </Badge>
                      )}
                      {field.isNotNull && !field.isPrimary && (
                        <Badge variant="outline" className="text-xs border-red-300 text-red-700 dark:border-red-700 dark:text-red-300">
                          Required
                        </Badge>
                      )}
                    </div>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Input
                          placeholder={`${field.type}${field.isNotNull ? ' (required)' : ' (optional)'}`}
                          value={queryConfig.createData?.[field.name] || ''}
                          onChange={(e) => updateCreateData(field.name, e.target.value)}
                        />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Enter value for {field.name} ({field.type})</p>
                        {field.constraints.length > 0 && (
                          <p>Constraints: {field.constraints.join(', ')}</p>
                        )}
                      </TooltipContent>
                    </Tooltip>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
        
        {/* Update Data */}
        {queryConfig.operation === 'update' && (
          <>
            <Separator />
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Label className="text-base font-semibold text-zinc-800 dark:text-zinc-200">✏️ Update Data</Label>
                <Tooltip>
                  <TooltipTrigger>
                    <HelpCircle className="w-3 h-3 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Set new values for fields (leave empty to keep unchanged)</p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <div className="space-y-3">
                {selectedTableSchema.fields.filter(f => !f.isPrimary).map(field => (
                  <div key={field.name} className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Label className="font-mono text-sm">{field.name}</Label>
                      <Badge variant="secondary" className="text-xs">
                        {field.type}
                      </Badge>
                    </div>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Input
                          placeholder={`New ${field.type} value (optional)`}
                          value={queryConfig.updateData?.[field.name] || ''}
                          onChange={(e) => updateUpdateData(field.name, e.target.value)}
                        />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Update {field.name} to new value ({field.type})</p>
                        <p>Leave empty to keep current value</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
    </TooltipProvider>
  )
}