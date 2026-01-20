import { createContext, useContext, useMemo, useState } from 'react'

type AppCtx = {
  selectedGroupId: number | null
  setSelectedGroupId: (v: number | null) => void
  selectedLeagueId: number | null
  setSelectedLeagueId: (v: number | null) => void
}

const Ctx = createContext<AppCtx | null>(null)

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [selectedGroupId, setSelectedGroupId] = useState<number | null>(null)
  const [selectedLeagueId, setSelectedLeagueId] = useState<number | null>(null)

  const value = useMemo(
    () => ({ selectedGroupId, setSelectedGroupId, selectedLeagueId, setSelectedLeagueId }),
    [selectedGroupId, selectedLeagueId]
  )

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useAppCtx() {
  const v = useContext(Ctx)
  if (!v) throw new Error('useAppCtx must be used within AppProvider')
  return v
}
