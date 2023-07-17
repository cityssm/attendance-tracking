// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable @typescript-eslint/indent */

import type { Request, Response } from 'express'

import { getAbsenceRecords } from '../../database/getAbsenceRecords.js'
import { getAfterHoursRecords } from '../../database/getAfterHoursRecords.js'
import { getCallOutLists } from '../../database/getCallOutLists.js'
import { getEmployees } from '../../database/getEmployees.js'
import { getReturnToWorkRecords } from '../../database/getReturnToWorkRecords.js'
import {
  getAbsenceTypes,
  getAfterHoursReasons,
  getCallOutResponseTypes,
  getEmployeePropertyNames
} from '../../helpers/functions.cache.js'
import { getConfigProperty } from '../../helpers/functions.config.js'
import * as permissionFunctions from '../../helpers/functions.permissions.js'
import type {
  AbsenceRecord,
  AbsenceType,
  AfterHoursReason,
  AfterHoursRecord,
  CallOutList,
  CallOutResponseType,
  ReturnToWorkRecord
} from '../../types/recordTypes.js'

async function populateAbsenceVariables(sessionUser: MonTYUser): Promise<{
  absenceRecords: AbsenceRecord[]
  absenceTypes: AbsenceType[]
}> {
  let absenceRecords: AbsenceRecord[] = []
  let absenceTypes: AbsenceType[] = []

  if (
    permissionFunctions.hasPermission(
      sessionUser,
      'attendance.absences.canView'
    )
  ) {
    absenceRecords = await getAbsenceRecords(
      {
        recentOnly: true,
        todayOnly: false
      },
      sessionUser
    )
  }

  if (
    permissionFunctions.hasPermission(
      sessionUser,
      'attendance.absences.canUpdate'
    )
  ) {
    absenceTypes = await getAbsenceTypes()
  }

  return {
    absenceRecords,
    absenceTypes
  }
}

async function populateReturnToWorkVariables(sessionUser: MonTYUser): Promise<{
  returnToWorkRecords: ReturnToWorkRecord[]
}> {
  let returnToWorkRecords: ReturnToWorkRecord[] = []

  if (
    permissionFunctions.hasPermission(
      sessionUser,
      'attendance.returnsToWork.canView'
    )
  ) {
    returnToWorkRecords = await getReturnToWorkRecords(
      {
        recentOnly: true,
        todayOnly: false
      },
      sessionUser
    )
  }

  return {
    returnToWorkRecords
  }
}

async function populateCallOutVariables(sessionUser: MonTYUser): Promise<{
  callOutLists: CallOutList[]
  callOutResponseTypes: CallOutResponseType[]
  employeeEligibilityFunctionNames: string[]
  employeeSortKeyFunctionNames: string[]
  employeePropertyNames: string[]
}> {
  let callOutLists: CallOutList[] = []
  let callOutResponseTypes: CallOutResponseType[] = []
  const employeeEligibilityFunctionNames: string[] = []
  const employeeSortKeyFunctionNames: string[] = []
  let employeePropertyNames: string[] = []

  if (
    permissionFunctions.hasPermission(
      sessionUser,
      'attendance.callOuts.canView'
    )
  ) {
    callOutLists = await getCallOutLists(
      {
        favouriteOnly: false
      },
      sessionUser
    )
  }

  if (
    permissionFunctions.hasPermission(
      sessionUser,
      'attendance.callOuts.canUpdate'
    )
  ) {
    callOutResponseTypes = await getCallOutResponseTypes()
  }

  if (
    permissionFunctions.hasPermission(
      sessionUser,
      'attendance.callOuts.canManage'
    )
  ) {
    const employeeEligibilityFunctions = getConfigProperty(
      'settings.employeeEligibilityFunctions'
    )

    for (const eligibilityFunction of employeeEligibilityFunctions) {
      employeeEligibilityFunctionNames.push(eligibilityFunction.functionName)
    }

    const employeeSortKeyFunctions = getConfigProperty(
      'settings.employeeSortKeyFunctions'
    )

    for (const sortKeyFunction of employeeSortKeyFunctions) {
      employeeSortKeyFunctionNames.push(sortKeyFunction.functionName)
    }

    employeePropertyNames = await getEmployeePropertyNames()
  }

  return {
    callOutLists,
    callOutResponseTypes,
    employeeEligibilityFunctionNames,
    employeeSortKeyFunctionNames,
    employeePropertyNames
  }
}

async function populateAfterHoursVariables(sessionUser: MonTYUser): Promise<{
  afterHoursRecords: AfterHoursRecord[]
  afterHoursReasons: AfterHoursReason[]
}> {
  let afterHoursRecords: AfterHoursRecord[] = []
  let afterHoursReasons: AfterHoursReason[] = []

  if (
    permissionFunctions.hasPermission(
      sessionUser,
      'attendance.afterHours.canView'
    )
  ) {
    afterHoursRecords = await getAfterHoursRecords(
      {
        recentOnly: true,
        todayOnly: false
      },
      sessionUser
    )
  }

  if (
    permissionFunctions.hasPermission(
      sessionUser,
      'attendance.afterHours.canUpdate'
    )
  ) {
    afterHoursReasons = await getAfterHoursReasons()
  }

  return {
    afterHoursRecords,
    afterHoursReasons
  }
}

export async function handler(
  request: Request,
  response: Response
): Promise<void> {
  /*
   * Absence Records
   */

  let absenceRecords: AbsenceRecord[] = []
  let absenceTypes: AbsenceType[] = []

  if (getConfigProperty('features.attendance.absences')) {
    const absenceVariables = await populateAbsenceVariables(
      request.session.user as MonTYUser
    )
    absenceRecords = absenceVariables.absenceRecords
    absenceTypes = absenceVariables.absenceTypes
  }

  /*
   * Return to Work Records
   */

  let returnToWorkRecords: ReturnToWorkRecord[] = []

  if (getConfigProperty('features.attendance.returnsToWork')) {
    const returnToWorkVariables = await populateReturnToWorkVariables(
      request.session.user as MonTYUser
    )

    returnToWorkRecords = returnToWorkVariables.returnToWorkRecords
  }

  /*
   * Call Out Records
   */

  let callOutLists: CallOutList[] = []
  let callOutResponseTypes: CallOutResponseType[] = []
  let employeeEligibilityFunctionNames: string[] = []
  let employeeSortKeyFunctionNames: string[] = []
  let employeePropertyNames: string[] = []

  if (getConfigProperty('features.attendance.callOuts')) {
    const callOutVariables = await populateCallOutVariables(
      request.session.user as MonTYUser
    )
    callOutLists = callOutVariables.callOutLists
    callOutResponseTypes = callOutVariables.callOutResponseTypes

    employeeEligibilityFunctionNames =
      callOutVariables.employeeEligibilityFunctionNames

    employeeSortKeyFunctionNames = callOutVariables.employeeSortKeyFunctionNames
    employeePropertyNames = callOutVariables.employeePropertyNames
  }

  /*
   * After Hours
   */

  let afterHoursRecords: AfterHoursRecord[] = []
  let afterHoursReasons: AfterHoursReason[] = []

  if (getConfigProperty('features.attendance.afterHours')) {
    const afterHoursVariables = await populateAfterHoursVariables(
      request.session.user as MonTYUser
    )
    afterHoursRecords = afterHoursVariables.afterHoursRecords
    afterHoursReasons = afterHoursVariables.afterHoursReasons
  }

  /*
   * Response
   */

  const employees = await getEmployees(
    {
      isActive: true
    },
    {
      orderBy: 'name'
    }
  )

  response.render('attendance', {
    headTitle: 'Employee Attendance',

    absenceRecords,
    absenceTypes,

    returnToWorkRecords,

    callOutLists,
    callOutResponseTypes,
    employeeEligibilityFunctionNames,
    employeeSortKeyFunctionNames,

    afterHoursRecords,
    afterHoursReasons,

    employees,

    employeePropertyNames
  })
}

export default handler
