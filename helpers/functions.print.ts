import { getCallOutList } from '../database/getCallOutList.js'
import { getCallOutListMembers } from '../database/getCallOutListMembers.js'
import type { CallOutList } from '../types/recordTypes.js'

import { hasPermission } from './functions.permissions.js'

interface PrintConfig {
  title: string
  params: string[]
}

const screenPrintConfigs: Record<string, PrintConfig> = {
  callOutList: {
    title: 'Call Out List',
    params: ['listIds']
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
    printConfig.params.includes('listIds') &&
    typeof requestQuery.listIds === 'string' &&
    hasPermission(sessionUser, 'attendance.callOuts.canView')
  ) {
    const callOutLists: CallOutList[] = []

    const callOutListIds = requestQuery.listIds.split(',')

    for (const listId of callOutListIds) {
      const callOutList = await getCallOutList(listId)

      if (callOutList !== undefined) {
        callOutList.callOutListMembers = await getCallOutListMembers(
          {
            listId
          },
          {
            includeSortKeyFunction: true
          }
        )

        callOutLists.push(callOutList)
      }
    }

    reportData.callOutLists = callOutLists
  }

  return reportData
}
