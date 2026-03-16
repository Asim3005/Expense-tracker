import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { CategorySelect } from '@/components/CategorySelect'

const mockCategories = [
  { id: '1', name: 'Food', color: '#f59e0b', icon: 'utensils', created_at: '', updated_at: '' },
  { id: '2', name: 'Transportation', color: '#64748b', icon: 'car', created_at: '', updated_at: '' },
]

describe('CategorySelect', () => {
  it('renders category options', () => {
    render(
      <CategorySelect
        categories={mockCategories}
        value={null}
        onChange={() => {}}
        transactionType="expense"
      />
    )

    expect(screen.getByLabelText('Category')).toBeInTheDocument()
    expect(screen.getByText('No category')).toBeInTheDocument()
    expect(screen.getByText('Food')).toBeInTheDocument()
    expect(screen.getByText('Transportation')).toBeInTheDocument()
  })

  it('calls onChange when category is selected', async () => {
    let selectedValue: string | null = null
    const handleChange = (value: string | null) => {
      selectedValue = value
    }

    render(
      <CategorySelect
        categories={mockCategories}
        value={selectedValue}
        onChange={handleChange}
        transactionType="expense"
      />
    )

    const select = screen.getByLabelText('Category')
    select.focus()

    // Select Food category
    const foodOption = screen.getByText('Food')
    await userEvent.selectOptions(select, foodOption)

    expect(selectedValue).toBe('1')
  })

  it('displays "No category" when value is null', () => {
    render(
      <CategorySelect
        categories={mockCategories}
        value={null}
        onChange={() => {}}
        transactionType="expense"
      />
    )

    const select = screen.getByLabelText('Category') as HTMLSelectElement
    expect(select.value).toBe('')
  })

  it('displays selected category when value is provided', () => {
    render(
      <CategorySelect
        categories={mockCategories}
        value="1"
        onChange={() => {}}
        transactionType="expense"
      />
    )

    const select = screen.getByLabelText('Category') as HTMLSelectElement
    expect(select.value).toBe('1')
  })
})
