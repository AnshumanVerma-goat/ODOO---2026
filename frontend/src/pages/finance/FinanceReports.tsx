import { useState } from 'react'
import { financeReportTemplates } from '../../data/financeData'
import { FinancePageHeader } from '../../components/finance/FinancePageHeader'
import { DataTable } from '../../components/finance/DataTable'
import { ExportButton } from '../../components/finance/ExportButton'
import { useFinance } from '../../context/FinanceContext'
import { exportToCsv } from '../../utils/finance'
import type { ReportFormat } from '../../types'

export function FinanceReports() {
  const { settings } = useFinance()
  const [generating, setGenerating] = useState<string | null>(null)
  const [generated, setGenerated] = useState<Set<string>>(new Set())
  const [selectedFormat, setSelectedFormat] = useState<ReportFormat>(settings.defaultReportFormat)

  const handleGenerate = (reportId: string) => {
    setGenerating(reportId)
    setTimeout(() => {
      setGenerating(null)
      setGenerated((prev) => new Set(prev).add(reportId))
    }, 1200)
  }

  const handleDownload = (reportName: string, format: ReportFormat) => {
    if (format === 'csv') {
      exportToCsv(
        `${reportName.toLowerCase().replace(/\s+/g, '-')}.csv`,
        ['Metric', 'Value'],
        [
          ['Report', reportName],
          ['Generated', new Date().toLocaleDateString()],
          ['Format', format],
          ['Status', 'Complete'],
        ],
      )
    }
  }

  return (
    <div className="page finance-page">
      <FinancePageHeader
        title="Financial Reports"
        subtitle="Generate, preview, and export comprehensive financial reports."
        action={
          <div className="finance-report-format">
            <label className="muted">Default format:</label>
            <select
              className="finance-select"
              value={selectedFormat}
              onChange={(e) => setSelectedFormat(e.target.value as ReportFormat)}
            >
              <option value="pdf">PDF</option>
              <option value="csv">CSV</option>
              <option value="xlsx">Excel</option>
            </select>
          </div>
        }
      />

      <div className="report-grid">
        {financeReportTemplates.map((report) => (
          <div key={report.id} className="report-card finance-report-card">
            <div className="report-card-header">
              <span className="report-icon finance-report-icon">
                {report.category === 'revenue' && '📈'}
                {report.category === 'expense' && '📉'}
                {report.category === 'fuel' && '⛽'}
                {report.category === 'maintenance' && '🔧'}
                {report.category === 'summary' && '📊'}
              </span>
              <div>
                <h3>{report.name}</h3>
                <span className="badge badge--muted capitalize">{report.frequency}</span>
              </div>
            </div>
            <p className="report-description">{report.description}</p>
            <div className="finance-report-formats">
              {report.formats.map((f) => (
                <span key={f} className="badge badge--info">{f.toUpperCase()}</span>
              ))}
            </div>
            {report.lastGenerated && (
              <p className="muted report-last">Last generated: {report.lastGenerated}</p>
            )}
            <div className="report-actions">
              <button
                type="button"
                className="btn btn--primary"
                disabled={generating === report.id}
                onClick={() => handleGenerate(report.id)}
              >
                {generating === report.id ? 'Generating...' : 'Generate Report'}
              </button>
              {generated.has(report.id) && (
                <>
                  {report.formats.map((format) => (
                    <button
                      key={format}
                      type="button"
                      className="btn btn--ghost btn--sm"
                      onClick={() => handleDownload(report.name, format)}
                    >
                      Download {format.toUpperCase()}
                    </button>
                  ))}
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      <section className="section">
        <div className="section-header">
          <h2>Recent Report Activity</h2>
          <ExportButton
            filename="report-activity.csv"
            headers={['Report', 'Type', 'Generated', 'Status']}
            rows={financeReportTemplates
              .filter((r) => r.lastGenerated)
              .map((r) => [r.name, r.frequency, r.lastGenerated ?? '', 'Available'])}
            label="Export Activity"
          />
        </div>
        <DataTable
          columns={[
            { key: 'name', header: 'Report', render: (r) => <strong>{r.name}</strong> },
            { key: 'frequency', header: 'Type', render: (r) => <span className="capitalize">{r.frequency}</span> },
            { key: 'lastGenerated', header: 'Generated', render: (r) => r.lastGenerated ?? '—' },
            { key: 'status', header: 'Status', render: () => <span className="badge badge--success">Available</span> },
            { key: 'formats', header: 'Formats', render: (r) => r.formats.map((f) => f.toUpperCase()).join(', ') },
          ]}
          data={financeReportTemplates.filter((r) => r.lastGenerated)}
          keyField="id"
        />
      </section>
    </div>
  )
}
