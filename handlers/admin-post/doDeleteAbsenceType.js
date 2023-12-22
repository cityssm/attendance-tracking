import { deleteAbsenceType } from '../../database/deleteAbsenceType.js';
import { getAbsenceTypes } from '../../helpers/functions.cache.js';
export async function handler(request, response) {
    const success = await deleteAbsenceType(request.body.absenceTypeKey, request.session.user);
    const absenceTypes = await getAbsenceTypes();
    const responseJson = {
        success,
        absenceTypes
    };
    response.json(responseJson);
}
export default handler;
