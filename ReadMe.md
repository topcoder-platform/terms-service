# Topcoder Terms API

## Dependencies

- nodejs https://nodejs.org/en/ (v10)
- Postgres
- Docusign

## Configuration

Configuration for the application is at `config/default.js`.
The following parameters can be set in config files or in env variables:

- LOG_LEVEL: the log level, default is 'debug'
- PORT: the server port, default is 3000
- AUTH_SECRET: The authorization secret used during token verification.
- VALID_ISSUERS: The valid issuer of tokens, a json array contains valid issuer.
- POSTGRES_URL: Postgres database url.
- AUTH0_URL: Auth0 URL, used to get TC M2M token
- AUTH0_AUDIENCE: Auth0 audience, used to get TC M2M token
- TOKEN_CACHE_TIME: Auth0 token cache time, used to get TC M2M token
- AUTH0_CLIENT_ID: Auth0 client id, used to get TC M2M token
- AUTH0_CLIENT_SECRET: Auth0 client secret, used to get TC M2M token
- AUTH0_PROXY_SERVER_URL: Proxy Auth0 URL, used to get TC M2M token
- USER_API_URL: User api url, default is 'https://api.topcoder-dev.com/v3/users'
- BUSAPI_URL: the Topcoder bus api base url.
- KAFKA_ERROR_TOPIC: the error topic used when posting Kafka event.
- KAFKA_MESSAGE_ORIGINATOR: the Kafka message originator.
- TERMS_CREATE_TOPIC: terms create topic name.
- TERMS_UPDATE_TOPIC: terms update topic name.
- DOCUSIGN: Contain configuration relate to DOCUSIGN API, you don't need to modify anything, refer `config/default.js` for more information
- EMAIL: Contain configuration relate to a simple SMTP server(Host, Port, UserName, Password and etc, refer `config/default.js` for more information)

Configuration for testing is at `config/test.js`, only add such new configurations different from `config/default.js`
- WAIT_TIME: wait time used in test, default is 5000 or 5 seconds
- AUTH_V2_URL: The auth v2 url
- AUTH_V2_CLIENT_ID: The auth v2 client id
- AUTH_V3_URL: The auth v3 url
- ADMIN_CREDENTIALS_USERNAME: The user's username with admin role
- ADMIN_CREDENTIALS_PASSWORD: The user's password with admin role
- USER_CREDENTIALS_USERNAME: The user's username with user role
- USER_CREDENTIALS_PASSWORD: The user's password with user role

## Local environment

Copy the `env.sh.sample` to `env.sh`, set the configuration variables and run `source env.sh`. You will need to create a demo account and templates for docusign related configuration.

## Postgres Database Setup
Go to https://www.postgresql.org/ download and install the Postgres.
Modify `POSTGRES_URL` under `config/default.js` to meet your environment.
Run `npm run init-db` to create table

## Local Deployment

- Install dependencies `npm install`
- Run lint `npm run lint`
- Run lint fix `npm run lint:fix`
- Setup process environment `source env.sh`
- Clear and init db `npm run init-db`
- Insert test data `npm run test-data`
- Start app `npm start`
- App is running at `http://localhost:3000`

## Testing
#### You need to `stop` the app and run command `source env.sh` before running unit or e2e tests.
- Run `npm run test` to execute unit tests and generate coverage report.

### Running E2E tests with Postman

#### `Start` the app server before running postman tests. You may need to set the env variables by calling `source env.sh` before calling `NODE_ENV=test npm start`.

- Make sure the db is started

To run postman e2e tests.

```bash
source env.sh
npm run test:init
npm run test:newman
```

## Verification
Refer to the verification document `Verification.md`
