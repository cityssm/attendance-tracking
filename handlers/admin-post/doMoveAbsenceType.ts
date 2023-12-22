// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable @typescript-eslint/indent */

import type { Request, Response } from 'express'

import {
  moveRecordDown,
  moveRecordDownToBottom,
  moveRecordUp,
  moveRecordUpToTop
} from '../../database/moveRecord.js'
import { getAbsenceTypes } from '../../helpers/functions.cache.js'
import type { AbsenceType } from '../../types/recordTypes.js'

export interface DoMoveAbsenceTypeResponse {
  success: boolean
  absenceTypes: AbsenceType[]
}

export async function doMoveAbsenceTypeDownHandler(
  request: Request,
  response: Response
): Promise<void> {
  const success =
    request.body.moveToEnd === '1'
      ? await moveRecordDownToBottom(
          'AbsenceTypes',
          request.body.absenceTypeKey as string
        )
      : await moveRecordDown(
          'AbsenceTypes',
          request.body.absenceTypeKey as string
        )

  const absenceTypes = await getAbsenceTypes()

  const responseJson: DoMoveAbsenceTypeResponse = {
    success,
    absenceTypes
  }

  response.json(responseJson)
}

export async function doMoveAbsenceTypeUpHandler(
  request: Request,
  response: Response
): Promise<void> {
  const success =
    request.body.moveToEnd === '1'
      ? await moveRecordUpToTop(
          'AbsenceTypes',
          request.body.absenceTypeKey as string
        )
      : await moveRecordUp(
          'AbsenceTypes',
          request.body.absenceTypeKey as string
        )

  const absenceTypes = await getAbsenceTypes()

  const responseJson: DoMoveAbsenceTypeResponse = {
    success,
    absenceTypes
  }

  response.json(responseJson)
}
