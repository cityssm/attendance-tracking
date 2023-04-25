export async function handler(_request, response) {
    response.render('attendance', {
        headTitle: 'Employee Attendnace'
    });
}
export default handler;
