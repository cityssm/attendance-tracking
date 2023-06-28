import type { AbsenceRecord, User } from '../types/recordTypes'

import { getAbsenceRecords } from './getAbsenceRecords.js'

export async function getAbsenceRecord(
  recordId: string,
  sessionUser: User
): Promise<AbsenceRecord | undefined> {
  const absenceRecords = await getAbsenceRecords(
    {
      recordId,
      recentOnly: false,
      todayOnly: false
    },
    sessionUser
  )

  if (absenceRecords.length > 0) {
    return absenceRecords[0]
  }

  return undefined
}
