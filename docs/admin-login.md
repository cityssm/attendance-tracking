[Help Home](https://cityssm.github.io/MonTY/docs/)

# Admin - Logging Into a New Install

As part of the database creation script, the domain `administrator` account is greanted admin access.
If you do not have access to that account, you can get started by using the default admin user.

In your `data/config.js` file, set the following property:

```javascript
config.application.tempAdminPassword = 'password'
```

As with all changes to the `config.js` file, you will have to restart Node
before the change takes effect.

![Login Prompt](images/adminLogin.png)

Once set, you will be able to log into the application with `~~monty` as
the user name and the password set in your `config.js` file.

It is **not recommended** to use the `config.js` file on an ongoing basis
for your admin credentials.

You should visit the [User Management](admin-userManagement.md) area
to create a proper admin user.
