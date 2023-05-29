import type { Request, Response } from 'express'

import { getEmployees } from '../../database/getEmployees.js'
import { getEmployeePropertyNames } from '../../helpers/functions.cache.js'

export async function handler(
  request: Request,
  response: Response
): Promise<void> {
  const employees = await getEmployees(
    {
      isActive: 'all'
    },
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
