import assert from 'node:assert';
import { exec } from 'node:child_process';
import http from 'node:http';
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
describe('Attendance Tracking', () => {
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
    it(`Ensure server starts on port ${portNumber.toString()}`, () => {
        assert.ok(serverStarted);
    });
    describe('Cypress tests', () => {
        it('Should run Cypress tests in Chrome', (done) => {
            runCypress('chrome', done);
        }).timeout(cypressTimeoutMillis);
        it('Should run Cypress tests in Firefox', (done) => {
            runCypress('firefox', done);
        }).timeout(cypressTimeoutMillis);
        it('Should run Cypress tests in Chrome Mobile', (done) => {
            runCypress('chrome-mobile', done);
        }).timeout(cypressTimeoutMillis);
    });
});
