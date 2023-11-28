import type { Request, Response } from 'express'

import { deleteCallOutRecord } from '../../database/deleteCallOutRecord.js'
import { getCallOutRecords } from '../../database/getCallOutRecords.js'

export async function handler(
  request: Request,
  response: Response
): Promise<void> {
  const success = await deleteCallOutRecord(
    request.body.recordId,
    request.session.user as AttendUser
  )

  const callOutRecords = await getCallOutRecords({
    listId: request.body.listId,
    employeeNumber: request.body.employeeNumber,
    recentOnly: true
  })

  response.json({
    success,
    callOutRecords
  })
}

export default handler
