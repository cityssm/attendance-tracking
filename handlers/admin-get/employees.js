import { getEmployees } from '../../database/getEmployees.js';
import { getEmployeePropertyNames } from '../../database/getEmployeePropertyNames.js';
export async function handler(request, response) {
    const employees = await getEmployees({
        isActive: 'all'
    }, {
        orderBy: 'name'
    });
    const employeePropertyNames = await getEmployeePropertyNames();
    response.render('admin.employees.ejs', {
        headTitle: 'Employee Maintenance',
        employees,
        employeePropertyNames
    });
}
export default handler;
