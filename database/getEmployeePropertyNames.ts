import * as configFunctions from '../helpers/functions.config.js'

import * as sqlPool from '@cityssm/mssql-multi-pool'
import type { IResult } from 'mssql'

export async function getEmployeePropertyNames(): Promise<string[]> {
  const pool = await sqlPool.connect(configFunctions.getProperty('mssql'))

  const propertyResult: IResult<{ propertyName: string }> = await pool.request()
    .query(`select
      distinct propertyName
      from MonTY.EmployeeProperties
      where recordDelete_dateTime is null
      order by propertyName`)

  const propertyNames: string[] = []

  for (const record of propertyResult.recordset) {
    propertyNames.push(record.propertyName)
  }

  return propertyNames
}
