import { getCallOutList } from '../database/getCallOutList.js'
import { getCallOutListMembers } from '../database/getCallOutListMembers.js'

import { hasPermission } from './functions.permissions.js'

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

export async function getReportData(
  printConfig: PrintConfig,
  requestQuery: Record<string, unknown>,
  sessionUser: AttendUser
): Promise<Record<string, unknown>> {
  const reportData: Record<string, unknown> = {
    headTitle: printConfig.title
  }

  if (
    printConfig.params.includes('listId') &&
    typeof requestQuery.listId === 'string' &&
    hasPermission(sessionUser, 'attendance.callOuts.canView')
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
