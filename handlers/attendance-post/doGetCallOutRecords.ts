import type { Request, Response } from 'express'

import { getCallOutRecords } from '../../database/getCallOutRecords.js'

export async function handler(
  request: Request,
  response: Response
): Promise<void> {
  const callOutRecords = await getCallOutRecords({
    listId: request.body.listId,
    employeeNumber: request.body.employeeNumber,
    recentOnly: true
  })

  response.json({
    callOutRecords
  })
}

export default handler
