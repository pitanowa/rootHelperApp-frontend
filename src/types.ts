export type Player = {
  id: number
  name: string
  createdAt: string
}

export type Group = {
  id: number
  name: string
}

export type GroupDetails = {
  id: number
  name: string
  members: Player[]
}

export type League = {
  id: number
  groupId: number
  name: string
}
