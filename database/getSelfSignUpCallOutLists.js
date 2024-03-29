import { connect as sqlPoolConnect } from '@cityssm/mssql-multi-pool';
import { getConfigProperty } from '../helpers/functions.config.js';
export async function getSelfSignUpCallOutLists(filters = {}) {
    const pool = await sqlPoolConnect(getConfigProperty('mssql'));
    let request = pool.request();
    let sql = `select l.listId, l.listName, l.listDescription,
    l.eligibilityFunction, l.employeePropertyName,
    cast (case when selfSignUpKey is null or selfSignUpKey = '' then 0 else 1 end as bit) as hasSelfSignUpKey
    from MonTY.CallOutLists l
    where l.recordDelete_dateTime is null
    and l.allowSelfSignUp = 1`;
    if (Object.hasOwn(filters, 'hasEmployeeNumber')) {
        sql +=
            ' and l.listId in (select listId from MonTY.CallOutListMembers where employeeNumber = @hasEmployeeNumber and recordDelete_dateTime is null)';
        request = request.input('hasEmployeeNumber', filters.hasEmployeeNumber);
    }
    if (Object.hasOwn(filters, 'doesNotHaveEmployeeNumber')) {
        sql +=
            ' and l.listId not in (select listId from MonTY.CallOutListMembers where employeeNumber = @doesNotHaveEmployeeNumber and recordDelete_dateTime is null)';
        request = request.input('doesNotHaveEmployeeNumber', filters.doesNotHaveEmployeeNumber);
    }
    sql += ' order by l.listName';
    const results = await request.query(sql);
    return results.recordset;
}
