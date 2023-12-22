import type { Request, Response } from 'express'

import { deleteEmployeeProperty } from '../../database/deleteEmployeeProperty.js'
import { getEmployeeProperties } from '../../database/getEmployeeProperties.js'
import type { EmployeeProperty } from '../../types/recordTypes.js'

export interface DoDeleteEmployeePropertyResponse {
  success: boolean
  employeeProperties: EmployeeProperty[]
}

export async function handler(
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

  const responseJson: DoDeleteEmployeePropertyResponse = {
    success,
    employeeProperties
  }

  response.json(responseJson)
}

export default handler
