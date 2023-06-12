import * as sqlPool from '@cityssm/mssql-multi-pool'
import type { IResult } from 'mssql'

import * as configFunctions from '../helpers/functions.config.js'
import type { Employee } from '../types/recordTypes.js'

interface ValidatedEmployee {
  employeeNumber: string
  employeeSurname: string
  employeeGivenName: string
}

export async function getValidatedEmployee(
  employeeNumberEnd: string,
  homeContactEnd: string
): Promise<ValidatedEmployee | undefined> {
  const pool = await sqlPool.connect(configFunctions.getProperty('mssql'))

  const employeeResult: IResult<Employee> = await pool
    .request()
    .input('employeeNumberEnd', employeeNumberEnd)
    .input('homeContactEnd', homeContactEnd).query(`select
      employeeNumber, employeeSurname, employeeGivenName
      from MonTY.Employees
      where employeeNumber like '%' + @employeeNumberEnd
      and (homeContact1 like '%' + @homeContactEnd or homeContact2 like '%' + @homeContactEnd)
      and isActive = 1
      and recordDelete_dateTime is null`)

  if (employeeResult.recordset.length === 1) {
    return {
      employeeNumber: employeeResult.recordset[0].employeeNumber,
      employeeSurname: employeeResult.recordset[0].employeeSurname,
      employeeGivenName: employeeResult.recordset[0].employeeGivenName
    }
  }

  return undefined
}
