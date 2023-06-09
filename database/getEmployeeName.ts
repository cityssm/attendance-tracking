import * as sqlPool from '@cityssm/mssql-multi-pool'
import type { IResult } from 'mssql'

import * as configFunctions from '../helpers/functions.config.js'
import type { Employee } from '../types/recordTypes.js'

export async function getEmployeeName(
  employeeNumberEnd: string,
  homeContactEnd: string
): Promise<string | undefined> {
  const pool = await sqlPool.connect(configFunctions.getProperty('mssql'))

  const employeeResult: IResult<Employee> = await pool
    .request()
    .input('employeeNumberEnd', employeeNumberEnd)
    .input('homeContactEnd', homeContactEnd).query(`select
      employeeSurname, employeeGivenName
      from MonTY.Employees
      where employeeNumber like '%' + @employeeNumberEnd
      and (homeContact1 like '%' + @homeContactEnd or homeContact2 like '%' + @homeContactEnd)
      and isActive = 1
      and recordDelete_dateTime is null`)

  if (employeeResult.recordset.length > 0) {
    return (
      employeeResult.recordset[0].employeeSurname +
      ', ' +
      employeeResult.recordset[0].employeeGivenName
    )
  }

  return undefined
}
