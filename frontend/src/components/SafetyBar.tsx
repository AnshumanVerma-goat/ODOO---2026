interface SafetyBarProps {
  score: number
}

export function SafetyBar({ score }: SafetyBarProps) {
  const color = score >= 85 ? 'high' : score >= 70 ? 'mid' : 'low'
  return (
    <div className="safety-bar">
      <div
        className={`safety-bar-fill safety-bar-fill--${color}`}
        style={{ width: `${score}%` }}
      />
      <span>{score}%</span>
    </div>
  )
}
