import type { Request, Response } from 'express'

import { getAbsenceTypes } from '../../database/getAbsenceTypes.js'
import { getCallOutResponseTypes } from '../../database/getCallOutResponseTypes.js'

export async function handler(
  request: Request,
  response: Response
): Promise<void> {
  const absenceTypes = await getAbsenceTypes()
  const callOutResponseTypes = await getCallOutResponseTypes()

  response.render('admin.tables.ejs', {
    headTitle: 'Table Maintenance',
    absenceTypes,
    callOutResponseTypes
  })
}

export default handler
