import { type availablePermissionValues } from '../helpers/functions.permissions'

export interface RecordUserNameDateTime {
  recordCreate_userName?: string
  recordCreate_dateTime?: Date

  recordUpdate_userName?: string
  recordUpdate_dateTime?: number

  recordDelete_userName?: string
  recordDelete_dateTime?: number
}

/*
 * EMPLOYEES
 */

export interface Employee extends RecordUserNameDateTime {
  employeeNumber: string
  employeeSurname: string
  employeeGivenName: string
  userName?: string
  workContact1?: string
  workContact2?: string
  homeContact1?: string
  homeContact2?: string
  jobTitle?: string
  department?: string
  seniorityDateTime?: Date
  isSynced?: boolean
  syncDateTime?: Date
  isActive?: boolean
  employeeProperties?: EmployeeProperty[]
}

export interface EmployeeProperty extends RecordUserNameDateTime {
  employeeNumber?: string
  propertyName: string
  propertyValue: string
}

/*
 * USER TYPES
 */

export interface User extends RecordUserNameDateTime {
  userName: string
  canLogin: boolean
  isAdmin: boolean
  permissions?: Partial<Record<keyof typeof availablePermissionValues, string>>
}

declare module 'express-session' {
  interface Session {
    user?: User
  }
}

export interface PartialSession {
  user?: User
}
