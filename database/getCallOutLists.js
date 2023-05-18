import * as configFunctions from '../helpers/functions.config.js';
import * as sqlPool from '@cityssm/mssql-multi-pool';
export async function getCallOutLists(filters, requestSession) {
    const pool = await sqlPool.connect(configFunctions.getProperty('mssql'));
    const propertyResult = await pool
        .request()
        .input('userName', requestSession.user.userName)
        .query(`select l.listId, l.listName, l.listDescription,
      l.sortKeyFunction, l.eligibilityFunction, l.employeePropertyName,
      cast (case when f.userName is not null then 1 else 0 end as bit) as isFavourite,
      count(m.employeeNumber) as callOutListMembersCount
      from MonTY.CallOutLists l
      left join MonTY.FavouriteCallOutLists f on l.listId = f.listId and f.userName = @userName
      left join MonTY.CallOutListMembers m
        on l.listId = m.listId
        and m.recordDelete_dateTime is null
        and m.employeeNumber in (select employeeNumber from MonTY.Employees where isActive = 1 and recordDelete_dateTime is null)
      where l.recordDelete_dateTime is null
      group by l.listId, l.listName, l.listDescription,
        l.sortKeyFunction, l.eligibilityFunction, l.employeePropertyName, f.userName
      order by isFavourite desc, listName`);
    return propertyResult.recordset;
}
