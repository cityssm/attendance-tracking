import type { Request, Response } from 'express'

import { addAbsenceRecord } from '../../database/addAbsenceRecord.js'
import { addReturnToWorkRecord } from '../../database/addReturnToWorkRecord.js'
import { getAbsenceRecords } from '../../database/getAbsenceRecords.js'
import { getReturnToWorkRecords } from '../../database/getReturnToWorkRecords.js'
import * as permissionFunctions from '../../helpers/functions.permissions.js'
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

  switch (callInType) {
    case 'absence': {
      if (
        permissionFunctions.hasPermission(
          request.session.user!,
          'attendance.absences.canUpdate'
        )
      ) {
        recordId = await addAbsenceRecord(request.body, request.session.user!)
        success = true
        absenceRecords = await getAbsenceRecords(
          {
            recentOnly: true,
            todayOnly: false
          },
          request.session.user!
        )
      }

      break
    }

    case 'returnToWork': {
      if (
        permissionFunctions.hasPermission(
          request.session.user!,
          'attendance.returnsToWork.canUpdate'
        )
      ) {
        recordId = await addReturnToWorkRecord(
          request.body,
          request.session.user!
        )
        success = true
        returnToWorkRecords = await getReturnToWorkRecords(
          {
            recentOnly: true,
            todayOnly: false
          },
          request.session.user!
        )
      }

      break
    }
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
