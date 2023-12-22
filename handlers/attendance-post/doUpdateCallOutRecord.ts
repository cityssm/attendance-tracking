import type { Request, Response } from 'express'

import { getCallOutRecords } from '../../database/getCallOutRecords.js'
import {
  type EditCallOutRecordForm,
  updateCallOutRecord
} from '../../database/updateCallOutRecord.js'
import type { CallOutRecord } from '../../types/recordTypes.js'

export interface DoUpdateCallOutRecordResponse {
  success: boolean
  callOutRecords: CallOutRecord[]
}

export async function handler(
  request: Request,
  response: Response
): Promise<void> {
  const success = await updateCallOutRecord(
    request.body as EditCallOutRecordForm,
    request.session.user as AttendUser
  )

  const callOutRecords = await getCallOutRecords({
    listId: request.body.listId,
    employeeNumber: request.body.employeeNumber,
    recentOnly: true
  })

  const responseJson: DoUpdateCallOutRecordResponse = {
    success,
    callOutRecords
  }

  response.json(responseJson)
}

export default handler
