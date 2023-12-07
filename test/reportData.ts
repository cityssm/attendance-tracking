import assert from 'node:assert'

import { manageUser } from '../data/temporaryUsers.js'
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

describe('database/getReportData.js', () => {
  for (const report of reports) {
    it(`Exports "${report.reportName}"`, async () => {
      const data = await getReportData(
        report.reportName,
        report.reportParameters ?? {},
        manageUser
      )

      assert.ok(data)
    })
  }

  it('Fails gracefully when missing parameter', async () => {
    const data = (await getReportData(
      'absenceRecords-recent-byEmployeeNumber',
      {},
      manageUser
    )) as unknown[]
    assert.strictEqual(data.length, 0)
  })

  it('Returns undefined on unknown reports', async () => {
    const data = await getReportData('qwertyuiop', {}, manageUser)
    assert.strictEqual(data, undefined)
  })
})
