import type { Request, Response } from 'express'

import { getEmployeeProperties } from '../../database/getEmployeeProperties.js'
import type { EmployeeProperty } from '../../types/recordTypes.js'

export interface DoGetEmployeePropertiesResponse {
  employeeProperties: EmployeeProperty[]
}

export async function handler(
  request: Request,
  response: Response
): Promise<void> {
  const employeeProperties = await getEmployeeProperties(
    request.body.employeeNumber as string
  )

  const responseJson: DoGetEmployeePropertiesResponse = {
    employeeProperties
  }

  response.json(responseJson)
}

export default handler
