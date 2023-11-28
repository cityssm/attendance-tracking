import type { Request, Response } from 'express'

import { getCallOutRecords } from '../../database/getCallOutRecords.js'
import { updateCallOutRecord } from '../../database/updateCallOutRecord.js'

export async function handler(
  request: Request,
  response: Response
): Promise<void> {
  const success = await updateCallOutRecord(request.body, request.session.user as AttendUser)

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
