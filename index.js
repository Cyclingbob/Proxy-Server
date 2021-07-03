const http = require('http')
const errors = require('./assets/errors')
const panel = require('./panel/panel')

function server(){
    http.createServer(require('./assets/request')).listen(80)
}

server()
errors()
panel()