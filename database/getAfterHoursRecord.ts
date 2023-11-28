import type { AfterHoursRecord } from '../types/recordTypes.js'

import { getAfterHoursRecords } from './getAfterHoursRecords.js'

export async function getAfterHoursRecord(
  recordId: string,
  sessionUser: AttendUser
): Promise<AfterHoursRecord | undefined> {
  const afterHoursRecords = await getAfterHoursRecords(
    {
      recordId,
      recentOnly: false,
      todayOnly: false
    },
    sessionUser
  )

  if (afterHoursRecords.length > 0) {
    return afterHoursRecords[0]
  }

  return undefined
}
