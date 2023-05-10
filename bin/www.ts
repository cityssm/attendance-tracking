import '../helpers/polyfills.js'

import cluster from 'node:cluster'
import type { Worker } from 'node:cluster'

import { fork } from 'node:child_process'

import os from 'node:os'
import { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

import * as configFunctions from '../helpers/functions.config.js'

import type { WorkerMessage } from '../types/applicationTypes'

import Debug from 'debug'
const debug = Debug(`monty:www:${process.pid}`)

const directoryName = dirname(fileURLToPath(import.meta.url))

const processCount = Math.min(
  configFunctions.getProperty('application.maximumProcesses'),
  os.cpus().length
)

process.title =
  configFunctions.getProperty('application.applicationName') + ' (Primary)'

debug(`Primary pid:   ${process.pid}`)
debug(`Primary title: ${process.title}`)
debug(`Launching ${processCount} processes`)

const clusterSettings = {
  exec: directoryName + '/wwwProcess.js'
}

cluster.setupPrimary(clusterSettings)

const activeWorkers = new Map<number, Worker>()

for (let index = 0; index < processCount; index += 1) {
  const worker = cluster.fork()
  activeWorkers.set(worker.process.pid!, worker)
}

cluster.on('message', (worker, message: WorkerMessage) => {
  for (const [pid, worker] of activeWorkers.entries()) {
    if (worker === undefined || pid === message.pid) {
      continue
    }

    debug(`Relaying message to worker: ${pid}`)
    worker.send(message)
  }
})

cluster.on('exit', (worker, code, signal) => {
  debug(`Worker ${worker.process.pid!.toString()} has been killed`)
  activeWorkers.delete(worker.process.pid!)

  debug('Starting another worker')
  cluster.fork()
})

if (process.env.STARTUP_TEST === 'true') {
  const killSeconds = 10

  debug(`Killing processes in ${killSeconds} seconds...`)

  setTimeout(() => {
    debug('Killing processes')

    // eslint-disable-next-line no-process-exit, unicorn/no-process-exit
    process.exit(0)
  }, 10_000)
} else {
  if (configFunctions.getProperty('features.employees.avantiSync')) {
    fork('./tasks/avantiEmployeeSync.js')
  }
}
