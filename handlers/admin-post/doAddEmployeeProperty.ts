// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable @typescript-eslint/indent */

import type { Request, Response } from 'express'

import { getEmployeeProperties } from '../../database/getEmployeeProperties.js'
import { getEmployeePropertyValue } from '../../database/getEmployeePropertyValue.js'
import { setEmployeeProperty } from '../../database/setEmployeeProperty.js'
import type { EmployeeProperty } from '../../types/recordTypes.js'

export interface DoAddEmployeePropertyResponse {
  success: boolean
  employeeProperties: EmployeeProperty[]
}

export async function handler(
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

  const responseJson: DoAddEmployeePropertyResponse = {
    success,
    employeeProperties
  }

  response.json(responseJson)
}

export default handler
