import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useFinance } from '../../context/FinanceContext'
import { FinancePageHeader } from '../../components/finance/FinancePageHeader'
import { formatCurrency, formatRelativeDate } from '../../utils/finance'
import type { FinanceNotificationType } from '../../types'

type Filter = 'all' | 'unread' | FinanceNotificationType

const TYPE_LABELS: Record<FinanceNotificationType, string> = {
  budget_alert: 'Budget',
  expense_spike: 'Expense Spike',
  maintenance_due: 'Maintenance',
  revenue_milestone: 'Revenue',
  approval_required: 'Approval',
  system: 'System',
}

const TYPE_ICONS: Record<FinanceNotificationType, string> = {
  budget_alert: '💰',
  expense_spike: '📈',
  maintenance_due: '🔧',
  revenue_milestone: '🎯',
  approval_required: '✋',
  system: '🔔',
}

export function FinanceNotifications() {
  const { notifications, unreadCount, markNotificationRead, markAllNotificationsRead } = useFinance()
  const [filter, setFilter] = useState<Filter>('all')

  const sorted = [...notifications].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  )

  const filtered = sorted.filter((n) => {
    if (filter === 'unread') return !n.read
    if (filter === 'all') return true
    return n.type === filter
  })

  return (
    <div className="page finance-page">
      <FinancePageHeader
        title="Financial Notifications"
        subtitle="Budget alerts, expense spikes, maintenance reminders, and approval requests."
        action={
          unreadCount > 0 ? (
            <button type="button" className="btn btn--ghost" onClick={markAllNotificationsRead}>
              Mark all as read
            </button>
          ) : undefined
        }
      />

      <div className="summary-bar finance-summary-bar">
        <span><strong>{notifications.length}</strong> Total</span>
        <span><strong>{unreadCount}</strong> Unread</span>
        <span>
          <strong>{notifications.filter((n) => n.priority === 'high').length}</strong> High Priority
        </span>
        <span>
          <strong>
            {formatCurrency(
              notifications.filter((n) => n.amount).reduce((s, n) => s + (n.amount ?? 0), 0),
            )}
          </strong> Alert Value
        </span>
      </div>

      <div className="filter-tabs">
        <button
          type="button"
          className={`filter-tab ${filter === 'all' ? 'filter-tab--active' : ''}`}
          onClick={() => setFilter('all')}
        >
          All
        </button>
        <button
          type="button"
          className={`filter-tab ${filter === 'unread' ? 'filter-tab--active' : ''}`}
          onClick={() => setFilter('unread')}
        >
          Unread
          {unreadCount > 0 && <span className="filter-tab-count">{unreadCount}</span>}
        </button>
        {(Object.keys(TYPE_LABELS) as FinanceNotificationType[]).map((type) => (
          <button
            key={type}
            type="button"
            className={`filter-tab ${filter === type ? 'filter-tab--active' : ''}`}
            onClick={() => setFilter(type)}
          >
            {TYPE_LABELS[type]}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="data-state data-state--empty">
          <span className="data-state-icon">🔔</span>
          <h3>No notifications</h3>
          <p>You're all caught up. New financial alerts will appear here.</p>
        </div>
      ) : (
        <div className="notification-list">
          {filtered.map((notification) => (
            <div
              key={notification.id}
              className={`notification-card finance-notification-card ${notification.read ? '' : 'notification-card--unread'} notification-card--${notification.priority}`}
            >
              <div className="notification-icon">{TYPE_ICONS[notification.type]}</div>
              <div className="notification-content">
                <div className="notification-header">
                  <strong>{notification.title}</strong>
                  <span className="notification-time">
                    {formatRelativeDate(notification.createdAt)}
                  </span>
                </div>
                <p>{notification.message}</p>
                {notification.amount && (
                  <span className="finance-alert-amount">{formatCurrency(notification.amount)}</span>
                )}
                <div className="notification-actions">
                  {notification.link && (
                    <Link to={notification.link} className="btn btn--ghost btn--sm">
                      View Details
                    </Link>
                  )}
                  {!notification.read && (
                    <button
                      type="button"
                      className="btn btn--ghost btn--sm"
                      onClick={() => markNotificationRead(notification.id)}
                    >
                      Mark as read
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
