import type { Request, Response } from 'express'

export async function handler(
  request: Request,
  response: Response
): Promise<void> {
  response.render('selfService.ejs', {
    headTitle: 'Self Service'
  })
}

export default handler
