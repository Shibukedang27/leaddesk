import { http } from './http'
import type { ApiEnvelope, LoginResponse, User } from '../types/auth'

export interface LoginPayload {
  email: string
  password: string
}

export async function loginRequest(payload: LoginPayload) {
  const response = await http.post<ApiEnvelope<LoginResponse>>('/v1/auth/login', payload)
  return response.data
}

export async function currentUserRequest() {
  const response = await http.get<ApiEnvelope<User>>('/v1/auth/me')
  return response.data
}

export async function logoutRequest() {
  const response = await http.post<ApiEnvelope<{ logged_out: boolean }>>('/v1/auth/logout')
  return response.data
}
