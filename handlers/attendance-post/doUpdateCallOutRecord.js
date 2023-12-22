import { getCallOutRecords } from '../../database/getCallOutRecords.js';
import { updateCallOutRecord } from '../../database/updateCallOutRecord.js';
export async function handler(request, response) {
    const success = await updateCallOutRecord(request.body, request.session.user);
    const callOutRecords = await getCallOutRecords({
        listId: request.body.listId,
        employeeNumber: request.body.employeeNumber,
        recentOnly: true
    });
    const responseJson = {
        success,
        callOutRecords
    };
    response.json(responseJson);
}
export default handler;
