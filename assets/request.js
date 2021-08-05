const proxy = require('./proxy')
const logs = require('./logs')
const fetch = require('node-fetch')
const config = require('../config.js')

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

    var data = await fetch(`https://api.cloudflare.com/client/v4/accounts/${config.cloudflare_account_id}/firewall/access_rules/rules`, {
        headers: {
            "X-Auth-Key": config.cloudflare_api_key,
            "X-Auth-Email": config.cloudflare_email,
            "Content-Type": "application/json"
        },
        method: "GET",
    })
    .then(data => data.json())
    .then(data => {

        if(data.result.includes(a => a.configuration.value === ip && a.mode === 'blocked')) return { block: true }

        return { block: false }

    })

    if(data.block === true) res.sendStatus(403)

    var data = {
        type: 'visit',
        domain: req.headers.host,
        time: Date.now(),
        ip,
        path: req.url,
        country
    }

    logs.add(data)

    proxy(req, res)

}

module.exports = request
