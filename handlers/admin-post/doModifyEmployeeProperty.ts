// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable @typescript-eslint/indent */

import type { Request, Response } from 'express'

import { deleteEmployeeProperty } from '../../database/deleteEmployeeProperty.js'
import { getEmployeeProperties } from '../../database/getEmployeeProperties.js'
import { getEmployeePropertyValue } from '../../database/getEmployeePropertyValue.js'
import { setEmployeeProperty } from '../../database/setEmployeeProperty.js'
import type { EmployeeProperty } from '../../types/recordTypes.js'

export interface DoModifyEmployeePropertyResponse {
  success: boolean
  employeeProperties: EmployeeProperty[]
}

export async function doAddEmployeePropertyHandler(
  request: Request,
  response: Response
): Promise<void> {
  const employeePropertyValue = await getEmployeePropertyValue(
    request.body.employeeNumber as string,
    request.body.propertyName as string
  )

  const success =
    employeePropertyValue === undefined
      ? await setEmployeeProperty(
          request.body as EmployeeProperty,
          false,
          request.session.user as AttendUser
        )
      : false

  const employeeProperties = await getEmployeeProperties(
    request.body.employeeNumber as string
  )

  const responseJson: DoModifyEmployeePropertyResponse = {
    success,
    employeeProperties
  }

  response.json(responseJson)
}

export async function doDeleteEmployeePropertyHandler(
  request: Request,
  response: Response
): Promise<void> {
  const success = await deleteEmployeeProperty(
    request.body.employeeNumber as string,
    request.body.propertyName as string,
    request.session.user as AttendUser
  )

  const employeeProperties = await getEmployeeProperties(
    request.body.employeeNumber as string
  )

  const responseJson: DoModifyEmployeePropertyResponse = {
    success,
    employeeProperties
  }

  response.json(responseJson)
}

export async function doUpdateEmployeePropertyHandler(
  request: Request,
  response: Response
): Promise<void> {
  const success = await setEmployeeProperty(
    request.body as EmployeeProperty,
    false,
    request.session.user as AttendUser
  )

  const employeeProperties = await getEmployeeProperties(
    request.body.employeeNumber as string
  )

  const responseJson: DoModifyEmployeePropertyResponse = {
    success,
    employeeProperties
  }

  response.json(responseJson)
}
