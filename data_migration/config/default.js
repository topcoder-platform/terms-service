const path = require('path')

module.exports = {
  LOG_LEVEL: process.env.LOG_LEVEL || 'debug',
  LOG_FILE: path.join(__dirname, '../log/migration.log'),
  BATCH_COUNT: parseInt(process.env.BATCH_COUNT, 10) || 100,
  INFORMIX: {
    host: process.env.INFORMIX_HOST || 'localhost',
    port: parseInt(process.env.INFORMIX_PORT || 2021, 10),
    user: process.env.INFORMIX_USER || 'informix',
    password: process.env.INFORMIX_PASSWORD || '1nf0rm1x',
    database: process.env.INFORMIX_DATABASE || 'common_oltp',
    server: process.env.INFORMIX_SERVER || 'informixoltp_tcp',
    minpool: parseInt(process.env.MINPOOL, 10) || 1,
    maxpool: parseInt(process.env.MAXPOOL, 10) || 60,
    maxsize: parseInt(process.env.MAXSIZE, 10) || 0,
    idleTimeout: parseInt(process.env.IDLETIMEOUT, 10) || 3600,
    timeout: parseInt(process.env.TIMEOUT, 10) || 30000
  },
  POSTGRES_URL: process.env.POSTGRES_URL || 'postgres://postgres:password@localhost:5432/postgres',
  DB_SCHEMA_NAME: process.env.DB_SCHEMA_NAME || 'termsdb'
}
