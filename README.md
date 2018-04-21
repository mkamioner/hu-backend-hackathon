# Hebrew University Hackathon

* **[Link to slideshow](https://docs.google.com/presentation/d/1r4zAXXFEyrf8OF7-h822Im-eTmTor8O0blaOh2G0oC8)**

## Installation Instructions

* Install [NodeJS](https://nodejs.org) (Requires 8.x +)
* Run `npm install`
* Create a local database:
  * Install [Docker](https://www.docker.com/)
  * Run `docker run -d -p 3306:3306 --env MYSQL_ROOT_PASSWORD=secret mysql:5.7` (This starts the mysql server in the background)
  * Run `docker ps` and copy the `CONTAINER ID`
  * Run `docker exec -it [CONTAINER ID] mysql -psecret`
  * Copy-Paste the contents of the file `createTables.sql`
* Set up PubNub credentials
  * Create a free PubNub account @ https://www.pubnub.com/
  * Set the environment variables with the PubNub subscribe key and publish key:

  ```sh
  export PUBNUB_PUBLISH_KEY=pub-c-xxxxxxxxxx
  export PUBNUB_SECRET_KEY=sub-c-xxxxxxxxxx
  ```

  * Alternatively, your IDE might be able to set up environment variables for you (this is where google helps)
* Run the app with `npm start`

## Deploy Instructions

* Create a MySQL DB in the cloud
  * Check out [freemysqlhosting.net](https://www.freemysqlhosting.net/)
  * Set up the database with a free [phpMyAdmin](http://www.phpmyadmin.co/) option (but this isn't so secure)
  * Alternatively you can connect with your own MySQL agent: `docker run mysql:5.7 mysql -h [HOST] -u [USER] -p[PASSWORD] [DATABASE]` then Copy-Paste the file `createTables.sql` **NOT INCLUDING** the first two commands (`CREATE SCHEMA GuessingGame` & `USE GuessingGame`)
* Create a free account with [Heroku](https://www.heroku.com)
  * Create a new app and set up the account according to the instructions on heroku
* Set up the environment variables on heroku

```sh
heroku config:set MYSQL_HOST=xxx
heroku config:set MYSQL_USER=xxx
heroku config:set MYSQL_PASSWORD=xxx
heroku config:set MYSQL_DATABASE=xxx
heroku config:set MYSQL_PORT=xxx
heroku config:set PUBNUB_PUBLISH_KEY=xxx
heroku config:set PUBNUB_SUBSCRIBE_KEY=xxx
```

* To deploy use `git push heroku master`
* If you need to see logs, use `heroku logs`
