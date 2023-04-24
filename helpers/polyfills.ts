import hasOwn from 'object.hasown'

// eslint-disable-next-line unicorn/prefer-node-protocol
import cluster from 'cluster'

import Debug from 'debug'
const debug = Debug('monty:polyfills')

export function applyPolyfills(): void {
  if (Object.hasOwn === undefined) {
    debug('Applying Object.hasOwn(o, v) polyfill')
    Object.hasOwn = hasOwn
  }

  if (
    !Object.hasOwn(cluster, 'setupPrimary') &&
    Object.hasOwn(cluster, 'setupMaster')
  ) {
    debug('Applying cluster.setupPrimary() polyfill')
    cluster.setupPrimary = cluster.setupMaster
  }
}

applyPolyfills()

export default applyPolyfills
