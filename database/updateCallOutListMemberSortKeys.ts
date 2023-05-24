import '../helpers/polyfills.js'

import * as configFunctions from '../helpers/functions.config.js'

import * as sqlPool from '@cityssm/mssql-multi-pool'

import { getCallOutListMembers } from './getCallOutListMembers.js'

import type * as recordTypes from '../types/recordTypes.js'
import { getEmployeeProperties } from './getEmployeeProperties.js'

interface CallOutListMemberFilters {
  listId?: string
  employeeNumber?: string
}

export async function updateCallOutListMemberSortKeys(
  filters: CallOutListMemberFilters,
  requestSession: recordTypes.PartialSession
): Promise<number> {
  const callOutListMembers = await getCallOutListMembers(filters, {
    includeSortKeyFunction: true
  })

  const pool = await sqlPool.connect(configFunctions.getProperty('mssql'))

  let updateCount = 0

  for (const member of callOutListMembers) {
    const sortKeyFunctionName = (member.sortKeyFunction ?? '').toLowerCase()

    const sortKeyFunction = configFunctions
      .getProperty('settings.employeeSortKeyFunctions')
      .find((possibleFunction) => {
        return (
          possibleFunction.functionName.toLowerCase() === sortKeyFunctionName
        )
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
        .input('record_userName', requestSession.user?.userName)
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
