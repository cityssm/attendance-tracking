import assert from 'node:assert';
import { exec } from 'node:child_process';
import http from 'node:http';
import { after, before, describe, it } from 'node:test';
import { app } from '../app.js';
import { portNumber } from './_globals.js';
const cypressTimeoutMillis = 30 * 60 * 60 * 1000;
function runCypress(browser, done) {
    let cypressCommand = `cypress run --config-file ${browser === 'chrome-mobile'
        ? 'cypress.config.mobile.js'
        : 'cypress.config.js'}`;
    cypressCommand += ` --browser ${browser === 'chrome-mobile' ? 'chrome' : browser}`;
    if ((process.env.CYPRESS_RECORD_KEY ?? '') !== '') {
        cypressCommand += ` --tag "${browser},${process.version}" --record`;
    }
    const childProcess = exec(cypressCommand);
    childProcess.stdout?.on('data', (data) => {
        console.log(data);
    });
    childProcess.stderr?.on('data', (data) => {
        console.error(data);
    });
    childProcess.on('exit', (code) => {
        assert.ok(code === 0);
        done();
    });
}
await describe('Attendance Tracking', async () => {
    const httpServer = http.createServer(app);
    let serverStarted = false;
    before(() => {
        httpServer.listen(portNumber);
        httpServer.on('listening', () => {
            serverStarted = true;
        });
    });
    after(() => {
        try {
            httpServer.close();
        }
        catch {
            console.warn('Error closing HTTP server.');
        }
    });
    await it(`Ensure server starts on port ${portNumber.toString()}`, () => {
        assert.ok(serverStarted);
    });
    await describe('Cypress tests', async () => {
        await it('Should run Cypress tests in Chrome', {
            timeout: cypressTimeoutMillis
        }, (_context, done) => {
            runCypress('chrome', done);
        });
        await it('Should run Cypress tests in Firefox', {
            timeout: cypressTimeoutMillis
        }, (_context, done) => {
            runCypress('firefox', done);
        });
        await it('Should run Cypress tests in Chrome Mobile', {
            timeout: cypressTimeoutMillis
        }, (_context, done) => {
            runCypress('chrome-mobile', done);
        });
    });
});
