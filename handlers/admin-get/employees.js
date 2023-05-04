export async function handler(request, response) {
    response.render('admin.employees.ejs', {
        headTitle: 'Employee Maintenance'
    });
}
export default handler;
