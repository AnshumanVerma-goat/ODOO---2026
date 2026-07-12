import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useSafety } from '../../context/SafetyContext'
import { SafetyPageHeader } from '../../components/safety/SafetyPageHeader'
import { formatRelativeDate } from '../../utils/safety'
import type { NotificationType } from '../../types'

type Filter = 'all' | NotificationType | 'unread'

const TYPE_LABELS: Record<NotificationType, string> = {
  license_expiry: 'License',
  low_score: 'Safety Score',
  incident: 'Incident',
  compliance: 'Compliance',
  system: 'System',
}

const TYPE_ICONS: Record<NotificationType, string> = {
  license_expiry: '🪪',
  low_score: '📉',
  incident: '⚠️',
  compliance: '✓',
  system: '🔔',
}

export function SafetyNotifications() {
  const { notifications, unreadCount, markNotificationRead, markAllNotificationsRead } = useSafety()
  const [filter, setFilter] = useState<Filter>('all')

  const sorted = [...notifications].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  )

  const filtered = sorted.filter((notification) => {
    if (filter === 'unread') return !notification.read
    if (filter === 'all') return true
    return notification.type === filter
  })

  return (
    <div className="page">
      <SafetyPageHeader
        title="Notifications"
        subtitle="Safety alerts, compliance reminders, and incident updates."
        action={
          unreadCount > 0 ? (
            <button type="button" className="btn btn--ghost" onClick={markAllNotificationsRead}>
              Mark all as read
            </button>
          ) : undefined
        }
      />

      <div className="summary-bar safety-summary-bar">
        <span>
          <strong>{notifications.length}</strong> Total
        </span>
        <span>
          <strong>{unreadCount}</strong> Unread
        </span>
        <span>
          <strong>{notifications.filter((n) => n.priority === 'high').length}</strong> High
          Priority
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
        {(Object.keys(TYPE_LABELS) as NotificationType[]).map((type) => (
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
        <div className="empty-state">No notifications to show.</div>
      ) : (
        <div className="notification-list">
          {filtered.map((notification) => (
            <div
              key={notification.id}
              className={`notification-card ${notification.read ? '' : 'notification-card--unread'} notification-card--${notification.priority}`}
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
