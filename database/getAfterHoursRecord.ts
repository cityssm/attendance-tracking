import type { AfterHoursRecord, PartialSession } from '../types/recordTypes'

import { getAfterHoursRecords } from './getAfterHoursRecords.js'

export async function getAfterHoursRecord(
  recordId: string,
  requestSession: PartialSession
): Promise<AfterHoursRecord | undefined> {
  const afterHoursRecords = await getAfterHoursRecords(
    {
      recordId,
      recentOnly: false,
      todayOnly: false
    },
    requestSession
  )

  if (afterHoursRecords.length > 0) {
    return afterHoursRecords[0]
  }

  return undefined
}
