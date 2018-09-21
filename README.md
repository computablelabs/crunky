# Computable Backend Service

## Dependencies

- Postgres

## Getting Started

### Install Dependencies

- `git clone git@github.com:computablelabs/crunky.git`

- `cd crunky`

- `npm install`

### Install Postgres

This installation assumes you use MacOS and have [Homebrew](https://brew.sh)
installed and available.

In a new terminal tab, run:

- `brew install postgresql`

You can then manage Postgres via homebrew services:

- `brew services start postgresql`

To view the services managed by homebrew and verify Postgres has successfully started:

- `brew services list`

### Configure Postgres

To start the postgres terminal, run:

- `psql postgres`

Create the Computable database:

- `CREATE DATABASE computable_backend;`

Create a database user:

- `CREATE ROLE <username> LOGIN PASSWORD '<password>';`

### Configure Application

Copy `.env.example` to `.env`

Update `DB_USERNAME` and `DB_PASSWORD` env vars with the values for your postgres user

### Node

We use NVM to track an application's recommended node version.
You can find installation instructuctions
[here](https://github.com/creationix/nvm#install-script)

The project contains a `.nvmrc` file in the root directory, which specifies our
current version.
To use it, run:

- `nvm use`

If you do not currently have our recommended version of node installed, run:

- `nvm install`
- `nvm use`

### Run the application

- Run `npm run dev`

