import type { Request, Response } from 'express'

import { deleteCallOutRecord } from '../../database/deleteCallOutRecord.js'
import { getCallOutRecords } from '../../database/getCallOutRecords.js'
import type { CallOutRecord } from '../../types/recordTypes.js'

export interface DoDeleteCallOutRecordResponse {
  success: boolean
  callOutRecords: CallOutRecord[]
}

export async function handler(
  request: Request,
  response: Response
): Promise<void> {
  const success = await deleteCallOutRecord(
    request.body.recordId as string,
    request.session.user as AttendUser
  )

  const callOutRecords = await getCallOutRecords({
    listId: request.body.listId,
    employeeNumber: request.body.employeeNumber,
    recentOnly: true
  })

  const responseJson: DoDeleteCallOutRecordResponse = {
    success,
    callOutRecords
  }

  response.json(responseJson)
}

export default handler
