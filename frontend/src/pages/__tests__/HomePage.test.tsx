import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { HomePage } from '../HomePage'
import { submitLeadRequest } from '../../services/leadCapture'
import { lead } from '../../test/fixtures'

vi.mock('../../services/leadCapture', () => ({
  submitLeadRequest: vi.fn(),
}))

describe('HomePage', () => {
  beforeEach(() => {
    vi.mocked(submitLeadRequest).mockResolvedValue({
      success: true,
      message: 'Lead request submitted successfully.',
      data: lead,
      timestamp: '2026-07-24T00:00:00.000Z',
    })
  })

  it('renders the landing page with semantic navigation and lead form controls', () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>,
    )

    expect(screen.getByRole('navigation', { name: /Primary navigation/i })).toBeInTheDocument()
    expect(screen.getByText('Modern Lead Management CRM')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /Tell us about the opportunity/i })).toBeInTheDocument()
    expect(screen.getByLabelText(/Full Name/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Email Address/i)).toHaveAttribute('type', 'email')
    expect(screen.getByRole('button', { name: /Submit Request/i })).toBeEnabled()
  })

  it('validates the contact form and submits a public lead request', async () => {
    const user = userEvent.setup()
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>,
    )

    await user.click(screen.getByRole('button', { name: /Submit Request/i }))

    expect(await screen.findByText('Enter your full name.')).toBeInTheDocument()
    expect(screen.getByText('Enter a valid email address.')).toBeInTheDocument()

    await user.type(screen.getByLabelText(/Full Name/i), 'Maya Kapoor')
    await user.type(screen.getByLabelText(/Email Address/i), 'maya@company.com')
    await user.selectOptions(screen.getByLabelText(/Budget Range/i), '$5k - $15k')
    await user.type(screen.getByLabelText(/Project Message/i), 'We need better lead management visibility.')
    await user.click(screen.getByRole('button', { name: /Submit Request/i }))

    await waitFor(() => {
      expect(submitLeadRequest).toHaveBeenCalledWith({
        full_name: 'Maya Kapoor',
        email: 'maya@company.com',
        budget: '$5k - $15k',
        message: 'We need better lead management visibility.',
        source: 'landing',
      })
    })
    expect(await screen.findByRole('status')).toHaveTextContent('Request submitted')
  })

  it('shows a friendly contact form error when submission fails', async () => {
    vi.mocked(submitLeadRequest).mockRejectedValueOnce(new Error('Network Error'))
    const user = userEvent.setup()
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>,
    )

    await user.type(screen.getByLabelText(/Full Name/i), 'Maya Kapoor')
    await user.type(screen.getByLabelText(/Email Address/i), 'maya@company.com')
    await user.selectOptions(screen.getByLabelText(/Budget Range/i), '$5k - $15k')
    await user.type(screen.getByLabelText(/Project Message/i), 'We need better lead management visibility.')
    await user.click(screen.getByRole('button', { name: /Submit Request/i }))

    expect(await screen.findByRole('alert')).toHaveTextContent('Request failed. Please try again.')
  })
})
