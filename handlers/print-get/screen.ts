import type { Request, Response } from 'express'

import { getConfigProperty } from '../../helpers/functions.config.js'
import {
  getReportData,
  getScreenPrintConfig
} from '../../helpers/functions.print.js'

const urlPrefix = getConfigProperty('reverseProxy.urlPrefix')

export async function handler(
  request: Request,
  response: Response
): Promise<void> {
  const printName: string = request.params.printName

  const printConfig = getScreenPrintConfig(printName)

  if (printConfig === undefined) {
    response.redirect(`${urlPrefix}/dashboard/?error=printNotFound`)
    return
  }

  const reportData = await getReportData(
    printConfig,
    request.query,
    request.session.user as MonTYUser
  )

  response.render(`print/screen/${printName}`, reportData)
}

export default handler
