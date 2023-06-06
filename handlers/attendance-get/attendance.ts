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
import * as configFunctions from '../../helpers/functions.config.js'
import * as permissionFunctions from '../../helpers/functions.permissions.js'
import type * as recordTypes from '../../types/recordTypes'

async function populateAbsenceVariables(
  requestSession: recordTypes.PartialSession
): Promise<{
  absenceRecords: recordTypes.AbsenceRecord[]
  absenceTypes: recordTypes.AbsenceType[]
}> {
  let absenceRecords: recordTypes.AbsenceRecord[] = []
  let absenceTypes: recordTypes.AbsenceType[] = []

  if (
    permissionFunctions.hasPermission(
      requestSession.user!,
      'attendance.absences.canView'
    )
  ) {
    absenceRecords = await getAbsenceRecords(
      {
        recentOnly: true,
        todayOnly: false
      },
      requestSession
    )
  }

  if (
    permissionFunctions.hasPermission(
      requestSession.user!,
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

async function populateReturnToWorkVariables(
  requestSession: recordTypes.PartialSession
): Promise<{
  returnToWorkRecords: recordTypes.ReturnToWorkRecord[]
}> {
  let returnToWorkRecords: recordTypes.ReturnToWorkRecord[] = []

  if (
    permissionFunctions.hasPermission(
      requestSession.user!,
      'attendance.returnsToWork.canView'
    )
  ) {
    returnToWorkRecords = await getReturnToWorkRecords(
      {
        recentOnly: true,
        todayOnly: false
      },
      requestSession
    )
  }

  return {
    returnToWorkRecords
  }
}

async function populateCallOutVariables(
  requestSession: recordTypes.PartialSession
): Promise<{
  callOutLists: recordTypes.CallOutList[]
  callOutResponseTypes: recordTypes.CallOutResponseType[]
  employeeEligibilityFunctionNames: string[]
  employeeSortKeyFunctionNames: string[]
  employeePropertyNames: string[]
}> {
  let callOutLists: recordTypes.CallOutList[] = []
  let callOutResponseTypes: recordTypes.CallOutResponseType[] = []
  const employeeEligibilityFunctionNames: string[] = []
  const employeeSortKeyFunctionNames: string[] = []
  let employeePropertyNames: string[] = []

  if (
    permissionFunctions.hasPermission(
      requestSession.user!,
      'attendance.callOuts.canView'
    )
  ) {
    callOutLists = await getCallOutLists(
      {
        favouriteOnly: false
      },
      requestSession
    )
  }

  if (
    permissionFunctions.hasPermission(
      requestSession.user!,
      'attendance.callOuts.canUpdate'
    )
  ) {
    callOutResponseTypes = await getCallOutResponseTypes()
  }

  if (
    permissionFunctions.hasPermission(
      requestSession.user!,
      'attendance.callOuts.canManage'
    )
  ) {
    const employeeEligibilityFunctions = configFunctions.getProperty(
      'settings.employeeEligibilityFunctions'
    )

    for (const eligibilityFunction of employeeEligibilityFunctions) {
      employeeEligibilityFunctionNames.push(eligibilityFunction.functionName)
    }

    const employeeSortKeyFunctions = configFunctions.getProperty(
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

async function populateAfterHoursVariables(
  requestSession: recordTypes.PartialSession
): Promise<{
  afterHoursRecords: recordTypes.AfterHoursRecord[]
  afterHoursReasons: recordTypes.AfterHoursReason[]
}> {
  let afterHoursRecords: recordTypes.AfterHoursRecord[] = []
  let afterHoursReasons: recordTypes.AfterHoursReason[] = []

  if (
    permissionFunctions.hasPermission(
      requestSession.user!,
      'attendance.afterHours.canView'
    )
  ) {
    afterHoursRecords = await getAfterHoursRecords(
      {
        recentOnly: true,
        todayOnly: false
      },
      requestSession
    )
  }

  if (
    permissionFunctions.hasPermission(
      requestSession.user!,
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

  let absenceRecords: recordTypes.AbsenceRecord[] = []
  let absenceTypes: recordTypes.AbsenceType[] = []

  if (configFunctions.getProperty('features.attendance.absences')) {
    const absenceVariables = await populateAbsenceVariables(request.session)
    absenceRecords = absenceVariables.absenceRecords
    absenceTypes = absenceVariables.absenceTypes
  }

  /*
   * Return to Work Records
   */

  let returnToWorkRecords: recordTypes.ReturnToWorkRecord[] = []

  if (configFunctions.getProperty('features.attendance.returnsToWork')) {
    const returnToWorkVariables = await populateReturnToWorkVariables(
      request.session
    )

    returnToWorkRecords = returnToWorkVariables.returnToWorkRecords
  }

  /*
   * Call Out Records
   */

  let callOutLists: recordTypes.CallOutList[] = []
  let callOutResponseTypes: recordTypes.CallOutResponseType[] = []
  let employeeEligibilityFunctionNames: string[] = []
  let employeeSortKeyFunctionNames: string[] = []
  let employeePropertyNames: string[] = []

  if (configFunctions.getProperty('features.attendance.callOuts')) {
    const callOutVariables = await populateCallOutVariables(request.session)
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

  let afterHoursRecords: recordTypes.AfterHoursRecord[] = []
  let afterHoursReasons: recordTypes.AfterHoursReason[] = []

  if (configFunctions.getProperty('features.attendance.afterHours')) {
    const afterHoursVariables = await populateAfterHoursVariables(
      request.session
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
