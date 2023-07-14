import type { Request, Response } from 'express'

import { deleteEmployeeProperty } from '../../database/deleteEmployeeProperty.js'
import { getEmployeeProperties } from '../../database/getEmployeeProperties.js'

export async function handler(
  request: Request,
  response: Response
): Promise<void> {
  const success = await deleteEmployeeProperty(
    request.body.employeeNumber,
    request.body.propertyName,
    request.session.user as MonTYUser
  )

  const employeeProperties = await getEmployeeProperties(
    request.body.employeeNumber
  )

  response.json({
    success,
    employeeProperties
  })
}

export default handler
