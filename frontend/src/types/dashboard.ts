import type { ApiEnvelope } from './auth'

export type LeadStatus = 'NEW' | 'CONTACTED' | 'CLOSED'
export type LeadSort = 'newest' | 'oldest' | 'budget' | 'alphabetical' | 'status'

export interface Lead {
  id: string
  full_name: string
  email: string
  budget: string
  message: string
  status: LeadStatus
  source: string
  notes: string | null
  created_at: string
  updated_at: string
}

export interface PaginationMeta {
  page: number
  limit: number
  total: number
  pages: number
  next: number | null
  previous: number | null
}

export interface PaginatedEnvelope<T> extends ApiEnvelope<T> {
  pagination: PaginationMeta
}

export interface LatestActivity {
  lead_id: string
  full_name: string
  status: LeadStatus
  occurred_at: string
}

export interface DashboardSummary {
  total_leads: number
  new_leads: number
  contacted: number
  closed: number
  recent_leads: Lead[]
  latest_activity: LatestActivity[]
}

export interface LeadCreatePayload {
  full_name: string
  email: string
  budget: string
  message: string
  source?: string
  notes?: string | null
}
