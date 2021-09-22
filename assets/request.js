const proxy = require('./proxy')
const logs = require('./logs')
const fetch = require('node-fetch')
const config = require('../config.js')

async function request(req, res, server_ip, cache, emitter){

    var ip, country
    server_ip = server_ip.ip

    if(req.headers['cf-connecting-ip']) ip = req.headers['cf-connecting-ip']
    else ip = req.connection.remoteAddress.split(':')[3]

    if(req.headers['cf-ipcountry'])country = req.headers['cf-ipcountry']
    else country = 'Unknown'

    if(config.banned_keywords.length > 0){
        if(config.banned_keywords.some(a => req.url.includes(a))){
            fetch(`https://api.cloudflare.com/client/v4/accounts/${config.cloudflare_account_id}/firewall/access_rules/rules`, {
                headers: {
                    "X-Auth-Key": config.cloudflare_api_key,
                    "X-Auth-Email": config.cloudflare_email,
                    "Content-Type": "application/json"
                },
                method: "POST",
                body: JSON.stringify({
                    mode: "block",
                    configuration: {
                        target: "ip",
                        value: ip
                    }
                })
            })
            .then(data => data.json())
            .then(data => {

                var blockdata = {
                    type: 'blocked',
                    domain: req.headers.host,
                    time: Date.now(),
                    ip,
                    path: req.url,
                    country
                }
            
                logs.add(blockdata)
                
                data.result.paused = false

                emitter.emit('cacheAdd', data.result)
                emitter.emit('blocked', "banned_keywords", blockdata, data)

            })

            return res.sendStatus(403)
        }
    }

    if(cache.rules.some(a => a.configuration.value === ip && a.mode === 'block')) return;

    if(config.block_ip_access === true){
        if(req.headers.host.includes(server_ip) || ip.includes(':')){
            var data = {
                type: 'ignored',
                domain: req.headers.host,
                time: Date.now(),
                ip,
                path: req.url,
                country
            }

            emitter.emit('ignored', "direct_ip_access", data, req, res)
        
            logs.add(data)
            return
        }
    }

    var data = {
        type: 'visit',
        domain: req.headers.host,
        time: Date.now(),
        ip,
        path: req.url,
        country
    }

    emitter.emit('visit', data)

    logs.add(data)

    proxy(req, res, emitter)

}

module.exports = request
