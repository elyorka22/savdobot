"use client"

import React, { useState } from "react"
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableRow, 
  TableHead, 
  TableCell 
} from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { 
  Search,
  Filter,
  MoreHorizontal,
  ChevronUp,
  ChevronDown,
  Download,
  RefreshCw,
  Eye,
  Edit,
  Trash2
} from "lucide-react"
import { cn } from "@/lib/utils"

interface Column<T> {
  key: keyof T
  title: string
  sortable?: boolean
  searchable?: boolean
  render?: (value: any, row: T) => React.ReactNode
  className?: string
}

interface ModernTableProps<T> {
  data: T[]
  columns: Column<T>[]
  title?: string
  subtitle?: string
  searchable?: boolean
  filterable?: boolean
  selectable?: boolean
  actions?: {
    view?: (row: T) => void
    edit?: (row: T) => void
    delete?: (row: T) => void
  }
  className?: string
  emptyState?: React.ReactNode
  loading?: boolean
}

export function ModernTable<T extends { id: string }>({
  data,
  columns,
  title,
  subtitle,
  searchable = true,
  filterable = true,
  selectable = false,
  actions,
  className,
  emptyState,
  loading = false
}: ModernTableProps<T>) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set())
  const [sortConfig, setSortConfig] = useState<{
    key: keyof T
    direction: 'asc' | 'desc'
  } | null>(null)

  // Filter data based on search
  const filteredData = data.filter(row => {
    if (!searchTerm) return true
    
    return columns.some(column => {
      if (!column.searchable) return false
      const value = row[column.key]
      return String(value).toLowerCase().includes(searchTerm.toLowerCase())
    })
  })

  // Sort data
  const sortedData = React.useMemo(() => {
    if (!sortConfig) return filteredData

    return [...filteredData].sort((a, b) => {
      const aValue = a[sortConfig.key]
      const bValue = b[sortConfig.key]

      if (aValue === null || aValue === undefined) return 1
      if (bValue === null || bValue === undefined) return -1

      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1
      return 0
    })
  }, [filteredData, sortConfig])

  // Handle sorting
  const handleSort = (key: keyof T) => {
    setSortConfig(current => {
      if (!current || current.key !== key) {
        return { key, direction: 'asc' }
      }
      if (current.direction === 'asc') {
        return { key, direction: 'desc' }
      }
      return null
    })
  }

  // Handle selection
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedRows(new Set(sortedData.map(row => row.id)))
    } else {
      setSelectedRows(new Set())
    }
  }

  const handleSelectRow = (id: string, checked: boolean) => {
    const newSelected = new Set(selectedRows)
    if (checked) {
      newSelected.add(id)
    } else {
      newSelected.delete(id)
    }
    setSelectedRows(newSelected)
  }

  const isAllSelected = sortedData.length > 0 && selectedRows.size === sortedData.length
  const isIndeterminate = selectedRows.size > 0 && selectedRows.size < sortedData.length

  return (
    <Card className={cn("glass", className)}>
      {(title || subtitle || searchable || filterable) && (
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              {title && <CardTitle className="text-gradient-primary">{title}</CardTitle>}
              {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
            </div>
            
            <div className="flex items-center gap-2">
              {filterable && (
                <Button variant="outline" size="sm" className="glass">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
              )}
              
              <Button variant="outline" size="sm" className="glass">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              
              <Button variant="outline" size="sm" className="glass">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>

          {searchable && (
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-background/50 border-muted/50"
              />
            </div>
          )}
        </CardHeader>
      )}

      <CardContent className="p-0">
        <div className="rounded-lg overflow-hidden">
          <Table>
            <TableHeader className="bg-muted/30">
              <TableRow>
                {selectable && (
                  <TableHead className="w-12">
                    <Checkbox
                      checked={isAllSelected}
                      ref={isIndeterminate ? (el: HTMLButtonElement) => {
                        if (el) {
                          const input = el.querySelector('input[type="checkbox"]') as HTMLInputElement
                          if (input) input.indeterminate = isIndeterminate
                        }
                      } : undefined}
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>
                )}
                
                {columns.map((column) => (
                  <TableHead key={String(column.key)} className={cn(
                    "font-medium",
                    column.sortable && "cursor-pointer hover:bg-muted/50 transition-colors",
                    column.className
                  )}>
                    {column.sortable ? (
                      <div
                        className="flex items-center gap-1"
                        onClick={() => handleSort(column.key)}
                      >
                        <span>{column.title}</span>
                        {sortConfig?.key === column.key && (
                          sortConfig.direction === 'asc' ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )
                        )}
                      </div>
                    ) : (
                      column.title
                    )}
                  </TableHead>
                ))}
                
                {actions && <TableHead className="w-12"></TableHead>}
              </TableRow>
            </TableHeader>
            
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={columns.length + (selectable ? 1 : 0) + (actions ? 1 : 0)} className="h-24 text-center">
                    <div className="flex items-center justify-center">
                      <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                      Loading...
                    </div>
                  </TableCell>
                </TableRow>
              ) : sortedData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={columns.length + (selectable ? 1 : 0) + (actions ? 1 : 0)} className="h-24 text-center">
                    {emptyState || (
                      <div className="text-muted-foreground">
                        No data available
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ) : (
                sortedData.map((row) => (
                  <TableRow 
                    key={row.id}
                    className={cn(
                      "hover:bg-muted/30 transition-colors active:bg-muted/50",
                      selectedRows.has(row.id) && "bg-muted/50"
                    )}
                  >
                    {selectable && (
                      <TableCell>
                        <Checkbox
                          checked={selectedRows.has(row.id)}
                          onCheckedChange={(checked) => handleSelectRow(row.id, checked as boolean)}
                        />
                      </TableCell>
                    )}
                    
                    {columns.map((column) => (
                      <TableCell key={String(column.key)} className={cn("p-2 md:p-3", column.className)}>
                        {column.render ? (
                          column.render(String(row[column.key]), row)
                        ) : (
                          String(row[column.key])
                        )}
                      </TableCell>
                    ))}
                    
                    {actions && (
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-9 w-9 p-2 md:h-8 md:w-8 md:p-3 min-h-[36px] min-w-[36px]">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="glass">
                            {actions.view && (
                              <DropdownMenuItem onClick={() => actions.view!(row)}>
                                <Eye className="h-4 w-4 mr-2" />
                                View
                              </DropdownMenuItem>
                            )}
                            {actions.edit && (
                              <DropdownMenuItem onClick={() => actions.edit!(row)}>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit
                              </DropdownMenuItem>
                            )}
                            {actions.delete && (
                              <DropdownMenuItem 
                                onClick={() => actions.delete!(row)}
                                className="text-destructive"
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    )}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Footer with pagination and selection info */}
        <div className="border-t bg-muted/20 px-4 py-3">
          <div className="flex items-center justify-between text-sm">
            <div className="text-muted-foreground">
              {selectedRows.size > 0 && (
                <span>{selectedRows.size} of {sortedData.length} selected</span>
              )}
            </div>
            
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" disabled>
                Previous
              </Button>
              <Badge variant="secondary">1</Badge>
              <Button variant="outline" size="sm" disabled>
                Next
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
