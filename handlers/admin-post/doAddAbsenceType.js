import { addAbsenceType } from '../../database/addAbsenceType.js';
import { getAbsenceTypes } from '../../database/getAbsenceTypes.js';
export async function handler(request, response) {
    const absenceTypeKey = await addAbsenceType(request.body, request.session);
    const absenceTypes = await getAbsenceTypes();
    response.json({
        success: true,
        absenceTypeKey,
        absenceTypes
    });
}
export default handler;
