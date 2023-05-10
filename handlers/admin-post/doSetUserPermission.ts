import type { Request, Response } from 'express'

import { setUserPermission } from '../../database/setUserPermission.js'

export async function handler(
  request: Request,
  response: Response
): Promise<void> {
  const success = await setUserPermission(request.body, request.session)

  response.json({
    success
  })
}

export default handler
