import * as configFunctions from '../helpers/functions.config.js';
import * as sqlPool from '@cityssm/mssql-multi-pool';
export async function setEmployeeProperty(employeeProperty, requestSession) {
    const pool = await sqlPool.connect(configFunctions.getProperty('mssql'));
    let result = await pool
        .request()
        .input('propertyValue', employeeProperty.propertyValue)
        .input('record_userName', requestSession.user?.userName)
        .input('record_dateTime', new Date())
        .input('employeeNumber', employeeProperty.employeeNumber)
        .input('propertyName', employeeProperty.propertyName)
        .query(`update MonTY.EmployeeProperties
      set propertyValue = @propertyValue,
      recordUpdate_userName = @record_userName,
      recordUpdate_dateTime = @record_dateTime,
      recordDelete_userName = null,
      recordDelete_dateTime = null
      where employeeNumber = @employeeNumber
      and propertyName = @propertyName`);
    if (result.rowsAffected[0] === 0) {
        result = await pool
            .request()
            .input('employeeNumber', employeeProperty.employeeNumber)
            .input('propertyName', employeeProperty.propertyName)
            .input('propertyValue', employeeProperty.propertyValue)
            .input('record_userName', requestSession.user?.userName)
            .input('record_dateTime', new Date())
            .query(`insert into MonTY.EmployeeProperties
        (employeeNumber, propertyName, propertyValue,
          recordCreate_userName, recordCreate_dateTime, recordUpdate_userName, recordUpdate_dateTime)
        values (@employeeNumber, @propertyName, @propertyValue,
          @record_userName, @record_dateTime, @record_userName, @record_dateTime)`);
    }
    return result.rowsAffected[0] > 0;
}
