[Help Home](https://cityssm.github.io/MonTY/docs/)

# Admin - Getting Started

While this application can run on a high end server, that is by no means a requirement.
Most user workstations are sufficient.

## Step 1: Install Node.js 18 or better and npm

[Node.js](https://nodejs.org) is a JavaScript runtime environment.
MonTY is built to run on Node.js.

[npm](https://www.npmjs.com/) is a package manager that contains all the prerequisites
for MonTY.

Node.js can run on Windows, Mac, and Linux.
Installers on the [Node.js website](https://nodejs.org) include npm.
Node.js and npm are also available in most package managers.

    > sudo apt install nodejs
    > sudo apt install npm

## Step 2: Install git

*Alternatively, [releases are available on GitHub](https://github.com/cityssm/monty/releases).*
*Git is not required when using releases.*

[Git](https://git-scm.com/) is the version control system that manages the
code for MonTY.

Git can run on Windows, Mac, and Linux.
You can install it using an install on the [Git website](https://git-scm.com/),
or from most package managers.

    > sudo apt install git

## Step 3: Clone the `monty` repository using git

Open a command line, and navigate to the folder where the application will reside.

    > git clone https://github.com/cityssm/monty

## Step 4: Install the dependencies

    > cd monty
    > npm install

## Step 5: Initialize the SQL Server tables

Although MonTY prefers its own database,
all tables are declared in the `MonTY` schema,
making it possible to share a database with another application with little possibility of colliding.

    > sqlcmd -S localhost -U saUser -P saP@ss -Q 'create database MonTY'
    > sqlcmd -S localhost -U saUser -P saP@ss -d MonTY -i database/scripts/createTables.sql -I

## Step 6: Create a `config.js` file

It is recommended to copy the `config.sample.js` file to get started.

    > cp data/config.sample.js data/config.js

See the [config.js documentation](admin-configJS.md) for help customizing
your configuration.

It is important that the config file includes Active Directory credentials for logging in,
and database credentials with read/write permission to the MonTY tables.

## Step 7: Start the application

**Start Using npm**

    > npm start

**Start Using node**

    > node ./bin/www

**Start as a Windows Service**

The included `windowsService-install.bat` script simplifies
the process of keeping the application running in a Windows environment
by creating a service that can start with the hosting server.

    > npm link node-windows
    > windowsService-install
