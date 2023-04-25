import type { Request, Response } from 'express'

export async function handler(
  _request: Request,
  response: Response
): Promise<void> {
  response.render('attendance', {
    headTitle: 'Employee Attendnace'
  })
}

export default handler
