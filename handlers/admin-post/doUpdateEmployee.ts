import type { Request, Response } from 'express'

import { getEmployees } from '../../database/getEmployees.js'
import { updateEmployee } from '../../database/updateEmployee.js'

export async function handler(
  request: Request,
  response: Response
): Promise<void> {
  const success = await updateEmployee(request.body, false, request.session.user!)

  const employees = await getEmployees(
    {
      isActive: 'all'
    },
    {
      orderBy: 'name'
    }
  )

  response.json({
    success,
    employees
  })
}

export default handler
