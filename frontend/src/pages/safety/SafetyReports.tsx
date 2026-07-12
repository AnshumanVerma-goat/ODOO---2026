import { useState } from 'react'
import { safetyReportTemplates } from '../../data/safetyData'
import { SafetyPageHeader } from '../../components/safety/SafetyPageHeader'

export function SafetyReports() {
  const [generating, setGenerating] = useState<string | null>(null)
  const [generated, setGenerated] = useState<Set<string>>(new Set())

  const handleGenerate = (reportId: string) => {
    setGenerating(reportId)
    setTimeout(() => {
      setGenerating(null)
      setGenerated((prev) => new Set(prev).add(reportId))
    }, 1200)
  }

  return (
    <div className="page">
      <SafetyPageHeader
        title="Safety Reports"
        subtitle="Generate compliance summaries, incident logs, and license audit reports."
      />

      <div className="report-grid">
        {safetyReportTemplates.map((report) => (
          <div key={report.id} className="report-card">
            <div className="report-card-header">
              <span className="report-icon">📄</span>
              <div>
                <h3>{report.name}</h3>
                <span className="badge badge--muted capitalize">{report.frequency}</span>
              </div>
            </div>
            <p className="report-description">{report.description}</p>
            {report.lastGenerated && (
              <p className="muted report-last">
                Last generated: {report.lastGenerated}
              </p>
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
                <button type="button" className="btn btn--ghost">
                  Download PDF
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      <section className="section">
        <h2>Recent Report Activity</h2>
        <div className="table-wrap table-wrap--responsive">
          <table>
            <thead>
              <tr>
                <th>Report</th>
                <th>Type</th>
                <th>Generated</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {safetyReportTemplates
                .filter((r) => r.lastGenerated)
                .map((report) => (
                  <tr key={report.id}>
                    <td data-label="Report">
                      <strong>{report.name}</strong>
                    </td>
                    <td data-label="Type" className="capitalize">
                      {report.frequency}
                    </td>
                    <td data-label="Generated">{report.lastGenerated}</td>
                    <td data-label="Status">
                      <span className="badge badge--success">Available</span>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
