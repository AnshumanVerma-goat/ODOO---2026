import { useState } from 'react'
import { exportToCsv } from '../../utils/finance'

interface ExportButtonProps {
  filename: string
  headers: string[]
  rows: (string | number)[][]
  label?: string
}

export function ExportButton({ filename, headers, rows, label = 'Export CSV' }: ExportButtonProps) {
  const [exporting, setExporting] = useState(false)

  const handleExport = () => {
    setExporting(true)
    setTimeout(() => {
      exportToCsv(filename, headers, rows)
      setExporting(false)
    }, 400)
  }

  return (
    <button
      type="button"
      className="btn btn--ghost btn--sm finance-export-btn"
      onClick={handleExport}
      disabled={exporting || rows.length === 0}
    >
      {exporting ? 'Exporting...' : `⬇ ${label}`}
    </button>
  )
}
