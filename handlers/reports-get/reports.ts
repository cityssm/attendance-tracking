import type { Request, Response } from 'express'

export async function handler(
  request: Request,
  response: Response
): Promise<void> {
  response.render('reports', {
    headTitle: 'Report Library'
  })
}

export default handler
