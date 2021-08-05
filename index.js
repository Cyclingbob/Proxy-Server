const http = require('http')
const errors = require('./assets/errors')
const panel = require('./panel/panel')
const config = require('./config')

const mongoose = require('mongoose')

mongoose.connect(
    config.mongodb_connection_string,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }
);

function server(){
    http.createServer(require('./assets/request')).listen(80)
}

server()
errors()
panel()
