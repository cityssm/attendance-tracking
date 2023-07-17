// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable @typescript-eslint/indent */

import type { availablePermissionValues } from '../helpers/functions.permissions.js'

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
  userName: string
  workContact1: string
  workContact2: string
  homeContact1: string
  homeContact2: string
  syncContacts: boolean
  jobTitle: string
  department: string
  seniorityDateTime?: string | Date
  isSynced: boolean
  syncDateTime?: Date
  isActive: boolean
  employeeProperties?: EmployeeProperty[]
}

export interface EmployeeProperty extends RecordUserNameDateTime {
  employeeNumber?: string
  propertyName: string
  propertyValue: string
  isSynced?: boolean
}

/*
 * ABSENCE REQUESTS
 */

export interface AbsenceType extends RecordUserNameDateTime {
  absenceTypeKey: string
  absenceType: string
  orderNumber?: number
}

export interface AbsenceRecord
  extends Partial<AbsenceType>,
    RecordUserNameDateTime {
  recordId: string // bigint
  employeeNumber?: string
  employeeName: string
  absenceDateTime: string | Date
  absenceTypeKey: string
  recordComment: string
  returnDateTime?: string | Date

  canUpdate?: boolean
}

/*
 * RETURN TO WORK
 */

export interface ReturnToWorkRecord extends RecordUserNameDateTime {
  recordId: string // bigint
  employeeNumber?: string
  employeeName: string
  returnDateTime: string | Date
  returnShift?: string
  recordComment: string

  canUpdate?: boolean
}

/*
 * CALL OUT LISTS
 */

export interface CallOutList extends RecordUserNameDateTime {
  listId: string // bigint
  listName: string
  listDescription?: string

  allowSelfSignUp?: boolean
  selfSignUpKey?: string
  hasSelfSignUpKey?: boolean

  sortKeyFunction?: string
  eligibilityFunction?: string
  employeePropertyName?: string
  callOutListMembersCount?: number
  callOutListMembers?: CallOutListMember[]
  isFavourite?: boolean
}

export interface CallOutListMember extends Employee, RecordUserNameDateTime {
  listId: string
  employeeNumber: string
  sortKey?: string
  isNext: boolean
  sortKeyFunction?: string
  employeePropertyName?: string
  callOutDateTimeMax?: string | Date | null
}

export interface CallOutResponseType extends RecordUserNameDateTime {
  responseTypeId: number
  responseType: string
  isSuccessful: boolean | '0' | '1'
  orderNumber?: number
}

export interface CallOutRecord
  extends Partial<CallOutResponseType>,
    Partial<CallOutList>,
    Partial<Employee>,
    RecordUserNameDateTime {
  recordId: string // bigint
  listId: string // bigint
  employeeNumber: string
  callOutDateTime: string | Date
  callOutHours: number
  responseTypeId: number
  recordComment: string
}

/*
 * AFTER HOURS
 */

export interface AfterHoursReason extends RecordUserNameDateTime {
  afterHoursReasonId: number
  afterHoursReason: string
  orderNumber?: number
}

export interface AfterHoursRecord
  extends Partial<AfterHoursReason>,
    RecordUserNameDateTime {
  recordId: string // bigint
  employeeNumber: string
  employeeName: string
  attendanceDateTime: string | Date
  afterHoursReasonId: number
  recordComment?: string

  canUpdate?: boolean
}

/*
 * USER TYPES
 */

declare global {
  interface MonTYUser extends RecordUserNameDateTime {
    userName: string
    canLogin: boolean
    isAdmin: boolean
    employeeNumber?: string
    employeeSurname?: string
    employeeGivenName?: string
    permissions?: Partial<
      Record<keyof typeof availablePermissionValues, string>
    >
  }
}

declare module 'express-session' {
  interface Session {
    user?: MonTYUser
  }
}
