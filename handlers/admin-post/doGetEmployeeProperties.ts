import type { Request, Response } from 'express'

import { getEmployeeProperties } from '../../database/getEmployeeProperties.js'

export async function handler(
  request: Request,
  response: Response
): Promise<void> {
  const employeeProperties = await getEmployeeProperties(
    request.body.employeeNumber
  )

  response.json({
    employeeProperties
  })
}

export default handler
