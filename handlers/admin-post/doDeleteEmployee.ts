import type { Request, Response } from 'express'

import { deleteEmployee } from '../../database/deleteEmployee.js'
import { getEmployees } from '../../database/getEmployees.js'
import type { Employee } from '../../types/recordTypes.js'

export interface DoDeleteEmployeeResponse {
  success: boolean
  employees: Employee[]
}

export async function handler(
  request: Request,
  response: Response
): Promise<void> {
  const success = await deleteEmployee(
    request.body.employeeNumber as string,
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

  const responseJson: DoDeleteEmployeeResponse = {
    success,
    employees
  }

  response.json(responseJson)
}

export default handler
