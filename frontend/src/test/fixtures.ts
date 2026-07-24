import type { DashboardSummary, Lead, PaginationMeta } from '../types/dashboard'
import type { User } from '../types/auth'

export const adminUser: User = {
  id: 'user-1',
  email: 'admin@leaddesk.app',
  full_name: 'Maya Kapoor',
  role: 'ADMIN',
  is_active: true,
}

export const lead: Lead = {
  id: 'lead-1',
  full_name: 'Maya Kapoor',
  email: 'maya@company.com',
  budget: '$5k-$15k',
  message: 'We need a polished CRM workflow for the sales team.',
  status: 'NEW',
  source: 'website',
  notes: null,
  created_at: '2026-07-20T10:00:00.000Z',
  updated_at: '2026-07-20T10:00:00.000Z',
}

export const contactedLead: Lead = {
  ...lead,
  id: 'lead-2',
  full_name: 'Noah Smith',
  email: 'noah@company.com',
  status: 'CONTACTED',
}

export const summary: DashboardSummary = {
  total_leads: 2,
  new_leads: 1,
  contacted: 1,
  closed: 0,
  recent_leads: [lead, contactedLead],
  latest_activity: [
    {
      lead_id: lead.id,
      full_name: lead.full_name,
      status: lead.status,
      occurred_at: lead.updated_at,
    },
  ],
}

export const pagination: PaginationMeta = {
  page: 1,
  limit: 10,
  total: 12,
  pages: 2,
  next: 2,
  previous: null,
}
