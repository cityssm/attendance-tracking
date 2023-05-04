import type { Request, Response } from 'express'

import { getEmployees } from '../../database/getEmployees.js'
import { getEmployeePropertyNames } from '../../database/getEmployeePropertyNames.js'

export async function handler(
  request: Request,
  response: Response
): Promise<void> {
  const employees = await getEmployees(
    {},
    {
      orderBy: 'name'
    }
  )

  const employeePropertyNames = await getEmployeePropertyNames()

  response.render('admin.employees.ejs', {
    headTitle: 'Employee Maintenance',
    employees,
    employeePropertyNames
  })
}

export default handler
