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
    const callOutLists: CallOutList[][] = []

    // listIds = 1|2,3,4,5|6,7,8

    const callOutListIdsInColumnGroups = requestQuery.listIds.split(',')

    for (const callOutListIdsColumn of callOutListIdsInColumnGroups) {
      const callOutListsColumn: CallOutList[] = []

      const callOutListIds = callOutListIdsColumn.split('|')

      for (const callOutListId of callOutListIds) {
        const callOutList = await getCallOutList(callOutListId)

        if (callOutList !== undefined) {
          callOutList.callOutListMembers = await getCallOutListMembers(
            {
              listId: callOutListId
            },
            {
              includeSortKeyFunction: true
            }
          )

          callOutListsColumn.push(callOutList)
        }
      }

      callOutLists.push(callOutListsColumn)
    }

    reportData.callOutLists = callOutLists
  }

  return reportData
}
