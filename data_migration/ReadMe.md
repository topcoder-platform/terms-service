# Data Migration Tool

## Dependencies
- Node 10
- Java 8
- [informix-wrapper](https://github.com/appirio-tech/informix-wrapper.git)

## Configuration

- `config/default.js`
 * `LOG_LEVEL`: string - the log level, you can change to debug level to see more logs
 * `LOG_FILE`: string - the path of log file
 * `BATCH_COUNT`: int - the batch count to process informix records
 * `INFORMIX`: object -informix connection configuration
 * `POSTGRES_URL`: string - postgres connection url
 * `DB_SCHEMA_NAME`: string - postgres database target schema

## Local Deployment
Install related tools and modify informix/postgres connection configurations to meet your environment.

Install node packages
```
npm install
```

example command to start migrate from scratch(It will clear the target database first and start migration from the beginning)
```
npm run restart
```
example command to continue migrate data from last pause(You can pause the migration using short-cut ctrl/cmd + c during the migration process)
```
npm start
```
example command to clean target database
```
npm run clean
```

command to generate test data on informix database
```
npm run test-data
```

## Note
You can use `replace/jdbc-wrapper.js` to replace `node_modules/informix-wrapper/lib/jdbc-wrapper.js` in order not to print time usage information of each sql query in console.
