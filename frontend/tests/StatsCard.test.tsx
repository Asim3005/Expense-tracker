import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { StatsCard } from '@/components/StatsCard'
import { Wallet, TrendingUp, TrendingDown } from 'lucide-react'

describe('StatsCard', () => {
  it('renders title and value', () => {
    render(
      <StatsCard
        title="Balance"
        value="$1,234.56"
        icon={Wallet}
      />
    )
    expect(screen.getByText('Balance')).toBeInTheDocument()
    expect(screen.getByText('$1,234.56')).toBeInTheDocument()
  })

  it('renders trend when provided', () => {
    render(
      <StatsCard
        title="Income"
        value="$5,000.00"
        icon={TrendingUp}
        trend={{ value: '+10%', positive: true }}
      />
    )
    expect(screen.getByText('+10%')).toBeInTheDocument()
  })

  it('renders negative trend when provided', () => {
    render(
      <StatsCard
        title="Expenses"
        value="$3,000.00"
        icon={TrendingDown}
        trend={{ value: '+5%', positive: false }}
      />
    )
    const trendElement = screen.getByText('+5%')
    expect(trendElement).toBeInTheDocument()
    expect(trendElement.className).toContain('text-red-600')
  })

  it('does not render trend when not provided', () => {
    render(
      <StatsCard
        title="Balance"
        value="$1,234.56"
        icon={Wallet}
      />
    )
    expect(screen.queryByText(/%/)).not.toBeInTheDocument()
  })
})
