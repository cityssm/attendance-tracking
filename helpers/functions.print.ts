import { getCallOutList } from '../database/getCallOutList.js'
import { getCallOutListMembers } from '../database/getCallOutListMembers.js'
import type * as recordTypes from '../types/recordTypes.js'

import * as permissionFunctions from './functions.permissions.js'

interface PrintConfig {
  title: string
  params: string[]
}

const screenPrintConfigs: Record<string, PrintConfig> = {
  callOutList: {
    title: 'Call Out List',
    params: ['listId']
  }
}

export function getScreenPrintConfig(
  printName: string
): PrintConfig | undefined {
  return screenPrintConfigs[printName]
}

const pdfPrintConfigs: Record<string, PrintConfig> = {}

export function getPdfPrintConfig(printName: string): PrintConfig | undefined {
  return pdfPrintConfigs[printName]
}

export function getPrintConfig(
  screenOrPdfPrintName: string
): PrintConfig | undefined {
  const printNameSplit = screenOrPdfPrintName.split('/')

  switch (printNameSplit[0]) {
    case 'screen': {
      return getScreenPrintConfig(printNameSplit[1])
    }
    case 'pdf': {
      return getPdfPrintConfig(printNameSplit[1])
    }
  }

  return undefined
}

export async function getReportData(
  printConfig: PrintConfig,
  requestQuery: Record<string, unknown>,
  requestSession: recordTypes.PartialSession
): Promise<Record<string, unknown>> {
  const reportData: Record<string, unknown> = {
    headTitle: printConfig.title
  }

  if (
    printConfig.params.includes('listId') &&
    typeof requestQuery.listId === 'string' &&
    permissionFunctions.hasPermission(
      requestSession.user!,
      'attendance.callOuts.canView'
    )
  ) {
    const callOutList = await getCallOutList(requestQuery.listId)
    const callOutListMembers = await getCallOutListMembers(
      {
        listId: requestQuery.listId
      },
      {
        includeSortKeyFunction: true
      }
    )

    reportData.callOutList = callOutList
    reportData.callOutListMembers = callOutListMembers
  }

  return reportData
}
