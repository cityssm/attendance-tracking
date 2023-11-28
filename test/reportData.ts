import assert from 'node:assert'

import { getReportData } from '../database/getReportData.js'

interface ReportData {
  reportName: string
  reportParameters?: Record<string, string | number>
}

const reports: ReportData[] = [
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
]

const testUser: MonTYUser = {
  userName: '~~testUser',
  canLogin: true,
  isAdmin: false,
  permissions: {
    'reports.hasRawExports': 'true',
    'attendance.absences.canView': 'true',
    'attendance.afterHours.canView': 'true',
    'attendance.callOuts.canView': 'true',
    'attendance.returnsToWork.canView': 'true'
  }
}

describe('database/getReportData.js', () => {
  for (const report of reports) {
    it(`Exports "${report.reportName}"`, async () => {
      const data = await getReportData(
        report.reportName,
        report.reportParameters ?? {},
        testUser
      )

      assert.ok(data)
    })
  }

  it('Fails gracefully when missing parameter object', async () => {
    const data = (await getReportData(
      'absenceRecords-recent-byEmployeeNumber',
      undefined,
      testUser
    )) as unknown[]
    assert.strictEqual(data.length, 0)
  })

  it('Fails gracefully when missing parameter', async () => {
    const data = (await getReportData(
      'absenceRecords-recent-byEmployeeNumber',
      {},
      testUser
    )) as unknown[]
    assert.strictEqual(data.length, 0)
  })

  it('Returns undefined on unknown reports', async () => {
    const data = await getReportData('qwertyuiop', {}, testUser)
    assert.strictEqual(data, undefined)
  })
})
