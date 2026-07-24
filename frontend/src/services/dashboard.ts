import { http } from './http'
import type { ApiEnvelope } from '../types/auth'
import type {
  DashboardSummary,
  Lead,
  LeadCreatePayload,
  LeadSort,
  LeadStatus,
  PaginatedEnvelope,
} from '../types/dashboard'

export interface LeadListParams {
  page: number
  limit: number
  search?: string
  status?: LeadStatus | 'ALL'
  sort?: LeadSort
}

export async function getDashboardSummary() {
  const response = await http.get<ApiEnvelope<DashboardSummary>>('/v1/dashboard')
  return response.data
}

export async function getLeads(params: LeadListParams) {
  const response = await http.get<PaginatedEnvelope<Lead[]>>('/v1/leads', {
    params: {
      page: params.page,
      limit: params.limit,
      search: params.search?.trim() ? params.search : undefined,
      status: params.status && params.status !== 'ALL' ? params.status : undefined,
      sort: params.sort,
    },
  })
  return response.data
}

export async function createLead(payload: LeadCreatePayload) {
  const response = await http.post<ApiEnvelope<Lead>>('/v1/leads', payload)
  return response.data
}

export async function updateLeadStatus(leadId: string, status: LeadStatus) {
  const response = await http.patch<ApiEnvelope<Lead>>(`/v1/leads/${leadId}`, { status })
  return response.data
}
