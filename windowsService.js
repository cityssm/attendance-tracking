import path from 'node:path';
const _dirname = '.';
export const serviceConfig = {
    name: 'Attendance Tracking',
    description: 'Track Your Employee Absences, Call Outs, and more!',
    script: path.join(_dirname, 'bin', 'www.js')
};
