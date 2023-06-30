import * as assert from 'node:assert';
import { getReportData } from '../database/getReportData.js';
const reports = [
    {
        reportName: 'employees-all'
    },
    {
        reportName: 'employees-contacts'
    },
    {
        reportName: 'employees-inactive'
    },
    {
        reportName: 'absenceRecords-all'
    },
    {
        reportName: 'absenceRecords-recent'
    },
    {
        reportName: 'absenceRecords-recent-byEmployeeNumber',
        reportParameters: {
            employeeNumber: '12345'
        }
    },
    {
        reportName: 'historicalAbsenceRecords-all'
    },
    {
        reportName: 'absenceTypes-all'
    },
    {
        reportName: 'absenceTypes-active'
    },
    {
        reportName: 'returnToWorkRecords-all'
    },
    {
        reportName: 'returnToWorkRecords-recent'
    },
    {
        reportName: 'returnToWorkRecords-recent-byEmployeeNumber',
        reportParameters: {
            employeeNumber: '12345'
        }
    },
    {
        reportName: 'historicalReturnToWorkRecords-all'
    },
    {
        reportName: 'callOutListMembers-formatted'
    },
    {
        reportName: 'callOutListMembers-formatted-byListId',
        reportParameters: {
            listId: 1
        }
    },
    {
        reportName: 'callOutRecords-all'
    },
    {
        reportName: 'callOutRecords-recent'
    },
    {
        reportName: 'callOutRecords-recent-byListId',
        reportParameters: {
            listId: 1
        }
    },
    {
        reportName: 'callOutRecords-recent-byEmployeeNumber',
        reportParameters: {
            employeeNumber: '12345'
        }
    },
    {
        reportName: 'historicalCallOutRecords-all'
    },
    {
        reportName: 'callOutResponseTypes-all'
    },
    {
        reportName: 'callOutResponseTypes-active'
    },
    {
        reportName: 'afterHoursRecords-all'
    },
    {
        reportName: 'afterHoursRecords-recent'
    },
    {
        reportName: 'afterHoursRecords-recent-byEmployeeNumber',
        reportParameters: {
            employeeNumber: '12345'
        }
    },
    {
        reportName: 'historicalAfterHoursRecords-all'
    },
    {
        reportName: 'afterHoursReasons-all'
    },
    {
        reportName: 'afterHoursReasons-active'
    }
];
describe('database/getReportData', () => {
    for (const report of reports) {
        it(`Exports "${report.reportName}"`, async () => {
            const data = await getReportData(report.reportName, report.reportParameters ?? {});
            assert.ok(data);
        });
    }
    it('Fails gracefully when missing parameter object', async () => {
        const data = (await getReportData('absenceRecords-recent-byEmployeeNumber'));
        assert.strictEqual(data.length, 0);
    });
    it('Fails gracefully when missing parameter', async () => {
        const data = (await getReportData('absenceRecords-recent-byEmployeeNumber', {}));
        assert.strictEqual(data.length, 0);
    });
    it('Returns undefined on unknown reports', async () => {
        const data = await getReportData('qwertyuiop');
        assert.strictEqual(data, undefined);
    });
});
