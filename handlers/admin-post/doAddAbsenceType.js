import { addAbsenceType } from '../../database/addAbsenceType.js';
import { getAbsenceTypes } from '../../helpers/functions.cache.js';
export async function handler(request, response) {
    const absenceTypeKey = await addAbsenceType(request.body, request.session.user);
    const absenceTypes = await getAbsenceTypes();
    const responseJson = {
        success: true,
        absenceTypeKey,
        absenceTypes
    };
    response.json(responseJson);
}
export default handler;
