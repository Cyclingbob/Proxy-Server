const proxy = require('./proxy')
const logs = require('./logs')

async function request(req, res){

    var ip, country

    if(req.headers['cf-connecting-ip']){

        ip = req.headers['cf-connecting-ip']

    } else{

        ip = req.connection.remoteAddress.split(':')[3]

    }

    if(req.headers['cf-ipcountry']){

        country = req.headers['cf-ipcountry']

    } else {

        country = 'Unknown'

    }

    logs.add({ time: Date.now(), ip, domain: req.headers.host, path: req.url, country })

    proxy(req, res)

}

module.exports = request