import type { Request, Response } from 'express'

import { addAbsenceType } from '../../database/addAbsenceType.js'
import { getAbsenceTypes } from '../../helpers/functions.cache.js'

export async function handler(
  request: Request,
  response: Response
): Promise<void> {
  const absenceTypeKey = await addAbsenceType(request.body, request.session.user!)

  const absenceTypes = await getAbsenceTypes()

  response.json({
    success: true,
    absenceTypeKey,
    absenceTypes
  })
}

export default handler
