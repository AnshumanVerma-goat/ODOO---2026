import { expenses } from '../data/mockData'

const categoryIcons: Record<string, string> = {
  fuel: '⛽',
  maintenance: '🔧',
  insurance: '🛡️',
  other: '📋',
}

export function FuelExpenses() {
  const byCategory = expenses.reduce<Record<string, number>>((acc, e) => {
    acc[e.category] = (acc[e.category] ?? 0) + e.amount
    return acc
  }, {})

  const total = expenses.reduce((s, e) => s + e.amount, 0)

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Fuel & Expenses</h1>
        <button className="btn btn--primary">+ Add Expense</button>
      </div>
      <p className="page-subtitle">Review fuel consumption, maintenance costs, and operational expenses.</p>

      <div className="category-grid">
        {Object.entries(byCategory).map(([cat, amount]) => (
          <div key={cat} className="category-card">
            <span className="category-icon">{categoryIcons[cat]}</span>
            <span className="category-name capitalize">{cat}</span>
            <span className="category-amount">₹{amount.toLocaleString()}</span>
            <span className="category-pct">{((amount / total) * 100).toFixed(1)}%</span>
          </div>
        ))}
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Category</th>
              <th>Vehicle</th>
              <th>Description</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((e) => (
              <tr key={e.id}>
                <td>{e.date}</td>
                <td className="capitalize">{e.category}</td>
                <td>{e.vehicle}</td>
                <td>{e.description}</td>
                <td>₹{e.amount.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
