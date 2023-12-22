import type { Request, Response } from 'express'

import { deleteAbsenceType } from '../../database/deleteAbsenceType.js'
import { getAbsenceTypes } from '../../helpers/functions.cache.js'
import type { AbsenceType } from '../../types/recordTypes.js'

export interface DoDeleteAbsenceTypeResponse {
  success: boolean
  absenceTypes: AbsenceType[]
}

export async function handler(
  request: Request,
  response: Response
): Promise<void> {
  const success = await deleteAbsenceType(
    request.body.absenceTypeKey as string,
    request.session.user as AttendUser
  )

  const absenceTypes = await getAbsenceTypes()

  const responseJson: DoDeleteAbsenceTypeResponse = {
    success,
    absenceTypes
  }

  response.json(responseJson)
}

export default handler
