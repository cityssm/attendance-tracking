import type { Request, Response } from 'express'

import { deleteAbsenceType } from '../../database/deleteAbsenceType.js'
import { getAbsenceTypes } from '../../helpers/functions.cache.js'

export async function handler(
  request: Request,
  response: Response
): Promise<void> {
  const success = await deleteAbsenceType(
    request.body.absenceTypeKey,
    request.session.user as MonTYUser
  )

  const absenceTypes = await getAbsenceTypes()

  response.json({
    success,
    absenceTypes
  })
}

export default handler
