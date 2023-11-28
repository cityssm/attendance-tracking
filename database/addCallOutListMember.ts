import { connect as sqlPoolConnect } from '@cityssm/mssql-multi-pool'
import type { IResult } from 'mssql'

import { getConfigProperty } from '../helpers/functions.config.js'

import { getEmployee } from './getEmployee.js'

export async function addCallOutListMember(
  listId: string,
  employeeNumber: string,
  sessionUser: AttendUser
): Promise<boolean> {
  const pool = await sqlPoolConnect(getConfigProperty('mssql'))

  const sortKeyResult: IResult<{
    sortKeyFunction: string
    employeePropertyName: string
  }> = await pool.request().input('listId', listId)
    .query(`select sortKeyFunction, employeePropertyName
      from MonTY.CallOutLists
      where listId = @listId`)

  if (sortKeyResult.recordset.length === 0) {
    return false
  }

  let sortKey = ''

  if ((sortKeyResult.recordset[0].sortKeyFunction ?? '') !== '') {
    const employee = await getEmployee(employeeNumber)

    const sortKeyFunction = getConfigProperty(
      'settings.employeeSortKeyFunctions'
    ).find((possibleFunction) => {
      return (
        possibleFunction.functionName ===
        sortKeyResult.recordset[0].sortKeyFunction
      )
    })

    if (sortKeyFunction !== undefined && employee !== undefined) {
      sortKey =
        sortKeyFunction.sortKeyFunction(
          employee,
          sortKeyResult.recordset[0].employeePropertyName
        ) ?? ''
    }
  }

  let employeeResult = await pool
    .request()
    .input('sortKey', sortKey)
    .input('record_userName', sessionUser.userName)
    .input('record_dateTime', new Date())
    .input('listId', listId)
    .input('employeeNumber', employeeNumber)
    .query(`update MonTY.CallOutListMembers
      set sortKey = @sortKey,
      recordUpdate_userName = @record_userName,
      recordUpdate_dateTime = @record_dateTime,
      recordDelete_userName = null,
      recordDelete_dateTime = null
      where listId = @listId
      and employeeNumber = @employeeNumber`)

  if (employeeResult.rowsAffected[0] === 0) {
    employeeResult = await pool
      .request()
      .input('listId', listId)
      .input('employeeNumber', employeeNumber)
      .input('sortKey', sortKey)
      .input('isNext', 0)
      .input('record_userName', sessionUser.userName)
      .input('record_dateTime', new Date())
      .query(`insert into MonTY.CallOutListMembers
        (listId, employeeNumber, sortKey, isNext,
          recordCreate_userName, recordCreate_dateTime, recordUpdate_userName, recordUpdate_dateTime)
        values (@listId, @employeeNumber, @sortKey, @isNext,
          @record_userName, @record_dateTime, @record_userName, @record_dateTime)`)
  }

  return employeeResult.rowsAffected[0] > 0
}
