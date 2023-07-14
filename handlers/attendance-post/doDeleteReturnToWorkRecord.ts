import type { Request, Response } from 'express'

import { deleteReturnToWorkRecord } from '../../database/deleteReturnToWorkRecord.js'
import { getReturnToWorkRecord } from '../../database/getReturnToWorkRecord.js'
import { getReturnToWorkRecords } from '../../database/getReturnToWorkRecords.js'

export async function handler(
  request: Request,
  response: Response
): Promise<unknown> {
  const recordId = request.body.recordId

  const returnToWorkRecord = await getReturnToWorkRecord(
    recordId,
    request.session.user as MonTYUser
  )

  if (returnToWorkRecord === undefined) {
    response.json({
      success: false,
      errorMessage: 'Return to work record not found.'
    })
    return
  }

  if (!(returnToWorkRecord.canUpdate as boolean)) {
    response.json({
      success: false,
      errorMessage: 'Access denied.'
    })
    return
  }

  const success = await deleteReturnToWorkRecord(
    recordId,
    request.session.user as MonTYUser
  )

  const returnToWorkRecords = await getReturnToWorkRecords(
    {
      recentOnly: true,
      todayOnly: false
    },
    request.session.user as MonTYUser
  )

  response.json({
    success,
    returnToWorkRecords
  })
}

export default handler
