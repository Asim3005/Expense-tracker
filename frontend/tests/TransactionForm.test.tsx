import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { TransactionForm } from '@/components/TransactionForm'
import * as api from '@/lib/api'
import { Category } from '@/lib/types'

const mockCategories: Category[] = [
  { id: '1', name: 'Food', color: '#f59e0b', icon: 'utensils', created_at: '', updated_at: '' },
]

describe('TransactionForm', () => {
  beforeEach(() => {
    vi.spyOn(api, 'createTransaction').mockResolvedValue({
      id: '1',
      amount: 25.50,
      description: 'Groceries',
      transaction_type: 'expense',
      category_id: '1',
      date: '2024-02-24',
      category: mockCategories[0],
      created_at: '',
      updated_at: '',
    } as any)
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('renders all form fields', () => {
    render(
      <TransactionForm
        categories={mockCategories}
        onSuccess={vi.fn()}
      />
    )

    expect(screen.getByLabelText('Type')).toBeInTheDocument()
    expect(screen.getByLabelText('Amount')).toBeInTheDocument()
    expect(screen.getByLabelText('Description')).toBeInTheDocument()
    expect(screen.getByLabelText('Category')).toBeInTheDocument()
    expect(screen.getByLabelText('Date')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /add transaction/i })).toBeInTheDocument()
  })

  it('submits transaction with valid data', async () => {
    const onSuccess = vi.fn()

    render(
      <TransactionForm
        categories={mockCategories}
        onSuccess={onSuccess}
      />
    )

    await userEvent.type(screen.getByLabelText('Amount'), '50')
    await userEvent.type(screen.getByLabelText('Description'), 'Test expense')
    await userEvent.selectOptions(screen.getByLabelText('Type'), screen.getByText('Expense'))
    await userEvent.click(screen.getByRole('button', { name: /add transaction/i }))

    await waitFor(() => {
      expect(onSuccess).toHaveBeenCalled()
      expect(api.createTransaction).toHaveBeenCalledWith(
        expect.objectContaining({
          amount: 50,
          description: 'Test expense',
          transaction_type: 'expense',
        })
      )
    })
  })

  it('displays error message on submit failure', async () => {
    vi.spyOn(api, 'createTransaction').mockRejectedValue(new Error('API Error'))

    render(
      <TransactionForm
        categories={mockCategories}
        onSuccess={vi.fn()}
      />
    )

    await userEvent.type(screen.getByLabelText('Amount'), '50')
    await userEvent.type(screen.getByLabelText('Description'), 'Test')
    await userEvent.click(screen.getByRole('button', { name: /add transaction/i }))

    await waitFor(() => {
      expect(screen.getByText('API Error')).toBeInTheDocument()
    })
  })

  it('calls onCancel when cancel button is clicked', async () => {
    const onCancel = vi.fn()

    render(
      <TransactionForm
        categories={mockCategories}
        onCancel={onCancel}
      />
    )

    await userEvent.click(screen.getByRole('button', { name: /cancel/i }))

    expect(onCancel).toHaveBeenCalled()
  })

  it('does not show cancel button when onCancel is not provided', () => {
    render(
      <TransactionForm
        categories={mockCategories}
        onSuccess={vi.fn()}
      />
    )

    expect(screen.queryByRole('button', { name: /cancel/i })).not.toBeInTheDocument()
  })

  it('resets form after successful submission', async () => {
    const onSuccess = vi.fn()
    const { rerender } = render(
      <TransactionForm
        categories={mockCategories}
        onSuccess={onSuccess}
      />
    )

    // Fill and submit
    await userEvent.type(screen.getByLabelText('Amount'), '100')
    await userEvent.type(screen.getByLabelText('Description'), 'Test')
    await userEvent.click(screen.getByRole('button', { name: /add transaction/i }))

    await waitFor(() => {
      expect(onSuccess).toHaveBeenCalled()
    })

    // Check form is reset
    const amountInput = screen.getByLabelText('Amount') as HTMLInputElement
    const descriptionInput = screen.getByLabelText('Description') as HTMLInputElement
    expect(amountInput.value).toBe('')
    expect(descriptionInput.value).toBe('')
  })
})
