import type { Request, Response } from 'express'

import * as configFunctions from '../../helpers/functions.config.js'
import * as permissionFunctions from '../../helpers/functions.permissions.js'

import type * as recordTypes from '../../types/recordTypes'

import { getAbsenceRecords } from '../../database/getAbsenceRecords.js'

import { getCallOutLists } from '../../database/getCallOutLists.js'
import { getEmployeePropertyNames } from '../../database/getEmployeePropertyNames.js'
import { getCallOutResponseTypes } from '../../database/getCallOutResponseTypes.js'
import { getAbsenceTypes } from '../../database/getAbsenceTypes.js'
import { getEmployees } from '../../database/getEmployees.js'
import { getReturnToWorkRecords } from '../../database/getReturnToWorkRecords.js'

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
    if (
      permissionFunctions.hasPermission(
        request.session.user!,
        'attendance.absences.canView'
      )
    ) {
      absenceRecords = await getAbsenceRecords({
        recentOnly: true
      })
    }

    if (
      permissionFunctions.hasPermission(
        request.session.user!,
        'attendance.absences.canUpdate'
      )
    ) {
      absenceTypes = await getAbsenceTypes()
    }
  }

  /*
   * Return to Work Records
   */

  let returnToWorkRecords: recordTypes.ReturnToWorkRecord[] = []

  if (
    configFunctions.getProperty('features.attendance.returnsToWork') &&
    permissionFunctions.hasPermission(
      request.session.user!,
      'attendance.returnsToWork.canView'
    )
  ) {
    returnToWorkRecords = await getReturnToWorkRecords({
      recentOnly: true
    })
  }

  /*
   * Call Out Records
   */

  let callOutLists: recordTypes.CallOutList[] = []
  let callOutResponseTypes: recordTypes.CallOutResponseType[] = []
  const employeeEligibilityFunctionNames: string[] = []
  const employeeSortKeyFunctionNames: string[] = []
  let employeePropertyNames: string[] = []

  if (configFunctions.getProperty('features.attendance.callOuts')) {
    if (
      permissionFunctions.hasPermission(
        request.session.user!,
        'attendance.callOuts.canView'
      )
    ) {
      callOutLists = await getCallOutLists()
    }

    if (
      permissionFunctions.hasPermission(
        request.session.user!,
        'attendance.callOuts.canUpdate'
      )
    ) {
      callOutResponseTypes = await getCallOutResponseTypes()
    }

    if (
      permissionFunctions.hasPermission(
        request.session.user!,
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
  }

  /*
   * Response
   */

  const employees = await getEmployees(
    {
      isActive: true
    },
    {
      orderBy: 'employeeNumber'
    }
  )

  response.render('attendance', {
    headTitle: 'Employee Attendance',

    absenceRecords,
    absenceTypes,

    returnToWorkRecords,

    employees,

    callOutLists,
    callOutResponseTypes,
    employeeEligibilityFunctionNames,
    employeeSortKeyFunctionNames,

    employeePropertyNames
  })
}

export default handler
