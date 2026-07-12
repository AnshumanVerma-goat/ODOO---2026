import { Link } from 'react-router-dom'
import { useFinance } from '../../context/FinanceContext'
import {
  expenseBreakdown,
  financeNotifications,
  monthlyRevenue,
} from '../../data/financeData'
import { expenses } from '../../data/mockData'
import { FinancePageHeader } from '../../components/finance/FinancePageHeader'
import { FinanceQuickLinks } from '../../components/finance/FinanceQuickLinks'
import { KpiCard } from '../../components/finance/KpiCard'
import { AreaChart } from '../../components/finance/AreaChart'
import { DonutChart } from '../../components/finance/DonutChart'
import { DataTable } from '../../components/finance/DataTable'
import { formatCurrency, formatRelativeDate, calcTrend } from '../../utils/finance'

export function FinanceDashboard() {
  const { unreadCount } = useFinance()

  const currentMonth = monthlyRevenue[monthlyRevenue.length - 1]
  const priorMonth = monthlyRevenue[monthlyRevenue.length - 2]
  const revenueTrend = calcTrend(currentMonth.revenue, priorMonth.revenue)
  const expenseTrend = calcTrend(currentMonth.expenses, priorMonth.expenses)
  const profitTrend = calcTrend(currentMonth.profit, priorMonth.profit)
  const totalExpenses = expenses.reduce((s, e) => s + e.amount, 0)

  const recentNotifications = [...financeNotifications]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 3)

  const recentExpenses = [...expenses]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5)

  return (
    <div className="page finance-page">
      <FinancePageHeader
        title="Finance Dashboard"
        subtitle="Real-time overview of revenue, expenses, and fleet financial health."
        action={
          <Link to="/finance/notifications" className="btn btn--ghost notification-btn">
            🔔 Notifications
            {unreadCount > 0 && <span className="notification-badge">{unreadCount}</span>}
          </Link>
        }
      />

      <div className="kpi-grid">
        <KpiCard
          label="Monthly Revenue"
          value={formatCurrency(currentMonth.revenue)}
          trend={revenueTrend.text}
          trendDirection={revenueTrend.direction}
          variant="success"
          icon="📈"
        />
        <KpiCard
          label="Monthly Expenses"
          value={formatCurrency(currentMonth.expenses)}
          trend={expenseTrend.text}
          trendDirection={expenseTrend.direction === 'up' ? 'down' : expenseTrend.direction === 'down' ? 'up' : 'neutral'}
          variant="warning"
          icon="📉"
        />
        <KpiCard
          label="Net Profit"
          value={formatCurrency(currentMonth.profit)}
          trend={profitTrend.text}
          trendDirection={profitTrend.direction}
          variant="info"
          icon="💰"
        />
        <KpiCard
          label="Profit Margin"
          value={`${((currentMonth.profit / currentMonth.revenue) * 100).toFixed(1)}%`}
          trend="+2.1% vs last month"
          trendDirection="up"
          variant="default"
          icon="📊"
        />
      </div>

      <FinanceQuickLinks />

      <div className="finance-dashboard-charts">
        <div className="finance-panel finance-panel--wide">
          <AreaChart
            title="Revenue vs Expenses"
            data={monthlyRevenue.map((m) => ({
              label: m.month,
              value: m.revenue,
              secondaryValue: m.expenses,
            }))}
            formatValue={(v) => `₹${(v / 1000).toFixed(0)}K`}
          />
        </div>
        <div className="finance-panel">
          <DonutChart
            title="Expense Breakdown"
            data={expenseBreakdown.map((e) => ({
              label: e.category,
              value: e.amount,
              color: e.color,
            }))}
            centerLabel="Total"
            centerValue={formatCurrency(totalExpenses)}
          />
        </div>
      </div>

      <div className="dashboard-split">
        <section className="section">
          <div className="section-header">
            <h2>Recent Expenses</h2>
            <Link to="/finance/revenue-expense" className="btn btn--ghost btn--sm">
              View all
            </Link>
          </div>
          <DataTable
            columns={[
              { key: 'date', header: 'Date', render: (e) => e.date },
              { key: 'category', header: 'Category', render: (e) => <span className="capitalize">{e.category}</span> },
              { key: 'vehicle', header: 'Vehicle', render: (e) => e.vehicle },
              { key: 'amount', header: 'Amount', render: (e) => formatCurrency(e.amount), align: 'right' },
            ]}
            data={recentExpenses}
            keyField="id"
            compact
          />
        </section>

        <section className="section">
          <div className="section-header">
            <h2>Financial Alerts</h2>
            <Link to="/finance/notifications" className="btn btn--ghost btn--sm">
              View all
            </Link>
          </div>
          <div className="card-list">
            {recentNotifications.length === 0 ? (
              <div className="empty-state">No financial alerts at this time.</div>
            ) : (
              recentNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`card finance-alert-card ${notification.read ? '' : 'card--alert'}`}
                >
                  <div className="card-header">
                    <strong>{notification.title}</strong>
                    <span className="muted">{formatRelativeDate(notification.createdAt)}</span>
                  </div>
                  <p>{notification.message}</p>
                  {notification.amount && (
                    <span className="finance-alert-amount">{formatCurrency(notification.amount)}</span>
                  )}
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  )
}
