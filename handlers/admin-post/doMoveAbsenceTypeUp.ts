import type { Request, Response } from 'express'

import { moveRecordUp, moveRecordUpToTop } from '../../database/moveRecord.js'

import { getAbsenceTypes } from '../../database/getAbsenceTypes.js'

export async function handler(
  request: Request,
  response: Response
): Promise<void> {
  const success =
    request.body.moveToEnd === '1'
      ? await moveRecordUpToTop('AbsenceTypes', request.body.absenceTypeKey)
      : await moveRecordUp('AbsenceTypes', request.body.absenceTypeKey)

  const absenceTypes = await getAbsenceTypes()

  response.json({
    success,
    absenceTypes
  })
}

export default handler
