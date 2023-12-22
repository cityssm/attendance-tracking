import type { Request, Response } from 'express'

import { getCallOutRecords } from '../../database/getCallOutRecords.js'
import type { CallOutRecord } from '../../types/recordTypes.js'

export interface DoGetCallOutRecordsResponse {
  callOutRecords: CallOutRecord[]
}

export async function handler(
  request: Request,
  response: Response
): Promise<void> {
  const callOutRecords = await getCallOutRecords({
    listId: request.body.listId,
    employeeNumber: request.body.employeeNumber,
    recentOnly: true
  })

  const responseJson: DoGetCallOutRecordsResponse = {
    callOutRecords
  }

  response.json(responseJson)
}

export default handler
