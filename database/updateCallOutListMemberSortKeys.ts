import { connect as sqlPoolConnect } from '@cityssm/mssql-multi-pool'

import { getConfigProperty } from '../helpers/functions.config.js'

import { getCallOutListMembers } from './getCallOutListMembers.js'
import { getEmployeeProperties } from './getEmployeeProperties.js'

interface CallOutListMemberFilters {
  listId?: string
  employeeNumber?: string
}

export async function updateCallOutListMemberSortKeys(
  filters: CallOutListMemberFilters,
  sessionUser: AttendUser
): Promise<number> {
  const callOutListMembers = await getCallOutListMembers(filters, {
    includeSortKeyFunction: true
  })

  const pool = await sqlPoolConnect(getConfigProperty('mssql'))

  let updateCount = 0

  for (const member of callOutListMembers) {
    const sortKeyFunctionName = (member.sortKeyFunction ?? '').toLowerCase()

    const sortKeyFunction = getConfigProperty(
      'settings.employeeSortKeyFunctions'
    ).find((possibleFunction) => {
      return possibleFunction.functionName.toLowerCase() === sortKeyFunctionName
    })

    let sortKey = ''

    if (sortKeyFunction !== undefined) {
      member.employeeProperties = await getEmployeeProperties(
        member.employeeNumber
      )

      sortKey = sortKeyFunction.sortKeyFunction(
        member,
        member.employeePropertyName
      )
    }

    if (sortKey !== member.sortKey) {
      const result = await pool
        .request()
        .input('sortKey', sortKey)
        .input('record_userName', sessionUser.userName)
        .input('record_dateTime', new Date())
        .input('listId', member.listId)
        .input('employeeNumber', member.employeeNumber)
        .query(`update MonTY.CallOutListMembers
          set sortKey = @sortKey,
          recordUpdate_userName = @record_userName,
          recordUpdate_dateTime = @record_dateTime
          where listId = @listId
          and employeeNumber = @employeeNumber`)

      if (result.rowsAffected[0] > 0) {
        updateCount += 1
      }
    }
  }

  return updateCount
}
