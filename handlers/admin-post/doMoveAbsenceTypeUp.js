import { moveRecordUp, moveRecordUpToTop } from '../../database/moveRecord.js';
import { getAbsenceTypes } from '../../helpers/functions.cache.js';
export async function handler(request, response) {
    const success = request.body.moveToEnd === '1'
        ? await moveRecordUpToTop('AbsenceTypes', request.body.absenceTypeKey)
        : await moveRecordUp('AbsenceTypes', request.body.absenceTypeKey);
    const absenceTypes = await getAbsenceTypes();
    response.json({
        success,
        absenceTypes
    });
}
export default handler;
