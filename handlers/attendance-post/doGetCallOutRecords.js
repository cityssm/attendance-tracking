import { getCallOutRecords } from '../../database/getCallOutRecords.js';
export async function handler(request, response) {
    const callOutRecords = await getCallOutRecords({
        employeeNumber: request.body.employeeNumber,
        recentOnly: true
    });
    const responseJson = {
        callOutRecords
    };
    response.json(responseJson);
}
export default handler;
