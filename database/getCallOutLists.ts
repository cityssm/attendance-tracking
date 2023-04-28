import * as configFunctions from '../helpers/functions.config.js'

import * as sqlPool from '@cityssm/mssql-multi-pool'
import type { IResult } from 'mssql'

import type { CallOutList } from '../types/recordTypes'

export async function getCallOutLists(): Promise<CallOutList[]> {
  const pool = await sqlPool.connect(configFunctions.getProperty('mssql'))

  const propertyResult: IResult<CallOutList> = await pool.request()
    .query(`select l.listId, l.listName, l.listDescription,
      l.sortKeyFunction, l.eligibilityFunction,
      count(m.employeeNumber) as callOutListMembersCount
      from MonTY.CallOutLists l
      left join MonTY.CallOutListMembers m
        on l.listId = m.listId
        and m.recordDelete_dateTime is null
        and m.employeeNumber in (select employeeNumber from MonTY.Employees where isActive = 1 and recordDelete_dateTime is null)
      where l.recordDelete_dateTime is null
      group by l.listId, l.listName, l.listDescription,
        l.sortKeyFunction, l.eligibilityFunction
      order by listName`)

  return propertyResult.recordset
}
