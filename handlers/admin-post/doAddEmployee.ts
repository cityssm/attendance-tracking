// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable @typescript-eslint/indent */

import type { Request, Response } from 'express'

import { createEmployee } from '../../database/createEmployee.js'
import { getEmployees } from '../../database/getEmployees.js'
import type { Employee } from '../../types/recordTypes.js'

export type DoAddEmployeeResponse =
  | {
      success: false
    }
  | {
      success: true
      employeeNumber: string
      employees: Employee[]
    }

export async function handler(
  request: Request,
  response: Response
): Promise<void> {
  let responseJson: DoAddEmployeeResponse

  const success = await createEmployee(
    request.body as Employee,
    request.session.user as AttendUser
  )

  if (success) {
    const employees = await getEmployees(
      {
        isActive: 'all'
      },
      {
        orderBy: 'name'
      }
    )

    responseJson = {
      success: true,
      employeeNumber: request.body.employeeNumber,
      employees
    }
  } else {
    responseJson = {
      success: false
    }
  }

  response.json(responseJson)
}

export default handler
