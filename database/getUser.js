import * as configFunctions from '../helpers/functions.config.js';
import * as sqlPool from '@cityssm/mssql-multi-pool';
export async function getUser(userName) {
    const pool = await sqlPool.connect(configFunctions.getProperty('mssql'));
    const userResult = await pool
        .request()
        .input('userName', userName).query(`SELECT top 1
      userName,
      canLogin, canUpdate, isAdmin
      FROM Monty.Users
      where userName = @userName
      and recordDelete_dateTime is null`);
    if (userResult.recordset.length > 0) {
        const user = userResult.recordset[0];
        return user;
    }
}
