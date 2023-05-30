import { moveRecordDown, moveRecordDownToBottom } from '../../database/moveRecord.js';
import { getAbsenceTypes } from '../../helpers/functions.cache.js';
export async function handler(request, response) {
    const success = request.body.moveToEnd === '1'
        ? await moveRecordDownToBottom('AbsenceTypes', request.body.absenceTypeKey)
        : await moveRecordDown('AbsenceTypes', request.body.absenceTypeKey);
    const absenceTypes = await getAbsenceTypes();
    response.json({
        success,
        absenceTypes
    });
}
export default handler;
