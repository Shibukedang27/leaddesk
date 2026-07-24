import { motion } from 'framer-motion'
import { CheckCircle2, Clock3, Menu, Plus, UsersRound, UserRoundCheck } from 'lucide-react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { Button } from '../components/Button'
import { AnalyticsCard } from '../components/dashboard/AnalyticsCard'
import { BottomNav } from '../components/dashboard/BottomNav'
import { ConfirmModal } from '../components/dashboard/ConfirmModal'
import { DashboardSkeleton } from '../components/dashboard/LoadingSkeleton'
import { EmptyState } from '../components/dashboard/EmptyState'
import { ErrorState } from '../components/dashboard/ErrorState'
import { LeadCreateModal } from '../components/dashboard/LeadCreateModal'
import { LeadTable } from '../components/dashboard/LeadTable'
import { Pagination } from '../components/dashboard/Pagination'
import { ProfileMenu } from '../components/dashboard/ProfileMenu'
import { SearchBar } from '../components/dashboard/SearchBar'
import { SectionHeader } from '../components/dashboard/SectionHeader'
import { Sidebar } from '../components/dashboard/Sidebar'
import { ToastProvider, useToast } from '../components/dashboard/Toast'
import { Topbar } from '../components/dashboard/Topbar'
import { useAuth } from '../hooks/useAuth'
import { useDebouncedValue } from '../hooks/useDebouncedValue'
import { createLead, getDashboardSummary, getLeads, updateLeadStatus } from '../services/dashboard'
import type {
  DashboardSummary,
  Lead,
  LeadCreatePayload,
  LeadSort,
  LeadStatus,
  PaginationMeta,
} from '../types/dashboard'
import { getApiErrorMessage } from '../utils/apiError'

const filterStorageKey = 'leaddesk.dashboard.filters'

interface StoredFilters {
  status: LeadStatus | 'ALL'
  sort: LeadSort
  limit: number
}

const defaultPagination: PaginationMeta = {
  page: 1,
  limit: 10,
  total: 0,
  pages: 0,
  next: null,
  previous: null,
}

function readStoredFilters(): StoredFilters {
  try {
    const raw = localStorage.getItem(filterStorageKey)
    if (!raw) return { status: 'ALL', sort: 'newest', limit: 10 }
    return { status: 'ALL', sort: 'newest', limit: 10, ...(JSON.parse(raw) as Partial<StoredFilters>) }
  } catch {
    return { status: 'ALL', sort: 'newest', limit: 10 }
  }
}

export function AdminPage() {
  return (
    <ToastProvider>
      <AdminDashboard />
    </ToastProvider>
  )
}

function AdminDashboard() {
  const { logout, user } = useAuth()
  const { showToast } = useToast()
  const [summary, setSummary] = useState<DashboardSummary | null>(null)
  const [leads, setLeads] = useState<Lead[]>([])
  const [pagination, setPagination] = useState<PaginationMeta>(defaultPagination)
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebouncedValue(search, 350)
  const [filters, setFilters] = useState<StoredFilters>(() => readStoredFilters())
  const [page, setPage] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [updatingId, setUpdatingId] = useState<string | null>(null)
  const [logoutOpen, setLogoutOpen] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [createOpen, setCreateOpen] = useState(false)

  useEffect(() => {
    localStorage.setItem(filterStorageKey, JSON.stringify(filters))
  }, [filters])

  const loadDashboard = useCallback(async () => {
    setIsLoading(true)
    setError('')
    try {
      const [summaryResponse, leadsResponse] = await Promise.all([
        getDashboardSummary(),
        getLeads({
          page,
          limit: filters.limit,
          search: debouncedSearch,
          status: filters.status,
          sort: filters.sort,
        }),
      ])
      setSummary(summaryResponse.data)
      setLeads(leadsResponse.data)
      setPagination(leadsResponse.pagination)
    } catch (apiError) {
      setError(getApiErrorMessage(apiError))
    } finally {
      setIsLoading(false)
    }
  }, [debouncedSearch, filters.limit, filters.sort, filters.status, page])

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      void loadDashboard()
    }, 0)
    return () => {
      window.clearTimeout(timeout)
    }
  }, [loadDashboard])

  function handleSearchChange(value: string) {
    setSearch(value)
    setPage(1)
  }

  function updateFilters(nextFilters: Partial<StoredFilters>) {
    setFilters((current) => ({ ...current, ...nextFilters }))
    setPage(1)
  }

  const stats = useMemo(
    () => [
      { title: 'Total Leads', value: summary?.total_leads ?? 0, trend: '+12%', icon: UsersRound },
      { title: 'New Leads', value: summary?.new_leads ?? 0, trend: 'Today', icon: Clock3 },
      { title: 'Contacted', value: summary?.contacted ?? 0, trend: '+8%', icon: UserRoundCheck },
      { title: 'Closed', value: summary?.closed ?? 0, trend: 'Won', icon: CheckCircle2 },
    ],
    [summary],
  )

  async function handleStatusUpdate(leadId: string, status: LeadStatus) {
    const previousLeads = leads
    setUpdatingId(leadId)
    setLeads((current) => current.map((lead) => (lead.id === leadId ? { ...lead, status } : lead)))
    try {
      const response = await updateLeadStatus(leadId, status)
      setLeads((current) => current.map((lead) => (lead.id === leadId ? response.data : lead)))
      showToast('Lead Updated', 'success')
      void loadDashboard()
    } catch (apiError) {
      setLeads(previousLeads)
      showToast(getApiErrorMessage(apiError), 'error')
    } finally {
      setUpdatingId(null)
    }
  }

  async function handleCreateLead(payload: LeadCreatePayload) {
    try {
      await createLead(payload)
      showToast('Lead Created', 'success')
      setPage(1)
      await loadDashboard()
    } catch (apiError) {
      showToast(getApiErrorMessage(apiError), 'error')
      throw apiError
    }
  }

  async function confirmLogout() {
    await logout()
    showToast('Logout Successful', 'success')
  }

  const currentDate = new Intl.DateTimeFormat('en', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  }).format(new Date())

  return (
    <main className="min-h-screen bg-premium pb-24 lg:pb-0">
      <Sidebar
        open={drawerOpen}
        onClose={() => {
          setDrawerOpen(false)
        }}
        onLogout={() => {
          setLogoutOpen(true)
        }}
      />
      <BottomNav
        onMenu={() => {
          setDrawerOpen(true)
        }}
      />
      <div className="px-4 py-4 lg:pl-84">
        <div className="mx-auto grid max-w-[1500px] gap-6">
          <Topbar user={user} />
          <section className="grid gap-4 lg:grid-cols-[1fr_320px]">
            <motion.div
              className="glass rounded-card p-6 md:p-8"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-bold uppercase tracking-[0.18em] text-primary">{currentDate}</p>
                  <h1 className="mt-4 text-4xl font-bold tracking-tight text-slate-950 md:text-6xl">
                    Good Morning, {user?.full_name.split(' ')[0] ?? 'Admin'}
                  </h1>
                  <p className="mt-4 max-w-2xl text-base font-medium leading-8 text-slate-500">
                    Your pipeline is organized, searchable, and ready for decisive follow-up.
                  </p>
                </div>
                <Button
                  className="hidden md:inline-flex"
                  type="button"
                  onClick={() => {
                    setCreateOpen(true)
                  }}
                >
                  <Plus className="size-4" />
                  Add Lead
                </Button>
                <button
                  className="grid size-11 place-items-center rounded-full bg-white/75 text-slate-500 shadow-soft lg:hidden"
                  type="button"
                  onClick={() => {
                    setDrawerOpen(true)
                  }}
                  aria-label="Open menu"
                >
                  <Menu className="size-5" />
                </button>
              </div>
            </motion.div>
            <ProfileMenu user={user} />
          </section>

          {isLoading && !summary ? (
            <DashboardSkeleton />
          ) : error ? (
            <div className="glass rounded-card">
              <ErrorState
                message={error}
                onRetry={() => {
                  void loadDashboard()
                }}
              />
            </div>
          ) : (
            <>
              <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {stats.map((stat) => (
                  <AnalyticsCard {...stat} key={stat.title} />
                ))}
              </section>

              <section className="glass rounded-card overflow-hidden">
                <div className="grid gap-4 border-b border-white/60 p-4 xl:grid-cols-[1fr_auto] xl:items-center">
                  <SectionHeader
                    title="Leads"
                    description="Search, filter, update, and review active opportunities."
                  />
                  <div className="flex flex-col gap-3 md:flex-row md:items-center">
                    <SearchBar value={search} onChange={handleSearchChange} />
                    <select
                      className="h-12 rounded-full border border-white/70 bg-white/75 px-4 text-sm font-bold text-slate-600 shadow-soft outline-none"
                      value={filters.status}
                      onChange={(event) => {
                        updateFilters({ status: event.target.value as LeadStatus | 'ALL' })
                      }}
                      aria-label="Filter by status"
                    >
                      <option value="ALL">All</option>
                      <option value="NEW">New</option>
                      <option value="CONTACTED">Contacted</option>
                      <option value="CLOSED">Closed</option>
                    </select>
                    <select
                      className="h-12 rounded-full border border-white/70 bg-white/75 px-4 text-sm font-bold text-slate-600 shadow-soft outline-none"
                      value={filters.sort}
                      onChange={(event) => {
                        updateFilters({ sort: event.target.value as LeadSort })
                      }}
                      aria-label="Sort leads"
                    >
                      <option value="newest">Newest</option>
                      <option value="oldest">Oldest</option>
                      <option value="budget">Budget</option>
                      <option value="alphabetical">Alphabetical</option>
                    </select>
                    <Button
                      className="h-12"
                      type="button"
                      onClick={() => {
                        setCreateOpen(true)
                      }}
                    >
                      <Plus className="size-4" />
                      Add Lead
                    </Button>
                  </div>
                </div>
                {leads.length === 0 ? (
                  <EmptyState
                    onCreate={() => {
                      setCreateOpen(true)
                    }}
                  />
                ) : (
                  <>
                    <LeadTable
                      leads={leads}
                      search={search}
                      updatingId={updatingId}
                      onStatusUpdate={handleStatusUpdate}
                    />
                    <Pagination
                      pagination={pagination}
                      onPageChange={setPage}
                      onLimitChange={(limit) => {
                        updateFilters({ limit })
                      }}
                    />
                  </>
                )}
              </section>
            </>
          )}
        </div>
      </div>
      <ConfirmModal
        open={logoutOpen}
        title="Log out?"
        description="Your local session token will be removed and protected dashboard access will require signing in again."
        confirmLabel="Logout"
        onCancel={() => {
          setLogoutOpen(false)
        }}
        onConfirm={() => {
          setLogoutOpen(false)
          void confirmLogout()
        }}
      />
      <LeadCreateModal
        open={createOpen}
        onClose={() => {
          setCreateOpen(false)
        }}
        onCreate={handleCreateLead}
      />
    </main>
  )
}
