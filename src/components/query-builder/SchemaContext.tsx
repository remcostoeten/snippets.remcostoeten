import React, { createContext, useContext, useState, ReactNode } from 'react'

export interface ParsedField {
  name: string
  type: string
  constraints: string[]
  isPrimary?: boolean
  isUnique?: boolean
  isNotNull?: boolean
}

export interface ParsedTable {
  name: string
  fields: ParsedField[]
}

export type CRUDOperation = 'create' | 'get' | 'update' | 'destroy'

export interface QueryConfig {
  table: string
  operation: CRUDOperation
  quantity?: 'One' | 'All'
  whereClause?: { column: string; value: string }
  orderBy?: { column: string; direction: 'Asc' | 'Desc' }
  limit?: number
  updateData?: { [key: string]: string }
  createData?: { [key: string]: string }
}

interface SchemaContextType {
  schemaText: string
  setSchemaText: (text: string) => void
  parsedTables: ParsedTable[]
  setParsedTables: (tables: ParsedTable[]) => void
  selectedTable: string
  setSelectedTable: (table: string) => void
  queryConfig: QueryConfig
  setQueryConfig: (config: QueryConfig) => void
  generatedCode: string
  setGeneratedCode: (code: string) => void
}

const SchemaContext = createContext<SchemaContextType | undefined>(undefined)

export function SchemaProvider({ children }: { children: ReactNode }) {
  const [schemaText, setSchemaText] = useState('')
  const [parsedTables, setParsedTables] = useState<ParsedTable[]>([])
  const [selectedTable, setSelectedTable] = useState('')
  const [queryConfig, setQueryConfig] = useState<QueryConfig>({
    table: '',
    operation: 'get',
    quantity: 'All'
  })
  const [generatedCode, setGeneratedCode] = useState('')

  return (
    <SchemaContext.Provider value={{
      schemaText,
      setSchemaText,
      parsedTables,
      setParsedTables,
      selectedTable,
      setSelectedTable,
      queryConfig,
      setQueryConfig,
      generatedCode,
      setGeneratedCode
    }}>
      {children}
    </SchemaContext.Provider>
  )
}

export function useSchema() {
  const context = useContext(SchemaContext)
  if (context === undefined) {
    throw new Error('useSchema must be used within a SchemaProvider')
  }
  return context
}