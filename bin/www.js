import '../helpers/polyfills.js';
import { fork } from 'node:child_process';
import cluster from 'node:cluster';
import os from 'node:os';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import Debug from 'debug';
import * as configFunctions from '../helpers/functions.config.js';
const debug = Debug(`monty:www:${process.pid}`);
const directoryName = dirname(fileURLToPath(import.meta.url));
const processCount = Math.min(configFunctions.getProperty('application.maximumProcesses'), os.cpus().length);
process.title =
    configFunctions.getProperty('application.applicationName') + ' (Primary)';
debug(`Primary pid:   ${process.pid}`);
debug(`Primary title: ${process.title}`);
debug(`Launching ${processCount} processes`);
const clusterSettings = {
    exec: directoryName + '/wwwProcess.js'
};
cluster.setupPrimary(clusterSettings);
const activeWorkers = new Map();
for (let index = 0; index < processCount; index += 1) {
    const worker = cluster.fork();
    activeWorkers.set(worker.process.pid, worker);
}
cluster.on('message', (worker, message) => {
    for (const [pid, worker] of activeWorkers.entries()) {
        if (worker === undefined || pid === message.pid) {
            continue;
        }
        debug(`Relaying message to worker: ${pid}`);
        worker.send(message);
    }
});
cluster.on('exit', (worker, code, signal) => {
    debug(`Worker ${worker.process.pid.toString()} has been killed`);
    activeWorkers.delete(worker.process.pid);
    debug('Starting another worker');
    const newWorker = cluster.fork();
    activeWorkers.set(newWorker.process.pid, newWorker);
});
if (process.env.STARTUP_TEST === 'true') {
    const killSeconds = 10;
    debug(`Killing processes in ${killSeconds} seconds...`);
    setTimeout(() => {
        debug('Killing processes');
        process.exit(0);
    }, 10000);
}
else {
    if (configFunctions.getProperty('features.employees.avantiSync')) {
        fork('./tasks/avantiEmployeeSync.js');
    }
}
