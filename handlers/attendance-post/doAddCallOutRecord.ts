import type { Request, Response } from 'express'

import {
  type AddCallOutRecordForm,
  addCallOutRecord
} from '../../database/addCallOutRecord.js'
import { getCallOutRecords } from '../../database/getCallOutRecords.js'
import type { CallOutRecord } from '../../types/recordTypes.js'

export interface DoAddCallOutRecordResponse {
  success: true
  recordId: string
  callOutRecords: CallOutRecord[]
}

export async function handler(
  request: Request,
  response: Response
): Promise<void> {
  const recordId = await addCallOutRecord(
    request.body as AddCallOutRecordForm,
    request.session.user as AttendUser
  )

  const callOutRecords = await getCallOutRecords({
    listId: request.body.listId,
    employeeNumber: request.body.employeeNumber,
    recentOnly: true
  })

  const responseJson: DoAddCallOutRecordResponse = {
    success: true,
    recordId,
    callOutRecords
  }

  response.json(responseJson)
}

export default handler
