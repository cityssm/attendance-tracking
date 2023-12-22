import type { Request, Response } from 'express'

import { getEmployeeProperties } from '../../database/getEmployeeProperties.js'
import { setEmployeeProperty } from '../../database/setEmployeeProperty.js'
import { type EmployeeProperty } from '../../types/recordTypes.js'

export interface DoUpdateEmployeePropertyResponse {
  success: boolean
  employeeProperties: EmployeeProperty[]
}

export async function handler(
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

  const responseJson: DoUpdateEmployeePropertyResponse = {
    success,
    employeeProperties
  }

  response.json(responseJson)
}

export default handler
