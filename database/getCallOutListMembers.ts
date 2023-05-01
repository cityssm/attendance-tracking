import * as configFunctions from '../helpers/functions.config.js'

import * as sqlPool from '@cityssm/mssql-multi-pool'
import type { IResult } from 'mssql'

import type { CallOutListMember } from '../types/recordTypes'

export async function getCallOutListMembers(
  listId: string | number
): Promise<CallOutListMember[]> {
  const pool = await sqlPool.connect(configFunctions.getProperty('mssql'))

  const propertyResult: IResult<CallOutListMember> = await pool
    .request()
    .input('listId', listId).query(`select m.employeeNumber, m.sortKey,
      e.employeeSurname, e.employeeGivenName,
      e.workContact1, e.workContact2, e.homeContact1, e.homeContact2,
      e.jobTitle
      from MonTY.CallOutListMembers m
      left join MonTY.Employees e on m.employeeNumber = e.employeeNumber
      where m.listId = @listId
      and m.recordDelete_dateTime is null
      and e.isActive = 1
      and e.recordDelete_dateTime is null
      order by m.sortKey, m.employeeNumber`)

  return propertyResult.recordset
}
