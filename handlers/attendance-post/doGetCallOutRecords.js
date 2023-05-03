import { getCallOutRecords } from '../../database/getCallOutRecords.js';
export async function handler(request, response) {
    const callOutRecords = await getCallOutRecords({
        listId: request.body.listId,
        employeeNumber: request.body.employeeNumber,
        recentOnly: true
    });
    response.json({
        callOutRecords
    });
}
export default handler;
