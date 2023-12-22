import { deleteCallOutRecord } from '../../database/deleteCallOutRecord.js';
import { getCallOutRecords } from '../../database/getCallOutRecords.js';
export async function handler(request, response) {
    const success = await deleteCallOutRecord(request.body.recordId, request.session.user);
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
