import type { Request, Response } from 'express'

import {
  getAbsenceTypes,
  getAfterHoursReasons,
  getCallOutResponseTypes
} from '../../helpers/functions.cache.js'

export async function handler(
  request: Request,
  response: Response
): Promise<void> {
  const absenceTypes = await getAbsenceTypes()
  const callOutResponseTypes = await getCallOutResponseTypes()
  const afterHoursReasons = await getAfterHoursReasons()

  response.render('admin.tables.ejs', {
    headTitle: 'Table Maintenance',
    absenceTypes,
    callOutResponseTypes,
    afterHoursReasons
  })
}

export default handler
