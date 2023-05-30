import * as sqlPool from '@cityssm/mssql-multi-pool'
import type { IResult } from 'mssql'

import * as configFunctions from '../helpers/functions.config.js'
import type * as recordTypes from '../types/recordTypes'

import { getEmployee } from './getEmployee.js'

export async function addCallOutListMember(
  listId: string,
  employeeNumber: string,
  requestSession: recordTypes.PartialSession
): Promise<boolean> {
  const pool = await sqlPool.connect(configFunctions.getProperty('mssql'))

  let result: IResult<{
    sortKeyFunction: string
    employeePropertyName: string
  }> = await pool.request().input('listId', listId)
    .query(`select sortKeyFunction, employeePropertyName
      from MonTY.CallOutLists
      where listId = @listId`)

  if (result.recordset.length === 0) {
    return false
  }

  let sortKey = ''

  if ((result.recordset[0].sortKeyFunction ?? '') !== '') {
    const employee = await getEmployee(employeeNumber)

    const sortKeyFunction = configFunctions
      .getProperty('settings.employeeSortKeyFunctions')
      .find((possibleFunction) => {
        return (
          possibleFunction.functionName === result.recordset[0].sortKeyFunction
        )
      })

    if (sortKeyFunction !== undefined) {
      sortKey =
        sortKeyFunction.sortKeyFunction(
          employee!,
          result.recordset[0].employeePropertyName
        ) ?? ''
    }
  }

  result = await pool
    .request()
    .input('sortKey', sortKey)
    .input('record_userName', requestSession.user?.userName)
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

  if (result.rowsAffected[0] === 0) {
    result = await pool
      .request()
      .input('listId', listId)
      .input('employeeNumber', employeeNumber)
      .input('sortKey', sortKey)
      .input('isNext', 0)
      .input('record_userName', requestSession.user?.userName)
      .input('record_dateTime', new Date())
      .query(`insert into MonTY.CallOutListMembers
        (listId, employeeNumber, sortKey, isNext,
          recordCreate_userName, recordCreate_dateTime, recordUpdate_userName, recordUpdate_dateTime)
        values (@listId, @employeeNumber, @sortKey, @isNext,
          @record_userName, @record_dateTime, @record_userName, @record_dateTime)`)
  }

  return result.rowsAffected[0] > 0
}
