import * as sqlPool from '@cityssm/mssql-multi-pool';
import { getConfigProperty } from '../helpers/functions.config.js';
export async function getCallOutLists(filters, sessionUser) {
    const pool = await sqlPool.connect(getConfigProperty('mssql'));
    const request = pool.request();
    let sql = `select l.listId, l.listName, l.listDescription,
    l.allowSelfSignUp, l.selfSignUpKey,
    l.sortKeyFunction, l.eligibilityFunction, l.employeePropertyName,
    cast (case when f.userName is not null then 1 else 0 end as bit) as isFavourite,
    count(m.employeeNumber) as callOutListMembersCount
    from MonTY.CallOutLists l
    ${filters.favouriteOnly ? 'inner' : 'left'} join MonTY.FavouriteCallOutLists f
      on l.listId = f.listId and f.userName = @userName
    left join MonTY.CallOutListMembers m
      on l.listId = m.listId
      and m.recordDelete_dateTime is null
      and m.employeeNumber in (select employeeNumber from MonTY.Employees where isActive = 1 and recordDelete_dateTime is null)
    where l.recordDelete_dateTime is null`;
    if (Object.hasOwn(filters, 'allowSelfSignUp')) {
        sql += ' and allowSelfSignUp = ' + (filters.allowSelfSignUp ? '1' : '0');
    }
    sql =
        sql +
            ` group by l.listId, l.listName, l.listDescription,
        l.allowSelfSignUp, l.selfSignUpKey,
        l.sortKeyFunction, l.eligibilityFunction, l.employeePropertyName, f.userName
      order by isFavourite desc, listName`;
    const results = await request
        .input('userName', sessionUser.userName)
        .query(sql);
    return results.recordset;
}
