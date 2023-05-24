import * as configFunctions from '../helpers/functions.config.js'

import * as sqlPool from '@cityssm/mssql-multi-pool'
import type { IResult } from 'mssql'

import type { EmployeeProperty } from '../types/recordTypes.js'

export async function getEmployeeProperties(
  employeeNumber: string
): Promise<EmployeeProperty[]> {
  const pool = await sqlPool.connect(configFunctions.getProperty('mssql'))

  const propertyResult: IResult<EmployeeProperty> = await pool
    .request()
    .input('employeeNumber', employeeNumber).query(`select
      propertyName, propertyValue, isSynced
      from MonTY.EmployeeProperties
      where employeeNumber = @employeeNumber
      and recordDelete_dateTime is null`)

  return propertyResult.recordset
}
