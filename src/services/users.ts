import { backend } from './backend'

export interface User {
  _id?: string
  ime?: string
}

export async function getUsers(): Promise<User[]> {
  const { data } = await backend.get<User[]>('/users')
  return data
}
