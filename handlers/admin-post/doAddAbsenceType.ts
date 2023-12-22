import type { Request, Response } from 'express'

import {
  type AddAbsenceTypeForm,
  addAbsenceType
} from '../../database/addAbsenceType.js'
import { getAbsenceTypes } from '../../helpers/functions.cache.js'
import type { AbsenceType } from '../../types/recordTypes.js'

export interface DoAddAbsenceTypeResponse {
  success: true
  absenceTypeKey: string
  absenceTypes: AbsenceType[]
}

export async function handler(
  request: Request,
  response: Response
): Promise<void> {
  const absenceTypeKey = await addAbsenceType(
    request.body as AddAbsenceTypeForm,
    request.session.user as AttendUser
  )

  const absenceTypes = await getAbsenceTypes()

  const responseJson: DoAddAbsenceTypeResponse = {
    success: true,
    absenceTypeKey,
    absenceTypes
  }

  response.json(responseJson)
}

export default handler
