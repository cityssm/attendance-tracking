import path from 'node:path'

import type { ServiceConfig } from 'node-windows'

const _dirname = '.'

export const serviceConfig: ServiceConfig = {
  name: 'Attendance Tracking',
  description: 'Track Your Employee Absences, Call Outs, and more!',
  script: path.join(_dirname, 'bin', 'www.js')
}
