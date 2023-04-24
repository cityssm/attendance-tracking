/* eslint-disable no-process-exit, unicorn/no-process-exit */

import { app } from '../app.js'

import http from 'node:http'

import * as configFunctions from '../helpers/functions.config.js'

import exitHook from 'exit-hook'

import Debug from 'debug'
const debug = Debug(`monty:wwwProcess:${process.pid}`)

interface ServerError extends Error {
  syscall: string
  code: string
}

function onError(error: ServerError): void {
  if (error.syscall !== 'listen') {
    throw error
  }

  // handle specific listen errors with friendly messages
  switch (error.code) {
    // eslint-disable-next-line no-fallthrough
    case 'EACCES': {
      debug('Requires elevated privileges')
      process.exit(1)
      // break;
    }

    // eslint-disable-next-line no-fallthrough
    case 'EADDRINUSE': {
      debug('Port is already in use.')
      process.exit(1)
      // break;
    }

    // eslint-disable-next-line no-fallthrough
    default: {
      throw error
    }
  }
}

function onListening(server: http.Server): void {
  const addr = server.address()

  if (addr !== null) {
    const bind =
      typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port.toString()
    debug('HTTP Listening on ' + bind)
  }
}

/*
 * Initialize HTTP
 */

process.title = configFunctions.getProperty('application.applicationName') + ' (Worker)'

const httpPort = configFunctions.getProperty('application.httpPort')

const httpServer = http.createServer(app)

httpServer.listen(httpPort)

httpServer.on('error', onError)
httpServer.on('listening', () => {
  onListening(httpServer)
})

exitHook(() => {
  debug('Closing HTTP')
  httpServer.close()
})
