type ApiError = { code?: string; message?: string }

const API_BASE_RAW = (import.meta as any)?.env?.VITE_API_BASE_URL as string | undefined
const API_BASE = (API_BASE_RAW ?? '').trim().replace(/\/+$/, '') // usuń końcowe /

function withBase(url: string): string {
  if (/^https?:\/\//i.test(url)) return url

  const path = url.startsWith('/') ? url : `/${url}`

  return API_BASE ? `${API_BASE}${path}` : path
}

async function parseError(res: Response): Promise<string> {
  try {
    const data = (await res.json()) as ApiError
    if (data?.message) return data.message
  } catch {}
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

export async function apiPost<T>(url: string, body?: any): Promise<T> {
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
