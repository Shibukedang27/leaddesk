import axios from 'axios'

const apiBaseUrl =
  import.meta.env.VITE_API_URL ?? import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000/api'

export const http = axios.create({
  baseURL: apiBaseUrl,
  timeout: 12_000,
  headers: {
    'Content-Type': 'application/json',
  },
})

export function setAccessToken(token: string | null) {
  if (token) {
    http.defaults.headers.common.Authorization = `Bearer ${token}`
  } else {
    delete http.defaults.headers.common.Authorization
  }
}

http.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      window.dispatchEvent(new Event('leaddesk:unauthorized'))
    }
    return Promise.reject(error instanceof Error ? error : new Error('Request failed.'))
  },
)
