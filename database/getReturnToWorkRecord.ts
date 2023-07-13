import type { ReturnToWorkRecord } from '../types/recordTypes.js'

import { getReturnToWorkRecords } from './getReturnToWorkRecords.js'

export async function getReturnToWorkRecord(
  recordId: string,
  sessionUser: MonTYUser
): Promise<ReturnToWorkRecord | undefined> {
  const returnToWorkRecords = await getReturnToWorkRecords(
    {
      recordId,
      recentOnly: false,
      todayOnly: false
    },
    sessionUser
  )

  if (returnToWorkRecords.length > 0) {
    return returnToWorkRecords[0]
  }

  return undefined
}
