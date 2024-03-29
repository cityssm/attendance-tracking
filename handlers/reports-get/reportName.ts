import type { Request, Response } from 'express'
import papaparse from 'papaparse'

import {
  getReportData
} from '../../database/getReportData.js'
import { type ReportParameters } from '../../helpers/functions.reports.js'

export async function handler(
  request: Request,
  response: Response
): Promise<void> {
  const reportName: string = request.params.reportName

  const rows = await getReportData(
    reportName,
    request.query as ReportParameters,
    request.session.user as AttendUser
  )

  if (rows === undefined) {
    response.status(404).json({
      success: false,
      message: 'Report Not Found'
    })

    return
  }

  const csv = papaparse.unparse(rows)

  response.setHeader(
    'Content-Disposition',
    `attachment; filename=${reportName}-${Date.now().toString()}.csv`
  )

  response.setHeader('Content-Type', 'text/csv')

  response.send(csv)
}

export default handler
