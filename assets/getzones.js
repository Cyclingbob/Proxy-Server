const config = require('../config')
const fetch = require('node-fetch')

module.exports = async function(){
    var zones = await fetch(`https://api.cloudflare.com/client/v4/zones`, {
        headers: {
            "X-Auth-Key": config.cloudflare_api_key,
            "X-Auth-Email": config.cloudflare_email,
            "Content-Type": "application/json"
        },
        method: 'GET'
    })
    .then(data => data.json())
    .then(data => {
        return data.result
    })

    return zones
}
