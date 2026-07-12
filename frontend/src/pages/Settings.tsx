import { useAuth } from '../context/AuthContext'
import { roleDescriptions, roleLabels } from '../data/mockData'

export function Settings() {
  const { role, user } = useAuth()

  return (
    <div className="page">
      <h1 className="page-title">Settings</h1>
      <p className="page-subtitle">Configure your fleet management preferences.</p>

      <div className="settings-grid">
        <section className="settings-section">
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

        <section className="settings-section">
          <h2>Notifications</h2>
          <label className="checkbox-label">
            <input type="checkbox" defaultChecked /> Maintenance alerts
          </label>
          <label className="checkbox-label">
            <input type="checkbox" defaultChecked /> License expiry warnings
          </label>
          <label className="checkbox-label">
            <input type="checkbox" defaultChecked /> Trip status updates
          </label>
          <label className="checkbox-label">
            <input type="checkbox" /> Expense threshold alerts
          </label>
        </section>

        <section className="settings-section">
          <h2>Preferences</h2>
          <div className="form-group">
            <label>Currency</label>
            <select defaultValue="INR">
              <option value="INR">INR (₹)</option>
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
            </select>
          </div>
          <div className="form-group">
            <label>Distance Unit</label>
            <select defaultValue="km">
              <option value="km">Kilometers</option>
              <option value="mi">Miles</option>
            </select>
          </div>
        </section>
      </div>

      <button className="btn btn--primary">Save Changes</button>
    </div>
  )
}
