import { fork } from 'node:child_process';
import cluster from 'node:cluster';
import os from 'node:os';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import Debug from 'debug';
import { getConfigProperty } from '../helpers/functions.config.js';
const debug = Debug(`attendance-tracking:www:${process.pid}`);
const directoryName = dirname(fileURLToPath(import.meta.url));
const processCount = Math.min(getConfigProperty('application.maximumProcesses'), os.cpus().length);
process.title = `${getConfigProperty('application.applicationName')} (Primary)`;
debug(`Primary pid:   ${process.pid}`);
debug(`Primary title: ${process.title}`);
debug(`Launching ${processCount} processes`);
const clusterSettings = {
    exec: `${directoryName}/wwwProcess.js`
};
cluster.setupPrimary(clusterSettings);
const activeWorkers = new Map();
for (let index = 0; index < processCount; index += 1) {
    const worker = cluster.fork();
    if (worker.process.pid !== undefined) {
        activeWorkers.set(worker.process.pid, worker);
    }
}
cluster.on('message', (worker, message) => {
    for (const [pid, activeWorker] of activeWorkers.entries()) {
        if (activeWorker === undefined || pid === message.pid) {
            continue;
        }
        debug(`Relaying message to worker: ${pid}`);
        activeWorker.send(message);
    }
});
cluster.on('exit', (worker) => {
    debug(`Worker ${(worker.process.pid ?? 0).toString()} has been killed`);
    activeWorkers.delete(worker.process.pid ?? 0);
    debug('Starting another worker');
    const newWorker = cluster.fork();
    if (newWorker.process.pid !== undefined) {
        activeWorkers.set(newWorker.process.pid, newWorker);
    }
});
if (process.env.STARTUP_TEST === 'true') {
    const killSeconds = 10;
    debug(`Killing processes in ${killSeconds} seconds...`);
    setTimeout(() => {
        debug('Killing processes');
        process.exit(0);
    }, 10_000);
}
else {
    fork('./tasks/databaseCleanup.js');
    if (getConfigProperty('features.employees.avantiSync')) {
        fork('./tasks/avantiEmployeeSync.js');
    }
}
