import { updateAbsenceType } from '../../database/updateAbsenceType.js';
export async function handler(request, response) {
    const success = await updateAbsenceType(request.body, request.session.user);
    const responseJson = {
        success
    };
    response.json(responseJson);
}
export default handler;
