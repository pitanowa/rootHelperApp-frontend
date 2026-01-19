type ApiError = { code?: string; message?: string }

async function parseError(res: Response): Promise<string> {
  try {
    const data = (await res.json()) as ApiError
    if (data?.message) return data.message
  } catch {}
  return `${res.status} ${res.statusText}`
}

export async function apiGet<T>(url: string): Promise<T> {
  const res = await fetch(url)
  if (!res.ok) {
    const msg = await parseError(res)
    throw new Error(msg)
  }
  return (await res.json()) as T
}

export async function apiPost<T>(url: string, body?: any): Promise<T> {
  const res = await fetch(url, {
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
  const res = await fetch(url, { method: 'DELETE' })

  if (!res.ok) {
    const msg = await parseError(res)
    throw new Error(msg)
  }

  if (res.status === 204) return undefined as T
  return (await res.json()) as T
}
