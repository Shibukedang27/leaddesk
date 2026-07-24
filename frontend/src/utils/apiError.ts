import axios from 'axios'

export function getApiErrorMessage(error: unknown) {
  if (axios.isAxiosError<{ message?: string }>(error)) {
    if (error.code === 'ECONNABORTED') {
      return 'The request took too long. Please try again.'
    }
    if (!error.response) {
      return 'The server is unreachable. Check your connection and try again.'
    }
    if (error.response.status === 401) {
      return 'Your session has expired. Please log in again.'
    }
    return error.response.data.message ?? 'Request failed. Please try again.'
  }
  return 'Request failed. Please try again.'
}
