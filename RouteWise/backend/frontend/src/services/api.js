import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000'
const AUTH_STORAGE_KEY = 'routewise-auth'

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
})

api.interceptors.request.use((config) => {
  const auth = localStorage.getItem(AUTH_STORAGE_KEY)
  if (auth) {
    const parsed = JSON.parse(auth)
    if (parsed?.access) {
      config.headers.Authorization = `Bearer ${parsed.access}`
    }
  }
  return config
})

const getErrorStatus = (error) => error?.response?.status

export const apiRequest = async ({ method = 'get', url, data, params, headers }) => {
  const response = await api({ method, url, data, params, headers })
  return response.data
}

export const apiRequestWithFallback = async ({ method = 'get', urls = [], data, params, headers }) => {
  let lastError
  for (const url of urls) {
    try {
      return await apiRequest({ method, url, data, params, headers })
    } catch (error) {
      lastError = error
      if (getErrorStatus(error) && getErrorStatus(error) !== 404) {
        throw error
      }
    }
  }
  throw lastError
}

export const authApi = {
  bootstrapStatus: () => apiRequestWithFallback({ urls: ['/admin-api/auth/bootstrap-status/'] }),
  bootstrapAdmin: (payload) =>
    apiRequestWithFallback({
      method: 'post',
      urls: ['/admin-api/auth/bootstrap-admin/'],
      data: payload,
    }),
  login: (payload) =>
    apiRequestWithFallback({
      method: 'post',
      urls: ['/admin-api/auth/jwt/login/', '/auth/login/', '/api/login/'],
      data: payload,
    }),
  register: (payload) =>
    apiRequestWithFallback({
      method: 'post',
      urls: ['/admin-api/auth/register/'],
      data: payload,
    }),
  requestPasswordOtp: (payload) =>
    apiRequestWithFallback({
      method: 'post',
      urls: ['/admin-api/auth/password-reset/request-otp/'],
      data: payload,
    }),
  verifyPasswordOtp: (payload) =>
    apiRequestWithFallback({
      method: 'post',
      urls: ['/admin-api/auth/password-reset/verify-otp/'],
      data: payload,
    }),
  resetPassword: (payload) =>
    apiRequestWithFallback({
      method: 'post',
      urls: ['/admin-api/auth/password-reset/confirm/'],
      data: payload,
    }),
  logout: () => apiRequestWithFallback({ method: 'post', urls: ['/admin-api/auth/logout/'] }),
}

export const adminApi = {
  dashboard: () => apiRequestWithFallback({ urls: ['/admin-api/dashboard/'] }),
  assignJob: (payload) => apiRequestWithFallback({ method: 'post', urls: ['/admin-api/assign-job/'], data: payload }),
  salespersons: () => apiRequestWithFallback({ urls: ['/admin-api/salespersons/'] }),
  getSalespersonThresholds: (salespersonId) =>
    apiRequestWithFallback({ urls: [`/admin-api/salespersons/${salespersonId}/thresholds/`] }),
  updateSalespersonThresholds: (salespersonId, payload) =>
    apiRequestWithFallback({
      method: 'put',
      urls: [`/admin-api/salespersons/${salespersonId}/thresholds/`],
      data: payload,
    }),
}

export const salesApi = {
  jobs: (salespersonId) => apiRequestWithFallback({ urls: [`/admin-api/salesperson/${salespersonId}/jobs/`] }),
  completeJob: (jobId) => apiRequestWithFallback({ method: 'post', urls: [`/admin-api/job/${jobId}/complete/`] }),
  uploadPhoto: (customerId, formData) =>
    apiRequestWithFallback({
      method: 'post',
      urls: [`/customer-api/upload-photo/${customerId}/`],
      data: formData,
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  nearbyCustomers: (salespersonId) =>
    apiRequestWithFallback({ urls: [`/admin-api/salesperson/${salespersonId}/nearby-customers/`] }),
  updateLocation: (payload) =>
    apiRequestWithFallback({ method: 'post', urls: ['/admin-api/salesperson/update-location/'], data: payload }),
  myThresholds: () => apiRequestWithFallback({ urls: ['/admin-api/salesperson/me/thresholds/'] }),
  updateMyThresholds: (payload) =>
    apiRequestWithFallback({
      method: 'put',
      urls: ['/admin-api/salesperson/me/thresholds/'],
      data: payload,
    }),
}

export const financeApi = {
  reviewQueue: () => apiRequestWithFallback({ urls: ['/customer-api/finance-queue/'] }),
  unassignedCustomers: () => apiRequestWithFallback({ urls: ['/customer-api/unassigned/', '/unassigned-customers/'] }),
  customerDetail: (customerId) => apiRequestWithFallback({ urls: [`/customer-api/detail/${customerId}/`] }),
  decision: (customerId, decision) =>
    apiRequestWithFallback({
      method: 'post',
      urls: [`/admin-api/finance/${customerId}/decision/`, `/customer-api/finance/${customerId}/decision/`],
      data: { decision },
    }),
}

export const customerApi = {
  submitRequest: (payload) =>
    apiRequestWithFallback({ method: 'post', urls: ['/customer-api/request/', '/customer/request/'], data: payload }),
}
