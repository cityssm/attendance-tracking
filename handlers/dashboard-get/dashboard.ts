/* eslint-disable import/namespace */

import type { Request, Response } from 'express'

import { getAbsenceRecords } from '../../database/getAbsenceRecords.js'
import { getCallOutLists } from '../../database/getCallOutLists.js'
import { getEmployees } from '../../database/getEmployees.js'
import { getReturnToWorkRecords } from '../../database/getReturnToWorkRecords.js'
import { getCallOutResponseTypes } from '../../helpers/functions.cache.js'
import * as configFunctions from '../../helpers/functions.config.js'
import * as permissionFunctions from '../../helpers/functions.permissions.js'
import type * as recordTypes from '../../types/recordTypes.js'

function isTemporaryAdmin(user: MonTYUser): boolean {
  return (
    configFunctions.getProperty('application.allowTesting') &&
    (user.userName.startsWith('~~') ?? false) &&
    (user.isAdmin ?? false)
  )
}

async function getAbsenceVariables(user: MonTYUser): Promise<{
  absenceRecords: recordTypes.AbsenceRecord[]
}> {
  let absenceRecords: recordTypes.AbsenceRecord[] = []

  if (
    configFunctions.getProperty('features.attendance.absences') &&
    permissionFunctions.hasPermission(user, 'attendance.absences.canView')
  ) {
    absenceRecords = await getAbsenceRecords(
      {
        recentOnly: true,
        todayOnly: true
      },
      user
    )
  }

  return {
    absenceRecords
  }
}

async function getReturnToWorkVariables(user: MonTYUser): Promise<{
  returnToWorkRecords: recordTypes.ReturnToWorkRecord[]
}> {
  let returnToWorkRecords: recordTypes.ReturnToWorkRecord[] = []

  if (
    configFunctions.getProperty('features.attendance.returnsToWork') &&
    permissionFunctions.hasPermission(user, 'attendance.returnsToWork.canView')
  ) {
    returnToWorkRecords = await getReturnToWorkRecords(
      {
        recentOnly: true,
        todayOnly: true
      },
      user
    )
  }

  return {
    returnToWorkRecords
  }
}

async function getCallOutVariables(user: MonTYUser): Promise<{
  callOutLists: recordTypes.CallOutList[]
  callOutResponseTypes: recordTypes.CallOutResponseType[]
}> {
  let callOutLists: recordTypes.CallOutList[] = []
  let callOutResponseTypes: recordTypes.CallOutResponseType[] = []

  if (
    configFunctions.getProperty('features.attendance.callOuts') &&
    permissionFunctions.hasPermission(user, 'attendance.callOuts.canView')
  ) {
    callOutLists = await getCallOutLists({ favouriteOnly: true }, user)

    if (
      permissionFunctions.hasPermission(user, 'attendance.callOuts.canUpdate')
    ) {
      callOutResponseTypes = await getCallOutResponseTypes()
    }
  }

  return {
    callOutLists,
    callOutResponseTypes
  }
}

async function getTestingSelfServiceDetails(user: MonTYUser): Promise<{
  employeeNumber: string
  lastFourDigits: string
  lastFourDigitsBad: string
}> {
  let employeeNumber = ''
  let lastFourDigits = ''
  let lastFourDigitsBad = 1000

  if (isTemporaryAdmin(user)) {
    const employees = await getEmployees(
      {
        isActive: true
      },
      { includeProperties: false }
    )

    const employeeNumberRegex = configFunctions.getProperty(
      'settings.employeeNumberRegularExpression'
    )

    for (const employee of employees) {
      employeeNumber = employee.employeeNumber

      if (
        employeeNumberRegex !== undefined &&
        !employeeNumberRegex.test(employeeNumber)
      ) {
        continue
      }

      const possibleFourDigits1 = (employee.homeContact1 ?? '').slice(-4)
      const possibleFourDigits2 = (employee.homeContact2 ?? '').slice(-4)

      if (/\d{4}/.test(possibleFourDigits1)) {
        lastFourDigits = possibleFourDigits1
      } else if (/\d{4}/.test(possibleFourDigits2)) {
        lastFourDigits = possibleFourDigits2
      }

      if (lastFourDigits !== '') {
        while (
          lastFourDigitsBad.toString() === possibleFourDigits1 ||
          lastFourDigitsBad.toString() === possibleFourDigits2
        ) {
          lastFourDigitsBad += 1
        }
      }
    }
  }

  return {
    employeeNumber,
    lastFourDigits,
    lastFourDigitsBad: lastFourDigitsBad.toString()
  }
}

export async function handler(
  request: Request,
  response: Response
): Promise<void> {
  const { absenceRecords } = await getAbsenceVariables(request.session.user!)

  const { returnToWorkRecords } = await getReturnToWorkVariables(
    request.session.user!
  )

  const { callOutLists, callOutResponseTypes } = await getCallOutVariables(
    request.session.user!
  )

  const { employeeNumber, lastFourDigits, lastFourDigitsBad } =
    await getTestingSelfServiceDetails(request.session.user!)

  response.render('dashboard', {
    headTitle: 'Dashboard',
    absenceRecords,
    returnToWorkRecords,
    callOutLists,
    callOutResponseTypes,

    employeeNumber,
    lastFourDigits,
    lastFourDigitsBad: lastFourDigitsBad.toString()
  })
}

export default handler
