import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useFinance } from '../../context/FinanceContext'
import { FinancePageHeader } from '../../components/finance/FinancePageHeader'
import { roleDescriptions, roleLabels } from '../../data/mockData'
import type { FinanceSettings, ReportFormat } from '../../types'

export function FinanceSettings() {
  const { role, user } = useAuth()
  const { settings, updateSettings } = useFinance()
  const [localSettings, setLocalSettings] = useState<FinanceSettings>(settings)
  const [saved, setSaved] = useState(false)

  const handleChange = <K extends keyof FinanceSettings>(key: K, value: FinanceSettings[K]) => {
    setLocalSettings((prev) => ({ ...prev, [key]: value }))
    setSaved(false)
  }

  const handleSave = () => {
    updateSettings(localSettings)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="page finance-page">
      <FinancePageHeader
        title="Finance Settings"
        subtitle="Configure financial preferences, alerts, and reporting defaults."
        action={
          <button type="button" className="btn btn--primary" onClick={handleSave}>
            {saved ? '✓ Saved' : 'Save Changes'}
          </button>
        }
      />

      <div className="settings-grid finance-settings-grid">
        <section className="settings-section finance-settings-section">
          <h2>Profile</h2>
          <div className="form-group">
            <label>Current Role</label>
            <input type="text" value={role ? roleLabels[role] : ''} readOnly />
          </div>
          <div className="form-group">
            <label>Role Description</label>
            <input type="text" value={role ? roleDescriptions[role] : ''} readOnly />
          </div>
          <div className="form-group">
            <label>Display Name</label>
            <input type="text" value={user?.name ?? ''} readOnly />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input type="email" value={user?.email ?? ''} readOnly />
          </div>
        </section>

        <section className="settings-section finance-settings-section">
          <h2>Financial Preferences</h2>
          <div className="form-group">
            <label>Currency</label>
            <select
              value={localSettings.currency}
              onChange={(e) => handleChange('currency', e.target.value as FinanceSettings['currency'])}
            >
              <option value="INR">INR (₹)</option>
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
            </select>
          </div>
          <div className="form-group">
            <label>Fiscal Year Start</label>
            <select
              value={localSettings.fiscalYearStart}
              onChange={(e) => handleChange('fiscalYearStart', e.target.value)}
            >
              <option value="January">January</option>
              <option value="April">April</option>
              <option value="July">July</option>
            </select>
          </div>
          <div className="form-group">
            <label>Default Report Format</label>
            <select
              value={localSettings.defaultReportFormat}
              onChange={(e) => handleChange('defaultReportFormat', e.target.value as ReportFormat)}
            >
              <option value="pdf">PDF</option>
              <option value="csv">CSV</option>
              <option value="xlsx">Excel (XLSX)</option>
            </select>
          </div>
          <div className="form-group">
            <label>Expense Alert Threshold</label>
            <input
              type="number"
              value={localSettings.expenseThreshold}
              onChange={(e) => handleChange('expenseThreshold', Number(e.target.value))}
            />
          </div>
        </section>

        <section className="settings-section finance-settings-section">
          <h2>Alert Preferences</h2>
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={localSettings.budgetAlerts}
              onChange={(e) => handleChange('budgetAlerts', e.target.checked)}
            />
            Budget threshold alerts
          </label>
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={localSettings.fuelAlerts}
              onChange={(e) => handleChange('fuelAlerts', e.target.checked)}
            />
            Fuel cost spike notifications
          </label>
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={localSettings.maintenanceAlerts}
              onChange={(e) => handleChange('maintenanceAlerts', e.target.checked)}
            />
            Maintenance cost reminders
          </label>
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={localSettings.weeklyDigest}
              onChange={(e) => handleChange('weeklyDigest', e.target.checked)}
            />
            Weekly financial digest email
          </label>
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={localSettings.autoExport}
              onChange={(e) => handleChange('autoExport', e.target.checked)}
            />
            Auto-export monthly reports
          </label>
        </section>
      </div>
    </div>
  )
}
