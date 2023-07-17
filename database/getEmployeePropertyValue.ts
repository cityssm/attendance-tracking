import * as sqlPool from '@cityssm/mssql-multi-pool'
import type { IResult } from 'mssql'

import { getConfigProperty } from '../helpers/functions.config.js'

export async function getEmployeePropertyValue(
  employeeNumber: string,
  propertyName: string
): Promise<string | undefined> {
  const pool = await sqlPool.connect(getConfigProperty('mssql'))

  const propertyResult: IResult<{ propertyValue: string }> = await pool
    .request()
    .input('employeeNumber', employeeNumber)
    .input('propertyName', propertyName).query(`select
        propertyValue
      from MonTY.EmployeeProperties
      where employeeNumber = @employeeNumber
        and propertyName = @propertyName
        and recordDelete_dateTime is null`)

  if (propertyResult.recordset.length === 0) {
    return undefined
  }

  return propertyResult.recordset[0].propertyValue ?? ''
}
