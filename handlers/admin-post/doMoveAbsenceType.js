import { moveRecordDown, moveRecordDownToBottom, moveRecordUp, moveRecordUpToTop } from '../../database/moveRecord.js';
import { getAbsenceTypes } from '../../helpers/functions.cache.js';
export async function doMoveAbsenceTypeDownHandler(request, response) {
    const success = request.body.moveToEnd === '1'
        ? await moveRecordDownToBottom('AbsenceTypes', request.body.absenceTypeKey)
        : await moveRecordDown('AbsenceTypes', request.body.absenceTypeKey);
    const absenceTypes = await getAbsenceTypes();
    const responseJson = {
        success,
        absenceTypes
    };
    response.json(responseJson);
}
export async function doMoveAbsenceTypeUpHandler(request, response) {
    const success = request.body.moveToEnd === '1'
        ? await moveRecordUpToTop('AbsenceTypes', request.body.absenceTypeKey)
        : await moveRecordUp('AbsenceTypes', request.body.absenceTypeKey);
    const absenceTypes = await getAbsenceTypes();
    const responseJson = {
        success,
        absenceTypes
    };
    response.json(responseJson);
}
