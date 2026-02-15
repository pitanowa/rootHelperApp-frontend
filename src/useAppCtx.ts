import { useContext } from 'react'
import { Ctx } from './app-context'

export function useAppCtx() {
  const value = useContext(Ctx)
  if (!value) throw new Error('useAppCtx must be used within AppProvider')
  return value
}
