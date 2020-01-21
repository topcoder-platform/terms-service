const _ = require('lodash')
const config = require('config')
const Wrapper = require('informix-wrapper')
const settings = config.INFORMIX

/**
 * Create informix connection
 * @param database the database.
 * @param isWrite the write sql flag.
 * @param reject the reject function.
 */
const createConnection = (database, isWrite, reject) => {
  const jdbc = new Wrapper(_.assign({}, settings, { database }))
  jdbc.on('error', (err) => {
    if (isWrite) {
      jdbc.endTransaction(err, (error) => {
        jdbc.disconnect()
        reject(error)
      })
    } else {
      jdbc.disconnect()
      reject(err)
    }
  })
  return jdbc.initialize()
}

/**
* Execute query in informix database.
* @param database the database.
* @param sql the sql.
* @param params the sql params.
*/
const executeQueryAsync = (database, sql, params) => new Promise((resolve, reject) => {
  let isWrite = false
  if (sql.trim().toLowerCase().indexOf('insert') === 0 ||
    sql.trim().toLowerCase().indexOf('update') === 0 ||
    sql.trim().toLowerCase().indexOf('delete') === 0 ||
    sql.trim().toLowerCase().indexOf('create') === 0) {
    isWrite = true
  }
  const connection = createConnection(database, isWrite, reject)
  connection.connect((error) => {
    if (error) {
      connection.disconnect()
      reject(error)
    } else {
      if (isWrite) {
        connection.beginTransaction(() => {
          connection.query(sql, (err, result) => {
            if (err) {
              reject(err)
            } else {
              resolve(result)
            }
          }, {
            start: (q) => {
              // logger.debug(`Start to execute ${q}`)
            },
            finish: (f) => {
              connection.endTransaction(null, () => {
                connection.disconnect()
                // logger.debug(`Finish executing ${f}`)
              })
            }
          }).execute(params)
        })
      } else {
        connection.query(sql, (err, result) => {
          if (err) {
            reject(err)
          } else {
            resolve(result)
          }
        }, {
          start: function (q) {
            // logger.debug(`Start to execute ${q}`)
          },
          finish: (f) => {
            connection.disconnect()
            // logger.debug(`Finish executing ${f}`)
          }
        }).execute(params)
      }
    }
  })
})

module.exports = {
  executeQueryAsync
}
