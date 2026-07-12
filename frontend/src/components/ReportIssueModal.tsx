import type { FormEvent } from 'react'
import { useState } from 'react'
import type { TripIssueCategory } from '../types'

const ISSUE_CATEGORIES: { value: TripIssueCategory; label: string }[] = [
  { value: 'vehicle', label: 'Vehicle problem' },
  { value: 'route', label: 'Route / traffic' },
  { value: 'safety', label: 'Safety concern' },
  { value: 'other', label: 'Other' },
]

interface ReportIssueModalProps {
  tripId: string
  route: string
  onSubmit: (category: TripIssueCategory, description: string) => void
  onClose: () => void
}

export function ReportIssueModal({ tripId, route, onSubmit, onClose }: ReportIssueModalProps) {
  const [category, setCategory] = useState<TripIssueCategory>('vehicle')
  const [description, setDescription] = useState('')

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!description.trim()) return
    onSubmit(category, description.trim())
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Report Issue</h2>
          <button type="button" className="modal-close" onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>
        <p className="modal-subtitle">
          Trip <span className="mono">{tripId}</span> · {route}
        </p>
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label htmlFor="issue-category">Category</label>
            <select
              id="issue-category"
              value={category}
              onChange={(e) => setCategory(e.target.value as TripIssueCategory)}
            >
              {ISSUE_CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="issue-description">Description</label>
            <textarea
              id="issue-description"
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the issue in detail..."
              required
            />
          </div>
          <div className="modal-actions">
            <button type="button" className="btn btn--ghost" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn--primary">
              Submit Report
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
