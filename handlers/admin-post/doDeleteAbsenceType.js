import { deleteAbsenceType } from '../../database/deleteAbsenceType.js';
import { getAbsenceTypes } from '../../helpers/functions.cache.js';
export async function handler(request, response) {
    const success = await deleteAbsenceType(request.body.absenceTypeKey, request.session.user);
    const absenceTypes = await getAbsenceTypes();
    response.json({
        success,
        absenceTypes
    });
}
export default handler;
