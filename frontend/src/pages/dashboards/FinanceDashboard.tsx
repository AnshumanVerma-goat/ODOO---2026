import { expenses } from '../../data/mockData'
import { StatCard } from '../../components/StatCard'

export function FinanceDashboard() {
  const totalExpenses = expenses.reduce((s, e) => s + e.amount, 0)

  return (
    <div className="page">
      <h1 className="page-title">Finance & Analytics Dashboard</h1>
      <p className="page-subtitle">Expenses, fuel costs, and profitability insights.</p>

      <div className="stats-grid">
        <StatCard label="Total Expenses" value={`₹${totalExpenses.toLocaleString()}`} />
        <StatCard
          label="Fuel Costs"
          value={`₹${expenses
            .filter((e) => e.category === 'fuel')
            .reduce((s, e) => s + e.amount, 0)
            .toLocaleString()}`}
          variant="warning"
        />
        <StatCard
          label="Maintenance Costs"
          value={`₹${expenses
            .filter((e) => e.category === 'maintenance')
            .reduce((s, e) => s + e.amount, 0)
            .toLocaleString()}`}
        />
        <StatCard label="Profit Margin" value="18.4%" variant="success" trend="+2.1% vs last month" />
      </div>

      <section className="section">
        <h2>Recent Expenses</h2>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Category</th>
                <th>Vehicle</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {expenses.slice(0, 5).map((e) => (
                <tr key={e.id}>
                  <td>{e.date}</td>
                  <td className="capitalize">{e.category}</td>
                  <td>{e.vehicle}</td>
                  <td>₹{e.amount.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
