import type { User } from '../types/recordTypes.js'

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
