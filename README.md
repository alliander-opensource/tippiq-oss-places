# Tippiq Places OSS

*Update 03-09-2017*: This repository is now published as open source software under the GPL 3 License (see the LICENSE file).

*Warning*: Please take the appropriate security measures before running this software in production.


Tippiq Places
=============

### Installation

**Prerequisites**
* Ruby, should come preinstalled on your Mac
* [Homebrew](http://http://brew.sh/)
* Wget, `brew install wget`
* [Git](http://git-scm.com/), `brew install git`
* [PostgreSQL](https://github.com/PostgresApp/PostgresApp/releases/download/9.5.5/Postgres-9.5.5.zip), do not install via Homebrew or use version 9.6 as that causes the migrations to fail
* Add `export PATH=$PATH:/Applications/Postgres.app/Contents/Versions/latest/bin` to your `~/.bash_profile` and `source ~/.bash_profile`. Doing `which psql` should report the installation
* [Node.js](https://nodejs.org/), `brew install homebrew/versions/node6-lts`, do not use v7 as some dependencies are incompatible
* `npm install -g knex`, for doing the database migrations
* `npm install -g yarn`, for efficient dependency management

**Install dependencies**

    yarn

**Local database**

    psql -c "CREATE USER tippiq_places WITH PASSWORD 'tippiq_places' SUPERUSER"

    psql -c "CREATE DATABASE tippiq_places WITH OWNER tippiq_places"

### Development

    export TIPPIQ_PLACES_DATABASE_URL='postgresql://tippiq_places:tippiq_places@localhost:5432/tippiq_places'

    npm run dev

Open [localhost:3010/styleguide](http://localhost:3010/styleguide) to verify

### Seed data

    knex seed:run

### Production

    npm run prod

### Testing

    npm test:...
