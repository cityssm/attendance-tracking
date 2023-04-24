import type { User } from '../types/recordTypes'

export interface UserRequest {
  session?: {
    user?: User
  }
}

export interface APIRequest {
  params?: {
    apiKey?: string
  }
}

export function userIsAdmin(request: UserRequest): boolean {
  return request.session?.user?.isAdmin ?? false
}

export function userCanUpdate(request: UserRequest): boolean {
  return request.session?.user?.canUpdate ?? false
}
