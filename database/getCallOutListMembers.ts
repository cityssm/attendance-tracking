import '../helpers/polyfills.js'

import * as configFunctions from '../helpers/functions.config.js'

import * as sqlPool from '@cityssm/mssql-multi-pool'
import type { IResult } from 'mssql'

import type { CallOutListMember } from '../types/recordTypes'

interface CallOutListMemberFilters {
  listId?: string
  employeeNumber?: string
}

interface CallOutListMemberOptions {
  includeSortKeyFunction?: boolean
}

export async function getCallOutListMembers(
  filters: CallOutListMemberFilters,
  options: CallOutListMemberOptions
): Promise<CallOutListMember[]> {
  const pool = await sqlPool.connect(configFunctions.getProperty('mssql'))

  let request = pool.request()

  let sql = `select m.listId, m.employeeNumber,
    m.sortKey,
    ${options.includeSortKeyFunction ?? false ? ' l.sortKeyFunction, l.employeePropertyName,' : ''}
    e.employeeSurname, e.employeeGivenName,
    e.workContact1, e.workContact2, e.homeContact1, e.homeContact2,
    e.jobTitle, e.department,
    e.seniorityDateTime
    from MonTY.CallOutListMembers m
    left join MonTY.Employees e on m.employeeNumber = e.employeeNumber
    ${
      options.includeSortKeyFunction ?? false
        ? ' left join MonTY.CallOutLists l on m.listId = l.listId'
        : ''
    }
    where m.recordDelete_dateTime is null
    and e.isActive = 1
    and e.recordDelete_dateTime is null`

  if ((filters.listId ?? '') !== '') {
    sql += ' and m.listId = @listId'
    request = request.input('listId', filters.listId)
  }

  if ((filters.employeeNumber ?? '') !== '') {
    sql += ' and m.employeeNumber = @employeeNumber'
    request = request.input('employeeNumber', filters.employeeNumber)
  }

  sql += ' order by m.sortKey, m.employeeNumber'

  const propertyResult: IResult<CallOutListMember> = await request.query(sql)

  return propertyResult.recordset
}