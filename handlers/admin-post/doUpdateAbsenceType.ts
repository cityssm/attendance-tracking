import type { Request, Response } from 'express'

import { updateAbsenceType } from '../../database/updateAbsenceType.js'
import type { AbsenceType } from '../../types/recordTypes.js'

export interface DoUpdateAbsenceTypeResponse {
  success: boolean
}

export async function handler(
  request: Request,
  response: Response
): Promise<void> {
  const success = await updateAbsenceType(
    request.body as AbsenceType,
    request.session.user as AttendUser
  )

  const responseJson: DoUpdateAbsenceTypeResponse = {
    success
  }

  response.json(responseJson)
}

export default handler
