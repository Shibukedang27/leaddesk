export interface User {
  id: string
  email: string
  full_name: string
  role: 'ADMIN' | 'MANAGER' | 'STAFF'
  is_active: boolean
}

export interface LoginResponse {
  access_token: string
  token_type: 'bearer'
  expires_in: number
  user: User
}

export interface ApiEnvelope<T> {
  success: boolean
  message: string
  data: T
  timestamp: string
}
