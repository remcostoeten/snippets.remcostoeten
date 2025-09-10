import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card'
import { Badge } from '@/shared/ui/badge'
import { Button } from '@/shared/ui/button'
import { useSchema } from './SchemaContext'
import { Database, Key, Lock, CheckCircle } from 'lucide-react'

export function SchemaBrowser() {
  const { parsedTables, selectedTable, setSelectedTable, setQueryConfig } = useSchema()
  
  const handleSelectTable = (tableName: string) => {
    setSelectedTable(tableName)
    setQueryConfig({
      table: tableName,
      operation: 'get',
      quantity: 'All'
    })
  }
  
  if (parsedTables.length === 0) {
    return (
      <Card className="h-full bg-zinc-100 dark:bg-zinc-900/50 border-zinc-300 dark:border-zinc-800">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-zinc-700 dark:text-zinc-300" />
            <CardTitle className="text-zinc-900 dark:text-zinc-100">Schema Browser</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="flex items-center justify-center text-zinc-600 dark:text-zinc-400">
          <div className="text-center">
            <Database className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>No schemas parsed yet</p>
            <p className="text-sm">Add your Drizzle schema to get started</p>
          </div>
        </CardContent>
      </Card>
    )
  }
  
  return (
    <Card className="h-full bg-zinc-100 dark:bg-zinc-900/50 border-zinc-300 dark:border-zinc-800">
      <CardHeader className="flex-shrink-0 pb-4">
        <div className="flex items-center gap-2">
          <Database className="w-5 h-5 text-zinc-700 dark:text-zinc-300" />
          <CardTitle className="text-zinc-900 dark:text-zinc-100 text-lg">Schema Browser</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="flex-1 overflow-auto">
        <div className="space-y-4">
          {parsedTables.map((table) => (
            <div key={table.name} className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className={`font-mono ${selectedTable === table.name ? 'text-primary' : ''}`}>
                  {table.name}
                </h3>
                <Button
                  variant={selectedTable === table.name ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleSelectTable(table.name)}
                >
                  {selectedTable === table.name ? 'Selected' : 'Select'}
                </Button>
              </div>
              
              <div className="space-y-2">
                {table.fields.map((field) => (
                  <div
                    key={field.name}
                    className="flex items-center justify-between p-2 rounded border bg-muted/20 border-muted"
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-medium">{field.name}</span>
                      <Badge variant="secondary" className="text-xs">
                        {field.type}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center gap-1">
                      {field.isPrimary && (
                        <Badge variant="default" className="text-xs">
                          <Key className="w-3 h-3 mr-1" />
                          PK
                        </Badge>
                      )}
                      {field.isUnique && !field.isPrimary && (
                        <Badge variant="outline" className="text-xs">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          UNIQUE
                        </Badge>
                      )}
                      {field.isNotNull && (
                        <Badge variant="outline" className="text-xs">
                          <Lock className="w-3 h-3 mr-1" />
                          NOT NULL
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}