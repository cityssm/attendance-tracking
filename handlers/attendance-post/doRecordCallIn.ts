import type { Request, Response } from 'express'

import { addAbsenceRecord } from '../../database/addAbsenceRecord.js'
import { addReturnToWorkRecord } from '../../database/addReturnToWorkRecord.js'
import { getAbsenceRecords } from '../../database/getAbsenceRecords.js'
import { getReturnToWorkRecords } from '../../database/getReturnToWorkRecords.js'
import { hasPermission } from '../../helpers/functions.permissions.js'
import type {
  AbsenceRecord,
  ReturnToWorkRecord
} from '../../types/recordTypes.js'

export async function handler(
  request: Request,
  response: Response
): Promise<void> {
  const callInType: 'absence' | 'returnToWork' = request.body.callInType

  let success = false
  let recordId = ''

  let absenceRecords: AbsenceRecord[] = []
  let returnToWorkRecords: ReturnToWorkRecord[] = []

  if (
    callInType === 'absence' &&
    hasPermission(
      request.session.user as MonTYUser,
      'attendance.absences.canUpdate'
    )
  ) {
    recordId = await addAbsenceRecord(
      request.body,
      request.session.user as MonTYUser
    )
    success = true
    absenceRecords = await getAbsenceRecords(
      {
        recentOnly: true,
        todayOnly: false
      },
      request.session.user as MonTYUser
    )
  } else if (
    callInType === 'returnToWork' &&
    hasPermission(
      request.session.user as MonTYUser,
      'attendance.returnsToWork.canUpdate'
    )
  ) {
    recordId = await addReturnToWorkRecord(
      request.body,
      request.session.user as MonTYUser
    )
    success = true
    returnToWorkRecords = await getReturnToWorkRecords(
      {
        recentOnly: true,
        todayOnly: false
      },
      request.session.user as MonTYUser
    )
  }

  response.json({
    success,
    recordId,
    callInType,
    absenceRecords,
    returnToWorkRecords
  })
}

export default handler
