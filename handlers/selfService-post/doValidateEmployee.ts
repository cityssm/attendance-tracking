import type { Request, Response } from 'express'

import { getEmployeeName } from '../../database/getEmployeeName.js'

export async function handler(
  request: Request,
  response: Response
): Promise<void> {
  const employeeName = await getEmployeeName(
    request.body.employeeNumber,
    request.body.employeeHomeContactLastFourDigits
  )

  if (employeeName === undefined) {
    response.json({
      success: false,
      errorMessage: 'Employee not found'
    })

    return
  }

  response.json({
    success: true,
    employeeName
  })
}

export default handler
