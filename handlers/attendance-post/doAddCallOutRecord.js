import { addCallOutRecord } from '../../database/addCallOutRecord.js';
import { getCallOutRecords } from '../../database/getCallOutRecords.js';
export async function handler(request, response) {
    const recordId = await addCallOutRecord(request.body, request.session.user);
    const callOutRecords = await getCallOutRecords({
        listId: request.body.listId,
        employeeNumber: request.body.employeeNumber,
        recentOnly: true
    });
    const responseJson = {
        success: true,
        recordId,
        callOutRecords
    };
    response.json(responseJson);
}
export default handler;
