import { useMemo, useState } from 'react'
import { Ctx } from './app-context'

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [selectedGroupId, setSelectedGroupId] = useState<number | null>(null)
  const [selectedLeagueId, setSelectedLeagueId] = useState<number | null>(null)

  const value = useMemo(
    () => ({ selectedGroupId, setSelectedGroupId, selectedLeagueId, setSelectedLeagueId }),
    [selectedGroupId, selectedLeagueId]
  )

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}
