import * as sqlPool from '@cityssm/mssql-multi-pool'
import type { IResult } from 'mssql'

import { getConfigProperty } from '../helpers/functions.config.js'
import type { CallOutList } from '../types/recordTypes.js'

export async function getCallOutList(
  listId: string
): Promise<CallOutList | undefined> {
  const pool = await sqlPool.connect(getConfigProperty('mssql'))

  const listResult: IResult<CallOutList> = await pool
    .request()
    .input('listId', listId)
    .query(`select l.listId, l.listName, l.listDescription,
      l.allowSelfSignUp, l.selfSignUpKey,
      l.sortKeyFunction, l.eligibilityFunction, l.employeePropertyName,
      count(m.employeeNumber) as callOutListMembersCount
      from MonTY.CallOutLists l
      left join MonTY.CallOutListMembers m
        on l.listId = m.listId
        and m.recordDelete_dateTime is null
        and m.employeeNumber in (select employeeNumber from MonTY.Employees where isActive = 1 and recordDelete_dateTime is null)
      where l.recordDelete_dateTime is null
      and l.listId = @listId
      group by l.listId, l.listName, l.listDescription,
        l.allowSelfSignUp, l.selfSignUpKey,
        l.sortKeyFunction, l.eligibilityFunction, l.employeePropertyName`)

  if (listResult.recordset.length > 0) {
    return listResult.recordset[0]
  }

  return undefined
}
