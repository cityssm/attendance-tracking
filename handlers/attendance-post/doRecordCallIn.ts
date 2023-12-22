import type { Request, Response } from 'express'

import {
  type AddAbsenceRecordForm,
  addAbsenceRecord
} from '../../database/addAbsenceRecord.js'
import {
  type AddReturnToWorkRecordForm,
  addReturnToWorkRecord
} from '../../database/addReturnToWorkRecord.js'
import { getAbsenceRecords } from '../../database/getAbsenceRecords.js'
import { getReturnToWorkRecords } from '../../database/getReturnToWorkRecords.js'
import { hasPermission } from '../../helpers/functions.permissions.js'
import type {
  AbsenceRecord,
  ReturnToWorkRecord
} from '../../types/recordTypes.js'

export interface DoRecordCallInResponse {
  success: boolean
  recordId: string
  callInType: 'absence' | 'returnToWork'
  absenceRecords: AbsenceRecord[]
  returnToWorkRecords: ReturnToWorkRecord[]
}

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
      request.session.user as AttendUser,
      'attendance.absences.canUpdate'
    )
  ) {
    recordId = await addAbsenceRecord(
      request.body as AddAbsenceRecordForm,
      request.session.user as AttendUser
    )
    success = true
    absenceRecords = await getAbsenceRecords(
      {
        recentOnly: true,
        todayOnly: false
      },
      {},
      request.session.user as AttendUser
    )
  } else if (
    callInType === 'returnToWork' &&
    hasPermission(
      request.session.user as AttendUser,
      'attendance.returnsToWork.canUpdate'
    )
  ) {
    recordId = await addReturnToWorkRecord(
      request.body as AddReturnToWorkRecordForm,
      request.session.user as AttendUser
    )
    success = true
    returnToWorkRecords = await getReturnToWorkRecords(
      {
        recentOnly: true,
        todayOnly: false
      },
      request.session.user as AttendUser
    )
  }

  const responseJson: DoRecordCallInResponse = {
    success,
    recordId,
    callInType,
    absenceRecords,
    returnToWorkRecords
  }

  response.json(responseJson)
}

export default handler
