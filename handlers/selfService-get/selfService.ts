import type { Request, Response } from 'express'

export function handler(request: Request, response: Response): void {
  response.render('selfService.ejs', {
    headTitle: 'Self Service'
  })
}

export default handler
