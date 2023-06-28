import type { Request, Response } from 'express'

import { updateAbsenceType } from '../../database/updateAbsenceType.js'

export async function handler(
  request: Request,
  response: Response
): Promise<void> {
  const success = await updateAbsenceType(request.body, request.session.user!)

  response.json({
    success
  })
}

export default handler
