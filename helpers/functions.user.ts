import type { Request } from 'express'

export interface APIRequest {
  params?: {
    apiKey?: string
  }
}

export function userIsAdmin(request: Request): boolean {
  return request.session?.user?.isAdmin ?? false
}
