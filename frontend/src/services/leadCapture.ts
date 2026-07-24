import { http } from './http'
import type { ApiEnvelope } from '../types/auth'
import type { Lead, LeadCreatePayload } from '../types/dashboard'

export async function submitLeadRequest(payload: LeadCreatePayload) {
  const response = await http.post<ApiEnvelope<Lead>>('/v1/leads/public', payload)
  return response.data
}
