import type { Request, Response } from 'express'

import { getUserPermissions } from '../../database/getUserPermissions.js'

export async function handler(
  request: Request,
  response: Response
): Promise<void> {
  const userPermissions = await getUserPermissions(request.body.userName)

  response.json({
    userPermissions
  })
}

export default handler
