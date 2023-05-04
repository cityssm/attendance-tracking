import type { Request, Response } from 'express'

export async function handler(
  request: Request,
  response: Response
): Promise<void> {
  response.render('admin.employees.ejs', {
    headTitle: 'Employee Maintenance'
  })
}

export default handler
