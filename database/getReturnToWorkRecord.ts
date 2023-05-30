import type { PartialSession, ReturnToWorkRecord } from '../types/recordTypes'

import { getReturnToWorkRecords } from './getReturnToWorkRecords.js'

export async function getReturnToWorkRecord(
  recordId: string,
  requestSession: PartialSession
): Promise<ReturnToWorkRecord | undefined> {
  const returnToWorkRecords = await getReturnToWorkRecords(
    {
      recordId,
      recentOnly: false,
      todayOnly: false
    },
    requestSession
  )

  if (returnToWorkRecords.length > 0) {
    return returnToWorkRecords[0]
  }

  return undefined
}
