import type { Request, Response } from 'express'

import { getEmployeeProperties } from '../../database/getEmployeeProperties.js'
import { getEmployeePropertyValue } from '../../database/getEmployeePropertyValue.js'
import { setEmployeeProperty } from '../../database/setEmployeeProperty.js'

export async function handler(
  request: Request,
  response: Response
): Promise<void> {
  const employeePropertyValue = await getEmployeePropertyValue(
    request.body.employeeNumber,
    request.body.propertyName
  )

  const success =
    employeePropertyValue === undefined
      ? await setEmployeeProperty(request.body, false, request.session.user as AttendUser)
      : false

  const employeeProperties = await getEmployeeProperties(
    request.body.employeeNumber
  )

  response.json({
    success,
    employeeProperties
  })
}

export default handler
