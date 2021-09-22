const http = require('http')
const { EventEmitter } = require('events')

const errors = require('./assets/errors')
const panel = require('./panel/panel')
const config = require('./config')

const getrules = require('./assets/getrules')
const getzones = require('./assets/getzones')
const getip = require('./assets/getip')

const mongoose = require('mongoose')

mongoose.connect(
    config.mongodb_connection_string,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }
);

(async () => {

    var rules = await getrules()
    var zones = await getzones()

    var cache = { zones, rules }

    var ip = await getip()

    const emitter = new EventEmitter()

    emitter.on('cacheAdd', function(new_item){

        cache.push(new_item)

    })

    function server(ip, cache, emitter){

        http.createServer(function(req, res){
            emitter.emit('request', req, res, function(boolean){
                if(boolean === true) return require('./assets/request')(req, res, ip, cache, emitter)
            })
        })
        .listen(80)

    }

    const fs = require('fs')
    const scriptsFolder = `${__dirname}/plugins/`

    const files = fs.readdirSync(scriptsFolder) // reading files from folders
    files.map(function(file) {
        var plugin = require(scriptsFolder + file)
        plugin(emitter)
    })

    server(ip, cache, emitter)
    errors()
    panel(getip(), cache)

    console.log('ready')

})();
