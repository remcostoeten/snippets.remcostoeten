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
      <Card className="h-full bg-card border-border">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Settings className="w-4 h-4" />
            <CardTitle>Query Builder</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="flex items-center justify-center text-muted-foreground">
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
      <Card className="h-full bg-card border-border">
        <CardHeader className="flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              <CardTitle>Query Builder</CardTitle>
            </div>
            <Tooltip>
              <TooltipTrigger>
                <Info className="w-4 h-4 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Configure your CRUD operations using the abstraction layer</p>
              </TooltipContent>
            </Tooltip>
          </div>
          <div className="flex items-center gap-2 mt-2">
            <Badge variant="outline" className="font-mono">
              {selectedTable}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="flex-1 overflow-auto space-y-4">
        {/* Operation Type */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Label>Operation Type</Label>
            <Tooltip>
              <TooltipTrigger>
                <HelpCircle className="w-3 h-3 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Choose which CRUD operation to generate</p>
              </TooltipContent>
            </Tooltip>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {[
              { op: 'create', icon: Plus, label: 'Create', tooltip: 'Insert new records' },
              { op: 'get', icon: Search, label: 'Read', tooltip: 'Query existing records' },
              { op: 'update', icon: Edit, label: 'Update', tooltip: 'Modify existing records' },
              { op: 'destroy', icon: Trash, label: 'Delete', tooltip: 'Remove records' }
            ].map(({ op, icon: Icon, label, tooltip }) => (
              <Tooltip key={op}>
                <TooltipTrigger asChild>
                  <Button
                    variant={queryConfig.operation === op ? "default" : "outline"}
                    size="sm"
                    onClick={() => updateQueryConfig({ operation: op as CRUDOperation })}
                    className="flex items-center gap-2"
                  >
                    <Icon className="w-4 h-4" />
                    {label}
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
              <Label>Quantity</Label>
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
              <Label>Where Clause</Label>
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
                              <span>{field.name}</span>
                              <Badge variant="secondary" className="text-xs">
                                {field.type}
                              </Badge>
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
              <Label>Order By</Label>
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
                              <span>{field.name}</span>
                              <Badge variant="secondary" className="text-xs">
                                {field.type}
                              </Badge>
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
              <Label>Limit</Label>
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
                <Label>Create Data</Label>
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
                      <Label className="font-mono text-sm">{field.name}</Label>
                      <Badge variant="secondary" className="text-xs">
                        {field.type}
                      </Badge>
                      {field.isNotNull && (
                        <Badge variant="destructive" className="text-xs">
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
                <Label>Update Data</Label>
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