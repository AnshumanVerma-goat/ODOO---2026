import type { ReactNode } from 'react'

export interface DataTableColumn<T> {
  key: string
  header: string
  render: (row: T) => ReactNode
  align?: 'left' | 'right' | 'center'
}

interface DataTableProps<T> {
  columns: DataTableColumn<T>[]
  data: T[]
  keyField: keyof T & string
  responsive?: boolean
  compact?: boolean
}

export function DataTable<T>({
  columns,
  data,
  keyField,
  responsive = true,
  compact = false,
}: DataTableProps<T>) {
  return (
    <div className={`table-wrap ${responsive ? 'table-wrap--responsive' : ''} ${compact ? 'table-wrap--compact' : ''}`}>
      <table className="finance-table">
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.key} style={{ textAlign: col.align ?? 'left' }}>
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={String(row[keyField])}>
              {columns.map((col) => (
                <td key={col.key} data-label={col.header} style={{ textAlign: col.align ?? 'left' }}>
                  {col.render(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
