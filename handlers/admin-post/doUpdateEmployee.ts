import type { Request, Response } from 'express'

import { getEmployees } from '../../database/getEmployees.js'
import { updateEmployee } from '../../database/updateEmployee.js'
import type { Employee } from '../../types/recordTypes.js'

export interface DoUpdateEmployeeResponse {
  success: boolean
  employees: Employee[]
}

export async function handler(
  request: Request,
  response: Response
): Promise<void> {
  const success = await updateEmployee(
    request.body as Employee,
    false,
    request.session.user as AttendUser
  )

  const employees = await getEmployees(
    {
      isActive: 'all'
    },
    {
      orderBy: 'name'
    }
  )

  const responseJson: DoUpdateEmployeeResponse = {
    success,
    employees
  }

  response.json(responseJson)
}

export default handler
