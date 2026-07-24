import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { ConfirmModal } from '../ConfirmModal'
import { EmptyState } from '../EmptyState'
import { ErrorState } from '../ErrorState'
import { LeadCreateModal } from '../LeadCreateModal'
import { Pagination } from '../Pagination'
import { StatusBadge } from '../StatusBadge'
import { ToastProvider, useToast } from '../Toast'
import { pagination } from '../../../test/fixtures'

describe('dashboard state components', () => {
  it('supports empty and error actions', async () => {
    const user = userEvent.setup()
    const onCreate = vi.fn()
    const onRetry = vi.fn()

    render(
      <>
        <EmptyState onCreate={onCreate} />
        <ErrorState message="Server Error" onRetry={onRetry} />
      </>,
    )

    await user.click(screen.getByRole('button', { name: /Add First Lead/i }))
    await user.click(screen.getByRole('button', { name: /Retry/i }))

    expect(onCreate).toHaveBeenCalledOnce()
    expect(onRetry).toHaveBeenCalledOnce()
  })

  it('renders status badges with meaningful text', () => {
    render(
      <>
        <StatusBadge status="NEW" />
        <StatusBadge status="CONTACTED" />
        <StatusBadge status="CLOSED" />
      </>,
    )

    expect(screen.getByText('NEW')).toBeInTheDocument()
    expect(screen.getByText('CONTACTED')).toBeInTheDocument()
    expect(screen.getByText('CLOSED')).toBeInTheDocument()
  })

  it('handles pagination controls and limit changes', async () => {
    const user = userEvent.setup()
    const onPageChange = vi.fn()
    const onLimitChange = vi.fn()

    render(<Pagination pagination={pagination} onPageChange={onPageChange} onLimitChange={onLimitChange} />)

    await user.click(screen.getByRole('button', { name: /Next/i }))
    await user.selectOptions(screen.getByLabelText('Items per page'), '20')

    expect(onPageChange).toHaveBeenCalledWith(2)
    expect(onLimitChange).toHaveBeenCalledWith(20)
    expect(screen.getByRole('button', { name: /Previous/i })).toBeDisabled()
  })

  it('keeps confirmation modal keyboard accessible', async () => {
    const user = userEvent.setup()
    const onCancel = vi.fn()
    const onConfirm = vi.fn()

    render(
      <ConfirmModal
        open
        title="Log out?"
        description="End the current session."
        confirmLabel="Logout"
        onCancel={onCancel}
        onConfirm={onConfirm}
      />,
    )

    expect(screen.getByRole('dialog', { name: /Log out/i })).toHaveAttribute('aria-modal', 'true')
    await user.keyboard('{Escape}')
    await user.click(screen.getByRole('button', { name: /Logout/i }))

    expect(onCancel).toHaveBeenCalledOnce()
    expect(onConfirm).toHaveBeenCalledOnce()
  })

  it('validates and submits the create lead modal', async () => {
    const user = userEvent.setup()
    const onCreate = vi.fn().mockResolvedValue(undefined)
    const onClose = vi.fn()

    render(<LeadCreateModal open onClose={onClose} onCreate={onCreate} />)

    await user.click(screen.getByRole('button', { name: /Create Lead/i }))
    expect(await screen.findByText('Enter a full name.')).toBeInTheDocument()

    const fullName = screen.getByLabelText('Full Name')
    const email = screen.getByLabelText('Email')
    const budget = screen.getByLabelText('Budget')
    const message = screen.getByLabelText('Message')

    fireEvent.input(fullName, { target: { value: 'Amara Lee' } })
    fireEvent.input(email, { target: { value: 'amara@example.com' } })
    fireEvent.change(budget, { target: { value: '$15k-$50k' } })
    fireEvent.input(message, { target: { value: 'A validated enterprise lead request.' } })

    await waitFor(() => {
      expect(fullName).toHaveValue('Amara Lee')
      expect(email).toHaveValue('amara@example.com')
      expect(budget).toHaveValue('$15k-$50k')
      expect(message).toHaveValue('A validated enterprise lead request.')
    })

    await user.click(screen.getByRole('button', { name: /Create Lead/i }))

    await waitFor(() => {
      expect(onCreate).toHaveBeenCalledWith({
        full_name: 'Amara Lee',
        email: 'amara@example.com',
        budget: '$15k-$50k',
        message: 'A validated enterprise lead request.',
      })
    })
    expect(onClose).toHaveBeenCalledOnce()
  })

  it('announces toast messages and removes them after timeout', async () => {
    vi.useFakeTimers()

    function ToastButton() {
      const { showToast } = useToast()
      return (
        <button
          type="button"
          onClick={() => {
            showToast('Lead Updated', 'success')
          }}
        >
          Show toast
        </button>
      )
    }

    render(
      <ToastProvider>
        <ToastButton />
      </ToastProvider>,
    )

    fireEvent.click(screen.getByRole('button', { name: /Show toast/i }))
    expect(screen.getByRole('status')).toHaveTextContent('Lead Updated')

    await act(async () => {
      await vi.advanceTimersByTimeAsync(4200)
    })
    expect(screen.queryByText('Lead Updated')).not.toBeInTheDocument()
  })
})
