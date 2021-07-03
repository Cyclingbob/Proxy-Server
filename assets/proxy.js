const domains = require('../data/domains.json')
const logs = require('../assets/logs.js')

const http = require('http')

async function proxy(client_req, client_res) {

    var options

    let ip = ''

    if(client_req.headers['cf-connecting-ip']){
        ip = client_req.headers['cf-connecting-ip']
    } else{
        ip = client_req.connection.remoteAddress
    }

    let domain = domains.find(x => x.domain === client_req.headers.host)
    if(!domain){

        options = {

            hostname: 'localhost',
            port: 2086,
            path: '/404',
            method: client_req.method,
            headers: client_req.headers

        };
        
    } else{

        logs.add({

            type: 'visit',
            domain: client_req.headers.host,
            date: Date.now(),
            ip,
            path: client_req.url

        })

        options = {

            hostname: domain.ip,
            port: domain.port,
            path: client_req.url,
            method: client_req.method,
            headers: client_req.headers

        };
        
    }

    var proxy = http.request(options, function (res) {

        client_res.writeHead(res.statusCode, res.headers)

        res.pipe(client_res, {

            end: true

        });

    });

    proxy.on('error', function(err1){

        logs.add({

            type: 'error',
            date: Date.now(),
            error: err1

        })

        options = {
            hostname: 'localhost',
            port: 2086,
            path: '/500',
            method: client_req.method,
            headers: client_req.headers
        };

        var proxy2 = http.request(options, function (res) {
            client_res.writeHead(res.statusCode, res.headers)
            res.pipe(client_res, {
                end: true
            });
        });

        client_req.pipe(proxy2, {
            end: true
        })
    })

    client_req.pipe(proxy, {
        end: true
    })
}

module.exports = proxy