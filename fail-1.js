/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

var error = require('./error')
var config = require('./config')
var log = require('./log')(config.logLevel, 'db-api')
var DB = require('./db/mysql')(log, error)
var path = require('path')
var util = require('util')
var sh = require('execSync')

var initSql = path.resolve(__dirname, './fail-1.sql')

// making an assumption on how mysql is connected locally
var cmd = util.format('cat %s | mysql -uroot fxa', initSql)
var result = sh.exec(cmd)
if (result.code !== 0) log.info('return code: ' + result.code)
if (result.stdout) log.info(result.stdout)

// setup two connection pools
DB.connect(config).done(
  function(db) {
    var db1 = db
    DB.connect(config).done(
      function(db) {
        run(db1, db)
      }
    )
  }
)

function run(conn1, conn2) {
  conn1.write('CALL xaction_fail()')
    .catch(
      function(err) {
        log.error(err)
        log.info('Can another session/connection work without blocking?')
        conn2.write('UPDATE testdata SET quantity = 77 WHERE testdata_id = 4')
          .catch(
            function(err) {
              log.error(err)
            }
          )
      }
    )
}
