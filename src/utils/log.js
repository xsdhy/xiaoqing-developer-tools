const log = require('electron-log')

log.transports.console.level = false
log.transports.console.level = 'silly'

module.exports.log = log