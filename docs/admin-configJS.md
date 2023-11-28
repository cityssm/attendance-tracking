[Help Home](https://cityssm.github.io/attendance-tracking/docs/)

# Admin - config.js

The `data/config.js` file is used to customize your application.
On first install, the file does not exist. You can create one from scratch,
or get started by using the `data/config.sample.js` file as a template.

If you wish to use TypeScript to validate your config.js file,
see [`types/configTypes.d.ts`](https://github.com/cityssm/attendance-tracking/blob/main/types/configTypes.d.ts).

```javascript
export const config = {}

// your configuration

export default config
```

---

## config.application = {}

| Property Name      | Type   | Description                                                                                  | Default Value                    |
| ------------------ | ------ | -------------------------------------------------------------------------------------------- | -------------------------------- |
| `applicationName`  | string | Make the application your own by changing the name.                                          | `"Attendance Tracking"`          |
| `httpPort`         | number | The listening port for HTTP.                                                                 | `7000`                           |
| `userDomain`       | string | The domain used when authenticating users.                                                   | `null`                           |
| `backgroundURL`    | string | The path to background used on the login page.                                               | `"/images/truck-background.jpg"` |
| `bigLogoURL`       | string | The path to a custom logo, displayed on the login page.                                      | `"/images/app-big.svg"`        |
| `smallLogoURL`     | string | The path to a custom logo, displayed in the top-left corner. Square-shaped images work best. | `"/images/app-small.svg"`      |
| `maximumProcesses` | number | The maximum number of server threads. May be limited by your processor.                      | 4                                |

---

## config.tempUsers = ConfigTemporaryUserCredentials[]

**Note that temporary user credentials should only be used to aid with initial setup, and not long term.**

There are preconfigured temporary users in `data/temporaryUsers.js` that can be imported.
Note that before they can be used, passwords must be set.

| ConfigTemporaryUserCredentials Property Name | Type                   | Description                                |
| -------------------------------------------- | ---------------------- | ------------------------------------------ |
| `user.userName`                              | string                 | User name, starting with "~~".             |
| `user.isAdmin`                               | boolean                | Whether the user has admin access or not.  |
| `user.canLogin`                              | boolean                | Whether the user can log in or not.        |
| `user.permissions`                           | Record<string, string> | Granular permissions assigned to the user. |
| `password`                                   | string                 | Please keep security in mind.              |

---

## config.session = {}

| Property Name  | Type    | Description                                                                        | Default Value      |
| -------------- | ------- | ---------------------------------------------------------------------------------- | ------------------ |
| `cookieName`   | string  | The name of the session cookie.                                                    | `"attendance-tracking-user-sid"` |
| `secret`       | string  | The secret used to sign the session cookie.                                        | `"cityssm/attendance-tracking"`  |
| `maxAgeMillis` | number  | The session timeout in milliseconds.                                               | `3600000`          |
| `doKeepAlive`  | boolean | When `true`, the browser will ping the web application to keep the session active. | `false`            |

---

## config.reverseProxy = {}

The settings below help when running the application behind
a reverse proxy like IIS.

| Property                | Type    | Description                                                        | Default |
| ----------------------- | ------- | ------------------------------------------------------------------ | ------- |
| `disableCompression`    | boolean |                                                                    | `false` |
| `disableEtag`           | boolean |                                                                    | `false` |
| `blockViaXForwardedFor` | boolean |                                                                    | `false` |
| `urlPrefix`             | string  | Prefixes all application URLs to make them appear inside a folder. | `""`    |

---

## config.activeDirectory = {}

See the configuration for [activedirectory2 on npm](https://www.npmjs.com/package/activedirectory2).

| Property Name | Type   | Sample Value             |
| ------------- | ------ | ------------------------ |
| `url`         | string | `"ldap://dc.domain.com"` |
| `baseDN`      | string | `"dc=domain,dc=com"`     |
| `userName`    | string | `username@domain.com`    |
| `password`    | string | `p@ssword`               |

---

## config.mssql = {}

See the configuration for [node-mssql on npm](https://www.npmjs.com/package/mssql#configuration-1).

---

## config.features = {}

| Property                   | Type    | Default |
| -------------------------- | ------- | ------- |
| `attendance.absences`      | boolean | `true`  |
| `attendance.afterHours`    | boolean | `true`  |
| `attendance.callOuts`      | boolean | `true`  |
| `attendance.returnsToWork` | boolean | `true`  |
| `employees.avantiSync`     | boolean | `false` |
| `selfService`              | boolean | `false` |

---

## config.settings = {}

| Property                       | Type                                                                                                                                    | Description                                                                  | Default          |
| ------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- | ---------------- |
| `printPdf.contentDisposition`  | string                                                                                                                                  | Either `attachment` or `inline`.                                             | `attachment`     |
| `avantiSync.config`            | [node-avanti-api Configuration](https://github.com/cityssm/node-avanti-api/blob/41d5c051641d3d1242e2b3d20046e7b501223009/apiCall.ts#L7) | Client details for connecting to the Avanti API.                             | `null`           |
| `avantiSync.locationCodes`     | string[]                                                                                                                                | The location codes to sync from the Avanti API.                              | `[]`             |
| `employeeSortKeyFunctions`     | _See below_                                                                                                                             | Options to sort employees within call out lists.                             | `[]`             |
| `employeeEligibilityFunctions` | _See below_                                                                                                                             | Options to test employee eligibility for call out lists.                     | `[]`             |
| `recentDays`                   | number                                                                                                                                  | The number of days of data to display to users without raw export abilities. | `10`             |
| `updateDays`                   | number                                                                                                                                  | The number of days users with update permissions can update past records.    | `5`              |
| `selfService.path`             | string                                                                                                                                  | The path after the main application URL to get to the self service area.     | `"/selfService"` |

### config.settings.employeeSortKeyFunctions = []

See [data/functions.ts](https://github.com/cityssm/MonTY/blob/main/data/functions.ts) for examples.

| Property          | Type                                                          | Description                                                                                                        | Sample Value     |
| ----------------- | ------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ | ---------------- |
| `functionName`    | string                                                        | The name of the function to display in the application.                                                            | `"Alphabetical"` |
| `sortKeyFunction` | (employee: Employee, employeePropertyName?: string) => string | The function that takes an employee record, and returns a string that can be used to sort the employees in a list. |                  |

### config.settings.employeeEligibilityFunctions = []

See [data/functions.ts](https://github.com/cityssm/MonTY/blob/main/data/functions.ts) for examples.

| Property          | Type                                                           | Description                                                                                                   | Sample Value     |
| ----------------- | -------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- | ---------------- |
| `functionName`    | string                                                         | The name of the function to display in the application.                                                       | `"Has Property"` |
| `sortKeyFunction` | (employee: Employee, employeePropertyName?: string) => boolean | The function that takes an employee record, and returns true if the employee passes the eligibility criteria. |                  |
