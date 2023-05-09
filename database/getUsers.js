import * as configFunctions from '../helpers/functions.config.js';
import * as sqlPool from '@cityssm/mssql-multi-pool';
export async function getUsers() {
    const pool = await sqlPool.connect(configFunctions.getProperty('mssql'));
    const userResult = await pool.request().query(`select
    userName, canLogin, isAdmin
    from MonTY.Users
    where recordDelete_dateTime is null`);
    return userResult.recordset;
}
