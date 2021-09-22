const fetch = require('node-fetch');

module.exports = async function(){
    var ip = await fetch('https://ip.seeip.org/json').then(data => data.json()).then(data => { return data })
    return ip
}
