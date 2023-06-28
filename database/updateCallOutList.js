import * as sqlPool from '@cityssm/mssql-multi-pool';
import * as configFunctions from '../helpers/functions.config.js';
import { updateCallOutListMemberSortKeys } from './updateCallOutListMemberSortKeys.js';
export async function updateCallOutList(callOutList, sessionUser) {
    const pool = await sqlPool.connect(configFunctions.getProperty('mssql'));
    const result = await pool
        .request()
        .input('listName', callOutList.listName)
        .input('listDescription', callOutList.listDescription)
        .input('allowSelfSignUp', callOutList.allowSelfSignUp)
        .input('selfSignUpKey', callOutList.selfSignUpKey)
        .input('sortKeyFunction', callOutList.sortKeyFunction)
        .input('eligibilityFunction', callOutList.eligibilityFunction)
        .input('employeePropertyName', callOutList.employeePropertyName)
        .input('record_userName', sessionUser.userName)
        .input('record_dateTime', new Date())
        .input('listId', callOutList.listId).query(`update MonTY.CallOutLists
      set listName = @listName,
        listDescription = @listDescription,
        allowSelfSignUp = @allowSelfSignUp,
        selfSignUpKey = @selfSignUpKey,
        sortKeyFunction = @sortKeyFunction,
        eligibilityFunction = @eligibilityFunction,
        employeePropertyName = @employeePropertyName,
        recordUpdate_userName = @record_userName,
        recordUpdate_dateTime = @record_dateTime
      output
        case when inserted.sortKeyFunction = deleted.sortKeyFunction then 0 else 1 end as sortKeyFunctionChanged,
        case when inserted.eligibilityFunction = deleted.eligibilityFunction then 0 else 1 end as eligibilityFunctionChanged,
        case when inserted.employeePropertyName = deleted.employeePropertyName then 0 else 1 end as employeePropertyNameOld
      where listId = @listId
        and recordDelete_dateTime is null`);
    if (result.recordset[0].sortKeyFunctionChanged === 1 ||
        result.recordset[0].employeePropertyNameChanged === 1) {
        await updateCallOutListMemberSortKeys({
            listId: callOutList.listId
        }, sessionUser);
    }
    return {
        success: result.rowsAffected[0] > 0,
        sortKeyFunctionChanged: result.recordset[0].sortKeyFunctionChanged === 1,
        eligibilityFunctionChanged: result.recordset[0].eligibilityFunctionChanged === 1
    };
}
