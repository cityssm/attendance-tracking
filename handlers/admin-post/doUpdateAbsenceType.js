import { updateAbsenceType } from '../../database/updateAbsenceType.js';
export async function handler(request, response) {
    const success = await updateAbsenceType(request.body, request.session.user);
    response.json({
        success
    });
}
export default handler;
