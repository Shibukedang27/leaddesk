import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { AdminPage } from '../AdminPage'
import { adminUser, contactedLead, lead, pagination, summary } from '../../test/fixtures'
import { getDashboardSummary, getLeads, updateLeadStatus } from '../../services/dashboard'

vi.mock('../../services/dashboard', () => ({
  createLead: vi.fn(),
  getDashboardSummary: vi.fn(),
  getLeads: vi.fn(),
  updateLeadStatus: vi.fn(),
}))

vi.mock('../../hooks/useAuth', () => ({
  useAuth: () => ({
    user: adminUser,
    isAuthenticated: true,
    isLoading: false,
    login: vi.fn(),
    logout: vi.fn().mockResolvedValue(undefined),
  }),
}))

function mockSuccessfulDashboard() {
  vi.mocked(getDashboardSummary).mockResolvedValue({
    success: true,
    message: 'Dashboard loaded.',
    data: summary,
    timestamp: '2026-07-24T00:00:00.000Z',
  })
  vi.mocked(getLeads).mockResolvedValue({
    success: true,
    message: 'Leads loaded.',
    data: [lead, contactedLead],
    pagination,
    timestamp: '2026-07-24T00:00:00.000Z',
  })
}

describe('AdminPage', () => {
  beforeEach(() => {
    localStorage.clear()
    mockSuccessfulDashboard()
    vi.mocked(updateLeadStatus).mockResolvedValue({
      success: true,
      message: 'Lead updated.',
      data: { ...lead, status: 'CONTACTED' },
      timestamp: '2026-07-24T00:00:00.000Z',
    })
  })

  function renderDashboard() {
    return render(
      <MemoryRouter>
        <AdminPage />
      </MemoryRouter>,
    )
  }

  it('renders loading, analytics, table rows, and accessible controls', async () => {
    renderDashboard()

    expect(await screen.findByText('Total Leads')).toBeInTheDocument()
    expect(screen.getAllByText('Maya Kapoor').length).toBeGreaterThan(0)
    expect(screen.getByLabelText('Filter by status')).toBeInTheDocument()
    expect(screen.getByLabelText('Sort leads')).toBeInTheDocument()
    expect(screen.getByLabelText('Items per page')).toBeInTheDocument()
  })

  it('debounces search requests and keeps search text highlighted in rows', async () => {
    const user = userEvent.setup()
    renderDashboard()

    await user.type(await screen.findByPlaceholderText(/Search leads/i), 'maya')

    await waitFor(() => {
      expect(getLeads).toHaveBeenLastCalledWith(
        expect.objectContaining({ page: 1, search: 'maya', status: 'ALL' }),
      )
    })
    expect(screen.getByText('Maya')).toBeInTheDocument()
  })

  it('updates pagination and filters without reloading the page', async () => {
    const user = userEvent.setup()
    renderDashboard()

    await user.click(await screen.findByRole('button', { name: /Next/i }))

    await waitFor(() => {
      expect(getLeads).toHaveBeenLastCalledWith(expect.objectContaining({ page: 2 }))
    })

    await user.selectOptions(screen.getByLabelText('Items per page'), '20')

    await waitFor(() => {
      expect(getLeads).toHaveBeenLastCalledWith(expect.objectContaining({ limit: 20, page: 1 }))
    })
  })

  it('optimistically updates lead status and shows success feedback', async () => {
    const user = userEvent.setup()
    renderDashboard()

    await user.selectOptions(await screen.findByLabelText('Change status for Maya Kapoor'), 'CONTACTED')
    const updateButton = screen.getAllByRole('button', { name: /Update/i })[0]
    if (!updateButton) {
      throw new Error('Expected an update button for the first lead row.')
    }
    await user.click(updateButton)

    await waitFor(() => {
      expect(updateLeadStatus).toHaveBeenCalledWith('lead-1', 'CONTACTED')
    })
    expect(await screen.findByRole('status')).toHaveTextContent('Lead Updated')
  })

  it('shows an error state and retry action when dashboard data fails', async () => {
    vi.mocked(getLeads).mockRejectedValueOnce(new Error('Server Error'))
    const user = userEvent.setup()
    renderDashboard()

    expect(await screen.findByText('Something needs another try.')).toBeInTheDocument()
    mockSuccessfulDashboard()
    await user.click(screen.getByRole('button', { name: /Retry/i }))

    await waitFor(() => {
      expect(screen.getAllByText('Maya Kapoor').length).toBeGreaterThan(0)
    })
  })
})
