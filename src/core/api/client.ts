type ApiError = { code?: string; message?: string }

const API_BASE_RAW = import.meta.env.VITE_API_BASE_URL as string | undefined
const API_BASE = (API_BASE_RAW ?? '').trim().replace(/\/+$/, '')

function withBase(url: string): string {
  if (/^https?:\/\//i.test(url)) return url
  const path = url.startsWith('/') ? url : `/${url}`
  return API_BASE ? `${API_BASE}${path}` : path
}

function normalizeApiPath(path: string): string {
  if (!path) return '/'
  if (path === '/api') return '/'
  if (path.startsWith('/api/')) return `/${path.slice('/api/'.length)}`
  if (path.startsWith('/')) return path
  return `/${path}`
}

function normalizeGameKey(gameKey: string): string {
  return (gameKey || 'ROOT').trim().toUpperCase()
}

export function gameApiPath(gameKey: string, path: string): string {
  const normalized = normalizeApiPath(path)
  const key = normalizeGameKey(gameKey)
  return `/api/games/${encodeURIComponent(key)}${normalized}`
}

async function parseError(res: Response): Promise<string> {
  try {
    const data = (await res.json()) as ApiError
    if (data?.message) return data.message
  } catch {
    // ignore json parse errors, fallback to HTTP status
  }
  return `${res.status} ${res.statusText}`
}

export async function apiGet<T>(url: string): Promise<T> {
  const res = await fetch(withBase(url))
  if (!res.ok) {
    const msg = await parseError(res)
    throw new Error(msg)
  }
  return (await res.json()) as T
}

export async function apiPost<T>(url: string, body?: unknown): Promise<T> {
  const res = await fetch(withBase(url), {
    method: 'POST',
    headers: body != null ? { 'Content-Type': 'application/json' } : undefined,
    body: body != null ? JSON.stringify(body) : undefined,
  })

  if (!res.ok) {
    const msg = await parseError(res)
    throw new Error(msg)
  }

  if (res.status === 204) return undefined as T
  return (await res.json()) as T
}

export async function apiDelete<T>(url: string): Promise<T> {
  const res = await fetch(withBase(url), { method: 'DELETE' })

  if (!res.ok) {
    const msg = await parseError(res)
    throw new Error(msg)
  }

  if (res.status === 204) return undefined as T
  return (await res.json()) as T
}

export function gameApiGet<T>(gameKey: string, path: string): Promise<T> {
  return apiGet<T>(gameApiPath(gameKey, path))
}

export function gameApiPost<T>(gameKey: string, path: string, body?: unknown): Promise<T> {
  return apiPost<T>(gameApiPath(gameKey, path), body)
}

export function gameApiDelete<T>(gameKey: string, path: string): Promise<T> {
  return apiDelete<T>(gameApiPath(gameKey, path))
}
